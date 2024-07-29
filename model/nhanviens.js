const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NhanVienModel = new Schema({
    fullname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    phone: { type: String, maxlength: 10 },
    ghiChu: { type: String },
    role: { type: Number, default: 0 },
    trangThai: { type: Boolean },
    avatar: { type: String },
    block: { type: Boolean }
})

module.exports = mongoose.model("nhanvien", NhanVienModel);