import { useState, useEffect } from "react";
import Badge from "./Badge";
import Toast from "./Toast";
import { getLichSuCuaToi, postHuyLichHen } from "../services/datSanService";
import { formatCurrency } from "../services/utils";

export default function LichSuDatSan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [huying, setHuying] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getLichSuCuaToi();
      setData(res || []);
    } catch (err) {
      setToast({ msg: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleHuy = async (maLichHen) => {
    setHuying(maLichHen);
    try {
      await postHuyLichHen(maLichHen);
      setToast({ msg: "Hủy lịch và hoàn tiền thành công!", type: "ok" });
      fetchData();
    } catch (err) {
      setToast({ msg: err.message, type: "error" });
    } finally {
      setHuying(null);
    }
  };

  if (loading) return <div className="lich-empty">Đang tải...</div>;

  return (
    <div>
      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {data.length === 0 ? (
        <div className="lich-empty">Bạn chưa có lịch đặt sân nào.</div>
      ) : (
        data.map((item) => (
          <div key={item.MaLichHen} className="lich-card">
            <div className="lich-card__header">
              <div>
                <span className="lich-card__ten">
                  {item.tenSan || item.MaSan}
                </span>
                <span className="lich-card__ma">{item.MaLichHen}</span>
              </div>
              <Badge status={item.TrangThai} />
            </div>

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

            {["cho_xac_nhan", "da_xac_nhan"].includes(item.TrangThai) && (
              <div className="lich-card__footer">
                <button
                  className="btn btn--danger"
                  onClick={() => handleHuy(item.MaLichHen)}
                  disabled={huying === item.MaLichHen}
                >
                  {huying === item.MaLichHen ? "Đang hủy..." : "Hủy lịch"}
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
