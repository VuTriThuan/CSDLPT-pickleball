import { ADMIN_TABS, USER_TABS } from "./constants";

export const tabsForRole = (role) => {
  if (role === "admin" || role === "Quản lý hệ thống") {
    return ADMIN_TABS;
  }
  if (role === "Quản lý chi nhánh") {
    return ADMIN_TABS.filter((tab) => tab.key !== "khach");
  }
  if (role === "Nhân viên chi nhánh") {
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
