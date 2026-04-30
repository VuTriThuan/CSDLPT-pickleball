const mongoose = require("mongoose");

const KhachHangSchema = new mongoose.Schema(
  {
    MaKhachHang: { type: String, required: true, unique: true },
    HoTen: { type: String, required: true },
    SoDienThoai: { type: String, required: true },
    Email: { type: String },
    NgayDangKy: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model("KHACH_HANG", KhachHangSchema, "KHACH_HANG");