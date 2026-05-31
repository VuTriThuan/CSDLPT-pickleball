export const USER_TABS = [
  { key: "dat", label: "Đặt sân" },
  { key: "lich", label: "Lịch sử" },
];

export const ADMIN_TABS = [
  { key: "lich", label: "Lịch đặt" },
  { key: "san", label: "Quản lý sân" },
  { key: "khach", label: "Khách hàng" },
  { key: "doanhthu", label: "Doanh thu" },
  { key: "nhan-vien", label: "Nhân viên" },
];

export const ROLE_LABELS = {
  user: "Khách hàng",
  admin: "Quản lý hệ thống",
  "Quản lý hệ thống": "Quản lý hệ thống",
  "Quản lý chi nhánh": "Quản lý chi nhánh",
  "Nhân viên chi nhánh": "Nhân viên chi nhánh",
};

export const MANAGE_ROLES = [
  "admin",
  "Quản lý hệ thống",
  "Quản lý chi nhánh",
  "Nhân viên chi nhánh",
];

export const ACTIONS = [
  { key: "create", label: "Thêm" },
  { key: "update", label: "Sửa" },
  { key: "delete", label: "Xóa" },
];

export const TRANG_THAI_SAN = [
  { value: "Hoạt động", label: "Hoạt động" },
  { value: "Dừng hoạt động", label: "Dừng hoạt động" },
];

export const initialSan = {
  MaSan: "",
  TenSan: "",
  GiaTheoGio: "",
  TrangThai: "Hoạt động",
  MaChiNhanh: "",
};

export const initialKhachHang = {
  MaKhachHang: "",
  HoTen: "",
  SoDienThoai: "",
  Email: "",
};
