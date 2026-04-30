const ROLES = {
  USER: "user",
  ADMIN: "admin",
};

const ROLE_ALIASES = {
  user: ROLES.USER,
  khach_hang: ROLES.USER,
  khachhang: ROLES.USER,
  customer: ROLES.USER,

  staff: ROLES.USER,
  nhan_vien: ROLES.USER,
  nhan_vien_chi_nhanh: ROLES.USER,
  manager: ROLES.USER,
  quan_ly_chi_nhanh: ROLES.USER,
  branch_manager: ROLES.USER,

  admin: ROLES.ADMIN,
  quan_ly_he_thong: ROLES.ADMIN,
  system_admin: ROLES.ADMIN,
};

const PERMISSIONS = {
  SAN_MANAGE: "san:manage",
  LICH_HEN_MANAGE: "lich_hen:manage",
  KHACH_HANG_MANAGE: "khach_hang:manage",
};

const ROLE_PERMISSIONS = {
  [ROLES.USER]: [],
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
