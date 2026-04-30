const ThanhToan = require("../models/ThanhToan");

const LichHen = require("../models/LichHen");

const createPayment = async (data) => {
  // tạo thanh toán
  const payment = await ThanhToan.create(data);

  // cập nhật trạng thái lịch hẹn
  await LichHen.findOneAndUpdate(
    {
      MaLichHen: data.MaLichHen,
    },
    {
      TrangThai: "hoan_thanh",
    }
  );

  return payment;
};

module.exports = {
  createPayment,
};