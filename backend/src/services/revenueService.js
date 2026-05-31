const ThanhToan = require("../models/ThanhToan");

const revenueWithBranchPipeline = (branchId) => [
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

  ...(branchId
    ? [
        {
          $match: {
            "San.MaChiNhanh": branchId,
          },
        },
      ]
    : []),
];

// doanh thu từng chi nhánh
const getRevenueAllBranches = async () => {
  return await ThanhToan.aggregate([
    ...revenueWithBranchPipeline(),
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
const getTotalRevenue = async (branchId) => {
  const result = await ThanhToan.aggregate([
    ...(branchId
      ? revenueWithBranchPipeline(branchId)
      : [
          {
            $match: {
              TrangThai: "thanh_cong",
            },
          },
        ]),
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

const getRevenueByBranch = async (branchId) => {
  const result = await ThanhToan.aggregate([
    ...revenueWithBranchPipeline(branchId),
    {
      $group: {
        _id: "$San.MaChiNhanh",
        TongDoanhThu: {
          $sum: "$SoTien",
        },
      },
    },
  ]);

  return result[0] || { _id: branchId, TongDoanhThu: 0 };
};

module.exports = {
  getRevenueAllBranches,
  getTotalRevenue,
  getRevenueByBranch,
};
