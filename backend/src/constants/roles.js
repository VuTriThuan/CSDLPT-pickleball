const ROLES = {
  USER: "user",
  NHAN_VIEN_CHI_NHANH: "nhan_vien_chi_nhanh",
  QUAN_LY_CHI_NHANH: "quan_ly_chi_nhanh",
  ADMIN: "quan_ly_he_thong",
};

const ROLE_ALIASES = {
  user: ROLES.USER,
  khach_hang: ROLES.USER,

  nhan_vien_chi_nhanh: ROLES.NHAN_VIEN_CHI_NHANH,
  quan_ly_chi_nhanh: ROLES.QUAN_LY_CHI_NHANH,
  quan_ly_he_thong: ROLES.ADMIN,
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
