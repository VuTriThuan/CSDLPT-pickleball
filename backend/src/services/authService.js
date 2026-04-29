const { v4: uuidv4 } = require("uuid");
const KhachHang = require("../models/KhachHang");
const { normalizeRole } = require("../constants/roles");

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
    Role: "user",
  });

  return {
    maKhachHang: kh.MaKhachHang,
    MaChiNhanh: kh.MaChiNhanh,
    hoTen: kh.HoTen,
    email: kh.Email,
    role: normalizeRole(kh.Role),
  };
};

const dangNhap = async ({ email, matKhau }) => {
  const kh = await KhachHang.findOne({ Email: email }).select("+MatKhau");
  if (!kh) throw new Error("Email không tồn tại");

  const ok = await kh.kiemTraMatKhau(matKhau);
  if (!ok) throw new Error("Mật khẩu không đúng");

  return {
    userId: kh._id.toString(),
    maKhachHang: kh.MaKhachHang,
    MaChiNhanh: kh.MaChiNhanh,
    hoTen: kh.HoTen,
    email: kh.Email,
    role: normalizeRole(kh.Role),
  };
};

const layNguoiDungTheoMa = async (maKhachHang) => {
  const kh = await KhachHang.findOne({ MaKhachHang: maKhachHang });
  if (!kh) throw new Error("Không tìm thấy người dùng");

  return {
    userId: kh._id.toString(),
    maKhachHang: kh.MaKhachHang,
    MaChiNhanh: kh.MaChiNhanh,
    hoTen: kh.HoTen,
    email: kh.Email,
    role: normalizeRole(kh.Role),
  };
};

module.exports = { dangKy, dangNhap, layNguoiDungTheoMa };
