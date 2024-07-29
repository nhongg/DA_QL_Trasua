const express = require("express");
const router = express.Router();

const NhanVienModel = require("../model/nhanviens");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    res.status(401).json({ msg: "Chưa nhập username" });
  } else {
    try {
      const nhanvien = await NhanVienModel.findOne({ username: username });
      if (!nhanvien) {
        return res
          .status(404)
          .json({ msg: "Không tìm thấy username người dùng" });
      } else {
        if (nhanvien.password != password) {
          return res.status(404).json({ msg: "Password chưa đúng" });
        }
        nhanvien.password = null;
        return res.json({
          status: 200,
          msg: "Login success",
          data: nhanvien,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Lỗi server");
    }
  }
});

module.exports = router;
