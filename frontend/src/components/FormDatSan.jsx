import { useState } from "react";
import Toast from "./Toast";
import { getSanTrong, postDatSan } from "../services/datSanService";
import { tinhSoGio, formatCurrency, PHUONG_THUC } from "../services/utils";

export default function FormDatSan({ onSuccess }) {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    maKhachHang: "",
    ngayDat: today,
    gioBatDau: "08:00",
    gioKetThuc: "10:00",
    maSan: "",
    phuongThucThanhToan: "tien_mat",
  });
  const [sanTrong, setSanTrong] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [toast, setToast] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleTimSan = async () => {
    if (!form.ngayDat || !form.gioBatDau || !form.gioKetThuc) return;
    setSearching(true);
    setSanTrong([]);
    set("maSan", "");
    try {
      const ds = await getSanTrong(
        form.ngayDat,
        form.gioBatDau,
        form.gioKetThuc,
      );
      setSanTrong(ds);
      if (!ds.length)
        setToast({
          msg: "Không có sân trống trong khung giờ này",
          type: "error",
        });
    } catch (err) {
      setToast({ msg: err.message, type: "error" });
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.maKhachHang || !form.maSan) {
      setToast({ msg: "Vui lòng điền đầy đủ thông tin", type: "error" });
      return;
    }
    setLoading(true);
    try {
      const result = await postDatSan(form);
      onSuccess(result);
      setForm((f) => ({ ...f, maSan: "", maKhachHang: "" }));
      setSanTrong([]);
    } catch (err) {
      setToast({ msg: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const soGio =
    form.gioBatDau && form.gioKetThuc
      ? tinhSoGio(form.gioBatDau, form.gioKetThuc)
      : 0;
  const selectedSan = sanTrong.find((s) => s.MaSan === form.maSan);
  const tongTien = selectedSan ? soGio * selectedSan.GiaTheoGio : 0;

  return (
    <div>
      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* ── Thông tin đặt ── */}
      <div className="form-grid">
        <div className="form-field">
          <label className="form-label">Mã khách hàng</label>
          <input
            className="form-input"
            value={form.maKhachHang}
            onChange={(e) => set("maKhachHang", e.target.value)}
            placeholder="VD: KH-001"
          />
        </div>
        <div className="form-field">
          <label className="form-label">Ngày đặt</label>
          <input
            className="form-input"
            type="date"
            value={form.ngayDat}
            min={today}
            onChange={(e) => set("ngayDat", e.target.value)}
          />
        </div>
        <div className="form-field">
          <label className="form-label">Giờ bắt đầu</label>
          <input
            className="form-input"
            type="time"
            value={form.gioBatDau}
            onChange={(e) => set("gioBatDau", e.target.value)}
          />
        </div>
        <div className="form-field">
          <label className="form-label">Giờ kết thúc</label>
          <input
            className="form-input"
            type="time"
            value={form.gioKetThuc}
            onChange={(e) => set("gioKetThuc", e.target.value)}
          />
        </div>
      </div>

      <button
        className="btn btn--secondary btn--full"
        onClick={handleTimSan}
        disabled={searching}
      >
        {searching ? "Đang tìm..." : "Tìm sân trống"}
      </button>

      {/* ── Danh sách sân trống ── */}
      {sanTrong.length > 0 && (
        <div className="section">
          <label className="form-label">
            Chọn sân ({sanTrong.length} trống)
          </label>
          <div className="san-grid">
            {sanTrong.map((s) => (
              <div
                key={s.MaSan}
                className={`san-card${form.maSan === s.MaSan ? " san-card--selected" : ""}`}
                onClick={() => set("maSan", s.MaSan)}
              >
                <div className="san-card__name">{s.TenSan}</div>
                <div className="san-card__ma">{s.MaSan}</div>
                <div className="san-card__gia">
                  {formatCurrency(s.GiaTheoGio)}/giờ
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Phương thức thanh toán ── */}
      {selectedSan && (
        <div className="section">
          <label className="form-label">Phương thức thanh toán</label>
          <div className="payment-options">
            {PHUONG_THUC.map((p) => (
              <div
                key={p.value}
                className={`payment-option${form.phuongThucThanhToan === p.value ? " payment-option--selected" : ""}`}
                onClick={() => set("phuongThucThanhToan", p.value)}
              >
                {p.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tóm tắt tiền ── */}
      {selectedSan && (
        <div className="summary-box">
          <div className="summary-row">
            <span>Sân đã chọn</span>
            <strong>{selectedSan.TenSan}</strong>
          </div>
          <div className="summary-row">
            <span>Thời gian</span>
            <strong>
              {soGio}h × {formatCurrency(selectedSan.GiaTheoGio)}
            </strong>
          </div>
          <div className="summary-total">
            <span>Tổng tiền</span>
            <span className="summary-total__amount">
              {formatCurrency(tongTien)}
            </span>
          </div>
        </div>
      )}

      <button
        className="btn btn--primary btn--full"
        style={{
          marginTop: 20,
          opacity: loading || !form.maSan || !form.maKhachHang ? 0.6 : 1,
        }}
        onClick={handleSubmit}
        disabled={loading || !form.maSan || !form.maKhachHang}
      >
        {loading ? "Đang xử lý..." : "Xác nhận đặt sân & Thanh toán"}
      </button>
    </div>
  );
}
