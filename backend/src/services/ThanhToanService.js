const ThanhToan = require('../models/ThanhToan');
const San = require('../models/San');
const mongoose = require('mongoose');

const DichVuThanhToan = {
  // Thêm thanh toán mới
  themThanhToanMoi: async (data) => {
    const thanhToan = new ThanhToan(data);
    return await thanhToan.save();
  },

  // Doanh thu theo chi nhánh (cross-shard aggregate)
  layDoanhThuTheoChiNhanh: async () => {
    return await ThanhToan.aggregate([
      {
        $group: {
          _id: '$MaChiNhanh',
          totalRevenue: { $sum: '$SoTien' },
          count: { $sum: 1 },
          avgRevenue: { $avg: '$SoTien' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);
  },

  // Info shard distribution
  layThongTinShard: async () => {
    const stats = await ThanhToan.aggregate([
      {
        $group: {
          _id: '$MaChiNhanh',
          count: { $sum: 1 }
        }
      }
    ]);
    return stats.map(s => s._id);
  }
};

module.exports = DichVuThanhToan;
