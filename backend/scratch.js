const mongoose = require('mongoose');
const NhanVien = require('./src/models/NhanVien');

mongoose.connect('mongodb://127.0.0.1:27017/pickleball?replicaSet=rs0').then(async () => {
    try {
        const nvs = await NhanVien.find().select('+MatKhau');
        console.log("Found", nvs.length, "nhan vien");
        for (const nv of nvs) {
            console.log(nv.MaNhanVien, nv.SoDienThoai, typeof nv.MatKhau);
        }
    } catch(e) { console.error(e); }
    process.exit();
});
