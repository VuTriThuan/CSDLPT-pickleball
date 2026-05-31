const mongoose = require("mongoose");
const SanSchema = new mongoose.Schema(
  {
    MaSan: { type: String, required: true, unique: true },
    TenSan: { type: String, required: true },
    GiaTheoGio: { type: Number, required: true },
    TrangThai: {
      type: String,
      enum: ["Hoạt động", "Dừng hoạt động"],
      default: "Hoạt động",
    },
    MaChiNhanh: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SAN", SanSchema, "SAN");
