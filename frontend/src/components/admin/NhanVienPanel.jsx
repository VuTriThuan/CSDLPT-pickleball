import { useEffect, useState } from "react";
import { ACTIONS } from "../../utils/constants";
import { getBranchList } from "../../services/branchService";

const API_NHAN_VIEN = "http://localhost:5000/api/nhan-vien";

const fetchJSON = async (url, options = {}) => {
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Lỗi không xác định");
  return data.data;
};

const getNhanVienList = (auth) => {
  const url = new URL(API_NHAN_VIEN);
  if (auth?.branchId) {
    url.searchParams.append("branchId", auth.branchId);
  }
  return fetchJSON(url.toString());
};

const createNhanVien = (payload) =>
  fetchJSON(API_NHAN_VIEN, {
    method: "POST",
    body: JSON.stringify(payload),
  });

const updateNhanVien = (id, payload) =>
  fetchJSON(`${API_NHAN_VIEN}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

const deleteNhanVien = (id) =>
  fetchJSON(`${API_NHAN_VIEN}/${id}`, { method: "DELETE" });

const initialForm = {
  HoTen: "",
  SoDienThoai: "",
  ChucVu: "nhan_vien_chi_nhanh",
  MaChiNhanh: "",
  MatKhau: "",
};

export default function NhanVienPanel({ auth, setToast }) {
  const [nhanVienList, setNhanVienList] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(null);
  const [form, setForm] = useState(initialForm);

  const isAdmin = auth.role === "admin" || auth.role === "quan_ly_he_thong";

  const loadData = async () => {
    setLoading(true);
    try {
      const [nvRes, branchRes] = await Promise.all([
        getNhanVienList(auth),
        getBranchList(),
      ]);
      setNhanVienList(nvRes || []);
      setBranches(branchRes || []);
    } catch (err) {
      setToast({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [auth.role, auth.branchId]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (!isAdmin) {
        payload.MaChiNhanh = auth.branchId;
      }

      if (action === "create") {
        if (!payload.MatKhau) throw new Error("Vui lòng nhập mật khẩu");
        await createNhanVien(payload);
        setToast({ type: "ok", msg: "Đã thêm nhân viên" });
      } else if (action === "update") {
        await updateNhanVien(form.MaNhanVien, payload);
        setToast({ type: "ok", msg: "Đã cập nhật nhân viên" });
      }
      setAction(null);
      loadData();
    } catch (err) {
      setToast({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (maNV) => {
    if (!window.confirm("Bạn có chắc muốn xóa nhân viên này?")) return;
    setLoading(true);
    try {
      await deleteNhanVien(maNV);
      setToast({ type: "ok", msg: "Đã xóa nhân viên" });
      loadData();
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
          <h2 className="admin-title">Quản lý Nhân viên</h2>
          <p className="admin-subtitle">Danh sách tài khoản nhân viên</p>
        </div>
        {!action && (
          <button
            className="btn btn--primary"
            onClick={() => {
              setForm(initialForm);
              setAction("create");
            }}
          >
            + Thêm nhân viên
          </button>
        )}
      </div>

      {action && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Họ tên</label>
              <input
                required
                className="form-input"
                value={form.HoTen}
                onChange={(e) => set("HoTen", e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="form-label">Số điện thoại</label>
              <input
                required
                className="form-input"
                value={form.SoDienThoai}
                onChange={(e) => set("SoDienThoai", e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="form-label">Chức vụ</label>
              <select
                className="form-input"
                value={form.ChucVu}
                onChange={(e) => set("ChucVu", e.target.value)}
              >
                <option value="nhan_vien_chi_nhanh">Nhân viên chi nhánh</option>
                <option value="quan_ly_chi_nhanh">Quản lý chi nhánh</option>
                {isAdmin && <option value="quan_ly_he_thong">Quản lý hệ thống</option>}
              </select>
            </div>
            {isAdmin && (
              <div className="form-field">
                <label className="form-label">Chi nhánh</label>
                <select
                  required
                  className="form-input"
                  value={form.MaChiNhanh}
                  onChange={(e) => set("MaChiNhanh", e.target.value)}
                >
                  <option value="">-- Chọn chi nhánh --</option>
                  {branches.map((b) => (
                    <option key={b.MaChiNhanh} value={b.MaChiNhanh}>
                      {b.TenChiNhanh}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {action === "create" && (
              <div className="form-field">
                <label className="form-label">Mật khẩu</label>
                <input
                  required
                  type="password"
                  className="form-input"
                  value={form.MatKhau}
                  onChange={(e) => set("MatKhau", e.target.value)}
                />
              </div>
            )}
          </div>
          <div className="admin-form-actions">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setAction(null)}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      )}

      {!action && (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã NV</th>
                <th>Họ tên</th>
                <th>SĐT</th>
                <th>Chức vụ</th>
                <th>Chi nhánh</th>
                <th className="action-col">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {nhanVienList.map((item) => (
                <tr key={item.MaNhanVien}>
                  <td className="admin-table__id">{item.MaNhanVien}</td>
                  <td>{item.HoTen}</td>
                  <td>{item.SoDienThoai}</td>
                  <td>
                    <span className={`status-badge status-badge--${item.ChucVu}`}>
                      {item.ChucVu === "quan_ly_he_thong"
                        ? "QL Hệ thống"
                        : item.ChucVu === "quan_ly_chi_nhanh"
                        ? "QL Chi nhánh"
                        : "NV Chi nhánh"}
                    </span>
                  </td>
                  <td>{item.MaChiNhanh}</td>
                  <td className="action-col">
                    <button
                      className="btn-icon"
                      onClick={() => {
                        setForm({ ...item, MatKhau: "" });
                        setAction("update");
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon btn-icon--danger"
                      onClick={() => handleDelete(item.MaNhanVien)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
              {!nhanVienList.length && (
                <tr>
                  <td colSpan="6" className="table-empty">
                    Chưa có nhân viên nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
