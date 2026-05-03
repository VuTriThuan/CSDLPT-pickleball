const ROLES = {
  USER: "user",
  NHAN_VIEN_CHI_NHANH: "Nhân viên chi nhánh",
  QUAN_LY_CHI_NHANH: "Quản lý chi nhánh",
  ADMIN: "Quản lý hệ thống",
};

const ROLE_ALIASES = {
  user: ROLES.USER,
  khach_hang: ROLES.USER,

  "nhân viên chi nhánh": ROLES.NHAN_VIEN_CHI_NHANH,
  "quản lý chi nhánh": ROLES.QUAN_LY_CHI_NHANH,
  "quản lý hệ thống": ROLES.ADMIN,
  admin: ROLES.ADMIN,
};

const PERMISSIONS = {
  SAN_VIEW: "san:view",
  SAN_MANAGE: "san:manage",
  LICH_HEN_MANAGE: "lich_hen:manage",
  KHACH_HANG_MANAGE: "khach_hang:manage",
  DOANH_THU_VIEW: "doanh_thu:view",
  NHAN_VIEN_MANAGE: "nhan_vien:manage",
};

const ROLE_PERMISSIONS = {
  [ROLES.USER]: [],
  [ROLES.NHAN_VIEN_CHI_NHANH]: [
    PERMISSIONS.SAN_VIEW,
    PERMISSIONS.LICH_HEN_MANAGE,
  ],
  [ROLES.QUAN_LY_CHI_NHANH]: [
    PERMISSIONS.SAN_VIEW,
    PERMISSIONS.SAN_MANAGE,
    PERMISSIONS.LICH_HEN_MANAGE,
    PERMISSIONS.DOANH_THU_VIEW,
    PERMISSIONS.NHAN_VIEN_MANAGE,
  ],
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
};

const normalizeRole = (role) =>
  ROLE_ALIASES[
    String(role || "")
      .trim()
      .toLowerCase()
  ] || null;

const getPermissionsForRole = (role) =>
  ROLE_PERMISSIONS[normalizeRole(role)] || [];

module.exports = {
  ROLES,
  PERMISSIONS,
  normalizeRole,
  getPermissionsForRole,
};
