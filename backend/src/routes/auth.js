const express = require("express");
const router = express.Router();
const {
  dangKy,
  dangNhap,
  layNguoiDungTheoMa,
} = require("../services/authService");

// POST /api/auth/dang-ky
router.post("/dang-ky", async (req, res) => {
  try {
    const { hoTen, soDienThoai, email, matKhau } = req.body;
    console.log("BODY:", req.body);
    if (!hoTen || !soDienThoai || !email || !matKhau)
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng điền đầy đủ thông tin" });

    const user = await dangKy({ hoTen, soDienThoai, email, matKhau });
    res
      .status(201)
      .json({ success: true, message: "Đăng ký thành công", data: user });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST /api/auth/dang-nhap
router.post("/dang-nhap", async (req, res) => {
  try {
    const { soDienThoai, matKhau } = req.body;
    if (!soDienThoai || !matKhau)
      return res
        .status(400)
        .json({ success: false, message: "Thiếu email hoặc mật khẩu" });

    const user = await dangNhap({ soDienThoai, matKhau });

    req.session.user = user;

    res.json({ success: true, message: "Đăng nhập thành công", data: user });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
});

// POST /api/auth/dang-xuat
router.post("/dang-xuat", (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res.status(500).json({ success: false, message: "Lỗi đăng xuất" });
    res.clearCookie("connect.sid");
    res.json({ success: true, message: "Đăng xuất thành công" });
  });
});

// GET /api/auth/me — kiểm tra session hiện tại
router.get("/me", async (req, res) => {
  try {
    if (!req.session?.user) {
      return res
        .status(401)
        .json({ success: false, message: "Chưa đăng nhập" });
    }

    const maKhachHang =
      req.session.user.maKhachHang || req.session.user.MaKhachHang;
    const user = await layNguoiDungTheoMa(maKhachHang);
    req.session.user = user;

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
});

module.exports = router;
