import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import AuthPage from "./components/AuthPage";
import FormDatSan from "./components/FormDatSan";
import LichSuDatSan from "./components/LichSuDatSan";
import ModalBill from "./components/ModalBill";
import "./styles/main.css";

const TABS = [
  { key: "dat", label: "🏟️ Đặt sân" },
  { key: "lich", label: "📋 Lịch của tôi" },
];

export default function App() {
  const { user, loading, dangXuat } = useAuth();
  const [tab, setTab] = useState("dat");
  const [billData, setBillData] = useState(null);

  // Đang kiểm tra session
  if (loading)
    return (
      <div className="app-wrapper" style={{ alignItems: "center" }}>
        <div style={{ color: "#94a3b8", fontSize: 18 }}>⏳ Đang tải...</div>
      </div>
    );

  // Chưa đăng nhập → hiện trang auth
  if (!user) return <AuthPage />;

  // Đã đăng nhập → hiện app chính
  return (
    <div className="app-wrapper">
      <div className="app-inner">
        {/* Header */}
        <header className="app-header">
          <div className="app-header__icon">🏓</div>
          <h1 className="app-header__title">Pickleball Court</h1>
          <p className="app-header__sub">
            Quản lý sân — Đặt sân &amp; Thanh toán
          </p>
        </header>

        {/* Navbar user */}
        <div className="user-bar">
          <span className="user-bar__name">👤 {user.hoTen}</span>
          <span className="user-bar__code">{user.maKhachHang}</span>
          <button className="user-bar__logout" onClick={dangXuat}>
            Đăng xuất
          </button>
        </div>

        {/* Card chính */}
        <div className="card">
          <nav className="tabs">
            {TABS.map((t) => (
              <button
                key={t.key}
                className={`tab-btn${tab === t.key ? " tab-btn--active" : ""}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <div className="card__body">
            {tab === "dat" ? (
              <FormDatSan onSuccess={setBillData} />
            ) : (
              <LichSuDatSan />
            )}
          </div>
        </div>

        <p className="app-footer">
          Powered by MongoDB Distributed Transactions · 8 Shards
        </p>
      </div>

      <ModalBill data={billData} onClose={() => setBillData(null)} />
    </div>
  );
}
