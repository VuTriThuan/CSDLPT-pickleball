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

  const query = LichHen.findOne({
    MaSan: maSan,
    NgayDat: { $gte: ngay, $lt: next },
    TrangThai: "Chờ xác nhận",
    $or: [{ GioBatDau: { $lt: gioKetThuc }, GioKetThuc: { $gt: gioBatDau } }],
  });

  return session ? query.session(session) : query;
};

const runWithOptionalTransaction = async (handler) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction({
      readConcern: { level: "snapshot" },
      writeConcern: { w: "majority" },
    });

    const result = await handler(session);
    await session.commitTransaction();
    return result;
  } catch (err) {
    try {
      await session.abortTransaction();
    } catch (_) {
      // Ignore abort errors when MongoDB rejected transaction startup.
    }

    if (
      err.message?.includes(
        "Transaction numbers are only allowed on a replica set member or mongos",
      )
    ) {
      return handler(null);
    }

    throw err;
  } finally {
    session.endSession();
  }
};

const findOneMaybeSession = (model, filter, session) => {
  const query = model.findOne(filter);
  return session ? query.session(session) : query;
};

const createOneMaybeSession = async (model, doc, session) => {
  if (!session) return model.create(doc);
  const [created] = await model.create([doc], { session });
  return created;
};

const updateOneMaybeSession = (model, filter, update, session) => {
  const options = session ? { session } : undefined;
  return model.updateOne(filter, update, options);
};

const datSanVaThanhToan = async ({
  maSan,
  maKhachHang,
  ngayDat,
  gioBatDau,
  gioKetThuc,
}) => {
  return runWithOptionalTransaction(async (session) => {
    const san = await findOneMaybeSession(
      San,
      {
        MaSan: maSan,
        TrangThai: "Hoạt động",
      },
      session,
    );
    if (!san) throw new Error("Sân không tồn tại hoặc đang bảo trì");

    const kh = await findOneMaybeSession(
      KhachHang,
      { MaKhachHang: maKhachHang },
      session,
    );
    if (!kh) throw new Error("Tài khoản khách hàng không hợp lệ");

    const xungDot = await kiemTraXungDot(
      maSan,
      ngayDat,
      gioBatDau,
      gioKetThuc,
      session,
    );
    if (xungDot) throw new Error("Sân đã được đặt trong khung giờ này");

    const soGio = tinhSoGio(gioBatDau, gioKetThuc);
    const [h1, m1] = gioBatDau.split(":").map(Number);
    const [h2, m2] = gioKetThuc.split(":").map(Number);

    if (
      [h1, m1, h2, m2].some((v) => Number.isNaN(v)) ||
      h2 * 60 + m2 <= h1 * 60 + m1
    ) {
      throw new Error("Giờ bắt đầu phải nhỏ hơn giờ kết thúc");
    }
    const soTien = soGio * san.GiaTheoGio;

    const maLichHen = "LH-" + uuidv4().slice(0, 8).toUpperCase();
    const maThanhToan = "TT-" + uuidv4().slice(0, 8).toUpperCase();

    const lichHen = await createOneMaybeSession(
      LichHen,
      {
        MaLichHen: maLichHen,
        NgayDat: new Date(ngayDat),
        GioBatDau: gioBatDau,
        GioKetThuc: gioKetThuc,
        TrangThai: "Chờ xác nhận",
        ThoiDiemTao: new Date(),
        MaKhachHang: maKhachHang,
        MaSan: maSan,
      },
      session,
    );

    const thanhToan = await createOneMaybeSession(
      ThanhToan,
      {
        MaThanhToan: maThanhToan,
        SoTien: soTien,
        ThoiDiemThanhToan: new Date(),
        TrangThai: "thanh_cong",
        MaLichHen: maLichHen,
      },
      session,
    );

    return {
      success: true,
      lichHen,
      thanhToan,
      soGio,
      soTien,
      tenSan: san.TenSan,
      tenKhachHang: kh.HoTen,
    };
  });
};

const huyLichHenVaHoanTien = async (maLichHen, maKhachHangYeuCau) => {
  return runWithOptionalTransaction(async (session) => {
    const lichHen = await findOneMaybeSession(
      LichHen,
      { MaLichHen: maLichHen },
      session,
    );
    if (!lichHen) throw new Error("Lịch hẹn không tồn tại");
    if (lichHen.MaKhachHang !== maKhachHangYeuCau)
      throw new Error("Không có quyền hủy lịch này");
    if (lichHen.TrangThai === "Huỷ") {
      throw new Error("Lịch hẹn đã được hủy trước đó");
    }
    if (lichHen.TrangThai === "Hoàn thành")
      throw new Error("Không thể hủy lịch đã hoàn thành");

    await updateOneMaybeSession(
      LichHen,
      { MaLichHen: maLichHen },
      { TrangThai: "Huỷ" },
      session,
    );

    await updateOneMaybeSession(
      ThanhToan,
      { MaLichHen: maLichHen, TrangThai: "thanh_cong" },
      { TrangThai: "hoan_tien" },
      session,
    );

    return { success: true, message: "Hủy lịch hẹn và hoàn tiền thành công" };
  });
};

const laySanTrong = async (maChiNhanh, ngayDat, gioBatDau, gioKetThuc) => {
  if (!maChiNhanh) {
    throw new Error("Phải chọn chi nhánh để đảm bảo shard routing");
  }

  const ngay = new Date(ngayDat);
  ngay.setHours(0, 0, 0, 0);
  const next = new Date(ngay);
  next.setDate(next.getDate() + 1);

  const sanChinhanh = await San.find({
    MaChiNhanh: maChiNhanh,
    TrangThai: "Hoạt động",
  }).select("MaSan TenSan GiaTheoGio");

  const maSanChiNhanh = sanChinhanh.map((s) => s.MaSan);

  if (maSanChiNhanh.length === 0) {
    return [];
  }

  const xungDot = await LichHen.find({
    MaSan: { $in: maSanChiNhanh },
    NgayDat: { $gte: ngay, $lt: next },
    TrangThai: "Chờ xác nhận",
    $or: [{ GioBatDau: { $lt: gioKetThuc }, GioKetThuc: { $gt: gioBatDau } }],
  }).select("MaSan");

  const maSanBan = xungDot.map((l) => l.MaSan);

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

// Admin xóa lịch hẹn và trừ doanh thu (nếu đã thanh toán)
const xoaLichHenVaTruDoanhThu = async (maLichHen) => {
  return runWithOptionalTransaction(async (session) => {
    const lichHen = await findOneMaybeSession(
      LichHen,
      { MaLichHen: maLichHen },
      session,
    );
    if (!lichHen) throw new Error("Lịch hẹn không tồn tại");

    // Kiểm tra và xử lý thanh toán
    const thanhToan = await findOneMaybeSession(
      ThanhToan,
      { MaLichHen: maLichHen },
      session,
    );

    let soTienTruThue = 0;
    if (thanhToan && thanhToan.TrangThai === "thanh_cong") {
      // Nếu đã thanh toán thành công, cập nhật trạng thái thành "hoan_tien"
      // Điều này sẽ trừ doanh thu vì revenueService chỉ tính những thanh toán "thanh_cong"
      await updateOneMaybeSession(
        ThanhToan,
        { MaLichHen: maLichHen },
        { TrangThai: "hoan_tien" },
        session,
      );
      soTienTruThue = thanhToan.SoTien;
    }

    // Xóa lịch hẹn
    const deleteResult = await LichHen.deleteOne(
      { MaLichHen: maLichHen },
      session ? { session } : undefined,
    );

    if (!deleteResult.deletedCount) {
      throw new Error("Không thể xóa lịch hẹn");
    }

    return {
      success: true,
      message:
        "Đã xóa lịch hẹn" + (soTienTruThue > 0 ? " và trừ doanh thu" : ""),
      soTienTruThue,
      maThanhToan: thanhToan?.MaThanhToan,
    };
  });
};

module.exports = {
  datSanVaThanhToan,
  huyLichHenVaHoanTien,
  laySanTrong,
  layLichSuDatSan,
  xoaLichHenVaTruDoanhThu,
};
