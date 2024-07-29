const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DichVuModel = new Schema({
    tenDichVu : {type: String, require: true},
    trangThai : {type: Boolean, require: true},
    moTa: {type: String},
    giaTien: {type: Number, require: true},
    type: {type: Boolean, require: true},
    hinhAnh: {type: String}
},{
    timestamps:true
})

module.exports = mongoose.model('dichvu',DichVuModel);