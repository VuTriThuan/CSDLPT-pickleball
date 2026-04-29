const mongoose = require("mongoose");

/**
 * CHI_NHANH — metadata, lưu trên config server / shard 1
 * Dùng để hiển thị thông tin chi nhánh và ánh xạ shard
 */
const ChiNhanhSchema = new mongoose.Schema(
  {
    MaChiNhanh: { type: String, required: true, unique: true }, // CN01–CN08
    TenChiNhanh: { type: String, required: true },
    DiaChi: { type: String },
    SoDienThoai: { type: String },
    TrangThai: {
      type: String,
      enum: ["hoat_dong", "ngung"],
      default: "hoat_dong",
    },
    ShardId: { type: Number, min: 1, max: 8 }, // shard node lưu data
  },
  { timestamps: true },
);

module.exports = mongoose.model("CHI_NHANH", ChiNhanhSchema, "CHI_NHANH");
