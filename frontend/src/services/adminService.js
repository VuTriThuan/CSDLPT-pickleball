const API = "http://localhost:5000/api/san";

const authHeaders = (auth) => ({
  "Content-Type": "application/json",
  "x-user-role": auth.role,
  "x-branch-id": auth.branchId,
});

const requestJson = async (url, options) => {
  const res = await fetch(url, options);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Thao tác thất bại");
  return data;
};

export const getSanList = () => requestJson(API);

export const createSan = (payload, auth) =>
  requestJson(API, {
    method: "POST",
    headers: authHeaders(auth),
    body: JSON.stringify(payload),
  });

export const updateSan = (maSan, payload, auth) =>
  requestJson(`${API}/${maSan}`, {
    method: "PUT",
    headers: authHeaders(auth),
    body: JSON.stringify(payload),
  });

export const deleteSan = (maSan, auth) =>
  requestJson(`${API}/${maSan}`, {
    method: "DELETE",
    headers: authHeaders(auth),
  });

export const createKhachHang = (payload, auth) =>
  requestJson(`${API}/quan-ly/khach-hang`, {
    method: "POST",
    headers: authHeaders(auth),
    body: JSON.stringify(payload),
  });

export const updateKhachHang = (maKhachHang, payload, auth) =>
  requestJson(`${API}/quan-ly/khach-hang/${maKhachHang}`, {
    method: "PUT",
    headers: authHeaders(auth),
    body: JSON.stringify(payload),
  });

export const deleteKhachHang = (maKhachHang, auth) =>
  requestJson(`${API}/quan-ly/khach-hang/${maKhachHang}`, {
    method: "DELETE",
    headers: authHeaders(auth),
  });
