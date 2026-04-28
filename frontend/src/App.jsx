import { useEffect, useMemo, useState } from "react";
import FormDatSan from "./components/FormDatSan";
import LichSuDatSan from "./components/LichSuDatSan";
import ModalBill from "./components/ModalBill";
import {
  createKhachHang,
  createSan,
  deleteKhachHang,
  deleteSan,
  getSanList,
  updateKhachHang,
  updateSan,
} from "./services/adminService";
import "./styles/main.css";

const TABS = [
  { key: "dat", label: "Đặt sân" },
  { key: "lich", label: "Lịch sử" },
  { key: "quyen", label: "Phân quyền" },
  { key: "san", label: "Quản lý sân" },
  { key: "khach", label: "Khách hàng" },
];

const ACTIONS = [
  { key: "create", label: "Thêm" },
  { key: "update", label: "Sửa" },
  { key: "delete", label: "Xóa" },
];

const ROLES = [
  { value: "quan_ly_chi_nhanh", label: "Quản lý chi nhánh" },
  { value: "quan_ly_he_thong", label: "Quản lý hệ thống" },
];

const TRANG_THAI_SAN = [
  { value: "hoat_dong", label: "Hoạt động" },
  { value: "bao_tri", label: "Bảo trì" },
  { value: "ngung", label: "Ngừng" },
];

const initialSan = {
  MaSan: "",
  TenSan: "",
  GiaTheoGio: "",
  TrangThai: "hoat_dong",
  MaChiNhanh: "",
};

const initialKhachHang = {
  MaKhachHang: "",
  HoTen: "",
  SoDienThoai: "",
  Email: "",
};

const cleanPayload = (payload) =>
  Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== "" && value != null),
  );

function AuthPanel({ auth, setAuth }) {
  const headerPreview = useMemo(
    () => ({
      "x-user-role": auth.role,
      "x-branch-id": auth.branchId || "(bỏ trống nếu là quản lý hệ thống)",
    }),
    [auth],
  );

  return (
    <div className="panel-stack">
      <div className="form-grid">
        <div className="form-field">
          <label className="form-label">Vai trò demo</label>
          <select
            className="form-input"
            value={auth.role}
            onChange={(e) =>
              setAuth((current) => ({ ...current, role: e.target.value }))
            }
          >
            {ROLES.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">Mã chi nhánh</label>
          <input
            className="form-input"
            value={auth.branchId}
            onChange={(e) =>
              setAuth((current) => ({ ...current, branchId: e.target.value }))
            }
            placeholder="VD: CN001"
          />
        </div>
      </div>

      <div className="permission-card">
        <div>
          <span className="permission-card__label">Header gửi lên API</span>
          <pre>{JSON.stringify(headerPreview, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

function SanPanel({ auth, setToast }) {
  const [sanList, setSanList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newForm, setNewForm] = useState(initialSan);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(initialSan);
  const [loading, setLoading] = useState(false);

  const loadSan = async () => {
    setLoading(true);
    try {
      const res = await getSanList();
      setSanList(res.data || []);
    } catch (err) {
      setToast({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSan();
  }, []);

  const setNew = (key, value) =>
    setNewForm((current) => ({ ...current, [key]: value }));

  const setEdit = (key, value) =>
    setEditForm((current) => ({ ...current, [key]: value }));

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

  const formatPrice = (value) =>
    Number(value || 0).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    });

  return (
    <div className="admin-panel">
      <div className="admin-toolbar">
        <div>
          <h2 className="admin-title">Quản lý sân</h2>
          <p className="admin-subtitle">Danh sách sân theo dữ liệu API</p>
        </div>
        <button
          className="btn btn--primary"
          onClick={() => setShowForm((current) => !current)}
        >
          Thêm sân
        </button>
      </div>

      {showForm && (
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
              <label className="form-label">Shard / Mã chi nhánh</label>
              <input
                className="form-input"
                value={newForm.MaChiNhanh}
                onChange={(e) => setNew("MaChiNhanh", e.target.value)}
                placeholder="VD: CN001"
              />
            </div>
          </div>
          <div className="admin-form-actions">
            <button className="btn btn--primary" onClick={addSan} disabled={loading}>
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
              <th>Giá/giờ</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
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
                      <span className={`status-badge status-badge--${san.TrangThai}`}>
                        {statusLabel(san.TrangThai)}
                      </span>
                    )}
                  </td>
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
                </tr>
              );
            })}

            {!sanList.length && (
              <tr>
                <td colSpan="5" className="table-empty">
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

function KhachHangPanel({ auth, setToast }) {
  const [action, setAction] = useState("create");
  const [form, setForm] = useState(initialKhachHang);
  const [loading, setLoading] = useState(false);

  const set = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = async () => {
    if (!form.MaKhachHang && action !== "create") {
      setToast({ type: "error", msg: "Cần nhập MaKhachHang" });
      return;
    }

    setLoading(true);
    try {
      if (action === "create") {
        await createKhachHang(form, auth);
        setToast({ type: "ok", msg: "Đã thêm khách hàng" });
      }

      if (action === "update") {
        await updateKhachHang(
          form.MaKhachHang,
          cleanPayload({
            HoTen: form.HoTen,
            SoDienThoai: form.SoDienThoai,
            Email: form.Email,
          }),
          auth,
        );
        setToast({ type: "ok", msg: "Đã sửa khách hàng" });
      }

      if (action === "delete") {
        await deleteKhachHang(form.MaKhachHang, auth);
        setToast({ type: "ok", msg: "Đã xóa khách hàng" });
      }

      setForm(initialKhachHang);
    } catch (err) {
      setToast({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel-stack">
      <div className="segmented">
        {ACTIONS.map((item) => (
          <button
            key={item.key}
            className={`segmented__btn${action === item.key ? " segmented__btn--active" : ""}`}
            onClick={() => setAction(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label className="form-label">Mã khách hàng</label>
          <input
            className="form-input"
            value={form.MaKhachHang}
            onChange={(e) => set("MaKhachHang", e.target.value)}
            placeholder="VD: KH001"
          />
        </div>
        {action !== "delete" && (
          <>
            <div className="form-field">
              <label className="form-label">Họ tên</label>
              <input
                className="form-input"
                value={form.HoTen}
                onChange={(e) => set("HoTen", e.target.value)}
                placeholder="VD: Nguyễn Văn A"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Số điện thoại</label>
              <input
                className="form-input"
                value={form.SoDienThoai}
                onChange={(e) => set("SoDienThoai", e.target.value)}
                placeholder="VD: 0901234567"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                value={form.Email}
                onChange={(e) => set("Email", e.target.value)}
                placeholder="VD: khach@example.com"
              />
            </div>
          </>
        )}
      </div>

      <button
        className="btn btn--primary btn--full"
        onClick={submit}
        disabled={loading}
      >
        {loading
          ? "Đang xử lý..."
          : `${ACTIONS.find((item) => item.key === action).label} khách hàng`}
      </button>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("dat");
  const [billData, setBillData] = useState(null);
  const [toast, setToast] = useState(null);
  const [auth, setAuth] = useState({
    role: "quan_ly_chi_nhanh",
    branchId: "CN001",
  });

  return (
    <div className="app-wrapper">
      <div className="app-inner">
        <header className="app-header">
          <div className="app-header__icon"></div>
          <h1 className="app-header__title">Pickleball Court</h1>
          <p className="app-header__sub">
            Quản lý sân — Đặt sân &amp; Thanh toán
          </p>
        </header>

        <div className="card">
          <nav className="tabs">
            {TABS.map((item) => (
              <button
                key={item.key}
                className={`tab-btn${tab === item.key ? " tab-btn--active" : ""}`}
                onClick={() => setTab(item.key)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="card__body">
            {tab === "dat" && <FormDatSan onSuccess={setBillData} />}
            {tab === "lich" && <LichSuDatSan />}
            {tab === "quyen" && <AuthPanel auth={auth} setAuth={setAuth} />}
            {tab === "san" && <SanPanel auth={auth} setToast={setToast} />}
            {tab === "khach" && (
              <KhachHangPanel auth={auth} setToast={setToast} />
            )}
          </div>
        </div>

        <footer className="app-footer">MongoDB Distributed Transactions</footer>
      </div>

      <ModalBill data={billData} onClose={() => setBillData(null)} />

      {toast && (
        <div className={`toast toast--${toast.type}`} onClick={() => setToast(null)}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
