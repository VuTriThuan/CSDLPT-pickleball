const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const LichHen = require("../models/LichHen");
const ThanhToan = require("../models/ThanhToan");
const San = require("../models/San");
const KhachHang = require("../models/KhachHang");

const tinhSoGio = (bat, ket) => {
  const [h1, m1] = bat.split(":").map(Number);
  const [h2, m2] = ket.split(":").map(Number);
  return (h2 * 60 + m2 - h1 * 60 - m1) / 60;
};

const kiemTraXungDot = async (
  maSan,
  ngayDat,
  gioBatDau,
  gioKetThuc,
  session,
) => {
  const ngay = new Date(ngayDat);
  ngay.setHours(0, 0, 0, 0);
  const next = new Date(ngay);
  next.setDate(next.getDate() + 1);

  return LichHen.findOne({
    MaSan: maSan,
    NgayDat: { $gte: ngay, $lt: next },
    TrangThai: { $in: ["cho_xac_nhan", "da_xac_nhan"] },
    $or: [{ GioBatDau: { $lt: gioKetThuc }, GioKetThuc: { $gt: gioBatDau } }],
  }).session(session);
};

/**
 * ============================================================
 * DISTRIBUTED TRANSACTION: Đặt sân + Thanh toán
 * ------------------------------------------------------------
 * Đây là 2-phase commit do MongoDB driver quản lý:
 *   Phase 1 (Prepare): ghi LICH_HEN + THANH_TOAN vào write-set
 *   Phase 2 (Commit):  atomically flush cả hai collection
 *
 * Nếu LICH_HEN và THANH_TOAN nằm trên 2 shard khác nhau
 * (do shard key khác nhau), MongoDB sẽ tự động thực hiện
 * cross-shard transaction thông qua mongos router.
 * ============================================================
 */
const datSanVaThanhToan = async ({
  maSan,
  maKhachHang,
  ngayDat,
  gioBatDau,
  gioKetThuc,
  phuongThucThanhToan = "tien_mat",
}) => {
  const session = await mongoose.startSession();
  session.startTransaction({
    readConcern: { level: "snapshot" }, // đọc snapshot nhất quán
    writeConcern: { w: "majority" }, // ghi majority để đảm bảo durability
  });

  try {
    // ── Bước 1: Đọc từ shard chứa sân (shard key: MaSan) ────────────
    const san = await San.findOne({
      MaSan: maSan,
      TrangThai: "hoat_dong",
    }).session(session);
    if (!san) throw new Error("Sân không tồn tại hoặc đang bảo trì");

    // ── Bước 2: Đọc từ shard chứa khách hàng ────────────────────────
    const kh = await KhachHang.findOne({ MaKhachHang: maKhachHang }).session(
      session,
    );
    if (!kh) throw new Error("Tài khoản khách hàng không hợp lệ");

    // ── Bước 3: Kiểm tra xung đột lịch (cùng shard với LICH_HEN) ────
    const xungDot = await kiemTraXungDot(
      maSan,
      ngayDat,
      gioBatDau,
      gioKetThuc,
      session,
    );
    if (xungDot) throw new Error("Sân đã được đặt trong khung giờ này");

    // ── Bước 4: Tính tiền ─────────────────────────────────────────────
    const soGio = tinhSoGio(gioBatDau, gioKetThuc);
    if (soGio <= 0) throw new Error("Khung giờ không hợp lệ");
    const soTien = soGio * san.GiaTheoGio;

    const maLichHen = "LH-" + uuidv4().slice(0, 8).toUpperCase();
    const maThanhToan = "TT-" + uuidv4().slice(0, 8).toUpperCase();

    // ── Bước 5: INSERT LICH_HEN (shard theo MaSan) ───────────────────
    const [lichHen] = await LichHen.create(
      [
        {
          MaLichHen: maLichHen,
          NgayDat: new Date(ngayDat),
          GioBatDau: gioBatDau,
          GioKetThuc: gioKetThuc,
          TrangThai: "da_xac_nhan",
          ThoiDiemTao: new Date(),
          MaKhachHang: maKhachHang,
          MaSan: maSan,
        },
      ],
      { session },
    );

    // ── Bước 6: INSERT THANH_TOAN (shard theo MaLichHen) ─────────────
    // Đây là điểm cross-shard nếu MaLichHen hash khác shard với MaSan
    const [thanhToan] = await ThanhToan.create(
      [
        {
          MaThanhToan: maThanhToan,
          SoTien: soTien,
          ThoiDiemThanhToan: new Date(),
          TrangThai: "thanh_cong",
          PhuongThuc: phuongThucThanhToan,
          MaLichHen: maLichHen,
        },
      ],
      { session },
    );

    // ── Commit: 2PC flush cả hai collection ──────────────────────────
    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      lichHen,
      thanhToan,
      soGio,
      soTien,
      tenSan: san.TenSan,
      tenKhachHang: kh.HoTen,
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

/**
 * DISTRIBUTED TRANSACTION: Hủy lịch + Hoàn tiền
 * Cập nhật đồng thời 2 collection trên (có thể) 2 shard khác nhau
 */
const huyLichHenVaHoanTien = async (maLichHen, maKhachHangYeuCau) => {
  const session = await mongoose.startSession();
  session.startTransaction({ writeConcern: { w: "majority" } });

  try {
    const lichHen = await LichHen.findOne({ MaLichHen: maLichHen }).session(
      session,
    );
    if (!lichHen) throw new Error("Lịch hẹn không tồn tại");
    if (lichHen.MaKhachHang !== maKhachHangYeuCau)
      throw new Error("Không có quyền hủy lịch này");
    if (lichHen.TrangThai === "da_huy")
      throw new Error("Lịch hẹn đã được hủy trước đó");
    if (lichHen.TrangThai === "hoan_thanh")
      throw new Error("Không thể hủy lịch đã hoàn thành");

    await LichHen.updateOne(
      { MaLichHen: maLichHen },
      { TrangThai: "da_huy" },
      { session },
    );

    await ThanhToan.updateOne(
      { MaLichHen: maLichHen, TrangThai: "thanh_cong" },
      { TrangThai: "hoan_tien" },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return { success: true, message: "Hủy lịch hẹn và hoàn tiền thành công" };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

const laySanTrong = async (maChiNhanh, ngayDat, gioBatDau, gioKetThuc) => {
  if (!maChiNhanh) {
    throw new Error("Phải chọn chi nhánh để đảm bảo shard routing");
  }

  const ngay = new Date(ngayDat);
  ngay.setHours(0, 0, 0, 0);
  const next = new Date(ngay);
  next.setDate(next.getDate() + 1);

  // ── Bước 1: Lấy tất cả MaSan hoạt động của chi nhánh (single-shard query) ────
  const sanChinhanh = await San.find({
    MaChiNhanh: maChiNhanh,
    TrangThai: "hoat_dong",
  }).select("MaSan TenSan GiaTheoGio");

  const maSanChiNhanh = sanChinhanh.map((s) => s.MaSan);

  if (maSanChiNhanh.length === 0) {
    return [];
  }

  // ── Bước 2: Query LICH_HEN chỉ trong scope MaSan của chi nhánh (scope xuống) ────
  const xungDot = await LichHen.find({
    MaSan: { $in: maSanChiNhanh },
    NgayDat: { $gte: ngay, $lt: next },
    TrangThai: { $in: ["cho_xac_nhan", "da_xac_nhan"] },
    $or: [{ GioBatDau: { $lt: gioKetThuc }, GioKetThuc: { $gt: gioBatDau } }],
  }).select("MaSan");

  const maSanBan = xungDot.map((l) => l.MaSan);

  // ── Bước 3: Lọc ra sân trống ────
  return sanChinhanh.filter((s) => !maSanBan.includes(s.MaSan));
};

const layLichSuKhachHang = async (maKhachHang, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const items = await LichHen.find({ MaKhachHang: maKhachHang })
    .sort({ ThoiDiemTao: -1 })
    .skip(skip)
    .limit(limit);

  const data = await Promise.all(
    items.map(async (lh) => {
      const [thanhToan, san] = await Promise.all([
        ThanhToan.findOne({ MaLichHen: lh.MaLichHen }),
        San.findOne({ MaSan: lh.MaSan }),
      ]);

      return {
        ...lh.toObject(),
        thanhToan,
        tenSan: san?.TenSan,
        maChiNhanh: san?.MaChiNhanh,
      };
    }),
  );

  const total = await LichHen.countDocuments({
    MaKhachHang: maKhachHang,
  });

  return {
    items: data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
const layLichSuDatSan = async (maKhachHang, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const lichHens = await LichHen.find({ MaKhachHang: maKhachHang })
    .sort({ ThoiDiemTao: -1 })
    .skip(skip)
    .limit(limit);

  const result = await Promise.all(
    lichHens.map(async (lh) => {
      const thanhToan = await ThanhToan.findOne({ MaLichHen: lh.MaLichHen });
      const san = await San.findOne({ MaSan: lh.MaSan });
      return { ...lh.toObject(), thanhToan, tenSan: san?.TenSan };
    }),
  );

  const total = await LichHen.countDocuments({ MaKhachHang: maKhachHang });

  return { data: result, total, page, limit };
};
module.exports = {
  datSanVaThanhToan,
  huyLichHenVaHoanTien,
  laySanTrong,
  layLichSuDatSan,
};
