const express = require("express");
const router = express.Router();

const { requireAuth, requirePermission } = require("../middleware/auth");
const { PERMISSIONS } = require("../constants/roles");
const { assertCanManageKhachHang } = require("../services/phanQuyenService");

const KhachHang = require("../models/KhachHang");

// ===== UPDATE =====
router.put(
  "/quan-ly/khach-hang/:maKhachHang",
  requireAuth,
  requirePermission(PERMISSIONS.KHACH_HANG_MANAGE),
  async (req, res) => {
    try {
      assertCanManageKhachHang(req.user);

      const updated = await KhachHang.findOneAndUpdate(
        { MaKhachHang: req.params.maKhachHang },
        req.body,
        { new: true, runValidators: true },
      );

      if (!updated)
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy khách hàng" });

      res.json({ success: true, data: updated });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
);

// ===== DELETE =====
router.delete(
  "/quan-ly/khach-hang/:maKhachHang",
  requireAuth,
  requirePermission(PERMISSIONS.KHACH_HANG_MANAGE),
  async (req, res) => {
    try {
      assertCanManageKhachHang(req.user);

      const result = await KhachHang.deleteOne({
        MaKhachHang: req.params.maKhachHang,
      });

      if (!result.deletedCount)
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy khách hàng" });

      res.json({ success: true, message: "Đã xóa khách hàng" });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
);

module.exports = router;
