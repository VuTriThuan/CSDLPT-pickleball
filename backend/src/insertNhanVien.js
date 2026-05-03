const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const NhanVien = require("./models/NhanVien");

const nhanViens = [
  {
    MaNhanVien: "NV001",
    HoTen: "Nguyễn Văn A",
    SoDienThoai: "0900000001",
    ChucVu: "Quản lý chi nhánh",
    MaChiNhanh: "HOAN_KIEM",
    MatKhau: "123456",
  },
  {
    MaNhanVien: "NV002",
    HoTen: "Trần Thị B",
    SoDienThoai: "0900000002",
    ChucVu: "Nhân viên chi nhánh",
    MaChiNhanh: "HOAN_KIEM",
    MatKhau: "123456",
  },
  {
    MaNhanVien: "NV003",
    HoTen: "Lê Văn C",
    SoDienThoai: "0900000003",
    ChucVu: "Quản lý chi nhánh",
    MaChiNhanh: "CAU_GIAY",
    MatKhau: "123456",
  },
  {
    MaNhanVien: "NV004",
    HoTen: "Phạm Thị D",
    SoDienThoai: "0900000004",
    ChucVu: "Nhân viên chi nhánh",
    MaChiNhanh: "CAU_GIAY",
    MatKhau: "123456",
  },
  {
    MaNhanVien: "NV005",
    HoTen: "Phạm Thị D",
    SoDienThoai: "0999999999",
    ChucVu: "Quản lý hệ thống",
    MaChiNhanh: "HA_DONG",
    MatKhau: "123456",
  },
];

async function seedNhanVien() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI ||
        "mongodb://127.0.0.1:27017/pickleball_db?replicaSet=rs0",
    );

    console.log("✅ Connected DB");

    for (const nv of nhanViens) {
      const existing = await NhanVien.findOne({
        MaNhanVien: nv.MaNhanVien,
      });

      if (!existing) {
        await NhanVien.create(nv);
        console.log(`✔️ Inserted ${nv.HoTen}`);
      } else {
        console.log(`⚠️ ${nv.HoTen} đã tồn tại`);
      }
    }

    console.log("🎉 Done seeding NHAN_VIEN");
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

seedNhanVien();
