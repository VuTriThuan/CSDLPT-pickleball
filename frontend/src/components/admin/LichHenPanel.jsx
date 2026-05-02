import { useEffect, useState } from "react";
import {
  getSanList,
  getLichHenList,
  updateLichHen,
  deleteLichHen,
} from "../../services/adminService";
import { cleanPayload, formatPrice } from "../../utils/helpers";

const formatDateInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function LichHenPanel({ auth, setToast }) {
  const [lichHenList, setLichHenList] = useState([]);
  const [sanList, setSanList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(false);

  const loadLichHen = async () => {
    setLoading(true);
    try {
      const [lichHenRes, sanRes] = await Promise.all([
        getLichHenList(auth),
        getSanList(auth),
      ]);
      const lichHenData = lichHenRes.data || [];
      setLichHenList(lichHenData);
      setSanList(sanRes.data || []);
    } catch (err) {
      setToast({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLichHen();
  }, [auth.role, auth.branchId]);

  const setEdit = (key, value) =>
    setEditForm((current) => ({ ...current, [key]: value }));

  const startEdit = (lichHen) => {
    setEditingId(lichHen.MaLichHen);
    setEditForm({
      MaSan: lichHen.MaSan || "",
      NgayDat: formatDateInput(lichHen.NgayDat),
      GioBatDau: lichHen.GioBatDau || "",
      GioKetThuc: lichHen.GioKetThuc || "",
      TrangThai: lichHen.TrangThai || "cho_xac_nhan",
      TrangThaiThanhToan: lichHen.thanhToan?.TrangThai || "",
    });
  };

  const saveEdit = async (maLichHen) => {
    setLoading(true);
    try {
      const res = await updateLichHen(
        maLichHen,
        cleanPayload({
          MaSan: editForm.MaSan,
          NgayDat: editForm.NgayDat,
          GioBatDau: editForm.GioBatDau,
          GioKetThuc: editForm.GioKetThuc,
          TrangThai: editForm.TrangThai,
          TrangThaiThanhToan: editForm.TrangThaiThanhToan,
        }),
        auth,
      );
      setLichHenList((current) =>
        current.map((item) =>
          item.MaLichHen === maLichHen ? { ...item, ...res.data } : item,
        ),
      );
      setEditingId(null);
      setToast({ type: "ok", msg: "Đã sửa lịch đặt" });
    } catch (err) {
      setToast({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

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

  const handleDelete = async (maLichHen) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá lịch hẹn này không?")) return;
    setLoading(true);
    try {
      await deleteLichHen(maLichHen, auth);
      setLichHenList((current) => current.filter((item) => item.MaLichHen !== maLichHen));
      setToast({ type: "ok", msg: "Đã xoá lịch hẹn thành công" });
    } catch (err) {
      setToast({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel admin-panel--lich-hen">
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
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {lichHenList.map((item) => {
              const isEditing = editingId === item.MaLichHen;

              return (
                <tr key={item.MaLichHen}>
                  <td className="admin-table__id">{item.MaLichHen}</td>
                  <td>
                    {item.tenKhachHang || item.MaKhachHang}
                  </td>
                  <td>
                    {isEditing ? (
                      <select
                        className="table-input"
                        value={editForm.MaSan}
                        onChange={(e) => setEdit("MaSan", e.target.value)}
                      >
                        {sanList.map((san) => (
                          <option key={san.MaSan} value={san.MaSan}>
                            {san.TenSan || san.MaSan}
                          </option>
                        ))}
                      </select>
                    ) : (
                      item.tenSan || item.MaSan
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        className="table-input"
                        type="date"
                        value={editForm.NgayDat}
                        onChange={(e) => setEdit("NgayDat", e.target.value)}
                      />
                    ) : (
                      new Date(item.NgayDat).toLocaleDateString("vi-VN")
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <div className="table-actions">
                        <input
                          className="table-input"
                          type="time"
                          value={editForm.GioBatDau}
                          onChange={(e) => setEdit("GioBatDau", e.target.value)}
                        />
                        <input
                          className="table-input"
                          type="time"
                          value={editForm.GioKetThuc}
                          onChange={(e) => setEdit("GioKetThuc", e.target.value)}
                        />
                      </div>
                    ) : (
                      `${item.GioBatDau} - ${item.GioKetThuc}`
                    )}
                  </td>
                  <td>
                    {item.thanhToan ? (
                      <div className="payment-cell">
                        <strong>{formatPrice(item.thanhToan.SoTien)}</strong>
                        <select
                          className="table-input"
                          value={
                            isEditing
                              ? editForm.TrangThaiThanhToan
                              : item.thanhToan.TrangThai
                          }
                          onChange={(event) =>
                            isEditing
                              ? setEdit("TrangThaiThanhToan", event.target.value)
                              : savePaymentStatus(
                                  item.MaLichHen,
                                  event.target.value,
                                )
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
                      value={isEditing ? editForm.TrangThai : item.TrangThai}
                      onChange={(event) =>
                        isEditing
                          ? setEdit("TrangThai", event.target.value)
                          : saveStatus(item.MaLichHen, event.target.value)
                      }
                      disabled={loading}
                    >
                      <option value="cho_xac_nhan">Chờ xác nhận</option>
                      <option value="da_xac_nhan">Đã xác nhận</option>
                      <option value="da_huy">Đã hủy</option>
                      <option value="hoan_thanh">Hoàn thành</option>
                    </select>
                  </td>
                  <td>
                    {isEditing ? (
                      <div className="table-actions">
                        <button
                          className="btn-text btn-text--primary"
                          onClick={() => saveEdit(item.MaLichHen)}
                          disabled={loading}
                        >
                          Lưu
                        </button>
                        <button
                          className="btn-text"
                          onClick={() => setEditingId(null)}
                          disabled={loading}
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <div className="table-actions">
                        <button
                          className="btn-text btn-text--primary"
                          onClick={() => startEdit(item)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn-text btn-text--danger"
                          onClick={() => handleDelete(item.MaLichHen)}
                          disabled={loading}
                        >
                          Xóa
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}

            {!lichHenList.length && (
              <tr>
                <td colSpan="8" className="table-empty">
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
