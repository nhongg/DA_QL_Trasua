const express = require('express');
const router = express.Router();

const DichVuModel = require('../model/dichvus');

// get list dich vu và tìm kiếm dịch vụ theo id
router.get('/', async (req, res) => {
    const dichVus = await DichVuModel.find().sort({createdAt : -1});
    res.send(dichVus);
});

// delete dich vu
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const result = await DichVuModel.deleteOne({ _id: id });
    if (result) {
        res.json({
            "status": "200",
            "msg": "Delete success",
            "data": result
        })
    } else {
        res.json({
            "status": "400",
            "msg": "Delete fail",
            "data": []
        })
    }
})

// post - add dich vu
router.post('/post', async (req, res) => {
    const data = req.body;
    const dichvu = new DichVuModel({
        tenDichVu: data.tenDichVu,
        trangThai: data.trangThai,
        moTa: data.moTa,
        giaTien: data.giaTien,
        hinhAnh: data.hinhAnh,
        type: data.type
    })

    const result = await dichvu.save();

    if (result) {
        res.json({
            status: 200,
            msg: "Add success",
            data: result
        })
    } else {
        res.json({
            status: 400,
            msg: "Add fail",
            data: []
        })
    }
})

// update - put dichvu
router.put('/put/:id', async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    // Sử dụng findByIdAndUpdate để tìm và cập nhật dữ liệu
    const result = await DichVuModel.findByIdAndUpdate(id, data, { new: true });

    if (result) {
        res.json({
            status: 200,
            msg: "Update success",
            data: result
        })
    } else {
        res.json({
            status: 400,
            msg: "Update fail",
            data: []
        })
    }
})

// search dichvu theo tên
router.get('/search', async (req, res) => {
    try {
        const key = req.query.key;
        // Tìm dịch vụ có tên phù hợp với 'key' được cung cấp bằng cách sử dụng regex không phân biệt chữ hoa/thường
        const data = await DichVuModel.find({ tenDichVu: { '$regex': key, "$options": "i" } }).sort({ createdAt: -1 })
        if (data.length > 0) {
            res.json({
                status: 200,
                msg: "Thành công",
                data: data
            })
        }
        else {
            res.json({
                status: 400,
                msg: "Thất bại",
                data: []
            })
        }
    } catch (error) {
        res.json({
            status: 404,
            msg: "Thất bại",
            data: []
        })
        console.log(error);
    }
})

module.exports = router;