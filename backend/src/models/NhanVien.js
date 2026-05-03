const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const NhanVienSchema = new mongoose.Schema(
  {
    MaNhanVien: { type: String, required: true, unique: true },

    HoTen: { type: String, required: true },

    SoDienThoai: { type: String, required: true, unique: true },

    ChucVu: {
      type: String,
      enum: ["Nhân viên chi nhánh", "Quản lý chi nhánh", "Quản lý hệ thống"],
      required: true,
    },

    MaChiNhanh: { type: String, required: true },

    MatKhau: { type: String, required: true, select: false },
  },
  { timestamps: true },
);

NhanVienSchema.pre("save", async function () {
  if (!this.isModified("MatKhau")) return;

  this.MatKhau = await bcrypt.hash(this.MatKhau, 10);
});

NhanVienSchema.methods.kiemTraMatKhau = function (matKhau) {
  return bcrypt.compare(matKhau, this.MatKhau);
};

module.exports = mongoose.model("NHAN_VIEN", NhanVienSchema, "NHAN_VIEN");
