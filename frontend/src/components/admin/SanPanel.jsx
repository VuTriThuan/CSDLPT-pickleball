import { useEffect, useState } from "react";
import BranchSelect from "../BranchSelect";
import {
  createSan,
  deleteSan,
  getSanList,
  updateSan,
} from "../../services/adminService";
import { initialSan, TRANG_THAI_SAN } from "../../utils/constants";
import { cleanPayload, formatPrice } from "../../utils/helpers";

export default function SanPanel({ auth, setToast }) {
  const [sanList, setSanList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newForm, setNewForm] = useState(initialSan);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(initialSan);
  const [loading, setLoading] = useState(false);

  const canManage =
    auth.role === "admin" ||
    auth.role === "quan_ly_he_thong" ||
    auth.role === "quan_ly_chi_nhanh";

  const loadSan = async () => {
    setLoading(true);
    try {
      const res = await getSanList(auth);
      setSanList(res.data || []);
    } catch (err) {
      setToast({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSan();
  }, [auth.role, auth.branchId]);

  const setEdit = (key, value) =>
    setEditForm((current) => ({ ...current, [key]: value }));

  const setNew = (key, value) =>
    setNewForm((current) => ({ ...current, [key]: value }));

  const addSan = async () => {
    if (
      !newForm.MaSan ||
      !newForm.TenSan ||
      !newForm.GiaTheoGio ||
      !newForm.MaChiNhanh
    ) {
      setToast({ type: "error", msg: "Cần nhập đầy đủ thông tin sân" });
      return;
    }

    setLoading(true);
    try {
      const res = await createSan(
        { ...newForm, GiaTheoGio: Number(newForm.GiaTheoGio) },
        auth,
      );
      setSanList((current) => [res.data, ...current]);
      setNewForm(initialSan);
      setShowForm(false);
      setToast({ type: "ok", msg: "Đã thêm sân" });
    } catch (err) {
      setToast({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (san) => {
    setEditingId(san.MaSan);
    setEditForm({
      MaSan: san.MaSan,
      TenSan: san.TenSan,
      GiaTheoGio: san.GiaTheoGio,
      TrangThai: san.TrangThai,
      MaChiNhanh: san.MaChiNhanh,
    });
  };

  const saveEdit = async (maSan) => {
    setLoading(true);
    try {
      const res = await updateSan(
        maSan,
        cleanPayload({
          TenSan: editForm.TenSan,
          GiaTheoGio: editForm.GiaTheoGio ? Number(editForm.GiaTheoGio) : "",
          TrangThai: editForm.TrangThai,
          MaChiNhanh: editForm.MaChiNhanh,
        }),
        auth,
      );
      setSanList((current) =>
        current.map((san) => (san.MaSan === maSan ? res.data : san)),
      );
      setEditingId(null);
      setToast({ type: "ok", msg: "Đã sửa sân" });
    } catch (err) {
      setToast({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  const removeSan = async (maSan) => {
    if (!window.confirm(`Xóa sân ${maSan}?`)) return;

    setLoading(true);
    try {
      await deleteSan(maSan, auth);
      setSanList((current) => current.filter((san) => san.MaSan !== maSan));
      setToast({ type: "ok", msg: "Đã xóa sân" });
    } catch (err) {
      setToast({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  const statusLabel = (status) =>
    TRANG_THAI_SAN.find((item) => item.value === status)?.label || status;

  return (
    <div className="admin-panel">
      <div className="admin-toolbar">
        <div>
          <h2 className="admin-title">Quản lý sân</h2>
          <p className="admin-subtitle">Danh sách sân theo dữ liệu API</p>
        </div>
        {canManage && (
          <button
            className="btn btn--primary"
            onClick={() => setShowForm((current) => !current)}
          >
            Thêm sân
          </button>
        )}
      </div>

      {showForm && canManage && (
        <div className="admin-form-card">
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Mã sân</label>
              <input
                className="form-input"
                value={newForm.MaSan}
                onChange={(e) => setNew("MaSan", e.target.value)}
                placeholder="VD: SAN001"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Tên sân</label>
              <input
                className="form-input"
                value={newForm.TenSan}
                onChange={(e) => setNew("TenSan", e.target.value)}
                placeholder="VD: Sân A1"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Giá/giờ</label>
              <input
                className="form-input"
                type="number"
                min="0"
                value={newForm.GiaTheoGio}
                onChange={(e) => setNew("GiaTheoGio", e.target.value)}
                placeholder="VD: 120000"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Trạng thái</label>
              <select
                className="form-input"
                value={newForm.TrangThai}
                onChange={(e) => setNew("TrangThai", e.target.value)}
              >
                {TRANG_THAI_SAN.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field form-field--wide">
              <label className="form-label">Chi nhánh</label>
              <BranchSelect
                value={newForm.MaChiNhanh}
                onChange={(e) => setNew("MaChiNhanh", e.target.value)}
              />
            </div>
          </div>
          <div className="admin-form-actions">
            <button
              className="btn btn--primary"
              onClick={addSan}
              disabled={loading}
            >
              Thêm
            </button>
            <button
              className="btn btn--secondary"
              onClick={() => {
                setShowForm(false);
                setNewForm(initialSan);
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
              <th>ID</th>
              <th>Tên sân</th>
              <th>Chi nhánh</th>
              <th>Giá/giờ</th>
              <th>Trạng thái</th>
              {canManage && <th>Hành động</th>}
            </tr>
          </thead>
          <tbody>
            {sanList.map((san) => {
              const isEditing = editingId === san.MaSan;

              return (
                <tr key={san.MaSan}>
                  <td className="admin-table__id">{san.MaSan}</td>
                  <td>
                    {isEditing ? (
                      <input
                        className="table-input"
                        value={editForm.TenSan}
                        onChange={(e) => setEdit("TenSan", e.target.value)}
                      />
                    ) : (
                      san.TenSan
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <BranchSelect
                        value={editForm.MaChiNhanh}
                        onChange={(e) => setEdit("MaChiNhanh", e.target.value)}
                        mode="select"
                      />
                    ) : (
                      san.MaChiNhanh
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        className="table-input"
                        type="number"
                        min="0"
                        value={editForm.GiaTheoGio}
                        onChange={(e) => setEdit("GiaTheoGio", e.target.value)}
                      />
                    ) : (
                      formatPrice(san.GiaTheoGio)
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <select
                        className="table-input"
                        value={editForm.TrangThai}
                        onChange={(e) => setEdit("TrangThai", e.target.value)}
                      >
                        {TRANG_THAI_SAN.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        className={`status-badge status-badge--${san.TrangThai === 'Hoạt động' ? 'hoat-dong' : 'dung-hoat-dong'}`}
                      >
                        {statusLabel(san.TrangThai)}
                      </span>
                    )}
                  </td>
                  {canManage && (
                    <td>
                      {isEditing ? (
                        <div className="table-actions">
                          <button
                            className="btn-text btn-text--primary"
                            onClick={() => saveEdit(san.MaSan)}
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
                            onClick={() => startEdit(san)}
                          >
                            Sửa
                          </button>
                          <button
                            className="btn-text btn-text--danger"
                            onClick={() => removeSan(san.MaSan)}
                            disabled={loading}
                          >
                            Xóa
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}

            {!sanList.length && (
              <tr>
                <td colSpan={canManage ? "6" : "5"} className="table-empty">
                  {loading ? "Đang tải dữ liệu..." : "Chưa có sân nào"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingId && (
        <div className="edit-branch-row">
          <label className="form-label">Shard / Mã chi nhánh</label>
          <input
            className="form-input"
            value={editForm.MaChiNhanh}
            onChange={(e) => setEdit("MaChiNhanh", e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
