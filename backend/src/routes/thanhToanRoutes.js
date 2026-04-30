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

module.exports = router;