import { ADMIN_TABS, USER_TABS } from "./constants";

export const tabsForRole = (role) => {
  if (role === "admin" || role === "quan_ly_he_thong") {
    return ADMIN_TABS;
  }
  if (role === "quan_ly_chi_nhanh") {
    return ADMIN_TABS.filter((tab) => tab.key !== "khach");
  }
  if (role === "nhan_vien_chi_nhanh") {
    return ADMIN_TABS.filter((tab) => tab.key === "lich" || tab.key === "san");
  }
  return USER_TABS;
};

export const cleanPayload = (payload) =>
  Object.fromEntries(
    Object.entries(payload).filter(
      ([, value]) => value !== "" && value != null,
    ),
  );

export const formatPrice = (value) =>
  Number(value || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });
