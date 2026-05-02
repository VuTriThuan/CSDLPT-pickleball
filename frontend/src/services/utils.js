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
  "Chờ xác nhận": "#f59e0b",
  cho_xu_ly: "#f59e0b",
  "Hủy": "#ef4444",
  "Hoàn thành": "#6366f1",
  thanh_cong: "#10b981",
  hoan_tien: "#8b5cf6",
  that_bai: "#ef4444",
};

export const TRANG_THAI_LABEL = {
  "Chờ xác nhận": "Chờ xác nhận",
  cho_xu_ly: "Chờ xử lý",
  "Hủy": "Hủy",
  "Hoàn thành": "Hoàn thành",
  thanh_cong: "Thành công",
  hoan_tien: "Hoàn tiền",
  that_bai: "Thất bại",
};
