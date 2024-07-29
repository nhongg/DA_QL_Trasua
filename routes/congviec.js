const express = require('express');
const router = express.Router();

const CongViecModel = require('../model/congviecs');

// xem danh sach
router.get('/', async (req, res) => {
    const congviec = await CongViecModel.find()
    console.log(congviec);
    res.send(congviec)
})

// them
router.post('/add', async (req, res) => {
    try {
        const data = req.body; // lay du lieu tu body
        const newCongViec = new CongViecModel({
            tenCongViec: data.tenCongViec,
            fromDate: data.fromDate,
            toDate: data.toDate,
            trangThai: 0,
            moTa: data.moTa,
            id_NhanVien: data.id_NhanVien
        }); // tao mot doi tuong moi

        const result = await newCongViec.save(); // them vao database
        if (result) {
            // neu them thanh cong result !null thi tra ve du lieu
            res.json({
                "status": 200,
                "msg": "Them thanh cong",
                "data": result
            })
        } else {
            // neu them khong thanh cong result == null thi tra ve du lieu rong []
            res.json({
                "status": 400,
                "msg": "Them khong thanh cong",
                "data": []
            })
        }
    } catch (err) {
        console.log(err);
    }
})

 // update
 router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params
    const data = req.body;
    const updateCongViec = await CongViecModel.findById(id);
    let result = null;
    if (updateCongViec) {
        // tao 1 doi tuong moi va them vao database

        updateCongViec.tenCongViec = data.tenCongViec ?? updateCongViec.tenCongViec;
        updateCongViec.fromDate = data.fromDate ?? updateCongViec.fromDate;
        updateCongViec.toDate = data.toDate ?? updateCongViec.toDate;
        updateCongViec.trangThai = data.trangThai ?? updateCongViec.trangThai;
        updateCongViec.moTa = data.moTa ?? updateCongViec.moTa;
        updateCongViec.id_NhanVien = data.id_NhanVien ?? updateCongViec.id_NhanVien;
        result = await updateCongViec.save();
    }

    if (result) {
        // neu them thanh cong result !null thi tra ve du lieu
        res.json({
            "status": 200,
            "msg": "Cap nhat thanh cong",
            "data": result
        })
    } else {
        // neu them khong thanh cong result == null thi tra ve du lieu rong []
        res.json({
            "status": 400,
            "msg": "Cap nhat khong thanh cong",
            "data": []
        })
    }
    } catch (error) {
        console.log(error);
    }
})

// xoa
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const result = await CongViecModel.deleteOne({ _id: id });
    console.log(result);
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
module.exports = router;