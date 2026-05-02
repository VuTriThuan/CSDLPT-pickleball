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
  quan_ly_he_thong: "Quản lý hệ thống",
  quan_ly_chi_nhanh: "Quản lý chi nhánh",
  nhan_vien_chi_nhanh: "Nhân viên chi nhánh",
};

export const MANAGE_ROLES = [
  "admin",
  "quan_ly_he_thong",
  "quan_ly_chi_nhanh",
  "nhan_vien_chi_nhanh",
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
