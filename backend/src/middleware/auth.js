const {
  ROLES,
  normalizeRole,
  getPermissionsForRole,
} = require("../constants/roles");

const readHeader = (req, name) => req.get(name) || req.get(`x-${name}`);

const authenticateDemoUser = (req, _res, next) => {
  const role = normalizeRole(
    readHeader(req, "user-role") || readHeader(req, "role") || req.query.role,
  );

  req.user = role
    ? {
        role,
        permissions: getPermissionsForRole(role),
        MaKhachHang:
          readHeader(req, "customer-id") ||
          readHeader(req, "ma-khach-hang") ||
          req.query.maKhachHang,
        MaNhanVien:
          readHeader(req, "employee-id") ||
          readHeader(req, "ma-nhan-vien") ||
          req.query.maNhanVien,
        MaChiNhanh:
          readHeader(req, "branch-id") ||
          readHeader(req, "ma-chi-nhanh") ||
          req.query.maChiNhanh,
      }
    : null;

  next();
};

const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message:
        "Chưa xác thực. Gửi header x-user-role để kích hoạt phân quyền demo.",
    });
  }

  next();
};

const hasRole = (user, role) => user?.role === role;
const isSystemManager = (user) => hasRole(user, ROLES.QUAN_LY_HE_THONG);
const isBranchUser = (user) =>
  [ROLES.NHAN_VIEN_CHI_NHANH, ROLES.QUAN_LY_CHI_NHANH].includes(user?.role);

const requirePermission =
  (...permissions) =>
  (req, res, next) => {
    if (!req.user) return requireAuth(req, res, next);
    if (isSystemManager(req.user)) return next();

    const allowed = permissions.some((permission) =>
      req.user.permissions.includes(permission),
    );

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền thực hiện chức năng này",
      });
    }

    next();
  };

module.exports = {
  authenticateDemoUser,
  requireAuth,
  requirePermission,
  hasRole,
  isSystemManager,
  isBranchUser,
};
