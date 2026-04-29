const {
  ROLES,
  normalizeRole,
  getPermissionsForRole,
} = require("../constants/roles");

const readHeader = (req, name) => req.get(name) || req.get(`x-${name}`);

/**
 * Middleware: gắn req.user từ:
 * 1. Session (ưu tiên)
 * 2. Header demo (fallback)
 */
const attachUser = (req, _res, next) => {
  // ✅ 1. Ưu tiên session
  if (req.session?.user) {
    req.user = {
      ...req.session.user,
      permissions: getPermissionsForRole(req.session.user.role),
    };
    return next();
  }

  // ✅ 2. Fallback demo header
  const role = normalizeRole(
    readHeader(req, "user-role") || readHeader(req, "role") || req.query.role,
  );

  if (role) {
    req.user = {
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
    };
  } else {
    req.user = null;
  }

  next();
};

/**
 * Require login (session hoặc demo)
 */
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Chưa đăng nhập hoặc chưa cung cấp quyền (demo header)",
    });
  }
  next();
};

/**
 * Require admin (session thật)
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Chưa đăng nhập",
    });
  }

  if (req.user.role !== "admin" && req.user.role !== ROLES.QUAN_LY_HE_THONG) {
    return res.status(403).json({
      success: false,
      message: "Không có quyền truy cập",
    });
  }

  next();
};

// ===== Helper =====
const hasRole = (user, role) => user?.role === role;

const isSystemManager = (user) =>
  user?.role === ROLES.QUAN_LY_HE_THONG || user?.role === "admin";

const isBranchUser = (user) =>
  [ROLES.NHAN_VIEN_CHI_NHANH, ROLES.QUAN_LY_CHI_NHANH].includes(user?.role);

// ===== Permission =====
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
  attachUser, // 🔥 QUAN TRỌNG
  requireAuth,
  requireAdmin,
  requirePermission,
  hasRole,
  isSystemManager,
  isBranchUser,
};
