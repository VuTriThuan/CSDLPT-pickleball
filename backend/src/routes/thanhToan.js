const express = require("express");
const router = express.Router();

const { requireAuth, requirePermission } = require("../middleware/auth");
const { PERMISSIONS } = require("../constants/roles");
const ThanhToan = require("../models/ThanhToan");
const LichHen = require("../models/LichHen");
const San = require("../models/San");
const KhachHang = require("../models/KhachHang");

const sendError = (res, err, defaultStatus = 500) =>
  res.status(err.statusCode || defaultStatus).json({
    success: false,
    message: err.message,
  });

const enrichThanhToanData = async (thanhToanList) => {
  return Promise.all(
    thanhToanList.map(async (tt) => {
      const lichHen = await LichHen.findOne({ MaLichHen: tt.MaLichHen });
      const khachHang = lichHen
        ? await KhachHang.findOne({ MaKhachHang: lichHen.MaKhachHang })
        : null;
      const san = lichHen ? await San.findOne({ MaSan: lichHen.MaSan }) : null;

      return {
        ...tt.toObject(),
        lichHen,
        khachHang,
        san,
        tenKhachHang: khachHang?.HoTen || lichHen?.MaKhachHang,
        tenSan: san?.TenSan || lichHen?.MaSan,
      };
    }),
  );
};

router.get(
  "/",
  requireAuth,
  requirePermission(PERMISSIONS.THANH_TOAN_MANAGE),
  async (req, res) => {
  try {
    const branchId =
      req.user?.role === "nhan_vien_chi_nhanh" ||
      req.user?.role === "quan_ly_chi_nhanh"
        ? req.user.MaChiNhanh
        : req.query.branchId;
    let thanhToanList = [];

    if (branchId) {
      const lichHenList = await LichHen.find();
      const sanList = await San.find();

      const sanMap = new Map(sanList.map((s) => [s.MaSan, s]));
      const filtered = lichHenList.filter(
        (item) => sanMap.get(item.MaSan)?.MaChiNhanh === branchId,
      );
      const maLichHenList = filtered.map((item) => item.MaLichHen);

      thanhToanList = await ThanhToan.find({
        MaLichHen: { $in: maLichHenList },
      });
    } else {
      thanhToanList = await ThanhToan.find();
    }

    const enriched = await enrichThanhToanData(thanhToanList);

    res.json({ success: true, data: enriched });
  } catch (err) {
    sendError(res, err);
  }
  },
);

router.get(
  "/lich-hen/:branchId",
  requireAuth,
  requirePermission(PERMISSIONS.THANH_TOAN_MANAGE),
  async (req, res) => {
  try {
    const { branchId } = req.params;

    const sanList = await San.find({ MaChiNhanh: branchId });
    const maSanList = sanList.map((s) => s.MaSan);

    const lichHenList = await LichHen.find({ MaSan: { $in: maSanList } });

    const enriched = await Promise.all(
      lichHenList.map(async (lh) => {
        const khachHang = await KhachHang.findOne({
          MaKhachHang: lh.MaKhachHang,
        });
        const san = sanList.find((s) => s.MaSan === lh.MaSan);
        return {
          ...lh.toObject(),
          tenKhachHang: khachHang?.HoTen || lh.MaKhachHang,
          tenSan: san?.TenSan || lh.MaSan,
        };
      }),
    );

    res.json({ success: true, data: enriched });
  } catch (err) {
    sendError(res, err);
  }
  },
);

router.post(
  "/",
  requireAuth,
  requirePermission(PERMISSIONS.THANH_TOAN_MANAGE),
  async (req, res) => {
    try {
      const thanhToan = await ThanhToan.create(req.body);
      const enriched = await enrichThanhToanData([thanhToan]);
      res.status(201).json({ success: true, data: enriched[0] });
    } catch (err) {
      sendError(res, err, 400);
    }
  },
);

router.put(
  "/:maThanhToan",
  requireAuth,
  requirePermission(PERMISSIONS.THANH_TOAN_MANAGE),
  async (req, res) => {
    try {
      const thanhToan = await ThanhToan.findOne({
        MaThanhToan: req.params.maThanhToan,
      });
      if (!thanhToan)
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy thanh toán",
        });

      const updated = await ThanhToan.findOneAndUpdate(
        { MaThanhToan: req.params.maThanhToan },
        req.body,
        { new: true, runValidators: true },
      );

      const enriched = await enrichThanhToanData([updated]);
      res.json({ success: true, data: enriched[0] });
    } catch (err) {
      sendError(res, err, 400);
    }
  },
);

router.delete(
  "/:maThanhToan",
  requireAuth,
  requirePermission(PERMISSIONS.THANH_TOAN_MANAGE),
  async (req, res) => {
    try {
      const thanhToan = await ThanhToan.findOne({
        MaThanhToan: req.params.maThanhToan,
      });
      if (!thanhToan)
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy thanh toán",
        });

      await ThanhToan.deleteOne({ MaThanhToan: req.params.maThanhToan });

      res.json({ success: true, message: "Đã xóa thanh toán" });
    } catch (err) {
      sendError(res, err, 400);
    }
  },
);

module.exports = router;
