const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const KhachHangModel = new Schema({
    tenKhachHang : {type: String, require: true},
    dienThoai : {type: String, require: true, unique: true},
    diaChi: {type: String, require : true}
})

module.exports = mongoose.model("khachhang",KhachHangModel);