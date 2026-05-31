const LichHen = require("../models/LichHen");

const getPendingAppointmentsByBranch = async (branchId) => {
  return await LichHen.aggregate([
    {
      $match: {
        TrangThai: "Chờ xác nhận",
      },
    },

    {
      $lookup: {
        from: "SAN",
        localField: "MaSan",
        foreignField: "MaSan",
        as: "San",
      },
    },

    {
      $unwind: "$San",
    },

    {
      $match: {
        "San.MaChiNhanh": branchId,
      },
    },
  ]);
};

module.exports = {
  getPendingAppointmentsByBranch,
};
