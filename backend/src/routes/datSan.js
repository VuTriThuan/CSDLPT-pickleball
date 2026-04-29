const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const {
  datSanVaThanhToan,
  huyLichHenVaHoanTien,
  laySanTrong,
  layLichSuDatSan,
} = require("../services/datSanService");
const LichHen = require("../models/LichHen");
const ThanhToan = require("../models/ThanhToan");
const San = require("../models/San");
const ChiNhanh = require("../models/ChiNhanh");

// GET /api/chi-nhanh — danh sách chi nhánh (public, để hiển thị filter)
router.get("/chi-nhanh", async (req, res) => {
  try {
    const list = await ChiNhanh.find({ TrangThai: "hoat_dong" }).sort(
      "MaChiNhanh",
    );
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/san/trong?maChiNhanh=&ngayDat=&gioBatDau=&gioKetThuc= (public)
router.get("/trong", async (req, res) => {
  try {
    const { maChiNhanh, ngayDat, gioBatDau, gioKetThuc } = req.query;
    if (!ngayDat || !gioBatDau || !gioKetThuc)
      return res.status(400).json({
        success: false,
        message: "Thiếu tham số ngayDat / gioBatDau / gioKetThuc",
      });

    const data = await laySanTrong(
      maChiNhanh || null,
      ngayDat,
      gioBatDau,
      gioKetThuc,
    );
    res.json({
      success: true,
      data,
      shardNote: maChiNhanh
        ? `Query trên shard của ${maChiNhanh}`
        : "Scatter-gather query tất cả shard",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/dat-san  ← cần đăng nhập, maKhachHang lấy từ session
router.post("/dat-san", requireAuth, async (req, res) => {
  try {
    const { maSan, ngayDat, gioBatDau, gioKetThuc, phuongThucThanhToan } =
      req.body;
    const maKhachHang = req.session.user.maKhachHang; // ← từ session, không nhập tay

    if (!maSan || !ngayDat || !gioBatDau || !gioKetThuc)
      return res
        .status(400)
        .json({ success: false, message: "Thiếu thông tin đặt sân" });

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

// POST /api/dat-san/huy/:maLichHen  ← cần đăng nhập
router.post("/dat-san/huy/:maLichHen", requireAuth, async (req, res) => {
  try {
    const result = await huyLichHenVaHoanTien(
      req.params.maLichHen,
      req.session.user.maKhachHang,
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/lich-hen/cua-toi  ← lịch của chính user đang đăng nhập
router.get("/lich-hen/cua-toi", requireAuth, async (req, res) => {
  try {
    const maKhachHang =
      req.session.user.maKhachHang || req.session.user.MaKhachHang;

    const pageNum = parseInt(req.query.page) || 1;
    const limitNum = parseInt(req.query.limit) || 10;

    const result = await layLichSuDatSan(maKhachHang, pageNum, limitNum);

    console.log("maKhachHang:", maKhachHang);
    console.log("result:", result);

    res.json({ success: true, ...result });
  } catch (err) {
    console.error("❌ LỖI LỊCH SỬ:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/lich-hen/:maLichHen
router.get("/lich-hen/:maLichHen", requireAuth, async (req, res) => {
  try {
    const lh = await LichHen.findOne({ MaLichHen: req.params.maLichHen });
    if (!lh)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy" });
    if (
      lh.MaKhachHang !== req.session.user.maKhachHang &&
      req.session.user.role !== "admin"
    )
      return res
        .status(403)
        .json({ success: false, message: "Không có quyền xem" });

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
