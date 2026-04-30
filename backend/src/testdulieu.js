const mongoose = require("mongoose");

const San = require("./models/San");
const LichHen = require("./models/LichHen");
const ThanhToan = require("./models/ThanhToan");
const KhachHang = require("./models/KhachHang");

mongoose
  .connect("mongodb://127.0.0.1:27017/pickleball")
  .then(async () => {
    console.log("MongoDB connected");

    // XÓA DỮ LIỆU CŨ
    await San.deleteMany();
    await LichHen.deleteMany();
    await ThanhToan.deleteMany();
    await KhachHang.deleteMany();

    console.log("Old data removed");

    // =========================
    // KHÁCH HÀNG
    // =========================

    await KhachHang.insertMany([
      {
        MaKhachHang: "KH001",
        HoTen: "Nguyen Van A",
        SoDienThoai: "0900000001",
        Email: "a@gmail.com",
      },

      {
        MaKhachHang: "KH002",
        HoTen: "Tran Van B",
        SoDienThoai: "0900000002",
        Email: "b@gmail.com",
      },

      {
        MaKhachHang: "KH003",
        HoTen: "Le Van C",
        SoDienThoai: "0900000003",
        Email: "c@gmail.com",
      },
    ]);

    console.log("KhachHang inserted");

    // =========================
    // SÂN
    // =========================

    await San.insertMany([
      {
        MaSan: "SAN001",
        TenSan: "Sân Hoàn Kiếm 1",
        GiaTheoGio: 200000,
        TrangThai: "hoat_dong",
        MaChiNhanh: "HOAN_KIEM",
      },

      {
        MaSan: "SAN002",
        TenSan: "Sân Hoàn Kiếm 2",
        GiaTheoGio: 250000,
        TrangThai: "hoat_dong",
        MaChiNhanh: "HOAN_KIEM",
      },

      {
        MaSan: "SAN003",
        TenSan: "Sân Cầu Giấy 1",
        GiaTheoGio: 300000,
        TrangThai: "hoat_dong",
        MaChiNhanh: "CAU_GIAY",
      },

      {
        MaSan: "SAN004",
        TenSan: "Sân Ba Đình 1",
        GiaTheoGio: 350000,
        TrangThai: "hoat_dong",
        MaChiNhanh: "BA_DINH",
      },

      {
        MaSan: "SAN005",
        TenSan: "Sân Long Biên 1",
        GiaTheoGio: 400000,
        TrangThai: "hoat_dong",
        MaChiNhanh: "LONG_BIEN",
      },
    ]);

    console.log("San inserted");

    // =========================
    // LỊCH HẸN
    // =========================

    await LichHen.insertMany([
      {
        MaLichHen: "LH001",
        NgayDat: new Date(),

        GioBatDau: "08:00",
        GioKetThuc: "10:00",

        TrangThai: "cho_xac_nhan",

        MaKhachHang: "KH001",

        MaSan: "SAN001",
      },

      {
        MaLichHen: "LH002",
        NgayDat: new Date(),

        GioBatDau: "10:00",
        GioKetThuc: "12:00",

        TrangThai: "cho_xac_nhan",

        MaKhachHang: "KH002",

        MaSan: "SAN002",
      },

      {
        MaLichHen: "LH003",
        NgayDat: new Date(),

        GioBatDau: "14:00",
        GioKetThuc: "16:00",

        TrangThai: "cho_xac_nhan",

        MaKhachHang: "KH003",

        MaSan: "SAN003",
      },

      {
        MaLichHen: "LH004",
        NgayDat: new Date(),

        GioBatDau: "18:00",
        GioKetThuc: "20:00",

        TrangThai: "hoan_thanh",

        MaKhachHang: "KH001",

        MaSan: "SAN004",
      },
    ]);

    console.log("LichHen inserted");

    // =========================
    // THANH TOÁN
    // =========================

    await ThanhToan.insertMany([
      {
        MaThanhToan: "TT001",

        SoTien: 400000,

        TrangThai: "thanh_cong",

        PhuongThuc: "tien_mat",

        MaLichHen: "LH004",
      },

      {
        MaThanhToan: "TT002",

        SoTien: 500000,

        TrangThai: "thanh_cong",

        PhuongThuc: "chuyen_khoan",

        MaLichHen: "LH003",
      },
    ]);

    console.log("ThanhToan inserted");

    console.log("SEED DATA SUCCESS");

    process.exit();
  })
  .catch((err) => {
    console.log(err);
  });