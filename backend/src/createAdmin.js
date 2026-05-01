const mongoose = require("mongoose");

const KhachHang = require("./models/KhachHang");

mongoose.connect("mongodb://127.0.0.1:27017/pickleball_db");

const createAdmin = async () => {
  try {
    const admin = new KhachHang({
      MaKhachHang: "ADMIN001",

      HoTen: "Admin He Thong",

      SoDienThoai: "0999999999",

      Email: "admin@gmail.com",

      MatKhau: "123456",

      Role: "admin",

      MaChiNhanh: "HOAN_KIEM",
    });

    await admin.save();

    console.log("Tạo admin thành công");

    process.exit();
  } catch (error) {
    console.log(error);

    process.exit();
  }
};

createAdmin();
