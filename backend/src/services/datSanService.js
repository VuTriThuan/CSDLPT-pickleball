const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const LichHen = require("../models/LichHen");
const ThanhToan = require("../models/ThanhToan");
const San = require("../models/San");
const KhachHang = require("../models/KhachHang");

const withSession = (query, session) => (session ? query.session(session) : query);

const isTransactionUnsupportedError = (error) => {
  const message = error?.message || "";
  return (
    message.includes("Transaction numbers are only allowed") ||
    message.includes("replica set member or mongos") ||
    message.includes("Transaction not supported")
  );
};

/**
 * Tính số giờ giữa gioBatDau và gioKetThuc (dạng "HH:MM")
 */
const tinhSoGio = (gioBatDau, gioKetThuc) => {
  const [h1, m1] = gioBatDau.split(":").map(Number);
  const [h2, m2] = gioKetThuc.split(":").map(Number);
  return (h2 * 60 + m2 - (h1 * 60 + m1)) / 60;
};

/**
 * Kiểm tra xung đột lịch hẹn
 */
const kiemTraXungDot = async (
  maSan,
  ngayDat,
  gioBatDau,
  gioKetThuc,
  session,
) => {
  const ngay = new Date(ngayDat);
  ngay.setHours(0, 0, 0, 0);
  const ngayTiepTheo = new Date(ngay);
  ngayTiepTheo.setDate(ngayTiepTheo.getDate() + 1);

  const xungDot = await withSession(
    LichHen.findOne({
      MaSan: maSan,
      NgayDat: { $gte: ngay, $lt: ngayTiepTheo },
      TrangThai: { $in: ["cho_xac_nhan", "da_xac_nhan"] },
      $or: [
        { GioBatDau: { $lt: gioKetThuc }, GioKetThuc: { $gt: gioBatDau } },
      ],
    }),
    session,
  );

  return !!xungDot;
};

/**
 * Đặt sân + tạo thanh toán. Dùng transaction nếu MongoDB hỗ trợ replica set.
 */
const datSanVaThanhToan = async ({
  maSan,
  maKhachHang,
  ngayDat,
  gioBatDau,
  gioKetThuc,
  phuongThucThanhToan = "tien_mat",
}) => {
  const execute = async (session) => {
    // 1. Kiểm tra sân tồn tại và đang hoạt động
    const san = await withSession(
      San.findOne({
        MaSan: maSan,
        TrangThai: "hoat_dong",
      }),
      session,
    );
    if (!san) throw new Error("Sân không tồn tại hoặc không hoạt động");

    // 2. Kiểm tra khách hàng
    const khachHang = await withSession(
      KhachHang.findOne({
        MaKhachHang: maKhachHang,
      }),
      session,
    );
    if (!khachHang) throw new Error("Khách hàng không tồn tại");

    // 3. Kiểm tra xung đột lịch
    const coXungDot = await kiemTraXungDot(
      maSan,
      ngayDat,
      gioBatDau,
      gioKetThuc,
      session,
    );
    if (coXungDot) throw new Error("Sân đã được đặt trong khung giờ này");

    // 4. Tính tiền
    const soGio = tinhSoGio(gioBatDau, gioKetThuc);
    if (soGio <= 0) throw new Error("Thời gian không hợp lệ");
    const soTien = soGio * san.GiaTheoGio;

    // 5. Tạo lịch hẹn
    const maLichHen = "LH-" + uuidv4().slice(0, 8).toUpperCase();
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
      session ? { session } : undefined,
    );

    // 6. Tạo thanh toán
    const maThanhToan = "TT-" + uuidv4().slice(0, 8).toUpperCase();
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
      session ? { session } : undefined,
    );

    return {
      success: true,
      lichHen,
      thanhToan,
      soGio,
      soTien,
      tenSan: san.TenSan,
      tenKhachHang: khachHang.HoTen,
    };
  };

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await execute(session);
    await session.commitTransaction();
    session.endSession();
    return result;
  } catch (error) {
    if (session.inTransaction()) await session.abortTransaction();
    session.endSession();
    if (isTransactionUnsupportedError(error)) return execute();
    throw error;
  }
};

/**
 * Hủy lịch hẹn + hoàn tiền (transaction)
 */
const huyLichHenVaHoanTien = async (maLichHen) => {
  const execute = async (session) => {
    const lichHen = await withSession(
      LichHen.findOne({ MaLichHen: maLichHen }),
      session,
    );
    if (!lichHen) throw new Error("Lịch hẹn không tồn tại");
    if (lichHen.TrangThai === "da_huy") {
      throw new Error("Lịch hẹn đã được hủy trước đó");
    }
    if (lichHen.TrangThai === "hoan_thanh") {
      throw new Error("Không thể hủy lịch hẹn đã hoàn thành");
    }

    await withSession(
      LichHen.updateOne({ MaLichHen: maLichHen }, { TrangThai: "da_huy" }),
      session,
    );

    await withSession(
      ThanhToan.updateOne(
        { MaLichHen: maLichHen, TrangThai: "thanh_cong" },
        { TrangThai: "hoan_tien" },
      ),
      session,
    );

    return { success: true, message: "Hủy lịch hẹn và hoàn tiền thành công" };
  };

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await execute(session);
    await session.commitTransaction();
    session.endSession();
    return result;
  } catch (error) {
    if (session.inTransaction()) await session.abortTransaction();
    session.endSession();
    if (isTransactionUnsupportedError(error)) return execute();
    throw error;
  }
};

/**
 * Lấy danh sách sân còn trống theo ngày + giờ
 */
const laySanTrong = async (maChiNhanh, ngayDat, gioBatDau, gioKetThuc) => {
  const ngay = new Date(ngayDat);
  ngay.setHours(0, 0, 0, 0);
  const ngayTiepTheo = new Date(ngay);
  ngayTiepTheo.setDate(ngayTiepTheo.getDate() + 1);

  const lichHenXungDot = await LichHen.find({
    NgayDat: { $gte: ngay, $lt: ngayTiepTheo },
    TrangThai: { $in: ["cho_xac_nhan", "da_xac_nhan"] },
    $or: [{ GioBatDau: { $lt: gioKetThuc }, GioKetThuc: { $gt: gioBatDau } }],
  }).select("MaSan");

  const maSanBan = lichHenXungDot.map((l) => l.MaSan);

  const sanFilter = {
    MaSan: { $nin: maSanBan },
    TrangThai: "hoat_dong",
  };

  if (maChiNhanh) sanFilter.MaChiNhanh = maChiNhanh;

  const sanTrong = await San.find(sanFilter);

  return sanTrong;
};

/**
 * Lấy lịch sử đặt sân của khách hàng
 */
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
