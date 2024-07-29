const express = require('express');
const router = express.Router();

const NhanVienModel = require('../model/nhanviens');

router.get('/', async (req, res) => {
    const nhanviens = await NhanVienModel.find();
    res.send(nhanviens)
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const nhanvien = await NhanVienModel.findById({ _id: id });
        if (nhanvien != null) {
            res.json({
                status: 200,
                message: "Tìm thấy nhân viên",
                data: nhanvien
            })
        } else {
            res.json({
                status: 400,
                message: "Không tìm thấy nhân viên",
                data: []
            })
        }
    } catch (error) {
        console.log(error);
        res.json({
            status: 404,
            message: "Lỗi",
            data: []
        })
    }
})

// post - add nhân viên
router.post('/post', async (req, res) => {
    const data = req.body;
    const nhanvien = new NhanVienModel({
        fullname: data.fullname,
        username: data.username,
        password: data.password,
        email: data.email || null,
        address: data.address || null,
        phone: data.phone || null,
        ghiChu: data.ghiChu || null,
        trangThai: true,
        avatar: data.avatar || null,
        role: 0,
        block: false
    })
    const checkUser = await NhanVienModel.findOne({ username: data.username })

    if (checkUser) {
        return res
            .status(404)
            .json({ message: "Tên đăng nhập tồn tại" });
    }
    else {
        const result = await nhanvien.save();
        if (result) {
            res.json({
                status: 200,
                message: "Add success",
                data: result
            })
        } else {
            res.json({
                status: 400,
                message: "Add fail",
                data: []
            })
        }
    }

})

// delete nhân viên
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const result = await NhanVienModel.deleteOne({ _id: id });
    if (result) {
        res.json({
            "status": "200",
            "messenger": "Delete success",
            "data": result
        })
    } else {
        res.json({
            "status": "400",
            "messenger": "Delete fail",
            "data": []
        })
    }
})

// update - put nhanvien
router.put('/put/:id', async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    // Sử dụng findByIdAndUpdate để tìm và cập nhật dữ liệu
    const result = await NhanVienModel.findByIdAndUpdate(id, data, { new: true });

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

// khoá tài khoản
router.put('/:actions/:id', async (req, res) => {
    const { actions, id } = req.params;

    try {
        const nhanvien = await NhanVienModel.findById(id);

        // cập nhật mới trạng thái block
        if (actions === 'unblock') {
            nhanvien.block = false;
        } else if (actions === 'block') {
            nhanvien.block = true;
        }else{
            return res.status(400).json({
                 msg:'Lỗi'
            })
        }
        const data = await nhanvien.save();
        if(data){
            return res.json({
                status:200,
                msg:`Đã ${actions} tài khoản này`
            })
        }else{
            return res.json({
                status:404,
                msg:`Lỗi khi ${actions}`
            })
        }
    } catch (error) {
        console.error(`Lỗi khi ${actions} nhân viên:`, error);
        res.status(500).json({ msg: `Lỗi khi ${actions} nhân viên` });
    }

})
module.exports = router;