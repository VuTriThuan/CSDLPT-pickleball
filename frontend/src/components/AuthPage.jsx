import { useState } from "react";
import { postDangNhap, postDangKy } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import Toast from "./Toast";

export default function AuthPage() {
  const { dangNhapThanhCong } = useAuth();
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    hoTen: "",
    soDienThoai: "",
    email: "",
    matKhau: "",
    xacNhanMatKhau: "",
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (mode === "register") {
      if (!form.hoTen || !form.soDienThoai || !form.email || !form.matKhau)
        return setToast({
          msg: "Vui lòng điền đầy đủ thông tin",
          type: "error",
        });
      if (form.matKhau !== form.xacNhanMatKhau)
        return setToast({ msg: "Mật khẩu xác nhận không khớp", type: "error" });
      if (form.matKhau.length < 6)
        return setToast({ msg: "Mật khẩu tối thiểu 6 ký tự", type: "error" });
    } else {
      if (!form.email || !form.matKhau)
        return setToast({
          msg: "Vui lòng nhập email và mật khẩu",
          type: "error",
        });
    }

    setLoading(true);
    try {
      if (mode === "register") {
        await postDangKy({
          hoTen: form.hoTen,
          soDienThoai: form.soDienThoai,
          email: form.email,
          matKhau: form.matKhau,
        });
        setToast({ msg: "Đăng ký thành công! Đang đăng nhập...", type: "ok" });
        const user = await postDangNhap({
          email: form.email,
          matKhau: form.matKhau,
        });
        dangNhapThanhCong(user);
      } else {
        const user = await postDangNhap({
          email: form.email,
          matKhau: form.matKhau,
        });
        dangNhapThanhCong(user);
      }
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
            <button
              className={`tab-btn${mode === "login" ? " tab-btn--active" : ""}`}
              onClick={() => setMode("login")}
            >
              Đăng nhập
            </button>
            <button
              className={`tab-btn${mode === "register" ? " tab-btn--active" : ""}`}
              onClick={() => setMode("register")}
            >
              Đăng ký
            </button>
          </nav>

          <div className="card__body">
            {mode === "register" && (
              <>
                <div className="form-field" style={{ marginBottom: 14 }}>
                  <label className="form-label">Họ tên</label>
                  <input
                    className="form-input"
                    placeholder="Nguyễn Văn A"
                    value={form.hoTen}
                    onChange={(e) => set("hoTen", e.target.value)}
                  />
                </div>
                <div className="form-field" style={{ marginBottom: 14 }}>
                  <label className="form-label">Số điện thoại</label>
                  <input
                    className="form-input"
                    placeholder="0912345678"
                    value={form.soDienThoai}
                    onChange={(e) => set("soDienThoai", e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="form-field" style={{ marginBottom: 14 }}>
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="example@email.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && mode === "login" && handleSubmit()
                }
              />
            </div>
            <div
              className="form-field"
              style={{ marginBottom: mode === "register" ? 14 : 22 }}
            >
              <label className="form-label">Mật khẩu</label>
              <input
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={form.matKhau}
                onChange={(e) => set("matKhau", e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && mode === "login" && handleSubmit()
                }
              />
            </div>

            {mode === "register" && (
              <div className="form-field" style={{ marginBottom: 22 }}>
                <label className="form-label">Xác nhận mật khẩu</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="••••••••"
                  value={form.xacNhanMatKhau}
                  onChange={(e) => set("xacNhanMatKhau", e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </div>
            )}

            <button
              className="btn btn--primary btn--full"
              onClick={handleSubmit}
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading
                ? "Đang xử lý..."
                : mode === "login"
                  ? "Đăng nhập"
                  : "Tạo tài khoản"}
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
