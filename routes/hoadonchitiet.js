const express = require('express');
const router = express.Router();

const HoadonChitietModel = require('../model/hoadonchitiets');

router.get('/', async (req, res) => {
    try {
        const { id_HoaDon } = req.query;
        if (id_HoaDon != null && id_HoaDon != undefined) {
            const hoadonchitiets = await HoadonChitietModel.find({ id_HoaDon: id_HoaDon });
            res.send(hoadonchitiets)
        } else {
            const hoadonchitiets = await HoadonChitietModel.find();
            res.send(hoadonchitiets)
        }
    } catch (error) {
        console.log(error);
    }
});

// post - thêm  
router.post('/post', async (req, res) => {
    try {
        const data = req.body;
        const dichvu = data.id_DichVu;
        const id_Bill = data.id_HoaDon;
        if (id_Bill == null || id_Bill == undefined) {
            res.status(403).json({ msg: "Chưa tạo id hóa đơn" });
        }
        const ListHDCT = await HoadonChitietModel.find({ id_HoaDon: id_Bill });
        const check = ListHDCT.find(dv => dv.id_DichVu == dichvu);
        console.log(check)
        if (check) {
            res.status(303).json({ msg: "Dịch vũ đã có không thể thêm" });
        } else {
            const hoadonchitiet = new HoadonChitietModel({
                id_HoaDon: data.id_HoaDon,
                id_DichVu: data.id_DichVu,
                soLuong: data.soLuong,
                giaTien: data.giaTien,
                ghiChu: "",
            })

            const result = await hoadonchitiet.save();

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
        }

    } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
    }
})

// delete hdct
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const result = await HoadonChitietModel.findByIdAndDelete({ _id: id });
    if (result) {
        res.json({
            "status": "200",
            "msg": "Đã xóa dịch vụ khỏi hóa đơn",
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

// update - put 
router.put('/put/:id', async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    // Sử dụng findByIdAndUpdate để tìm và cập nhật dữ liệu
    const result = await HoadonChitietModel.findByIdAndUpdate(id, data, { new: true });

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

module.exports = router;