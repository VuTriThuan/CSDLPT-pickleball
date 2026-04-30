const API = "http://localhost:5000/api/chi-nhanh";

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

export const getChiNhanhList = () => fetchJSON(`${API}/chi-nhanh`);
