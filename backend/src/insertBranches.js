const mongoose = require("mongoose");
const ChiNhanh = require("./models/ChiNhanh");

const branches = [
  {
    MaChiNhanh: "HOAN_KIEM",
    TenChiNhanh: "Hoàn Kiếm",
    DiaChi: "123 Đường A, Hoàn Kiếm, Hà Nội",
    SoDienThoai: "0123456789",
    TrangThai: "Hoạt động",
    ShardId: 1,
  },
  {
    MaChiNhanh: "CAU_GIAY",
    TenChiNhanh: "Cầu Giấy",
    DiaChi: "456 Đường B, Cầu Giấy, Hà Nội",
    SoDienThoai: "0987654321",
    TrangThai: "Hoạt động",
    ShardId: 2,
  },
  {
    MaChiNhanh: "BA_DINH",
    TenChiNhanh: "Ba Đình",
    DiaChi: "789 Đường C, Ba Đình, Hà Nội",
    SoDienThoai: "0111111111",
    TrangThai: "Hoạt động",
    ShardId: 3,
  },
  {
    MaChiNhanh: "NAM_TU_LIEM",
    TenChiNhanh: "Nam Từ Liêm",
    DiaChi: "101 Đường D, Nam Từ Liêm, Hà Nội",
    SoDienThoai: "0222222222",
    TrangThai: "Hoạt động",
    ShardId: 4,
  },
  {
    MaChiNhanh: "BAC_TU_LIEM",
    TenChiNhanh: "Bắc Từ Liêm",
    DiaChi: "202 Đường E, Bắc Từ Liêm, Hà Nội",
    SoDienThoai: "0333333333",
    TrangThai: "Hoạt động",
    ShardId: 5,
  },
  {
    MaChiNhanh: "THANH_XUAN",
    TenChiNhanh: "Thanh Xuân",
    DiaChi: "303 Đường F, Thanh Xuân, Hà Nội",
    SoDienThoai: "0444444444",
    TrangThai: "Hoạt động",
    ShardId: 6,
  },
  {
    MaChiNhanh: "LONG_BIEN",
    TenChiNhanh: "Long Biên",
    DiaChi: "404 Đường G, Long Biên, Hà Nội",
    SoDienThoai: "0555555555",
    TrangThai: "Hoạt động",
    ShardId: 7,
  },
  {
    MaChiNhanh: "HA_DONG",
    TenChiNhanh: "Hà Đông",
    DiaChi: "505 Đường H, Hà Đông, Hà Nội",
    SoDienThoai: "0666666666",
    TrangThai: "Hoạt động",
    ShardId: 8,
  },
];

async function insertBranches() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pickleball_db",
    );
    console.log("Connected to MongoDB");

    for (const branch of branches) {
      const existing = await ChiNhanh.findOne({
        MaChiNhanh: branch.MaChiNhanh,
      });
      if (!existing) {
        await ChiNhanh.create(branch);
        console.log(`Inserted ${branch.TenChiNhanh}`);
      } else {
        console.log(`${branch.TenChiNhanh} already exists`);
      }
    }

    console.log("Done");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

insertBranches();
