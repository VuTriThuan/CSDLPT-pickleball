const API = "http://localhost:5000/api/san";

export const getSanTrong = async (ngayDat, gioBatDau, gioKetThuc) => {
  const res = await fetch(
    `${API}/trong?ngayDat=${ngayDat}&gioBatDau=${gioBatDau}&gioKetThuc=${gioKetThuc}`,
  );
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Lỗi tìm sân trống");
  return data.data;
};

export const postDatSan = async (payload) => {
  console.log("🚀 Payload gửi:", payload);
  const res = await fetch(`${API}/dat-san`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Đặt sân thất bại");
  return data;
};

export const getLichSuDatSan = async (maKhachHang, page = 1, limit = 10) => {
  const res = await fetch(
    `${API}/lich-hen/khach-hang/${maKhachHang}?page=${page}&limit=${limit}`,
  );
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Lỗi tải lịch sử");
  return data;
};

export const postHuyLichHen = async (maLichHen) => {
  const res = await fetch(`${API}/dat-san/huy/${maLichHen}`, {
    method: "POST",
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Hủy lịch thất bại");
  return data;
};
