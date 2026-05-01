export const USER_TABS = [
  { key: "dat", label: "Đặt sân" },
  { key: "lich", label: "Lịch sử" },
];

export const ADMIN_TABS = [
  { key: "lich", label: "Lịch đặt" },
  { key: "san", label: "Quản lý sân" },
  { key: "khach", label: "Khách hàng" },
  { key: "thanh-toan", label: "Thanh Toán" },
  { key: "doanhthu", label: "Doanh thu" },
];

export const ROLE_LABELS = {
  user: "Khách hàng",
  admin: "Quản lý hệ thống",
};

export const MANAGE_ROLES = ["admin"];

export const ACTIONS = [
  { key: "create", label: "Thêm" },
  { key: "update", label: "Sửa" },
  { key: "delete", label: "Xóa" },
];

export const TRANG_THAI_SAN = [
  { value: "hoat_dong", label: "Hoạt động" },
  { value: "bao_tri", label: "Bảo trì" },
  { value: "ngung", label: "Ngừng" },
];

export const initialSan = {
  MaSan: "",
  TenSan: "",
  GiaTheoGio: "",
  TrangThai: "hoat_dong",
  MaChiNhanh: "",
};

export const initialKhachHang = {
  MaKhachHang: "",
  HoTen: "",
  SoDienThoai: "",
  Email: "",
};
