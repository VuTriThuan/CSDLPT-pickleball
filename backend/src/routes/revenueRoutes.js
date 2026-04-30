const express = require("express");

const router = express.Router();

const RevenueService = require(
  "../services/RevenueService"
);

// doanh thu từng chi nhánh
router.get("/", async (req, res) => {
  try {
    const data =
      await RevenueService.getRevenueAllBranches();

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
    const data =
      await RevenueService.getTotalRevenue();

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