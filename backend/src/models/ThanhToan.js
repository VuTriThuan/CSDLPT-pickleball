const mongoose = require("mongoose");

const ThanhToanSchema = new mongoose.Schema(
  {
    MaThanhToan: { type: String, required: true, unique: true },
    SoTien: { type: Number, required: true },
    ThoiDiemThanhToan: { type: Date, default: Date.now },
    TrangThai: {
      type: String,
      enum: ["cho_xu_ly", "thanh_cong", "that_bai", "hoan_tien"],
      default: "cho_xu_ly",
    },
    PhuongThuc: {
      type: String,
      enum: ["tien_mat", "chuyen_khoan", "the"],
      default: "tien_mat",
    },
    MaLichHen: { type: String, required: true },
    MaChiNhanh: { type: String, required: true }, // Distributed shard key
  },
  { timestamps: true },
);

module.exports = mongoose.model("THANH_TOAN", ThanhToanSchema, "THANH_TOAN");
