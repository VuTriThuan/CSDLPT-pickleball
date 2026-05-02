const express = require("express");
const router = express.Router();

const ChiNhanh = require("../models/ChiNhanh");

router.get("/chi-nhanh", async (req, res) => {
  try {
    const list = await ChiNhanh.find({ TrangThai: "Hoạt động" }).sort(
      "MaChiNhanh",
    );
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
