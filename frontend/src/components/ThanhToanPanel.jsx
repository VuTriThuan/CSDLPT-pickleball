import { useEffect, useState } from "react";
import {
  getThanhToanList,
  getThanhToanLichHen,
  createThanhToan,
  updateThanhToan,
  deleteThanhToan,
} from "../services/adminService";
import BranchSelect from "./BranchSelect";

const TRANG_THAI_THANH_TOAN = [
  { value: "cho_xu_ly", label: "Chờ xử lý" },
  { value: "thanh_cong", label: "Thanh toán thành công" },
  { value: "that_bai", label: "Thanh toán thất bại" },
  { value: "hoan_tien", label: "Hoàn tiền" },
];

const initialForm = {
  MaThanhToan: "",
  SoTien: "",
  TrangThai: "thanh_cong",
  MaDatSan: "",
};

const formatPrice = (value) =>
  Number(value || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

export default function ThanhToanPanel({ auth, setToast, selectedBranch }) {
  const [thanhToanList, setThanhToanList] = useState([]);
  const [lichHenList, setLichHenList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newForm, setNewForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const loadThanhToan = async () => {
    setLoading(true);
    try {
      const res = await getThanhToanList(auth);
      setThanhToanList(res.data || []);
    } catch (err) {
      setToast({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  const loadLichHen = async () => {
    if (!selectedBranch) return;
    try {
      const res = await getThanhToanLichHen(selectedBranch, auth);
      setLichHenList(res.data || []);
    } catch (err) {
      setToast({ type: "error", msg: err.message });
    }
  };

  useEffect(() => {
    loadThanhToan();
  }, [auth.role, auth.branchId]);

  useEffect(() => {
    loadLichHen();
  }, [selectedBranch]);

  const setNew = (key, value) =>
    setNewForm((current) => ({ ...current, [key]: value }));

  const setEdit = (key, value) =>
    setEditForm((current) => ({ ...current, [key]: value }));

  const addThanhToan = async () => {
    if (!newForm.MaThanhToan || !newForm.SoTien || !newForm.MaDatSan) {
      setToast({ type: "error", msg: "Cần nhập đầy đủ thông tin thanh toán" });
      return;
    }

    setLoading(true);
    try {
      const res = await createThanhToan(
        { ...newForm, SoTien: Number(newForm.SoTien) },
        auth,
      );
      setThanhToanList((current) => [res.data, ...current]);
      setNewForm(initialForm);
      setShowForm(false);
      setToast({ type: "ok", msg: "Đã thêm thanh toán" });
    } catch (err) {
      setToast({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (thanhToan) => {
    setEditingId(thanhToan.MaThanhToan);
    setEditForm({
      MaThanhToan: thanhToan.MaThanhToan,
      SoTien: thanhToan.SoTien,
      TrangThai: thanhToan.TrangThai,
      MaDatSan: thanhToan.MaDatSan,
    });
  };

  const saveEdit = async (maThanhToan) => {
    setLoading(true);
    try {
      const res = await updateThanhToan(
        maThanhToan,
        {
          SoTien: editForm.SoTien ? Number(editForm.SoTien) : "",
          TrangThai: editForm.TrangThai,
          MaDatSan: editForm.MaDatSan,
        },
        auth,
      );
      setThanhToanList((current) =>
        current.map((item) =>
          item.MaThanhToan === maThanhToan ? res.data : item,
        ),
      );
      setEditingId(null);
      setToast({ type: "ok", msg: "Đã sửa thanh toán" });
    } catch (err) {
      setToast({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  const removeThanhToan = async (maThanhToan) => {
    if (!window.confirm(`Xóa thanh toán ${maThanhToan}?`)) return;

    setLoading(true);
    try {
      await deleteThanhToan(maThanhToan, auth);
      setThanhToanList((current) =>
        current.filter((item) => item.MaThanhToan !== maThanhToan),
      );
      setToast({ type: "ok", msg: "Đã xóa thanh toán" });
    } catch (err) {
      setToast({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  const statusLabel = (status) =>
    TRANG_THAI_THANH_TOAN.find((item) => item.value === status)?.label ||
    status;

  const getLichHenInfo = (maDatSan) =>
    lichHenList.find((item) => item.MaLichHen === maDatSan);

  return (
    <div className="admin-panel">
      <div className="admin-toolbar">
        <div>
          <h2 className="admin-title">Quản lý thanh toán</h2>
          <p className="admin-subtitle">
            Danh sách thanh toán
            {selectedBranch && ` - Chi nhánh ${selectedBranch}`}
          </p>
        </div>
        <button
          className="btn btn--primary"
          onClick={() => setShowForm((current) => !current)}
        >
          Thêm thanh toán
        </button>
      </div>

      {showForm && (
        <div className="admin-form-card">
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Mã thanh toán</label>
              <input
                className="form-input"
                value={newForm.MaThanhToan}
                onChange={(e) => setNew("MaThanhToan", e.target.value)}
                placeholder="VD: TT001"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Số tiền</label>
              <input
                className="form-input"
                type="number"
                min="0"
                value={newForm.SoTien}
                onChange={(e) => setNew("SoTien", e.target.value)}
                placeholder="VD: 250000"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Trạng thái</label>
              <select
                className="form-input"
                value={newForm.TrangThai}
                onChange={(e) => setNew("TrangThai", e.target.value)}
              >
                {TRANG_THAI_THANH_TOAN.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field form-field--wide">
              <label className="form-label">Lịch hẹn</label>
              <select
                className="form-input"
                value={newForm.MaDatSan}
                onChange={(e) => setNew("MaDatSan", e.target.value)}
              >
                <option value="">-- Chọn lịch hẹn --</option>
                {lichHenList.map((item) => (
                  <option key={item.MaLichHen} value={item.MaLichHen}>
                    {item.MaLichHen} - {item.tenKhachHang || item.MaKhachHang}{" "}
                    ({new Date(item.NgayDat).toLocaleDateString("vi-VN")}{" "}
                    {item.GioBatDau}-{item.GioKetThuc})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="admin-form-actions">
            <button
              className="btn btn--primary"
              onClick={addThanhToan}
              disabled={loading}
            >
              Thêm
            </button>
            <button
              className="btn btn--secondary"
              onClick={() => {
                setShowForm(false);
                setNewForm(initialForm);
              }}
              disabled={loading}
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã thanh toán</th>
              <th>Khách hàng</th>
              <th>Số tiền</th>
              <th>Trạng thái</th>
              <th>Ngày thanh toán</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {thanhToanList.map((item) => {
              const isEditing = editingId === item.MaThanhToan;
              const lichHenInfo = getLichHenInfo(item.MaDatSan);
              return (
                <tr key={item.MaThanhToan}>
                  <td className="admin-table__id">{item.MaThanhToan}</td>
                  <td>{lichHenInfo?.tenKhachHang || "-"}</td>
                  <td>
                    {isEditing ? (
                      <input
                        className="table-input"
                        type="number"
                        min="0"
                        value={editForm.SoTien}
                        onChange={(e) => setEdit("SoTien", e.target.value)}
                      />
                    ) : (
                      formatPrice(item.SoTien)
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <select
                        className="table-input"
                        value={editForm.TrangThai}
                        onChange={(e) => setEdit("TrangThai", e.target.value)}
                      >
                        {TRANG_THAI_THANH_TOAN.map((trangThai) => (
                          <option
                            key={trangThai.value}
                            value={trangThai.value}
                          >
                            {trangThai.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      statusLabel(item.TrangThai)
                    )}
                  </td>
                  <td>
                    {new Date(item.ThoiDiemThanhToan).toLocaleDateString(
                      "vi-VN",
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <div className="table-actions">
                        <button
                          className="btn-text btn-text--primary"
                          onClick={() => saveEdit(item.MaThanhToan)}
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
                          onClick={() => removeThanhToan(item.MaThanhToan)}
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

            {!thanhToanList.length && (
              <tr>
                <td colSpan="7" className="table-empty">
                  {loading ? "Đang tải dữ liệu..." : "Chưa có thanh toán nào"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
