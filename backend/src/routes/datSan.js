const express = require("express");
const router = express.Router();
const {
  datSanVaThanhToan,
  huyLichHenVaHoanTien,
  laySanTrong,
  layLichSuDatSan,
} = require("../services/datSanService");
const LichHen = require("../models/LichHen");
const ThanhToan = require("../models/ThanhToan");

/**
 * GET /api/san/trong
 * Lấy danh sách sân trống theo ngày giờ
 */
router.get("/trong", async (req, res) => {
  try {
    const { ngayDat, gioBatDau, gioKetThuc } = req.query;
    if (!ngayDat || !gioBatDau || !gioKetThuc) {
      return res.status(400).json({
        success: false,
        message: "Thiếu tham số ngayDat, gioBatDau, gioKetThuc",
      });
    }
    const sanTrong = await laySanTrong(ngayDat, gioBatDau, gioKetThuc);
    res.json({ success: true, data: sanTrong });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/dat-san
 * Đặt sân và thanh toán (dùng transaction)
 * Body: { maSan, maKhachHang, ngayDat, gioBatDau, gioKetThuc, phuongThucThanhToan }
 */
router.post("/dat-san", async (req, res) => {
  try {
    const {
      gioBatDau,
      gioKetThuc,
      maKhachHang,
      maSan,
      ngayDat,
      phuongThucThanhToan,
    } = req.body;
    if (!maSan || !maKhachHang || !ngayDat || !gioBatDau || !gioKetThuc) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu thông tin đặt sân" });
    }
    const result = await datSanVaThanhToan({
      gioBatDau,
      gioKetThuc,
      maKhachHang,
      maSan,
      ngayDat,
      phuongThucThanhToan,
    });
    res.status(201).json(result);
  } catch (err) {
    console.error("❌ ERROR:", err.message); // 👈 thêm dòng này
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/dat-san/huy/:maLichHen
 * Hủy lịch hẹn + hoàn tiền (transaction)
 */
router.post("/dat-san/huy/:maLichHen", async (req, res) => {
  try {
    const result = await huyLichHenVaHoanTien(req.params.maLichHen);
    res.json(result);
  } catch (err) {
    console.error("❌ ERROR:", err.message); // 👈 thêm dòng này
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/lich-hen/khach-hang/:maKhachHang
 * Lịch sử đặt sân của khách hàng
 */
router.get("/lich-hen/khach-hang/:maKhachHang", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await layLichSuDatSan(
      req.params.maKhachHang,
      Number(page),
      Number(limit),
    );
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/lich-hen/:maLichHen
 * Chi tiết 1 lịch hẹn
 */
router.get("/lich-hen/:maLichHen", async (req, res) => {
  try {
    const lichHen = await LichHen.findOne({ MaLichHen: req.params.maLichHen });
    if (!lichHen)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy lịch hẹn" });
    const thanhToan = await ThanhToan.findOne({ MaLichHen: lichHen.MaLichHen });
    res.json({ success: true, data: { ...lichHen.toObject(), thanhToan } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/thanh-toan/:maThanhToan
 * Chi tiết thanh toán
 */
router.get("/thanh-toan/:maThanhToan", async (req, res) => {
  try {
    const tt = await ThanhToan.findOne({ MaThanhToan: req.params.maThanhToan });
    if (!tt)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy thanh toán" });
    res.json({ success: true, data: tt });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
