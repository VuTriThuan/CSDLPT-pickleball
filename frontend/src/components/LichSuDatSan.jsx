import { useState } from "react";
import Badge from "./Badge";
import Toast from "./Toast";
import { getLichSuDatSan, postHuyLichHen } from "../services/datSanService";
import { formatCurrency } from "../services/utils";

export default function LichSuDatSan() {
  const [maKH, setMaKH] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [huying, setHuying] = useState(null);
  const [toast, setToast] = useState(null);

  const handleSearch = async () => {
    if (!maKH.trim()) return;
    setLoading(true);
    setData([]);
    try {
      const res = await getLichSuDatSan(maKH.trim());
      setData(res.data || []);
      if (!res.data?.length)
        setToast({ msg: "Không có lịch đặt sân cho khách hàng này", type: "error" });
    } catch (err) {
      setToast({ msg: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleHuy = async (maLichHen) => {
    setHuying(maLichHen);
    try {
      await postHuyLichHen(maLichHen);
      setToast({ msg: "Hủy lịch và hoàn tiền thành công!", type: "ok" });
      handleSearch();
    } catch (err) {
      setToast({ msg: err.message, type: "error" });
    } finally {
      setHuying(null);
    }
  };

  return (
    <div>
      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* ── Thanh tìm kiếm ── */}
      <div className="search-bar">
        <input
          className="form-input"
          style={{ flex: 1 }}
          value={maKH}
          onChange={(e) => setMaKH(e.target.value)}
          placeholder="Nhập mã khách hàng..."
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          className="btn btn--primary"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "..." : "Tra cứu"}
        </button>
      </div>

      {/* ── Danh sách lịch hẹn ── */}
      {data.map((item) => (
        <div key={item.MaLichHen} className="lich-card">
          {/* Header */}
          <div className="lich-card__header">
            <div>
              <span className="lich-card__ten">
                {item.tenSan || item.MaSan}
              </span>
              <span className="lich-card__ma">{item.MaLichHen}</span>
            </div>
            <Badge status={item.TrangThai} />
          </div>

          {/* Body */}
          <div className="lich-card__body">
            <div className="lich-card__field">
              <div className="lich-card__field-label">Ngày đặt</div>
              <div className="lich-card__field-value">
                {new Date(item.NgayDat).toLocaleDateString("vi-VN")}
              </div>
            </div>
            <div className="lich-card__field">
              <div className="lich-card__field-label">Giờ chơi</div>
              <div className="lich-card__field-value">
                {item.GioBatDau} – {item.GioKetThuc}
              </div>
            </div>
            <div className="lich-card__field">
              <div className="lich-card__field-label">Thanh toán</div>
              {item.thanhToan ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ fontWeight: 700, color: "#059669" }}>
                    {formatCurrency(item.thanhToan.SoTien)}
                  </span>
                  <Badge status={item.thanhToan.TrangThai} />
                </div>
              ) : (
                <span style={{ color: "#94a3b8" }}>—</span>
              )}
            </div>
          </div>

          {/* Nút hủy */}
          {["cho_xac_nhan", "da_xac_nhan"].includes(item.TrangThai) && (
            <div className="lich-card__footer">
              <button
                className="btn btn--danger"
                onClick={() => handleHuy(item.MaLichHen)}
                disabled={huying === item.MaLichHen}
              >
                {huying === item.MaLichHen
                  ? "Đang hủy..."
                  : "Hủy lịch & Hoàn tiền"}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
