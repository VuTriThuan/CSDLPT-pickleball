const ThanhToan = require("../models/ThanhToan");

// doanh thu từng chi nhánh
const getRevenueAllBranches = async () => {
  return await ThanhToan.aggregate([
    {
      $match: {
        TrangThai: "thanh_cong",
      },
    },

    {
      $lookup: {
        from: "LICH_HEN",
        localField: "MaLichHen",
        foreignField: "MaLichHen",
        as: "LichHen",
      },
    },

    {
      $unwind: "$LichHen",
    },

    {
      $lookup: {
        from: "SAN",
        localField: "LichHen.MaSan",
        foreignField: "MaSan",
        as: "San",
      },
    },

    {
      $unwind: "$San",
    },

    {
      $group: {
        _id: "$San.MaChiNhanh",

        TongDoanhThu: {
          $sum: "$SoTien",
        },
      },
    },
  ]);
};

// tổng doanh thu toàn hệ thống
const getTotalRevenue = async () => {
  const result = await ThanhToan.aggregate([
    {
      $match: {
        TrangThai: "thanh_cong",
      },
    },

    {
      $group: {
        _id: null,

        TongTatCaChiNhanh: {
          $sum: "$SoTien",
        },
      },
    },
  ]);

  return result[0];
};

module.exports = {
  getRevenueAllBranches,
  getTotalRevenue,
};