const ROLES = {
  KHACH_HANG: "khach_hang",
  NHAN_VIEN_CHI_NHANH: "nhan_vien_chi_nhanh",
  QUAN_LY_CHI_NHANH: "quan_ly_chi_nhanh",
  QUAN_LY_HE_THONG: "quan_ly_he_thong",
};

const ROLE_ALIASES = {
  user: ROLES.KHACH_HANG,
  khach_hang: ROLES.KHACH_HANG,
  khachhang: ROLES.KHACH_HANG,
  customer: ROLES.KHACH_HANG,

  staff: ROLES.NHAN_VIEN_CHI_NHANH,
  nhan_vien: ROLES.NHAN_VIEN_CHI_NHANH,
  nhan_vien_chi_nhanh: ROLES.NHAN_VIEN_CHI_NHANH,

  manager: ROLES.QUAN_LY_CHI_NHANH,
  quan_ly_chi_nhanh: ROLES.QUAN_LY_CHI_NHANH,
  branch_manager: ROLES.QUAN_LY_CHI_NHANH,

  admin: ROLES.QUAN_LY_HE_THONG,
  quan_ly_he_thong: ROLES.QUAN_LY_HE_THONG,
  system_admin: ROLES.QUAN_LY_HE_THONG,
};

const PERMISSIONS = {
  SAN_VIEW: "san:view",
  SAN_MANAGE: "san:manage",
  LICH_HEN_MANAGE: "lich_hen:manage",
  KHACH_HANG_MANAGE: "khach_hang:manage",
  THANH_TOAN_MANAGE: "thanh_toan:manage",
  REVENUE_VIEW: "revenue:view",
  CHI_NHANH_MANAGE: "chi_nhanh:manage",
};

const ROLE_PERMISSIONS = {
  [ROLES.KHACH_HANG]: [PERMISSIONS.SAN_VIEW],
  [ROLES.NHAN_VIEN_CHI_NHANH]: [
    PERMISSIONS.SAN_VIEW,
    PERMISSIONS.LICH_HEN_MANAGE,
  ],
  [ROLES.QUAN_LY_CHI_NHANH]: [
    PERMISSIONS.SAN_VIEW,
    PERMISSIONS.LICH_HEN_MANAGE,
    PERMISSIONS.SAN_MANAGE,
    PERMISSIONS.REVENUE_VIEW,
  ],
  [ROLES.QUAN_LY_HE_THONG]: Object.values(PERMISSIONS),
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
