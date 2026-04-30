const express = require('express');
const DichVuThanhToan = require('../services/ThanhToanService');
const San = require('../models/San');
const LichHen = require('../models/LichHen');
const router = express.Router();

// POST /api/thanh-toan/lich-hen - Thanh toán theo MaLichHen (auto lấy MaChiNhanh)
router.post('/lich-hen', async (req, res) => {
  try {
    const { MaLichHen, SoTien, PhuongThuc } = req.body;
    
    // Fetch LichHen → San → MaChiNhanh
    const lichHen = await LichHen.findOne({ MaLichHen, TrangThai: 'cho_xac_nhan' });
    if (!lichHen) {
      return res.status(404).json({ error: 'Lịch hẹn không tồn tại hoặc đã xử lý' });
    }
    
    const san = await San.findOne({ MaSan: lichHen.MaSan });
    if (!san) {
      return res.status(404).json({ error: 'Sân không tồn tại' });
    }
    
    // Create ThanhToan với MaChiNhanh từ San
    const thanhToan = await DichVuThanhToan.themThanhToanMoi({
      MaThanhToan: `TT${Date.now()}`,
      SoTien,
      PhuongThuc: PhuongThuc || 'tien_mat',
      MaLichHen,
      MaChiNhanh: san.MaChiNhanh
    });
    
    // Update LichHen status
    await LichHen.updateOne({ MaLichHen }, { TrangThai: 'da_xac_nhan' });
    
    res.status(201).json({ 
      message: '✅ Thanh toán thành công!',
      data: thanhToan,
      chiNhanh: san.MaChiNhanh
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/thanh-toan - Thêm thanh toán trực tiếp
router.post('/', async (req, res) => {
  try {
    const thanhToan = await DichVuThanhToan.themThanhToanMoi(req.body);
    res.status(201).json({ 
      message: '✅ Thanh toán thêm thành công',
      data: thanhToan,
      shard: thanhToan.MaChiNhanh
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/thanh-toan/doanh-thu - Doanh thu tất cả chi nhánh (across shards)
router.get('/doanh-thu', async (req, res) => {
  try {
    const doanhThu = await DichVuThanhToan.layDoanhThuTheoChiNhanh();
    const shardInfo = await DichVuThanhToan.layThongTinShard();
    
    res.json({ 
      doanhThu, 
      phanPho: shardInfo,
      message: `${doanhThu.length} chi nhánh - Truy vấn phân tán OK`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
