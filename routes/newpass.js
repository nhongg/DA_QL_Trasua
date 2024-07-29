const express = require("express");
const router = express.Router();

const NhanVienModel = require("../model/nhanviens");

router.put('/:id', async (req,res) => {
    const {id} = req.params;
    const {oldPass, newPass} = req.body;
    const user = await NhanVienModel.findById(id);
    if(user != null){

        if(oldPass != user.password){
            return res
          .status(404)
          .json({ msg: "Mật khẩu không chính xác!" });
        }
 
        if(newPass == null || newPass == undefined){
            return res
          .status(403)
          .json({ msg: "Chưa nhập mật khẩu mới" });
        }

        const result = await NhanVienModel.findByIdAndUpdate(id,{password: newPass}, {new : true});
        if(result){
            return res
            .status(200)
            .json({ msg: "Đổi mật khẩu thành công, vui lòng đăng nhập lại" });
        }else{
            return res
            .status(404)
            .json({ msg: "Đổi mật khẩu không thành công" });
        } 
    }
})
module.exports = router;  