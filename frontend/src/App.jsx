import { useState } from "react";
import FormDatSan from "./components/FormDatSan";
import LichSuDatSan from "./components/LichSuDatSan";
import ModalBill from "./components/ModalBill";
import "./styles/main.css";

const TABS = [
  { key: "dat", label: "Đặt sân" },
  { key: "lich", label: "Lịch sử" },
];

export default function App() {
  const [tab, setTab] = useState("dat");
  const [billData, setBillData] = useState(null);

  return (
    <div className="app-wrapper">
      <div className="app-inner">
        {/* Header */}
        <header className="app-header">
          <div className="app-header__icon"></div>
          <h1 className="app-header__title">Pickleball Court</h1>
          <p className="app-header__sub">
            Quản lý sân — Đặt sân &amp; Thanh toán
          </p>
        </header>

        {/* Card */}
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
      </div>

      <ModalBill data={billData} onClose={() => setBillData(null)} />
    </div>
  );
}
