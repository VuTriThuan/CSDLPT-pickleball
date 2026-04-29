const { ROLES } = require("../constants/roles");

class AuthorizationError extends Error {
  constructor(message = "Không có quyền truy cập") {
    super(message);
    this.name = "AuthorizationError";
    this.statusCode = 403;
  }
}

const isSystemManager = (actor) => actor?.role === ROLES.ADMIN;

const assertAuthenticated = (actor) => {
  if (!actor?.role) throw new AuthorizationError("Chưa xác thực người dùng");
};

const assertCanManageSan = (actor, maChiNhanh) => {
  assertAuthenticated(actor);
  if (isSystemManager(actor)) return;

  throw new AuthorizationError("Chỉ admin mới được thêm/sửa/xóa sân");
};

const assertCanManageKhachHang = (actor) => {
  assertAuthenticated(actor);
  if (isSystemManager(actor)) return;
  throw new AuthorizationError("Chỉ admin mới được quản lý khách hàng");
};

module.exports = {
  AuthorizationError,
  assertCanManageSan,
  assertCanManageKhachHang,
};
