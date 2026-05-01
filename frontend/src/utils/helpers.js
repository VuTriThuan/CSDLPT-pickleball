import { ADMIN_TABS, USER_TABS } from "./constants";

export const tabsForRole = (role) => {
  if (role === "nhan_vien_chi_nhanh") {
    return ADMIN_TABS.filter((tab) => ["lich", "san"].includes(tab.key));
  }

  if (role === "quan_ly_chi_nhanh") {
    return ADMIN_TABS.filter((tab) =>
      ["lich", "san", "doanhthu"].includes(tab.key),
    );
  }

  if (role === "quan_ly_he_thong" || role === "admin") return ADMIN_TABS;
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
