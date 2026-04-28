const { ROLES } = require("../constants/roles");

class AuthorizationError extends Error {
  constructor(message = "Không có quyền truy cập") {
    super(message);
    this.name = "AuthorizationError";
    this.statusCode = 403;
  }
}

const isSystemManager = (actor) => actor?.role === ROLES.QUAN_LY_HE_THONG;

const assertAuthenticated = (actor) => {
  if (!actor?.role) throw new AuthorizationError("Chưa xác thực người dùng");
};

const assertCanManageSan = (actor, maChiNhanh) => {
  assertAuthenticated(actor);
  if (isSystemManager(actor)) return;

  if (
    actor.role === ROLES.QUAN_LY_CHI_NHANH &&
    actor.MaChiNhanh &&
    actor.MaChiNhanh === maChiNhanh
  ) {
    return;
  }

  throw new AuthorizationError("Chỉ được thêm/sửa/xóa sân của chi nhánh mình");
};

const assertCanManageKhachHang = (actor) => {
  assertAuthenticated(actor);
  if (isSystemManager(actor)) return;
  throw new AuthorizationError("Chỉ quản lý hệ thống mới được quản lý khách hàng");
};

module.exports = {
  AuthorizationError,
  assertCanManageSan,
  assertCanManageKhachHang,
};
