// const { ROLES } = require("../constants/roles");

// class AuthorizationError extends Error {
//   constructor(message = "Không có quyền truy cập") {
//     super(message);
//     this.name = "AuthorizationError";
//     this.statusCode = 403;
//   }
// }

// const isSystemManager = (actor) => actor?.role === ROLES.QUAN_LY_HE_THONG;

// const assertAuthenticated = (actor) => {
//   if (!actor?.role) throw new AuthorizationError("Chưa xác thực người dùng");
// };

// const assertCanManageSan = (actor, maChiNhanh) => {
//   assertAuthenticated(actor);
//   if (isSystemManager(actor)) return;

//   if (
//     actor.role === ROLES.QUAN_LY_CHI_NHANH &&
//     actor.MaChiNhanh &&
//     actor.MaChiNhanh === maChiNhanh
//   ) {
//     return;
//   }

//   throw new AuthorizationError("Chỉ được thêm/sửa/xóa sân của chi nhánh mình");
// };

// const assertCanManageKhachHang = (actor) => {
//   assertAuthenticated(actor);
//   if (isSystemManager(actor)) return;
//   throw new AuthorizationError(
//     "Chỉ quản lý hệ thống mới được quản lý khách hàng",
//   );
// };

// module.exports = {
//   AuthorizationError,
//   assertCanManageSan,
//   assertCanManageKhachHang,
// };
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
