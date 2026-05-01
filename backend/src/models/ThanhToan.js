const mongoose = require("mongoose");
const ThanhToanSchema = new mongoose.Schema(
  {
    MaThanhToan: { type: String, required: true, unique: true },
    SoTien: { type: Number, required: true },
    ThoiDiemThanhToan: { type: Date, default: Date.now },
    TrangThai: {
      type: String,
      enum: ["cho_xu_ly", "thanh_cong", "that_bai", "hoan_tien"],
      default: "thanh_cong",
    },
    PhuongThuc: {
      type: String,
      enum: ["tien_mat", "chuyen_khoan", "the"],
      default: "tien_mat",
    },
    MaLichHen: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("THANH_TOAN", ThanhToanSchema, "THANH_TOAN");
