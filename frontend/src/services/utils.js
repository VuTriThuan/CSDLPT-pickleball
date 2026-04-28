export const formatCurrency = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    n,
  );

export const tinhSoGio = (bat, ket) => {
  const [h1, m1] = bat.split(":").map(Number);
  const [h2, m2] = ket.split(":").map(Number);
  return ((h2 * 60 + m2 - (h1 * 60 + m1)) / 60).toFixed(1);
};

export const PHUONG_THUC = [
  { value: "tien_mat", label: "Tiền mặt" },
  { value: "chuyen_khoan", label: "Chuyển khoản" },
  { value: "the", label: "Thẻ" },
];

export const TRANG_THAI_COLOR = {
  cho_xac_nhan: "#f59e0b",
  da_xac_nhan: "#10b981",
  da_huy: "#ef4444",
  hoan_thanh: "#6366f1",
  thanh_cong: "#10b981",
  hoan_tien: "#8b5cf6",
  that_bai: "#ef4444",
};

export const TRANG_THAI_LABEL = {
  cho_xac_nhan: "Chờ xác nhận",
  da_xac_nhan: "Đã xác nhận",
  da_huy: "Đã hủy",
  hoan_thanh: "Hoàn thành",
  thanh_cong: "Thành công",
  hoan_tien: "Hoàn tiền",
  that_bai: "Thất bại",
};
