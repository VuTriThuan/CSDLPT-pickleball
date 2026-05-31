const API = "http://localhost:5000/api/auth";

const fetchJSON = async (url, options = {}) => {
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Lỗi không xác định");
  return data.data;
};

export const postDangKy = (payload) =>
  fetchJSON(`${API}/dang-ky`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const postDangNhap = (payload) =>
  fetchJSON(`${API}/dang-nhap`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const postDangXuat = () =>
  fetch(`${API}/dang-xuat`, { method: "POST", credentials: "include" });

export const getMe = () => fetchJSON(`${API}/me`);
