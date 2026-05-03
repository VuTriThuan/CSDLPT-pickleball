const API = "http://localhost:5000/api/san";
const REVENUE_API = "http://localhost:5000/api/revenue";
const THANH_TOAN_API = "http://localhost:5000/api/thanh-toan";

const authHeaders = (auth = {}) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (auth.branchId) {
    headers["x-branch-id"] = auth.branchId;
  }

  return headers;
};

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

export const deleteLichHen = (maLichHen, auth) =>
  requestJson(`${API}/quan-ly/lich-hen/${maLichHen}`, {
    method: "DELETE",
    headers: authHeaders(auth),
  });

export const getKhachHangList = (auth) =>
  requestJson(`${API}/quan-ly/khach-hang`, {
    headers: authHeaders(auth),
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

export const getThanhToanList = (auth) =>
  requestJson(withBranchQuery(THANH_TOAN_API, auth?.branchId), {
    headers: authHeaders(auth),
  });

export const getThanhToanLichHen = (branchId, auth) =>
  requestJson(`${THANH_TOAN_API}/lich-hen/${branchId}`, {
    headers: authHeaders(auth),
  });

export const createThanhToan = (payload, auth) =>
  requestJson(THANH_TOAN_API, {
    method: "POST",
    headers: authHeaders(auth),
    body: JSON.stringify(payload),
  });

export const updateThanhToan = (maThanhToan, payload, auth) =>
  requestJson(`${THANH_TOAN_API}/${maThanhToan}`, {
    method: "PUT",
    headers: authHeaders(auth),
    body: JSON.stringify(payload),
  });

export const deleteThanhToan = (maThanhToan, auth) =>
  requestJson(`${THANH_TOAN_API}/${maThanhToan}`, {
    method: "DELETE",
    headers: authHeaders(auth),
  });
