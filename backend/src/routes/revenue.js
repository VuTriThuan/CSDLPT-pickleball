const express = require("express");

const router = express.Router();

const RevenueService = require("../services/revenueService");
const { requireAuth, requirePermission } = require("../middleware/auth");
const { PERMISSIONS } = require("../constants/roles");

const getSelectedBranchId = (req) => {
  if (
    req.user?.role === "nhan_vien_chi_nhanh" ||
    req.user?.role === "quan_ly_chi_nhanh"
  ) {
    return req.user.MaChiNhanh || "";
  }

  return req.query.branchId || req.get("x-branch-id") || "";
};

const assertCanViewBranchRevenue = (req, branchId) => {
  if (
    req.user?.role === "quan_ly_chi_nhanh" &&
    branchId !== req.user.MaChiNhanh
  ) {
    const err = new Error("Khong co quyen xem doanh thu chi nhanh khac");
    err.statusCode = 403;
    throw err;
  }
};

router.get(
  "/",
  requireAuth,
  requirePermission(PERMISSIONS.REVENUE_VIEW),
  async (req, res) => {
  try {
    const branchId = getSelectedBranchId(req);
    const data = branchId
      ? [await RevenueService.getRevenueByBranch(branchId)]
      : await RevenueService.getRevenueAllBranches();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
  },
);

router.get(
  "/branch/:branchId",
  requireAuth,
  requirePermission(PERMISSIONS.REVENUE_VIEW),
  async (req, res) => {
  try {
    assertCanViewBranchRevenue(req, req.params.branchId);
    const branchId = req.params.branchId;
    const data = await RevenueService.getRevenueByBranch(branchId);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
  },
);

router.get(
  "/total",
  requireAuth,
  requirePermission(PERMISSIONS.REVENUE_VIEW),
  async (req, res) => {
  try {
    const branchId = getSelectedBranchId(req);
    const data = (await RevenueService.getTotalRevenue(branchId)) || {
      _id: null,
      TongTatCaChiNhanh: 0,
    };

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
  },
);

module.exports = router;
