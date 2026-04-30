const express = require('express');
const DichVuLichHen = require('../services/LichHenService');
const router = express.Router();

// GET /api/lich-hen/cho-xu-ly -> Tất cả lịch hẹn chờ xử lý
router.get('/cho-xu-ly', async (req, res) => {
  try {
    const { maChiNhanh } = req.query;
    let lichHen;
    
    if (maChiNhanh) {
      lichHen = await DichVuLichHen.layLichHenChoXuLyTheoChiNhanh(maChiNhanh);
    } else {
      lichHen = await DichVuLichHen.layTatCaLichHenChoXuLy();
    }
    
    res.json({ 
      lichHen,
      count: lichHen.length,
      message: `Tìm thấy ${lichHen.length} lịch hẹn chờ xử lý`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
