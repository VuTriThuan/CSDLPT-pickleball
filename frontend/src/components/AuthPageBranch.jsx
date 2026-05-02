import { useState } from "react";
import { postDangNhap, postDangKy } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import Toast from "./Toast";
import BranchSelect from "./BranchSelect";

export default function AuthPageBranch() {
  const { dangNhapThanhCong } = useAuth();
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    soDienThoai: "",
    matKhau: "",
    chiNhanh: "",
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.soDienThoai || !form.matKhau || !form.chiNhanh)
      return setToast({
        msg: "Vui lòng điền số điện thoại, mật khẩu và chi nhánh",
        type: "error",
      });

    setLoading(true);
    try {
      const user = await postDangNhap({
        soDienThoai: form.soDienThoai,
        matKhau: form.matKhau,
        maChiNhanh: form.chiNhanh,
      });
      dangNhapThanhCong(user);
    } catch (err) {
      setToast({ msg: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="auth-container">
        <div className="app-header">
          <div className="app-header__icon">🏓</div>
          <h1 className="app-header__title">Pickleball Court</h1>
          <p className="app-header__sub">Hệ thống quản lý sân phân tán</p>
        </div>

        <div className="card">
          <nav className="tabs">
            <button className="tab-btn tab-btn--active">
              Đăng nhập Quản trị / Nhân viên
            </button>
          </nav>

          <div className="card__body">
            <div className="form-field" style={{ marginBottom: 14 }}>
              <label className="form-label">Số điện thoại</label>
              <input
                className="form-input"
                type="text"
                placeholder="0912345678"
                value={form.soDienThoai}
                onChange={(e) => set("soDienThoai", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>

            <div className="form-field" style={{ marginBottom: 14 }}>
              <label className="form-label">Chi nhánh</label>
              <BranchSelect
                value={form.chiNhanh}
                onChange={(e) => set("chiNhanh", e.target.value)}
                includeAll={false}
              />
            </div>

            <div className="form-field" style={{ marginBottom: 22 }}>
              <label className="form-label">Mật khẩu</label>
              <input
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={form.matKhau}
                onChange={(e) => set("matKhau", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>

            <button
              className="btn btn--primary btn--full"
              onClick={handleSubmit}
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </div>
        </div>

        <p className="app-footer">
          Powered by MongoDB Distributed Transactions
        </p>
      </div>
    </div>
  );
}
