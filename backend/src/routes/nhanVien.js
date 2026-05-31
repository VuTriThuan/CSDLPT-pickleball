const express = require("express");
const router = express.Router();
const NhanVien = require("../models/NhanVien");
const { requireAuth, requirePermission, isSystemManager } = require("../middleware/auth");
const { PERMISSIONS, ROLES } = require("../constants/roles");
const { assertCanManageNhanVien } = require("../services/phanQuyenService");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

const sendError = (res, err, defaultStatus = 500) =>
  res.status(err.statusCode || defaultStatus).json({
    success: false,
    message: err.message,
  });

router.get("/", requireAuth, requirePermission(PERMISSIONS.NHAN_VIEN_MANAGE), async (req, res) => {
  try {
    let filter = {};
    // Nếu là quản lý chi nhánh thì chỉ xem được nhân viên của chi nhánh mình
    if (!isSystemManager(req.user)) {
      filter.MaChiNhanh = req.user.MaChiNhanh;
      filter.ChucVu = {
        $in: [ROLES.NHAN_VIEN_CHI_NHANH, ROLES.QUAN_LY_CHI_NHANH],
      };
    }
    
    // Nếu có query branchId (dành cho QLHT lọc)
    if (req.query.branchId && isSystemManager(req.user)) {
      filter.MaChiNhanh = req.query.branchId;
    }

    const nhanVienList = await NhanVien.find(filter).sort({ MaNhanVien: 1 });
    res.json({ success: true, data: nhanVienList });
  } catch (err) {
    sendError(res, err);
  }
});

router.post("/", requireAuth, requirePermission(PERMISSIONS.NHAN_VIEN_MANAGE), async (req, res) => {
  try {
    const { HoTen, SoDienThoai, ChucVu, MaChiNhanh, MatKhau } = req.body;
    
    // Kiểm tra quyền
    assertCanManageNhanVien(req.user, MaChiNhanh, ChucVu);

    const ton = await NhanVien.findOne({ SoDienThoai });
    if (ton) {
      return res.status(400).json({ success: false, message: "Số điện thoại đã tồn tại" });
    }

    const maNhanVien = "NV-" + uuidv4().slice(0, 8).toUpperCase();
    
    const nhanVien = await NhanVien.create({
      MaNhanVien: maNhanVien,
      HoTen,
      SoDienThoai,
      ChucVu,
      MaChiNhanh,
      MatKhau
    });

    res.status(201).json({ success: true, data: nhanVien });
  } catch (err) {
    sendError(res, err, 400);
  }
});

router.put("/:maNhanVien", requireAuth, requirePermission(PERMISSIONS.NHAN_VIEN_MANAGE), async (req, res) => {
  try {
    const nv = await NhanVien.findOne({ MaNhanVien: req.params.maNhanVien });
    if (!nv) {
      return res.status(404).json({ success: false, message: "Không tìm thấy nhân viên" });
    }

    const targetChiNhanh = req.body.MaChiNhanh || nv.MaChiNhanh;
    const targetChucVu = req.body.ChucVu || nv.ChucVu;
    assertCanManageNhanVien(req.user, nv.MaChiNhanh, targetChucVu);
    
    // Nếu họ đổi chi nhánh của nhân viên, kiểm tra quyền ở chi nhánh mới
    if (targetChiNhanh !== nv.MaChiNhanh) {
      assertCanManageNhanVien(req.user, targetChiNhanh, targetChucVu);
    }

    const updateData = { ...req.body };
    if (!updateData.MatKhau) {
      delete updateData.MatKhau;
    } else {
      updateData.MatKhau = await bcrypt.hash(updateData.MatKhau, 10);
    }

    const updated = await NhanVien.findOneAndUpdate(
      { MaNhanVien: req.params.maNhanVien },
      updateData,
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    sendError(res, err, 400);
  }
});

router.delete("/:maNhanVien", requireAuth, requirePermission(PERMISSIONS.NHAN_VIEN_MANAGE), async (req, res) => {
  try {
    const nv = await NhanVien.findOne({ MaNhanVien: req.params.maNhanVien });
    if (!nv) {
      return res.status(404).json({ success: false, message: "Không tìm thấy nhân viên" });
    }

    assertCanManageNhanVien(req.user, nv.MaChiNhanh, nv.ChucVu);

    await NhanVien.deleteOne({ MaNhanVien: req.params.maNhanVien });
    res.json({ success: true, message: "Đã xóa nhân viên" });
  } catch (err) {
    sendError(res, err, 400);
  }
});

module.exports = router;
