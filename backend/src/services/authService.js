const { v4: uuidv4 } = require("uuid");
const KhachHang = require("../models/KhachHang");
const { normalizeRole } = require("../constants/roles");

const NhanVien = require("../models/NhanVien");

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
    hoTen: kh.HoTen,
    email: kh.Email,
    role: normalizeRole(kh.Role),
  };
};

const dangNhap = async ({ soDienThoai, matKhau, maChiNhanh }) => {
  if (maChiNhanh) {
    const nv = await NhanVien.findOne({
      SoDienThoai: soDienThoai,
      MaChiNhanh: maChiNhanh,
    }).select("+MatKhau");

    if (!nv) throw new Error("Số điện thoại không tồn tại ở chi nhánh này");

    const ok = await nv.kiemTraMatKhau(matKhau);
    if (!ok) throw new Error("Mật khẩu không đúng");

    let role = nv.ChucVu;
    if (maChiNhanh === "CN-HD") {
      role = "Quản lý hệ thống";
    }

    return {
      userId: nv._id.toString(),
      maNhanVien: nv.MaNhanVien,
      maChiNhanh: nv.MaChiNhanh,
      hoTen: nv.HoTen,
      role: normalizeRole(role),
    };
  }

  const kh = await KhachHang.findOne({ SoDienThoai: soDienThoai }).select(
    "+MatKhau",
  );
  if (!kh) throw new Error("Số điện thoại không tồn tại");

  const ok = await kh.kiemTraMatKhau(matKhau);
  if (!ok) throw new Error("Mật khẩu không đúng");

  return {
    userId: kh._id.toString(),
    maKhachHang: kh.MaKhachHang,
    hoTen: kh.HoTen,
    email: kh.Email,
    role: normalizeRole(kh.Role),
  };
};

const layNguoiDungTheoMa = async ({ maKhachHang, maNhanVien }) => {
  if (maNhanVien) {
    const nv = await NhanVien.findOne({ MaNhanVien: maNhanVien });
    if (!nv) throw new Error("Không tìm thấy nhân viên");

    let role = nv.ChucVu;
    if (nv.MaChiNhanh === "CN-HD") {
      role = "Quản lý hệ thống";
    }

    return {
      userId: nv._id.toString(),
      maNhanVien: nv.MaNhanVien,
      maChiNhanh: nv.MaChiNhanh,
      hoTen: nv.HoTen,
      role: normalizeRole(role),
    };
  }

  const kh = await KhachHang.findOne({ MaKhachHang: maKhachHang });
  if (!kh) throw new Error("Không tìm thấy khách hàng");

  return {
    userId: kh._id.toString(),
    maKhachHang: kh.MaKhachHang,
    hoTen: kh.HoTen,
    email: kh.Email,
    role: normalizeRole(kh.Role),
  };
};

module.exports = { dangKy, dangNhap, layNguoiDungTheoMa };
