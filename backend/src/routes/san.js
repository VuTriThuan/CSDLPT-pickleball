const express = require("express");
const router = express.Router();

const { requireAuth, requirePermission } = require("../middleware/auth");
const { PERMISSIONS } = require("../constants/roles");
const { assertCanManageSan } = require("../services/phanQuyenService");

const { laySanTrong } = require("../services/datSanService");

const San = require("../models/San");

const sendError = (res, err, defaultStatus = 500) => {
  if (err.code === 11000 && err.keyPattern?.MaSan) {
    return res.status(400).json({
      success: false,
      message: `Mã sân ${err.keyValue?.MaSan || ""} đã tồn tại`,
    });
  }

  return res.status(err.statusCode || defaultStatus).json({
    success: false,
    message: err.message,
  });
};

router.get("/", async (_req, res) => {
  try {
    const san = await San.find().sort({ MaSan: 1 });
    res.json({ success: true, data: san });
  } catch (err) {
    sendError(res, err);
  }
});

router.post(
  "/",
  requireAuth,
  requirePermission(PERMISSIONS.SAN_MANAGE),
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

router.put(
  "/:maSan",
  requireAuth,
  requirePermission(PERMISSIONS.SAN_MANAGE),
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

router.delete(
  "/:maSan",
  requireAuth,
  requirePermission(PERMISSIONS.SAN_MANAGE),
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
