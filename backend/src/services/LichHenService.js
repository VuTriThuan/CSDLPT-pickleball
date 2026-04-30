const LichHen = require('../models/LichHen');
const San = require('../models/San');

class DichVuLichHen {
  // Lịch hẹn chờ xử lý theo MaSan
  static async layLichHenChoXuLy(maSan) {
    return LichHen.find({ MaSan: maSan, TrangThai: 'cho_xac_nhan' });
  }

  // Lịch hẹn chờ xử lý theo chi nhánh (JOIN San → LichHen)
  static async layLichHenChoXuLyTheoChiNhanh(maChiNhanh) {
    const san = await San.find({ MaChiNhanh: maChiNhanh });
    const maSanList = san.map(s => s.MaSan);
    return LichHen.find({ MaSan: { $in: maSanList }, TrangThai: 'cho_xac_nhan' });
  }

  // Lấy tất cả lịch hẹn chờ xử lý (all branches)
  static async layTatCaLichHenChoXuLy() {
    return LichHen.find({ TrangThai: 'cho_xac_nhan' });
  }
}

module.exports = DichVuLichHen;
