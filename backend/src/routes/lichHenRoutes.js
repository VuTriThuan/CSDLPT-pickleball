const express = require("express");

const router = express.Router();

const LichHenService = require(
  "../services/LichHenService"
);

router.get("/", (req, res) => {
  res.send("LichHen API working");
});


router.get("/pending/:branchId", async (req, res) => {
  try {
    const branchId = req.params.branchId;

    const data =
      await LichHenService.getPendingAppointmentsByBranch(
        branchId
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