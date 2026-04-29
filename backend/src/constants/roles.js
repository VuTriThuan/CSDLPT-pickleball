const ROLES = {
  KHACH_HANG: "khach_hang",
  NHAN_VIEN_CHI_NHANH: "nhan_vien_chi_nhanh",
  QUAN_LY_CHI_NHANH: "quan_ly_chi_nhanh",
  QUAN_LY_HE_THONG: "quan_ly_he_thong",
};

const ROLE_ALIASES = {
  khach_hang: ROLES.KHACH_HANG,
  khachhang: ROLES.KHACH_HANG,
  customer: ROLES.KHACH_HANG,

  nhan_vien: ROLES.NHAN_VIEN_CHI_NHANH,
  nhan_vien_chi_nhanh: ROLES.NHAN_VIEN_CHI_NHANH,
  staff: ROLES.NHAN_VIEN_CHI_NHANH,

  quan_ly_chi_nhanh: ROLES.QUAN_LY_CHI_NHANH,
  branch_manager: ROLES.QUAN_LY_CHI_NHANH,

  quan_ly_he_thong: ROLES.QUAN_LY_HE_THONG,
  system_admin: ROLES.QUAN_LY_HE_THONG,
  admin: ROLES.QUAN_LY_HE_THONG,
};

const PERMISSIONS = {
  SAN_MANAGE_BRANCH: "san:manage_branch",
  KHACH_HANG_MANAGE_SYSTEM: "khach_hang:manage_system",
};

const ROLE_PERMISSIONS = {
  [ROLES.KHACH_HANG]: [],
  [ROLES.NHAN_VIEN_CHI_NHANH]: [],
  [ROLES.QUAN_LY_CHI_NHANH]: [PERMISSIONS.SAN_MANAGE_BRANCH],
  [ROLES.QUAN_LY_HE_THONG]: Object.values(PERMISSIONS),
};

const normalizeRole = (role) => ROLE_ALIASES[String(role || "").trim()] || null;

const getPermissionsForRole = (role) => ROLE_PERMISSIONS[role] || [];

module.exports = {
  ROLES,
  PERMISSIONS,
  normalizeRole,
  getPermissionsForRole,
};
