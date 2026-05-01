const { v4: uuidv4 } = require("uuid");
const KhachHang = require("../models/KhachHang");
const NhanVien = require("../models/NhanVien");
const { ROLES, normalizeRole } = require("../constants/roles");

const buildKhachHangSession = (kh) => ({
  userId: kh._id.toString(),
  maKhachHang: kh.MaKhachHang,
  MaKhachHang: kh.MaKhachHang,
  hoTen: kh.HoTen,
  email: kh.Email,
  soDienThoai: kh.SoDienThoai,
  role: ROLES.KHACH_HANG,
});

const buildNhanVienSession = (nv) => ({
  userId: nv._id.toString(),
  maNhanVien: nv.MaNhanVien,
  MaNhanVien: nv.MaNhanVien,
  MaChiNhanh: nv.MaChiNhanh,
  maChiNhanh: nv.MaChiNhanh,
  hoTen: nv.HoTen,
  soDienThoai: nv.SoDienThoai,
  role: normalizeRole(nv.ChucVu),
});

const dangKy = async ({ hoTen, soDienThoai, email, matKhau }) => {
  const ton = await KhachHang.findOne({
    $or: [{ Email: email }, { SoDienThoai: soDienThoai }],
  });
  if (ton) throw new Error("Email hoặc số điện thoại đã được đăng ký");

  const maKhachHang = "KH-" + uuidv4().slice(0, 8).toUpperCase();
  const kh = await KhachHang.create({
    MaKhachHang: maKhachHang,
    HoTen: hoTen,
    SoDienThoai: soDienThoai,
    Email: email,
    MatKhau: matKhau,
  });

  return buildKhachHangSession(kh);
};

const dangNhapKhachHang = async ({ soDienThoai, matKhau }) => {
  const kh = await KhachHang.findOne({ SoDienThoai: soDienThoai }).select(
    "+MatKhau",
  );
  if (!kh) throw new Error("Số điện thoại không tồn tại");

  const ok = await kh.kiemTraMatKhau(matKhau);
  if (!ok) throw new Error("Mật khẩu không đúng");

  return buildKhachHangSession(kh);
};

const dangNhapNhanVien = async ({ soDienThoai, matKhau, maChiNhanh }) => {
  if (!maChiNhanh) throw new Error("Vui lòng chọn chi nhánh");

  const nv = await NhanVien.findOne({
    SoDienThoai: soDienThoai,
    MaChiNhanh: maChiNhanh,
  }).select("+MatKhau");
  if (!nv) throw new Error("Không tìm thấy nhân viên tại chi nhánh đã chọn");

  const role = normalizeRole(nv.ChucVu);
  if (!role || role === ROLES.KHACH_HANG) {
    throw new Error("Chức vụ nhân viên không hợp lệ");
  }

  const ok = await nv.kiemTraMatKhau(matKhau);
  if (!ok) throw new Error("Mật khẩu không đúng");

  return buildNhanVienSession(nv);
};

const dangNhap = async ({ soDienThoai, matKhau, maChiNhanh }) => {
  if (maChiNhanh) {
    return dangNhapNhanVien({ soDienThoai, matKhau, maChiNhanh });
  }

  return dangNhapKhachHang({ soDienThoai, matKhau });
};

const layNguoiDungTheoMa = async (maKhachHang) => {
  const kh = await KhachHang.findOne({ MaKhachHang: maKhachHang });
  if (!kh) throw new Error("Không tìm thấy khách hàng");

  return buildKhachHangSession(kh);
};

const layNhanVienTheoMa = async (maNhanVien) => {
  const nv = await NhanVien.findOne({ MaNhanVien: maNhanVien });
  if (!nv) throw new Error("Không tìm thấy nhân viên");

  return buildNhanVienSession(nv);
};

module.exports = { dangKy, dangNhap, layNguoiDungTheoMa, layNhanVienTheoMa };
