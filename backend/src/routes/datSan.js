const express = require("express");
const router = express.Router();
const {
  datSanVaThanhToan,
  huyLichHenVaHoanTien,
  laySanTrong,
  layLichSuDatSan,
  xoaLichHenVaTruDoanhThu,
} = require("../services/datSanService");
const LichHen = require("../models/LichHen");
const ThanhToan = require("../models/ThanhToan");
const San = require("../models/San");
const KhachHang = require("../models/KhachHang");
const { PERMISSIONS } = require("../constants/roles");
const { requireAuth, requirePermission } = require("../middleware/auth");
const {
  assertCanManageSan,
  assertCanManageKhachHang,
  assertCanAddLichHen,
  assertCanEditOrDeleteLichHen,
} = require("../services/phanQuyenService");

const sendError = (res, err, defaultStatus = 500) =>
  res.status(err.statusCode || defaultStatus).json({
    success: false,
    message: err.message,
  });

const pickDefined = (source, fields) =>
  fields.reduce((result, field) => {
    if (source[field] !== undefined) result[field] = source[field];
    return result;
  }, {});

const cleanPayload = (payload) =>
  Object.fromEntries(
    Object.entries(payload).filter(
      ([, value]) => value !== "" && value != null,
    ),
  );

const getSelectedBranchId = (req) => {
  if (req.user && req.user.role !== "admin" && req.user.role !== "quan_ly_he_thong") {
    return req.user.MaChiNhanh;
  }
  return req.query.branchId || req.get("x-branch-id") || "";
};

const normalizeSanPayload = (body) =>
  cleanPayload({
    MaSan: body.MaSan || body.maSan,
    TenSan: body.TenSan || body.tenSan,
    GiaTheoGio: body.GiaTheoGio ?? body.gia,
    TrangThai: body.TrangThai || body.trangThai,
    MaChiNhanh: body.MaChiNhanh || body.shard || body.maChiNhanh,
  });

const createSanForUser = async (req) => {
  const payload = normalizeSanPayload(req.body);
  assertCanManageSan(req.user, payload.MaChiNhanh);
  return San.create(payload);
};

const updateSanForUser = async (req) => {
  const san = await San.findOne({ MaSan: req.params.maSan });
  if (!san) {
    const err = new Error("Không tìm thấy sân");
    err.statusCode = 404;
    throw err;
  }

  const payload = normalizeSanPayload(req.body);
  assertCanManageSan(req.user, san.MaChiNhanh);
  if (payload.MaChiNhanh && payload.MaChiNhanh !== san.MaChiNhanh) {
    assertCanManageSan(req.user, payload.MaChiNhanh);
  }

  return San.findOneAndUpdate({ MaSan: req.params.maSan }, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteSanForUser = async (req) => {
  const san = await San.findOne({ MaSan: req.params.maSan });
  if (!san) {
    const err = new Error("Không tìm thấy sân");
    err.statusCode = 404;
    throw err;
  }

  assertCanManageSan(req.user, san.MaChiNhanh);
  await San.deleteOne({ MaSan: req.params.maSan });
};

router.get("/", async (req, res) => {
  try {
    const branchId = getSelectedBranchId(req);
    const filter = branchId ? { MaChiNhanh: branchId } : {};
    const san = await San.find(filter).sort({ MaSan: 1 });
    res.json({ success: true, data: san });
  } catch (err) {
    sendError(res, err);
  }
});

router.post(
  "/",
  requireAuth,
  requirePermission(PERMISSIONS.SAN_MANAGE),
  async (req, res) => {
    try {
      const san = await createSanForUser(req);
      res.status(201).json({ success: true, data: san });
    } catch (err) {
      sendError(res, err, 400);
    }
  },
);

router.get("/trong", async (req, res) => {
  try {
    const { maChiNhanh, ngayDat, gioBatDau, gioKetThuc } = req.query;
    if (!maChiNhanh) {
      return res.status(400).json({
        success: false,
        message: "Chi nhánh là bắt buộc (cho sharding)",
      });
    }
    if (!ngayDat || !gioBatDau || !gioKetThuc) {
      return res.status(400).json({
        success: false,
        message: "Thiếu tham số ngayDat, gioBatDau, gioKetThuc",
      });
    }
    const sanTrong = await laySanTrong(
      maChiNhanh,
      ngayDat,
      gioBatDau,
      gioKetThuc,
    );
    res.json({ success: true, data: sanTrong });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.post("/dat-san", requireAuth, async (req, res) => {
  try {
    const { gioBatDau, gioKetThuc, maSan, ngayDat } =
      req.body;
    const maKhachHang =
      req.user?.MaKhachHang ||
      req.session?.user?.maKhachHang ||
      req.session?.user?.MaKhachHang ||
      req.body.maKhachHang;

    if (!maSan) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng chọn sân" });
    }
    if (!ngayDat) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng chọn ngày đặt" });
    }
    if (!gioBatDau || !gioKetThuc) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn giờ bắt đầu và kết thúc",
      });
    }
    if (!maKhachHang) {
      return res.status(401).json({
        success: false,
        message:
          "Chưa đăng nhập hoặc phiên làm việc đã hết hạn. Vui lòng đăng nhập lại",
      });
    }
    if (req.user && req.user.role !== "user") {
      const san = await San.findOne({ MaSan: maSan });
      if (san) {
        assertCanAddLichHen(req.user, san.MaChiNhanh);
      }
    }
    const result = await datSanVaThanhToan({
      gioBatDau,
      gioKetThuc,
      maKhachHang,
      maSan,
      ngayDat,
    });
    res.status(201).json(result);
  } catch (err) {
    console.error("ERROR:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/dat-san/huy/:maLichHen
 */
router.post("/dat-san/huy/:maLichHen", requireAuth, async (req, res) => {
  try {
    const maKhachHang =
      req.user?.MaKhachHang ||
      req.session?.user?.maKhachHang ||
      req.session?.user?.MaKhachHang;
    const result = await huyLichHenVaHoanTien(
      req.params.maLichHen,
      maKhachHang,
    );
    res.json(result);
  } catch (err) {
    console.error("ERROR:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/san/lich-hen/cua-toi
 * Lịch sử đặt sân của khách hàng đang đăng nhập
 */
router.get("/lich-hen/cua-toi", requireAuth, async (req, res) => {
  try {
    const maKhachHang =
      req.user?.MaKhachHang ||
      req.session?.user?.maKhachHang ||
      req.session?.user?.MaKhachHang;

    if (!maKhachHang) {
      return res
        .status(400)
        .json({ success: false, message: "Không xác định khách hàng" });
    }

    const { page = 1, limit = 10 } = req.query;
    const result = await layLichSuDatSan(
      maKhachHang,
      Number(page),
      Number(limit),
    );
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/lich-hen/khach-hang/:maKhachHang
 * Lịch sử đặt sân của khách hàng
 */
router.get("/lich-hen/khach-hang/:maKhachHang", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await layLichSuDatSan(
      req.params.maKhachHang,
      Number(page),
      Number(limit),
    );
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get(
  "/quan-ly/lich-hen",
  requireAuth,
  requirePermission(PERMISSIONS.LICH_HEN_MANAGE),
  async (req, res) => {
    try {
      const branchId = getSelectedBranchId(req);
      const sanFilter = branchId ? { MaChiNhanh: branchId } : {};
      const sanList = await San.find(sanFilter).select(
        "MaSan TenSan MaChiNhanh",
      );
      const sanById = new Map(sanList.map((san) => [san.MaSan, san]));
      const lichHenFilter = branchId
        ? { MaSan: { $in: sanList.map((san) => san.MaSan) } }
        : {};
      const lichHen = await LichHen.find(lichHenFilter).sort({
        ThoiDiemTao: -1,
      });
      const data = await Promise.all(
        lichHen.map(async (item) => {
          const [khachHang, thanhToan] = await Promise.all([
            KhachHang.findOne({ MaKhachHang: item.MaKhachHang }),
            ThanhToan.findOne({ MaDatSan: item.MaLichHen }),
          ]);
          const san = sanById.get(item.MaSan);

          return {
            ...item.toObject(),
            tenSan: san?.TenSan,
            maChiNhanh: san?.MaChiNhanh,
            tenKhachHang: khachHang?.HoTen,
            thanhToan,
          };
        }),
      );

      res.json({ success: true, data });
    } catch (err) {
      sendError(res, err);
    }
  },
);

router.put(
  "/quan-ly/lich-hen/:maLichHen",
  requireAuth,
  requirePermission(PERMISSIONS.LICH_HEN_MANAGE),
  async (req, res) => {
    try {
      const lichHen = await LichHen.findOne({
        MaLichHen: req.params.maLichHen,
      });
      if (!lichHen) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy lịch hẹn" });
      }

      const san = await San.findOne({ MaSan: lichHen.MaSan });
      assertCanEditOrDeleteLichHen(req.user, san?.MaChiNhanh);

      const lichHenPayload = pickDefined(req.body, [
        "MaKhachHang",
        "MaSan",
        "NgayDat",
        "GioBatDau",
        "GioKetThuc",
        "TrangThai",
      ]);
      const targetSan = lichHenPayload.MaSan
        ? await San.findOne({ MaSan: lichHenPayload.MaSan })
        : san;
      if (!targetSan) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy sân" });
      }
      if (lichHenPayload.MaSan && lichHenPayload.MaSan !== lichHen.MaSan) {
        assertCanEditOrDeleteLichHen(req.user, targetSan.MaChiNhanh);
      }

      if (lichHenPayload.MaKhachHang) {
        const khachHang = await KhachHang.findOne({
          MaKhachHang: lichHenPayload.MaKhachHang,
        });
        if (!khachHang) {
          return res.status(404).json({
            success: false,
            message: "Không tìm thấy khách hàng",
          });
        }
      }

      const nextNgayDat = lichHenPayload.NgayDat || lichHen.NgayDat;
      const nextGioBatDau = lichHenPayload.GioBatDau || lichHen.GioBatDau;
      const nextGioKetThuc = lichHenPayload.GioKetThuc || lichHen.GioKetThuc;
      const nextMaSan = lichHenPayload.MaSan || lichHen.MaSan;
      const batDau = nextGioBatDau.split(":").map(Number);
      const ketThuc = nextGioKetThuc.split(":").map(Number);
      if (
        batDau.length !== 2 ||
        ketThuc.length !== 2 ||
        batDau.some((part) => Number.isNaN(part)) ||
        ketThuc.some((part) => Number.isNaN(part)) ||
        ketThuc[0] * 60 + ketThuc[1] <= batDau[0] * 60 + batDau[1]
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Khung giờ không hợp lệ" });
      }

      if (
        lichHenPayload.MaSan ||
        lichHenPayload.NgayDat ||
        lichHenPayload.GioBatDau ||
        lichHenPayload.GioKetThuc
      ) {
        const ngay = new Date(nextNgayDat);
        ngay.setHours(0, 0, 0, 0);
        const next = new Date(ngay);
        next.setDate(next.getDate() + 1);
        const xungDot = await LichHen.findOne({
          MaLichHen: { $ne: req.params.maLichHen },
          MaSan: nextMaSan,
          NgayDat: { $gte: ngay, $lt: next },
          TrangThai: "Chờ xác nhận",
          $or: [
            {
              GioBatDau: { $lt: nextGioKetThuc },
              GioKetThuc: { $gt: nextGioBatDau },
            },
          ],
        });
        if (xungDot) {
          return res.status(400).json({
            success: false,
            message: "Sân đã được đặt trong khung giờ này",
          });
        }
      }

      // Cập nhật lịch hẹn
      const [updated, thanhToan] = await Promise.all([
        Object.keys(lichHenPayload).length
          ? LichHen.findOneAndUpdate(
              { MaLichHen: req.params.maLichHen },
              lichHenPayload,
              { new: true, runValidators: true },
            )
          : Promise.resolve(lichHen),
        ThanhToan.findOne({ MaDatSan: req.params.maLichHen }),
      ]);

      // Khi admin chuyển trạng thái sang "Hủy", cập nhật thanh toán thành "hoan_tien" để trừ doanh thu
      if (
        lichHenPayload.TrangThai === "Hủy" &&
        lichHen.TrangThai !== "Hủy" &&
        thanhToan &&
        thanhToan.TrangThai === "thanh_cong"
      ) {
        await ThanhToan.updateOne(
          { MaDatSan: req.params.maLichHen },
          { TrangThai: "hoan_tien" },
        );
      }

      const [updatedSan, updatedKhachHang] = await Promise.all([
        San.findOne({ MaSan: updated.MaSan }),
        KhachHang.findOne({ MaKhachHang: updated.MaKhachHang }),
      ]);

      res.json({
        success: true,
        data: {
          ...updated.toObject(),
          tenSan: updatedSan?.TenSan,
          maChiNhanh: updatedSan?.MaChiNhanh,
          tenKhachHang: updatedKhachHang?.HoTen,
          thanhToan,
        },
      });
    } catch (err) {
      sendError(res, err, 400);
    }
  },
);

router.delete(
  "/quan-ly/lich-hen/:maLichHen",
  requireAuth,
  requirePermission(PERMISSIONS.LICH_HEN_MANAGE),
  async (req, res) => {
    try {
      const lichHen = await LichHen.findOne({
        MaLichHen: req.params.maLichHen,
      });
      if (!lichHen) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy lịch hẹn" });
      }

      const san = await San.findOne({ MaSan: lichHen.MaSan });
      assertCanEditOrDeleteLichHen(req.user, san?.MaChiNhanh);

      // Gọi service để xóa lịch hẹn và xử lý doanh thu
      const result = await xoaLichHenVaTruDoanhThu(req.params.maLichHen);

      res.json(result);
    } catch (err) {
      sendError(res, err, 400);
    }
  },
);

/**
 * GET /api/lich-hen/:maLichHen
 * Chi tiết 1 lịch hẹn
 */
router.get("/lich-hen/:maLichHen", async (req, res) => {
  try {
    const lichHen = await LichHen.findOne({ MaLichHen: req.params.maLichHen });
    if (!lichHen)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy lịch hẹn" });
    const thanhToan = await ThanhToan.findOne({ MaDatSan: lichHen.MaLichHen });
    res.json({ success: true, data: { ...lichHen.toObject(), thanhToan } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/thanh-toan/:maThanhToan
 * Chi tiết thanh toán
 */
router.get("/thanh-toan/:maThanhToan", async (req, res) => {
  try {
    const tt = await ThanhToan.findOne({ MaThanhToan: req.params.maThanhToan });
    if (!tt)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy thanh toán" });
    res.json({ success: true, data: tt });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Them, sua, xoa san
router.post(
  "/quan-ly/san",
  requireAuth,
  requirePermission(PERMISSIONS.SAN_MANAGE),
  async (req, res) => {
    try {
      assertCanManageSan(req.user, req.body.MaChiNhanh);
      const san = await San.create(req.body);
      res.status(201).json({ success: true, data: san });
    } catch (err) {
      sendError(res, err, 400);
    }
  },
);

router.put(
  "/quan-ly/san/:maSan",
  requireAuth,
  requirePermission(PERMISSIONS.SAN_MANAGE),
  async (req, res) => {
    try {
      const san = await San.findOne({ MaSan: req.params.maSan });
      if (!san) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy sân" });
      }

      assertCanManageSan(req.user, san.MaChiNhanh);
      if (req.body.MaChiNhanh && req.body.MaChiNhanh !== san.MaChiNhanh) {
        assertCanManageSan(req.user, req.body.MaChiNhanh);
      }

      const updated = await San.findOneAndUpdate(
        { MaSan: req.params.maSan },
        pickDefined(req.body, [
          "TenSan",
          "GiaTheoGio",
          "TrangThai",
          "MaChiNhanh",
        ]),
        { new: true, runValidators: true },
      );

      res.json({ success: true, data: updated });
    } catch (err) {
      sendError(res, err, 400);
    }
  },
);

router.delete(
  "/quan-ly/san/:maSan",
  requireAuth,
  requirePermission(PERMISSIONS.SAN_MANAGE),
  async (req, res) => {
    try {
      const san = await San.findOne({ MaSan: req.params.maSan });
      if (!san) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy sân" });
      }

      assertCanManageSan(req.user, san.MaChiNhanh);
      await San.deleteOne({ MaSan: req.params.maSan });
      res.json({ success: true, message: "Đã xóa sân" });
    } catch (err) {
      sendError(res, err, 400);
    }
  },
);

// 3. xem, sua, xoa thong tin khach hang
router.get(
  "/quan-ly/khach-hang",
  requireAuth,
  requirePermission(PERMISSIONS.KHACH_HANG_MANAGE),
  async (req, res) => {
    try {
      assertCanManageKhachHang(req.user);
      const khachHang = await KhachHang.find().sort({ MaKhachHang: 1 });
      res.json({ success: true, data: khachHang });
    } catch (err) {
      sendError(res, err, 400);
    }
  },
);

router.put(
  "/quan-ly/khach-hang/:maKhachHang",
  requireAuth,
  requirePermission(PERMISSIONS.KHACH_HANG_MANAGE),
  async (req, res) => {
    try {
      assertCanManageKhachHang(req.user);
      const updated = await KhachHang.findOneAndUpdate(
        { MaKhachHang: req.params.maKhachHang },
        pickDefined(req.body, ["HoTen", "SoDienThoai", "Email", "NgayDangKy"]),
        { new: true, runValidators: true },
      );

      if (!updated) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy khách hàng" });
      }

      res.json({ success: true, data: updated });
    } catch (err) {
      sendError(res, err, 400);
    }
  },
);

router.delete(
  "/quan-ly/khach-hang/:maKhachHang",
  requireAuth,
  requirePermission(PERMISSIONS.KHACH_HANG_MANAGE),
  async (req, res) => {
    try {
      assertCanManageKhachHang(req.user);
      const result = await KhachHang.deleteOne({
        MaKhachHang: req.params.maKhachHang,
      });
      if (!result.deletedCount) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy khách hàng" });
      }
      res.json({ success: true, message: "Đã xóa khách hàng" });
    } catch (err) {
      sendError(res, err, 400);
    }
  },
);

router.put(
  "/:maSan",
  requireAuth,
  requirePermission(PERMISSIONS.SAN_MANAGE),
  async (req, res) => {
    try {
      const updated = await updateSanForUser(req);
      res.json({ success: true, data: updated });
    } catch (err) {
      sendError(res, err, 400);
    }
  },
);

router.delete(
  "/:maSan",
  requireAuth,
  requirePermission(PERMISSIONS.SAN_MANAGE),
  async (req, res) => {
    try {
      await deleteSanForUser(req);
      res.json({ success: true, message: "Đã xóa sân" });
    } catch (err) {
      sendError(res, err, 400);
    }
  },
);

module.exports = router;
