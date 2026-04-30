const express = require("express");

const router = express.Router();

const ThanhToanService = require(
  "../services/ThanhToanService"
);

router.post("/", async (req, res) => {
  try {
    const payment =
      await ThanhToanService.createPayment(
        req.body
      );

    res.status(201).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// lấy tất cả thanh toán
router.get("/", async (req, res) => {
  try {
    const data =
      await ThanhToanService.getAllPayments();

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

// xóa thanh toán
router.delete("/:id", async (req, res) => {
  try {
    await ThanhToanService.deletePayment(
      req.params.id
    );

    res.json({
      success: true,
      message: "Xóa thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// sửa thanh toán
router.put("/:id", async (req, res) => {
  try {
    const data =
      await ThanhToanService.updatePayment(
        req.params.id,
        req.body
      );

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