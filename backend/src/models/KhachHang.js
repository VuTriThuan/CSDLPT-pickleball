const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const KhachHangSchema = new mongoose.Schema(
  {
    MaKhachHang: { type: String, required: true, unique: true },
    HoTen: { type: String, required: true },
    SoDienThoai: { type: String, required: true, unique: true },
    Email: { type: String, required: true, unique: true },
    MatKhau: { type: String, required: true, select: false },
    Role: {
      type: String,
      enum: ["user"],
      default: "user",
    },
    MaChiNhanh: { type: String },
    NgayDangKy: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

KhachHangSchema.pre("save", async function () {
  if (!this.isModified("MatKhau")) return;

  // this.MatKhau = await bcrypt.hash(this.MatKhau, 10);
});

KhachHangSchema.methods.kiemTraMatKhau = function (matKhau) {
  // return bcrypt.compare(matKhau, this.MatKhau);
  return matKhau === this.MatKhau;
};

module.exports = mongoose.model("KHACH_HANG", KhachHangSchema, "KHACH_HANG");
