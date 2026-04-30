const API = "http://localhost:5000/api/san";
const REVENUE_API = "http://localhost:5000/api/revenue";

const authHeaders = (auth = {}) => ({
  "Content-Type": "application/json",
  "x-user-role": auth.role,
  "x-branch-id": auth.branchId,
});

const requestJson = async (url, options = {}) => {
  const res = await fetch(url, {
    credentials: "include",
    ...options,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Thao tác thất bại");
  return data;
};

const withBranchQuery = (url, branchId) => {
  if (!branchId) return url;
  const params = new URLSearchParams({ branchId });
  return `${url}?${params.toString()}`;
};

export const getSanList = (auth) =>
  requestJson(withBranchQuery(API, auth?.branchId), {
    headers: authHeaders(auth),
  });

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

export const getLichHenList = (auth) =>
  requestJson(withBranchQuery(`${API}/quan-ly/lich-hen`, auth?.branchId), {
    headers: authHeaders(auth),
  });

export const updateLichHen = (maLichHen, payload, auth) =>
  requestJson(`${API}/quan-ly/lich-hen/${maLichHen}`, {
    method: "PUT",
    headers: authHeaders(auth),
    body: JSON.stringify(payload),
  });

export const getKhachHangList = (auth) =>
  requestJson(`${API}/quan-ly/khach-hang`, {
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

export const getRevenueAllBranches = (auth) =>
  requestJson(withBranchQuery(REVENUE_API, auth?.branchId), {
    headers: authHeaders(auth),
  });

export const getTotalRevenue = (auth) =>
  requestJson(withBranchQuery(`${REVENUE_API}/total`, auth?.branchId), {
    headers: authHeaders(auth),
  });
