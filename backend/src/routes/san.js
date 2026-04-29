const express = require("express");
const router = express.Router();

const { requireAuth, requirePermission } = require("../middleware/auth");
const { PERMISSIONS } = require("../constants/roles");
const { assertCanManageSan } = require("../services/phanQuyenService");

const { laySanTrong } = require("../services/datSanService");

const San = require("../models/San");

// ===== helper giữ nguyên =====
const sendError = (res, err, defaultStatus = 500) =>
  res.status(err.statusCode || defaultStatus).json({
    success: false,
    message: err.message,
  });

// ===== GET all =====
router.get("/", async (_req, res) => {
  try {
    const san = await San.find().sort({ MaSan: 1 });
    res.json({ success: true, data: san });
  } catch (err) {
    sendError(res, err);
  }
});

// ===== CREATE =====
router.post(
  "/",
  requireAuth,
  requirePermission(PERMISSIONS.SAN_MANAGE_BRANCH),
  async (req, res) => {
    try {
      assertCanManageSan(req.user, req.body.MaChiNhanh);
      const san = await San.create(req.body);
      res.status(201).json({ success: true, data: san });
    } catch (err) {
      sendError(res, err, 400);
    }
  },
);

// ===== UPDATE =====
router.put(
  "/:maSan",
  requireAuth,
  requirePermission(PERMISSIONS.SAN_MANAGE_BRANCH),
  async (req, res) => {
    try {
      const san = await San.findOne({ MaSan: req.params.maSan });
      if (!san)
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy sân" });

      assertCanManageSan(req.user, san.MaChiNhanh);

      const updated = await San.findOneAndUpdate(
        { MaSan: req.params.maSan },
        req.body,
        { new: true, runValidators: true },
      );

      res.json({ success: true, data: updated });
    } catch (err) {
      sendError(res, err, 400);
    }
  },
);

// ===== DELETE =====
router.delete(
  "/:maSan",
  requireAuth,
  requirePermission(PERMISSIONS.SAN_MANAGE_BRANCH),
  async (req, res) => {
    try {
      const san = await San.findOne({ MaSan: req.params.maSan });
      if (!san)
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy sân" });

      assertCanManageSan(req.user, san.MaChiNhanh);
      await San.deleteOne({ MaSan: req.params.maSan });

      res.json({ success: true, message: "Đã xóa sân" });
    } catch (err) {
      sendError(res, err, 400);
    }
  },
);

// ===== SÂN TRỐNG =====
router.get("/trong", async (req, res) => {
  try {
    const { maChiNhanh, ngayDat, gioBatDau, gioKetThuc } = req.query;

    if (!ngayDat || !gioBatDau || !gioKetThuc) {
      return res.status(400).json({
        success: false,
        message: "Thiếu tham số ngayDat / gioBatDau / gioKetThuc",
      });
    }

    const data = await laySanTrong(
      maChiNhanh || null,
      ngayDat,
      gioBatDau,
      gioKetThuc,
    );

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
