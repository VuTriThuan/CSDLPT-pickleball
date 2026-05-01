import { useEffect, useState } from "react";
import {
  getLichHenList,
  updateLichHen,
} from "../../services/adminService";
import { formatPrice } from "../../utils/helpers";


export default function LichHenPanel({ auth, setToast }) {
  const [lichHenList, setLichHenList] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadLichHen = async () => {
    setLoading(true);
    try {
      const res = await getLichHenList(auth);
      setLichHenList(res.data || []);
    } catch (err) {
      setToast({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLichHen();
  }, [auth.role, auth.branchId]);

  const saveStatus = async (maLichHen, TrangThai) => {
    setLoading(true);
    try {
      const res = await updateLichHen(maLichHen, { TrangThai }, auth);
      setLichHenList((current) =>
        current.map((item) =>
          item.MaLichHen === maLichHen ? { ...item, ...res.data } : item,
        ),
      );
      setToast({ type: "ok", msg: "Đã cập nhật lịch đặt" });
    } catch (err) {
      setToast({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  const savePaymentStatus = async (maLichHen, TrangThaiThanhToan) => {
    setLoading(true);
    try {
      const res = await updateLichHen(maLichHen, { TrangThaiThanhToan }, auth);
      setLichHenList((current) =>
        current.map((item) =>
          item.MaLichHen === maLichHen
            ? { ...item, thanhToan: res.data.thanhToan }
            : item,
        ),
      );
      setToast({ type: "ok", msg: "Đã cập nhật trạng thái thanh toán" });
    } catch (err) {
      setToast({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-toolbar">
        <div>
          <h2 className="admin-title">Quản lý lịch đặt</h2>
          <p className="admin-subtitle">Danh sách lịch đặt của toàn hệ thống</p>
        </div>
      </div>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã lịch</th>
              <th>Khách hàng</th>
              <th>Sân</th>
              <th>Ngày</th>
              <th>Giờ</th>
              <th>Thanh toán</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {lichHenList.map((item) => (
              <tr key={item.MaLichHen}>
                <td className="admin-table__id">{item.MaLichHen}</td>
                <td>{item.tenKhachHang || item.MaKhachHang}</td>
                <td>{item.tenSan || item.MaSan}</td>
                <td>{new Date(item.NgayDat).toLocaleDateString("vi-VN")}</td>
                <td>
                  {item.GioBatDau} - {item.GioKetThuc}
                </td>
                <td>
                  {item.thanhToan ? (
                    <div className="payment-cell">
                      <strong>{formatPrice(item.thanhToan.SoTien)}</strong>
                      <select
                        className="table-input"
                        value={item.thanhToan.TrangThai}
                        onChange={(event) =>
                          savePaymentStatus(item.MaLichHen, event.target.value)
                        }
                        disabled={loading}
                      >
                        <option value="thanh_cong">Đã thanh toán</option>
                        <option value="cho_xu_ly">Chưa thanh toán</option>
                      </select>
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  <select
                    className="table-input"
                    value={item.TrangThai}
                    onChange={(event) =>
                      saveStatus(item.MaLichHen, event.target.value)
                    }
                    disabled={loading}
                  >
                    <option value="cho_xac_nhan">Chờ xác nhận</option>
                    <option value="da_xac_nhan">Đã xác nhận</option>
                    <option value="da_huy">Đã hủy</option>
                    <option value="hoan_thanh">Hoàn thành</option>
                  </select>
                </td>
              </tr>
            ))}

            {!lichHenList.length && (
              <tr>
                <td colSpan="7" className="table-empty">
                  {loading ? "Đang tải dữ liệu..." : "Chưa có lịch đặt nào"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
