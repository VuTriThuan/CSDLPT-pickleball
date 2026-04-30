const mongoose = require("mongoose");

const LichHenSchema = new mongoose.Schema(
  {
    MaLichHen: { type: String, required: true, unique: true },
    NgayDat: { type: Date, required: true },
    GioBatDau: { type: String, required: true }, // "08:00"
    GioKetThuc: { type: String, required: true }, // "10:00"
    TrangThai: {
      type: String,
      enum: ["cho_xac_nhan", "da_xac_nhan", "da_huy", "hoan_thanh"],
      default: "cho_xac_nhan",
    },
    ThoiDiemTao: { type: Date, default: Date.now },
    MaKhachHang: { type: String, required: true },
    MaSan: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("LICH_HEN", LichHenSchema, "LICH_HEN");