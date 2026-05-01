const mongoose = require("mongoose");

const KhachHang = require("./models/KhachHang");
const NhanVien = require("./models/NhanVien");
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
    await NhanVien.deleteMany({});

    console.log("Da xoa du lieu cu");

    await KhachHang.create([
      {
        MaKhachHang: "KH001",
        HoTen: "Nguyen Van A",
        SoDienThoai: "0900000001",
        Email: "a@gmail.com",
        MatKhau: "123456",
      },
      {
        MaKhachHang: "KH002",
        HoTen: "Tran Van B",
        SoDienThoai: "0900000002",
        Email: "b@gmail.com",
        MatKhau: "123456",
      },
    ]);

    console.log("Da tao khach hang");

    await NhanVien.create([
      {
        MaNhanVien: "NV_HK_01",
        HoTen: "Nhan vien Hoan Kiem",
        SoDienThoai: "0910000001",
        ChucVu: "nhan_vien_chi_nhanh",
        MaChiNhanh: "HOAN_KIEM",
        MatKhau: "123456",
      },
      {
        MaNhanVien: "QL_HK_01",
        HoTen: "Quan ly Hoan Kiem",
        SoDienThoai: "0910000002",
        ChucVu: "quan_ly_chi_nhanh",
        MaChiNhanh: "HOAN_KIEM",
        MatKhau: "123456",
      },
      {
        MaNhanVien: "NV_CG_01",
        HoTen: "Nhan vien Cau Giay",
        SoDienThoai: "0910000003",
        ChucVu: "nhan_vien_chi_nhanh",
        MaChiNhanh: "CAU_GIAY",
        MatKhau: "123456",
      },
      {
        MaNhanVien: "QL_CG_01",
        HoTen: "Quan ly Cau Giay",
        SoDienThoai: "0910000004",
        ChucVu: "quan_ly_chi_nhanh",
        MaChiNhanh: "CAU_GIAY",
        MatKhau: "123456",
      },
      {
        MaNhanVien: "ADMIN_SYS",
        HoTen: "Quan ly he thong",
        SoDienThoai: "0999999999",
        ChucVu: "quan_ly_he_thong",
        MaChiNhanh: "HOAN_KIEM",
        MatKhau: "123456",
      },
    ]);

    console.log("Da tao nhan vien");

    await San.insertMany([
      {
        MaSan: "SAN001",
        TenSan: "San Hoan Kiem 1",
        GiaTheoGio: 300000,
        TrangThai: "hoat_dong",
        MaChiNhanh: "HOAN_KIEM",
      },
      {
        MaSan: "SAN002",
        TenSan: "San Cau Giay 1",
        GiaTheoGio: 250000,
        TrangThai: "hoat_dong",
        MaChiNhanh: "CAU_GIAY",
      },
      {
        MaSan: "SAN003",
        TenSan: "San Ba Dinh 1",
        GiaTheoGio: 280000,
        TrangThai: "hoat_dong",
        MaChiNhanh: "BA_DINH",
      },
      {
        MaSan: "SAN004",
        TenSan: "San Thanh Xuan 1",
        GiaTheoGio: 320000,
        TrangThai: "hoat_dong",
        MaChiNhanh: "THANH_XUAN",
      },
      {
        MaSan: "SAN005",
        TenSan: "San Long Bien 1",
        GiaTheoGio: 350000,
        TrangThai: "hoat_dong",
        MaChiNhanh: "LONG_BIEN",
      },
    ]);

    console.log("Da tao san");

    await LichHen.insertMany([
      {
        MaLichHen: "LH001",
        NgayDat: new Date(),
        GioBatDau: "08:00",
        GioKetThuc: "10:00",
        TrangThai: "da_xac_nhan",
        MaKhachHang: "KH001",
        MaSan: "SAN001",
      },
      {
        MaLichHen: "LH002",
        NgayDat: new Date(),
        GioBatDau: "10:00",
        GioKetThuc: "12:00",
        TrangThai: "da_xac_nhan",
        MaKhachHang: "KH002",
        MaSan: "SAN002",
      },
      {
        MaLichHen: "LH003",
        NgayDat: new Date(),
        GioBatDau: "13:00",
        GioKetThuc: "15:00",
        TrangThai: "hoan_thanh",
        MaKhachHang: "KH001",
        MaSan: "SAN003",
      },
      {
        MaLichHen: "LH004",
        NgayDat: new Date(),
        GioBatDau: "18:00",
        GioKetThuc: "20:00",
        TrangThai: "cho_xac_nhan",
        MaKhachHang: "KH002",
        MaSan: "SAN004",
      },
      {
        MaLichHen: "LH005",
        NgayDat: new Date(),
        GioBatDau: "20:00",
        GioKetThuc: "22:00",
        TrangThai: "da_xac_nhan",
        MaKhachHang: "KH001",
        MaSan: "SAN005",
      },
    ]);

    console.log("Da tao lich hen");

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

    console.log("Da tao thanh toan");
    console.log("Seed du lieu thanh cong");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

seedData();
