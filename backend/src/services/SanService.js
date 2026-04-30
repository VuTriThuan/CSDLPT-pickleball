const San = require('../models/San');

const CHI_NHANH = [
  'Hoàn Kiếm', 'Cầu Giấy', 'Ba Đình', 'Nam Từ Liêm', 
  'Bắc Từ Liêm', 'Thanh Xuân', 'Long Biên', 'Hà Đông'
];

class DichVuSan {
  static async laySanTheoChiNhanh(maChiNhanh) {
    return San.find({ MaChiNhanh: maChiNhanh, TrangThai: 'hoat_dong' });
  }
  
  static layDanhSachChiNhanh() {
    return CHI_NHANH;
  }
}

module.exports = DichVuSan;

