const {
  ROLES,
  normalizeRole,
  getPermissionsForRole,
} = require("../constants/roles");

const buildSessionUser = (sessionUser) => {
  if (!sessionUser) return null;

  const role = normalizeRole(sessionUser.role || sessionUser.Role);
  if (!role) return null;

  return {
    ...sessionUser,
    role,
    MaKhachHang: sessionUser.MaKhachHang || sessionUser.maKhachHang,
    MaNhanVien: sessionUser.MaNhanVien || sessionUser.maNhanVien,
    MaChiNhanh: sessionUser.MaChiNhanh || sessionUser.maChiNhanh,
    permissions: getPermissionsForRole(role),
  };
};

const attachUser = (req, _res, next) => {
  req.user = buildSessionUser(req.session?.user);
  next();
};

const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Chưa đăng nhập hoặc chưa cung cấp quyền",
    });
  }

  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.user) return requireAuth(req, res, next);

  if (req.user.role !== ROLES.QUAN_LY_HE_THONG) {
    return res.status(403).json({
      success: false,
      message: "Không có quyền truy cập",
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

    const userPermissions = req.user.permissions || [];
    const allowed = permissions.some((permission) =>
      userPermissions.includes(permission),
    );

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền thực hiện chức năng này",
      });
    }

    next();
  };

const authenticateDemoUser = (_req, _res, next) => {
  next();
};

module.exports = {
  attachUser,
  requireAuth,
  requireAdmin,
  requirePermission,
  hasRole,
  isSystemManager,
  isBranchUser,
  authenticateDemoUser,
};
