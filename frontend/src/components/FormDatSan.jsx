import { useState } from "react";
import Toast from "./Toast";
import BranchSelect from "./BranchSelect";
import { getSanTrong, postDatSan } from "../services/datSanService";
import { tinhSoGio, formatCurrency } from "../services/utils";

export default function FormDatSan({ onSuccess }) {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    ngayDat: today,
    gioBatDau: "08:00",
    gioKetThuc: "10:00",
    maChiNhanh: "",
    maSan: "",
  });
  const [sanTrong, setSanTrong] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [toast, setToast] = useState(null);

  const set = (k, v) =>
    setForm((f) => ({ ...f, [k]: v, ...(k !== "maSan" && { maSan: "" }) }));
  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleTimSan = async () => {
    if (!form.maChiNhanh) {
      setToast({ msg: "Vui lòng chọn chi nhánh", type: "error" });
      return;
    }
    if (!form.ngayDat || !form.gioBatDau || !form.gioKetThuc) return;
    setSearching(true);
    setSanTrong([]);
    setField("maSan", "");
    try {
      const ds = await getSanTrong(
        form.maChiNhanh,
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
    if (!form.maSan)
      return setToast({ msg: "Vui lòng chọn sân", type: "error" });
    setLoading(true);
    try {
      const result = await postDatSan({
        maSan: form.maSan,
        ngayDat: form.ngayDat,
        gioBatDau: form.gioBatDau,
        gioKetThuc: form.gioKetThuc,
      });
      onSuccess(result);
      setForm((f) => ({ ...f, maSan: "" }));
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

      <div className="form-grid">
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
          <label className="form-label">Chi nhánh</label>
          <BranchSelect
            value={form.maChiNhanh}
            onChange={(e) => set("maChiNhanh", e.target.value)}
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
        {searching ? "Đang tìm..." : "🔍 Tìm sân trống"}
      </button>

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
                onClick={() => setField("maSan", s.MaSan)}
              >
                <div className="san-card__name">{s.TenSan}</div>
                <div className="san-card__ma">
                  {s.MaSan} · {s.MaChiNhanh}
                </div>
                <div className="san-card__gia">
                  {formatCurrency(s.GiaTheoGio)}/giờ
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedSan && (
        <div className="summary-box">
          <div className="summary-row">
            <span>Sân</span>
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
        style={{ marginTop: 20, opacity: loading || !form.maSan ? 0.6 : 1 }}
        onClick={handleSubmit}
        disabled={loading || !form.maSan}
      >
        {loading ? "Đang xử lý..." : "Xác nhận đặt sân & Thanh toán"}
      </button>
    </div>
  );
}
