import { useState } from 'react';
import api from '../services/api';

function RevenueForm({ onRevenueUpdate }) {
  const [chiNhanh, setChiNhanh] = useState('');
  const [soTien, setSoTien] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const chiNhanhList = ['HN001', 'HCM001', 'DN001', 'CT001']; // MaChiNhanh

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const maThanhToan = 'TT' + Date.now();
      await api.themThanhToan({ 
        MaThanhToan: maThanhToan,
        SoTien: Number(soTien),
        MaChiNhanh: chiNhanh,
        MaLichHen: 'LH' + Date.now(), // fake
        TrangThai: 'thanh_cong',
        PhuongThuc: 'chuyen_khoan'
      });
      setMessage(`✅ Lưu shard ${chiNhanh} thành công!`);
      setChiNhanh('');
      setSoTien('');
      onRevenueUpdate();
    } catch (error) {
      setMessage(`❌ Lỗi: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '20px auto', 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px' 
    }}>
      <h3>💳 Thêm Thanh Toán (Distributed)</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Chi Nhánh (Shard): </label>
          <select 
            value={chiNhanh} 
            onChange={(e) => setChiNhanh(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="">Chọn shard</option>
            {chiNhanhList.map(id => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>SoTien (VNĐ): </label>
          <input 
            type="number" 
            value={soTien} 
            onChange={(e) => setSoTien(e.target.value)}
            placeholder="100000"
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading || !chiNhanh || !soTien}
          style={{ 
            width: '100%', 
            padding: '10px', 
            background: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px' 
          }}
        >
          {loading ? '🔄 Routing to shard...' : '💾 Lưu Thanh Toán'}
        </button>
      </form>
      {message && <p style={{ marginTop: '10px', color: message.includes('❌') ? 'red' : 'green' }}>{message}</p>}
    </div>
  );
}

export default RevenueForm;
