const mongoose = require("mongoose");

const KhachHang = require("./models/KhachHang");
const San = require("./models/San");
const LichHen = require("./models/LichHen");
const ThanhToan = require("./models/ThanhToan");

mongoose.connect("mongodb://127.0.0.1:27017/pickleball_db");

const seedData = async () => {
  try {
    await ThanhToan.deleteMany({});
    await LichHen.deleteMany({});
    await San.deleteMany({});
    await KhachHang.deleteMany({});

    console.log("🗑️ Đã xóa dữ liệu cũ");

    const kh1 = new KhachHang({
      MaKhachHang: "KH001",
      HoTen: "Nguyen Van A",
      SoDienThoai: "0900000001",
      Email: "a@gmail.com",
      MatKhau: "123456",
      Role: "khach_hang",
    });

    const kh2 = new KhachHang({
      MaKhachHang: "KH002",
      HoTen: "Tran Van B",
      SoDienThoai: "0900000002",
      Email: "b@gmail.com",
      MatKhau: "123456",
      Role: "khach_hang",
    });

    const admin = new KhachHang({
      MaKhachHang: "ADMIN001",
      HoTen: "Admin System",
      SoDienThoai: "0999999999",
      Email: "admin@gmail.com",
      MatKhau: "123456",
      Role: "admin",
      MaChiNhanh: "HA_DONG",
    });

    await kh1.save();
    await kh2.save();
    await admin.save();

    console.log("Đã tạo khách hàng");

    await San.insertMany([
      {
        MaSan: "SAN001",
        TenSan: "Sân Hoàn Kiếm 1",
        GiaTheoGio: 300000,
        TrangThai: "Hoạt động",
        MaChiNhanh: "HOAN_KIEM",
      },

      {
        MaSan: "SAN002",
        TenSan: "Sân Cầu Giấy 1",
        GiaTheoGio: 250000,
        TrangThai: "Hoạt động",
        MaChiNhanh: "CAU_GIAY",
      },

      {
        MaSan: "SAN003",
        TenSan: "Sân Ba Đình 1",
        GiaTheoGio: 280000,
        TrangThai: "Hoạt động",
        MaChiNhanh: "BA_DINH",
      },

      {
        MaSan: "SAN004",
        TenSan: "Sân Thanh Xuân 1",
        GiaTheoGio: 320000,
        TrangThai: "Hoạt động",
        MaChiNhanh: "THANH_XUAN",
      },

      {
        MaSan: "SAN005",
        TenSan: "Sân Long Biên 1",
        GiaTheoGio: 350000,
        TrangThai: "Hoạt động",
        MaChiNhanh: "LONG_BIEN",
      },
    ]);

    console.log("Đã tạo sân");

    await LichHen.insertMany([
      {
        MaLichHen: "LH001",
        NgayDat: new Date(),
        GioBatDau: "08:00",
        GioKetThuc: "10:00",
        TrangThai: "Chờ xác nhận",
        MaKhachHang: "KH001",
        MaSan: "SAN001",
      },

      {
        MaLichHen: "LH002",
        NgayDat: new Date(),
        GioBatDau: "10:00",
        GioKetThuc: "12:00",
        TrangThai: "Chờ xác nhận",
        MaKhachHang: "KH002",
        MaSan: "SAN002",
      },

      {
        MaLichHen: "LH003",
        NgayDat: new Date(),
        GioBatDau: "13:00",
        GioKetThuc: "15:00",
        TrangThai: "Hoàn thành",
        MaKhachHang: "KH001",
        MaSan: "SAN003",
      },

      {
        MaLichHen: "LH004",
        NgayDat: new Date(),
        GioBatDau: "18:00",
        GioKetThuc: "20:00",
        TrangThai: "Chờ xác nhận",
        MaKhachHang: "KH002",
        MaSan: "SAN004",
      },

      {
        MaLichHen: "LH005",
        NgayDat: new Date(),
        GioBatDau: "20:00",
        GioKetThuc: "22:00",
        TrangThai: "Chờ xác nhận",
        MaKhachHang: "KH001",
        MaSan: "SAN005",
      },
    ]);

    console.log("Đã tạo lịch hẹn");

    await ThanhToan.insertMany([
      {
        MaThanhToan: "TT001",
        SoTien: 600000,
        TrangThai: "thanh_cong",
        MaLichHen: "LH001",
      },

      {
        MaThanhToan: "TT002",
        SoTien: 500000,
        TrangThai: "thanh_cong",
        MaLichHen: "LH002",
      },

      {
        MaThanhToan: "TT003",
        SoTien: 560000,
        TrangThai: "cho_xu_ly",
        MaLichHen: "LH003",
      },

      {
        MaThanhToan: "TT004",
        SoTien: 700000,
        TrangThai: "that_bai",
        MaLichHen: "LH005",
      },
    ]);

    console.log("Đã tạo thanh toán");

    console.log("Seed dữ liệu thành công");

    process.exit();
  } catch (error) {
    console.log(error);

    process.exit();
  }
};

seedData();
