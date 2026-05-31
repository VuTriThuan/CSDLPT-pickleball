const mongoose = require("mongoose");

const KhachHang = require("./models/KhachHang");
const San = require("./models/San");
const LichHen = require("./models/LichHen");
const ThanhToan = require("./models/ThanhToan");
const NhanVien = require("./models/NhanVien");

mongoose.connect("mongodb://127.0.0.1:27017/pickleball_db");

const seedData = async () => {
  try {
    // Chỉ xóa dữ liệu của 4 model này, không xóa ChiNhanh và NhanVien
    await ThanhToan.deleteMany({});
    await LichHen.deleteMany({});
    await San.deleteMany({});
    await KhachHang.deleteMany({});
    await NhanVien.deleteMany({});

    console.log("🗑️ Đã xóa dữ liệu cũ (KhachHang, San, LichHen, ThanhToan)");

    const admin = new 
    NhanVien({
    MaNhanVien: "NV005",
    HoTen: "Phạm Thị D",
    SoDienThoai: "0999999999",
    ChucVu: "Quản lý hệ thống",
    MaChiNhanh: "HA_DONG",
    MatKhau: "123456",
    },);

    await admin.save();

    console.log("✅ Đã tạo tài khoản admin toàn hệ thống");

    const quanlychinhanh = new NhanVien({
    MaNhanVien: "NV001",
    HoTen: "Nguyễn Văn A",
    SoDienThoai: "0900000001",
    ChucVu: "Quản lý chi nhánh",
    MaChiNhanh: "HOAN_KIEM",
    MatKhau: "123456",
    },);

    await quanlychinhanh.save();

    console.log("✅ Đã tạo tài khoản quản lý chi nhánh Hoàn Kiếm");

    const nhanvienchinhanh = new NhanVien({
    MaNhanVien: "NV002",
    HoTen: "Trần Thị B",
    SoDienThoai: "0900000002",
    ChucVu: "Nhân viên chi nhánh",
    MaChiNhanh: "HOAN_KIEM",
    MatKhau: "123456",
    },);

    await nhanvienchinhanh.save();

    console.log("✅ Đã tạo tài khoản nhân viên chi nhánh Hoàn Kiếm"); 



    // Tạo khách hàng
    const kh1 = new KhachHang({
      MaKhachHang: "KH001",
      HoTen: "Nguyen Van A",
      SoDienThoai: "0900000010",
      Email: "a@gmail.com",
      MatKhau: "123456",
      Role: "user",
    });

    const kh2 = new KhachHang({
      MaKhachHang: "KH002",
      HoTen: "Tran Van B",
      SoDienThoai: "0900000020",
      Email: "b@gmail.com",
      MatKhau: "123456",
      Role: "user",
    });

    await kh1.save();
    await kh2.save();

    console.log("✅ Đã tạo 2 khách hàng");

    // Tạo sân (chi nhánh HOAN_KIEM)
    await San.insertMany([
      {
        MaSan: "SAN001",
        TenSan: "Sân 1 - Hoàn Kiếm",
        GiaTheoGio: 300000,
        TrangThai: "Hoạt động",
        MaChiNhanh: "HOAN_KIEM",
      },
      {
        MaSan: "SAN002",
        TenSan: "Sân 2 - Hoàn Kiếm",
        GiaTheoGio: 300000,
        TrangThai: "Hoạt động",
        MaChiNhanh: "HOAN_KIEM",
      },
      {
        MaSan: "SAN003",
        TenSan: "Sân 1 - Cầu Giấy",
        GiaTheoGio: 250000,
        TrangThai: "Hoạt động",
        MaChiNhanh: "CAU_GIAY",
      },
      {
        MaSan: "SAN004",
        TenSan: "Sân 1 - Ba Đình",
        GiaTheoGio: 280000,
        TrangThai: "Hoạt động",
        MaChiNhanh: "BA_DINH",
      },
    ]);

    console.log("✅ Đã tạo 4 sân");

    // Tạo lịch hẹn (có những lịch đã hoàn thành để có thanh toán)
    await LichHen.insertMany([
      {
        MaLichHen: "LH001",
        NgayDat: new Date(),
        GioBatDau: "08:00",
        GioKetThuc: "10:00",
        TrangThai: "Hoàn thành",
        MaKhachHang: "KH001",
        MaSan: "SAN001",
      },
      {
        MaLichHen: "LH002",
        NgayDat: new Date(),
        GioBatDau: "10:00",
        GioKetThuc: "12:00",
        TrangThai: "Hoàn thành",
        MaKhachHang: "KH002",
        MaSan: "SAN003",
      },
      {
        MaLichHen: "LH003",
        NgayDat: new Date(),
        GioBatDau: "13:00",
        GioKetThuc: "15:00",
        TrangThai: "Hoàn thành",
        MaKhachHang: "KH001",
        MaSan: "SAN002",
      },
      {
        MaLichHen: "LH004",
        NgayDat: new Date(),
        GioBatDau: "16:00",
        GioKetThuc: "18:00",
        TrangThai: "Chờ xác nhận",
        MaKhachHang: "KH002",
        MaSan: "SAN004",
      },
    ]);

    console.log("✅ Đã tạo 4 lịch hẹn");

    // Tạo thanh toán (chỉ cho những lịch hẹn đã hoàn thành)
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
        SoTien: 600000,
        TrangThai: "thanh_cong",
        MaLichHen: "LH003",
      },
    ]);

    console.log("✅ Đã tạo 3 thanh toán");

    console.log("\n" + "=".repeat(60));
    console.log("🎉 SEED DỮ LIỆU THÀNH CÔNG!");
    console.log("=".repeat(60));
    console.log("\n📊 Dữ liệu được tạo:");
    console.log("✅ Khách hàng: 2");
    console.log("✅ Sân: 4");
    console.log("✅ Lịch hẹn: 4 (3 hoàn thành, 1 chờ xác nhận)");
    console.log("✅ Thanh toán: 3 (tổng 1,700,000đ)");
    console.log("\n🔐 Tài khoản Admin Toàn Hệ Thống:");
    console.log("   Số điện thoại: 0999999999");
    console.log("   Mật khẩu: 123456");
    console.log("   Chi nhánh: HA_DONG (Hà Đông)");
    console.log("\n" + "=".repeat(60));

    process.exit();
  } catch (error) {
    console.error("❌ Lỗi:", error.message);
    console.error(error);

    process.exit();
  }
};

seedData();
