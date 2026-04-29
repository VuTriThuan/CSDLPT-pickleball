const API = "http://localhost:5000/api";

const fetchJSON = async (url, options = {}) => {
  const res = await fetch(url, {
    credentials: "include", // gửi cookie session theo mọi request
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Lỗi không xác định");
  return data;
};

export const getChiNhanh = () =>
  fetchJSON(`${API}/chi-nhanh`).then((d) => d.data);

export const getSanTrong = (maChiNhanh, ngayDat, gioBatDau, gioKetThuc) => {
  const q = new URLSearchParams({ ngayDat, gioBatDau, gioKetThuc });
  if (maChiNhanh) q.set("maChiNhanh", maChiNhanh);
  return fetchJSON(`${API}/san/trong?${q}`).then((d) => d.data);
};

// maKhachHang KHÔNG cần truyền nữa — backend lấy từ session
export const postDatSan = (payload) =>
  fetchJSON(`${API}/san/dat-san`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getLichSuCuaToi = (page = 1, limit = 10) =>
  fetchJSON(`${API}/san/lich-hen/cua-toi?page=${page}&limit=${limit}`).then(
    (data) => data.data,
  );

export const postHuyLichHen = (maLichHen) =>
  fetchJSON(`${API}/san/dat-san/huy/${maLichHen}`, { method: "POST" });
