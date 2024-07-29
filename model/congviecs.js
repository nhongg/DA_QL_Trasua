const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CongViecs = new Schema({
    tenCongViec: { type: String, required: true, unique: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    trangThai: { type: Number, required: true },
    moTa: { type: String },
    id_NhanVien: { type:Schema.Types.ObjectId, ref: 'nhanvien' }
})
module.exports = mongoose.model('congviec', CongViecs);