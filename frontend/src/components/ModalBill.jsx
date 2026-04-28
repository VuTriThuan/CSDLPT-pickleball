import { formatCurrency } from "../services/utils";

export default function ModalBill({ data, onClose }) {
  if (!data) return null;

  const rows = [
    ["Sân", data.tenSan],
    ["Khách hàng", data.tenKhachHang],
    ["Ngày", new Date(data.lichHen.NgayDat).toLocaleDateString("vi-VN")],
    ["Giờ", `${data.lichHen.GioBatDau} – ${data.lichHen.GioKetThuc}`],
    ["Số giờ", `${data.soGio}h`],
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon"></div>
          <div className="modal-title">Đặt sân thành công!</div>
        </div>

        <div className="modal-body">
          {rows.map(([k, v]) => (
            <div key={k} className="modal-row">
              <span className="modal-row__label">{k}</span>
              <span className="modal-row__value">{v}</span>
            </div>
          ))}
          <div className="modal-total">
            <span>Tổng tiền</span>
            <span className="modal-total__amount">
              {formatCurrency(data.soTien)}
            </span>
          </div>
        </div>

        <div className="modal-codes">
          <div className="modal-code">
            <div className="modal-code__label">Mã lịch hẹn</div>
            <div className="modal-code__value modal-code__value--blue">
              {data.lichHen.MaLichHen}
            </div>
          </div>
          <div className="modal-code">
            <div className="modal-code__label">Mã thanh toán</div>
            <div className="modal-code__value modal-code__value--green">
              {data.thanhToan.MaThanhToan}
            </div>
          </div>
        </div>

        <button className="btn btn--primary btn--full" onClick={onClose}>
          Xong
        </button>
      </div>
    </div>
  );
}
