const mongoose = require("mongoose");
const ChiNhanhSchema = new mongoose.Schema(
  {
    MaChiNhanh: { type: String, required: true, unique: true },
    TenChiNhanh: { type: String, required: true },
    DiaChi: { type: String },
    SoDienThoai: { type: String },
    TrangThai: {
      type: String,
      enum: ["hoat_dong", "ngung"],
      default: "hoat_dong",
    },
    ShardId: { type: Number, min: 1, max: 8 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("CHI_NHANH", ChiNhanhSchema, "CHI_NHANH");
