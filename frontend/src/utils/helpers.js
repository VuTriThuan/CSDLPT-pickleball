import { ADMIN_TABS, USER_TABS } from "./constants";

export const tabsForRole = (role) => {
  if (role === "admin") return ADMIN_TABS;
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
