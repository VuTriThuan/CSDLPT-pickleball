const express = require("express");

const router = express.Router();

const RevenueService = require("../services/revenueService");

const getSelectedBranchId = (req) =>
  req.query.branchId || req.get("x-branch-id") || "";

// doanh thu từng chi nhánh
router.get("/", async (req, res) => {
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// doanh thu của một chi nhánh cụ thể
router.get("/branch/:branchId", async (req, res) => {
  try {
    const branchId = req.params.branchId;
    const data = await RevenueService.getRevenueByBranch(branchId);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// tổng doanh thu toàn hệ thống
router.get("/total", async (req, res) => {
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
