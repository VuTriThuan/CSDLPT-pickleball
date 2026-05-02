const { ROLES } = require("../constants/roles");

class AuthorizationError extends Error {
  constructor(message = "Không có quyền truy cập") {
    super(message);
    this.name = "AuthorizationError";
    this.statusCode = 403;
  }
}

const isSystemManager = (actor) => actor?.role === ROLES.ADMIN;
const isBranchManager = (actor) => actor?.role === ROLES.QUAN_LY_CHI_NHANH;
const isBranchStaff = (actor) => actor?.role === ROLES.NHAN_VIEN_CHI_NHANH;

const assertAuthenticated = (actor) => {
  if (!actor?.role) throw new AuthorizationError("Chưa xác thực người dùng");
};

const assertCanManageSan = (actor, maChiNhanh) => {
  assertAuthenticated(actor);
  if (isSystemManager(actor)) return;
  if (isBranchManager(actor) && actor.MaChiNhanh === maChiNhanh) return;

  throw new AuthorizationError(
    "Chỉ quản lý chi nhánh hoặc hệ thống mới được quản lý sân",
  );
};

const assertCanManageKhachHang = (actor) => {
  assertAuthenticated(actor);
  if (isSystemManager(actor)) return;
  throw new AuthorizationError("Chỉ quản lý hệ thống mới được quản lý khách hàng");
};

const assertCanAddLichHen = (actor, maChiNhanh) => {
  assertAuthenticated(actor);
  if (isSystemManager(actor)) return;
  if (isBranchManager(actor) && actor.MaChiNhanh === maChiNhanh) return;
  
  throw new AuthorizationError(
    "Chỉ quản lý chi nhánh hoặc hệ thống mới được thêm lịch hẹn",
  );
};

const assertCanEditOrDeleteLichHen = (actor, maChiNhanh) => {
  assertAuthenticated(actor);
  if (isSystemManager(actor)) return;
  if (
    (isBranchManager(actor) || isBranchStaff(actor)) &&
    actor.MaChiNhanh === maChiNhanh
  )
    return;

  throw new AuthorizationError(
    "Không có quyền chỉnh sửa/xóa lịch hẹn của chi nhánh khác",
  );
};

const assertCanManageNhanVien = (actor, targetChiNhanh, targetRole) => {
  assertAuthenticated(actor);
  if (isSystemManager(actor)) return;

  if (isBranchManager(actor)) {
    if (actor.MaChiNhanh !== targetChiNhanh) {
      throw new AuthorizationError("Không thể quản lý nhân viên ở chi nhánh khác");
    }
    // Quản lý chi nhánh chỉ được thêm sửa xóa nhân viên chi nhánh
    // nhưng "quản lý chi nhánh có thêm chức năng thêm, sửa, xoá nhân viên cho chi nhánh mình"
    // Nếu targetRole không phải là NHAN_VIEN_CHI_NHANH thì có thể chặn?
    // Để an toàn, branch manager không thể tạo 1 admin.
    if (targetRole === ROLES.ADMIN) {
      throw new AuthorizationError("Không thể cấp quyền quản lý hệ thống");
    }
    return;
  }

  throw new AuthorizationError("Không có quyền quản lý nhân viên");
};

module.exports = {
  AuthorizationError,
  assertCanManageSan,
  assertCanManageKhachHang,
  assertCanAddLichHen,
  assertCanEditOrDeleteLichHen,
  assertCanManageNhanVien,
};
