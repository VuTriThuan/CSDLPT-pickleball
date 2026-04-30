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


const getAllPayments = async () => {
  return await ThanhToan.find();
};

const deletePayment = async (id) => {
  return await ThanhToan.findByIdAndDelete(id);
};

const updatePayment = async (id, data) => {
  return await ThanhToan.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
    }
  );
};


module.exports = {
  createPayment,
  getAllPayments,
  deletePayment,
  updatePayment,
};