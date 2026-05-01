import { useEffect, useState } from "react";
import {
  getRevenueAllBranches,
  getTotalRevenue,
} from "../../services/adminService";
import { formatPrice } from "../../utils/helpers";

export default function RevenuePanel({ auth, setToast }) {
  const [branchRevenue, setBranchRevenue] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadRevenue = async () => {
    setLoading(true);
    try {
      const resAll = await getRevenueAllBranches(auth);
      const resTotal = await getTotalRevenue(auth);
      setBranchRevenue(resAll.data || []);
      setTotalRevenue(resTotal.data || null);
    } catch (err) {
      setToast({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRevenue();
  }, [auth.role, auth.branchId]);

  return (
    <div className="admin-panel">
      <div className="admin-toolbar">
        <div>
          <h2 className="admin-title">Doanh thu</h2>
          <p className="admin-subtitle">
            {auth.branchId
              ? `Tổng hợp doanh thu chi nhánh ${auth.branchId}`
              : "Tổng hợp doanh thu chi nhánh và toàn hệ thống"}
          </p>
        </div>
      </div>

      <div className="admin-summary">
        <div className="summary-card">
          <div className="summary-card__label">
            {auth.branchId
              ? `Tổng doanh thu chi nhánh ${auth.branchId}`
              : "Tổng doanh thu toàn hệ thống"}
          </div>
          <div className="summary-card__value">
            {totalRevenue
              ? formatPrice(totalRevenue.TongTatCaChiNhanh)
              : loading
                ? "Đang tải..."
                : "0 ₫"}
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Chi nhánh</th>
              <th>Doanh thu</th>
            </tr>
          </thead>
          <tbody>
            {branchRevenue.map((item, index) => (
              <tr key={item._id || index}>
                <td className="admin-table__id">{item._id || "Không rõ"}</td>
                <td>{formatPrice(item.TongDoanhThu)}</td>
              </tr>
            ))}

            {!branchRevenue.length && (
              <tr>
                <td colSpan="2" className="table-empty">
                  {loading ? "Đang tải dữ liệu..." : "Chưa có doanh thu"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
