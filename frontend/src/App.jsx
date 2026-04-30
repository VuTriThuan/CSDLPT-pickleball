import { useEffect, useState } from "react";
import RevenueForm from "./components/RevenueForm";
import api from "./services/api";

function App() {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRevenue = async () => {
    try {
      const result = await api.getDoanhThuChiNhanh();
      setRevenueData(result.doanhThu);
      setShardInfo(result.shards);
    } catch (error) {
      console.error('Lỗi fetch revenue:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  const handleRevenueUpdate = () => {
    fetchRevenue();
  };

  if (loading) return <div style={{padding: '40px', textAlign: 'center'}}>⏳ Loading revenue...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
        💰 Doanh Thu Các Chi Nhánh Pickleball
      </h1>
      
      <RevenueForm onRevenueUpdate={handleRevenueUpdate} />
      
      <div style={{ marginTop: '40px' }}>
        <h2>📈 Bảng Doanh Thu (sort theo tổng cao nhất)</h2>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse', 
          marginTop: '20px',
          background: 'white',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <thead>
            <tr style={{ background: '#007bff', color: 'white' }}>
              <th style={{ padding: '15px', border: '1px solid #ddd' }}>Chi Nhánh</th>
              <th style={{ padding: '15px', border: '1px solid #ddd' }}>Tổng Doanh Thu</th>
              <th style={{ padding: '15px', border: '1px solid #ddd' }}>Số Lượng</th>
              <th style={{ padding: '15px', border: '1px solid #ddd' }}>Trung Bình</th>
            </tr>
          </thead>
          <tbody>
            {revenueData.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '30px', textAlign: 'center', color: '#666' }}>
                  Chưa có dữ liệu doanh thu. Thêm dữ liệu bằng form trên!
                </td>
              </tr>
            ) : (
              revenueData.map((branch, index) => (
                <tr key={branch._id || index} style={{ '&:hover': { background: '#f5f5f5' } }}>
                  <td style={{ padding: '15px', border: '1px solid #ddd', fontWeight: 'bold' }}>
                    {branch._id}
                  </td>
                  <td style={{ padding: '15px', border: '1px solid #ddd' }}>
                    {branch.totalRevenue.toLocaleString()} VNĐ
                  </td>
                  <td style={{ padding: '15px', border: '1px solid #ddd' }}>
                    {branch.count}
                  </td>
                  <td style={{ padding: '15px', border: '1px solid #ddd' }}>
                    {Math.round(branch.avgRevenue).toLocaleString()} VNĐ
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
