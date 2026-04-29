const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/auth");

const {
  datSanVaThanhToan,
  huyLichHenVaHoanTien,
  layLichSuDatSan,
} = require("../services/datSanService");

const LichHen = require("../models/LichHen");
const ThanhToan = require("../models/ThanhToan");
const San = require("../models/San");

// ===== ĐẶT SÂN =====
router.post("/dat-san", requireAuth, async (req, res) => {
  try {
    const { maSan, ngayDat, gioBatDau, gioKetThuc, phuongThucThanhToan } =
      req.body;

    const maKhachHang = req.session.user.maKhachHang;

    if (!maSan || !ngayDat || !gioBatDau || !gioKetThuc)
      return res
        .status(400)
        .json({ success: false, message: "Thiếu thông tin" });

    const result = await datSanVaThanhToan({
      maSan,
      maKhachHang,
      ngayDat,
      gioBatDau,
      gioKetThuc,
      phuongThucThanhToan,
    });

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ===== HỦY =====
router.post("/dat-san/huy/:maLichHen", requireAuth, async (req, res) => {
  try {
    const result = await huyLichHenVaHoanTien(
      req.params.maLichHen,
      req.session.user.maKhachHang,
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ===== LỊCH SỬ =====
router.get("/lich-hen/cua-toi", requireAuth, async (req, res) => {
  try {
    const maKhachHang =
      req.session.user.maKhachHang || req.session.user.MaKhachHang;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await layLichSuDatSan(maKhachHang, page, limit);

    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== CHI TIẾT =====
router.get("/lich-hen/:maLichHen", requireAuth, async (req, res) => {
  try {
    const lh = await LichHen.findOne({ MaLichHen: req.params.maLichHen });

    if (!lh)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy" });

    const [thanhToan, san] = await Promise.all([
      ThanhToan.findOne({ MaLichHen: lh.MaLichHen }),
      San.findOne({ MaSan: lh.MaSan }),
    ]);

    res.json({ success: true, data: { ...lh.toObject(), thanhToan, san } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
