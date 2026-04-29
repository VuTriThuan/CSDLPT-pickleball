/**
 * Auth middleware dùng express-session
 * Session lưu: { userId, maKhachHang, hoTen, role }
 */

const requireAuth = (req, res, next) => {
  if (!req.session?.user) {
    return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.session?.user) {
    return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
  }
  if (req.session.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Không có quyền truy cập" });
  }
  next();
};

module.exports = { requireAuth, requireAdmin };
