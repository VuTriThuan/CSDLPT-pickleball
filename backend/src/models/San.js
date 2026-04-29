// const mongoose = require("mongoose");

// const SanSchema = new mongoose.Schema(
//   {
//     MaSan: { type: String, required: true, unique: true },
//     TenSan: { type: String, required: true },
//     GiaTheoGio: { type: Number, required: true },
//     TrangThai: {
//       type: String,
//       enum: ["hoat_dong", "bao_tri", "ngung"],
//       default: "hoat_dong",
//     },
//     MaChiNhanh: { type: String, required: true },
//   },
//   { timestamps: true },
// );

// module.exports = mongoose.model("SAN", SanSchema, "SAN");
const mongoose = require("mongoose");

/**
 * SAN — shard key: MaChiNhanh
 * Mỗi sân thuộc 1 chi nhánh → shard tương ứng lưu toàn bộ sân của chi nhánh đó
 */
const SanSchema = new mongoose.Schema(
  {
    MaSan: { type: String, required: true, unique: true },
    TenSan: { type: String, required: true },
    GiaTheoGio: { type: Number, required: true },
    TrangThai: {
      type: String,
      enum: ["hoat_dong", "bao_tri", "ngung"],
      default: "hoat_dong",
    },
    MaChiNhanh: { type: String, required: true }, // ← shard key
  },
  { timestamps: true },
);

module.exports = mongoose.model("SAN", SanSchema, "SAN");
