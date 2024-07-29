const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const HoaDonChiTietModel = new Schema({
    id_DichVu : {type: Schema.Types.ObjectId, ref: 'dichvu', require: true},
    id_HoaDon : {type: Schema.Types.ObjectId, ref: 'hoadon', required : true},
    soLuong : {type: Number, require: true},
    giaTien : {type: Number, require: true},
    ghiChu : {type: String}
})

module.exports = mongoose.model("hoadonchitiet",HoaDonChiTietModel);