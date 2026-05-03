import { useEffect, useMemo, useState } from "react";
import AuthPage from "./components/AuthPage";
import AuthPageBranch from "./components/AuthPageBranch";
import FormDatSan from "./components/FormDatSan";
import LichSuDatSan from "./components/LichSuDatSan";
import ModalBill from "./components/ModalBill";
import BranchSelect from "./components/BranchSelect";

import SanPanel from "./components/admin/SanPanel";
import LichHenPanel from "./components/admin/LichHenPanel";
import KhachHangPanel from "./components/admin/KhachHangPanel";
import RevenuePanel from "./components/admin/RevenuePanel";
import NhanVienPanel from "./components/admin/NhanVienPanel";

import { useAuth } from "./context/AuthContext";
import { ROLE_LABELS, MANAGE_ROLES } from "./utils/constants";
import { tabsForRole } from "./utils/helpers";

import "./styles/main.css";

export default function App() {
  const { user, loading: authLoading, dangXuat } = useAuth();
  const [userTab, setUserTab] = useState("dat");
  const [manageTab, setManageTab] = useState("san");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [billData, setBillData] = useState(null);
  const [toast, setToast] = useState(null);
  const isManagementRole = MANAGE_ROLES.includes(user?.role);
  const tabs = tabsForRole(user?.role);
  const activeTab = isManagementRole ? manageTab : userTab;

  useEffect(() => {
    if (user?.role === "admin") {
      setSelectedBranch("");
    } else if (user) {
      setSelectedBranch(user?.MaChiNhanh || user?.maChiNhanh || "");
    }
  }, [user]);

  const adminAuth = useMemo(
    () => ({
      role: user?.role,
      branchId: selectedBranch === "" ? "" : selectedBranch,
    }),
    [user, selectedBranch],
  );

  if (authLoading) {
    return (
      <div className="app-wrapper">
        <div className="app-inner">
          <div className="card">
            <div className="card__body">Đang kiểm tra đăng nhập...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    if (window.location.pathname.startsWith("/admin")) {
      return <AuthPageBranch />;
    }
    return <AuthPage />;
  }

  return (
    <div className="app-wrapper">
      <div
        className={`app-inner${
          isManagementRole && manageTab === "lich" ? " app-inner--lich-dat" : ""
        }`}
      >
        <header className="app-header">
          <div className="app-header__icon"></div>
          <h1 className="app-header__title">Pickleball Court</h1>
          <p className="app-header__sub">
            {isManagementRole ? ROLE_LABELS[user.role] : "Đặt sân & Thanh toán"}
          </p>
          <div className="auth-actions">
            <span className="auth-actions__user">
              {user.hoTen || user.email} ({user.role})
            </span>
            <button className="btn btn--secondary" onClick={dangXuat}>
              Đăng xuất
            </button>
          </div>
        </header>

        <div className="card">
          <nav className="tabs">
            {tabs.map((item) => (
              <button
                key={item.key}
                className={`tab-btn${
                  activeTab === item.key ? " tab-btn--active" : ""
                }`}
                onClick={() =>
                  isManagementRole
                    ? setManageTab(item.key)
                    : setUserTab(item.key)
                }
              >
                {item.label}
              </button>
            ))}
          </nav>

          {isManagementRole && manageTab !== "khach" && (user?.role === "admin" || user?.role === "Quản lý hệ thống") && (
            <div
              className="form-grid"
              style={{ gap: "16px", margin: "16px 0" }}
            >
              <div
                className="form-field form-field--wide"
                style={{ marginLeft: "30px" }}
              >
                <label className="form-label">Chi nhánh</label>
                <BranchSelect
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  includeAll
                />
              </div>
            </div>
          )}

          <div className="card__body">
            {!isManagementRole && userTab === "dat" && (
              <FormDatSan onSuccess={setBillData} />
            )}
            {!isManagementRole && userTab === "lich" && <LichSuDatSan />}
          {isManagementRole && manageTab === "lich" && (
              <LichHenPanel auth={adminAuth} setToast={setToast} />
            )}
            {isManagementRole && manageTab === "san" && (
              <SanPanel auth={adminAuth} setToast={setToast} />
            )}
            {isManagementRole && manageTab === "khach" && (
              <KhachHangPanel auth={adminAuth} setToast={setToast} />
            )}
            {isManagementRole && manageTab === "doanhthu" && (
              <RevenuePanel auth={adminAuth} setToast={setToast} />
            )}
            {isManagementRole && manageTab === "nhan-vien" && (
              <NhanVienPanel auth={adminAuth} setToast={setToast} />
            )}
          </div>
        </div>

        <footer className="app-footer">MongoDB Distributed Transactions</footer>
      </div>

      <ModalBill data={billData} onClose={() => setBillData(null)} />

      {toast && (
        <div
          className={`toast toast--${toast.type}`}
          onClick={() => setToast(null)}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
