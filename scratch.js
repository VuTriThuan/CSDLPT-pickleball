const mongoose = require('mongoose');
const NhanVien = require('./backend/src/models/NhanVien');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/pickleball', { useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {
    const nv = await NhanVien.findOne({ HoTen: /.*/ }).select('+MatKhau');
    console.log(nv.MaNhanVien, nv.SoDienThoai, nv.MatKhau);
    const isValid = await bcrypt.compare('123456', nv.MatKhau);
    console.log('123456 isValid?', isValid);
    process.exit();
});
