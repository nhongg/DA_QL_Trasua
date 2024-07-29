const express = require('express');
const router = express.Router();

const HoadonModel = require('../model/hoadons');
const HoadonchitietModel = require('../model/hoadonchitiets');

router.get('/', (req, res) => {
    res.send('Thống kê doanh thu')
});

router.get('/doanhthu-thongso', async (req, res) => {

    const year = req.query.year || new Date().getFullYear();

    const hoadons = await HoadonModel.find();
    const hondonoks = await HoadonModel.find({ trangThai: 1 });
    const hondonfails = await HoadonModel.find({ trangThai: -1 });
    const hondonloads = await HoadonModel.find({ trangThai: 0 });
    const uniqueCustomers = {}; // Đối tượng để lưu trữ thông tin của khách hàng

    if (hoadons.length == 0) {
        return res.send('Không có hóa đơn nào');
    }

    let Tongtien = 0;
    let TongtienYear = 0;
    let TongSoKhachHang = 0;
    let TongHoaDon = hoadons.length;
    let TongHoaDonOK = hondonoks.length;
    let TongHoaDonFail = hondonfails.length;
    let TongHoaDonLoad = hondonloads.length;

    for (let hoadon of hondonoks) {
        Tongtien += hoadon.tongTien;
    }

    for (let hoadon of hoadons) {
        // Kiểm tra xem khách hàng đã tồn tại trong danh sách chưa
        if (!uniqueCustomers[hoadon.id_KhachHang]) {
            uniqueCustomers[hoadon.id_KhachHang] = true;
            TongSoKhachHang++; // Tăng số lượng khách hàng nếu chưa tồn tại
        }
    }

    // Thống kê theo tháng
    const hoadonsByMonth = await HoadonModel.aggregate([
        {
            $match: {
                trangThai: 1,  // Chỉ lấy các hóa đơn có trạng thái là 1
                createdAt: { $gte: new Date(year, 0, 1), $lt: new Date(year+1, 0, 1) } // Lấy các hóa đơn trong năm nhập vào
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" }, // Nhóm theo năm của ngày mua
                    month: { $month: "$createdAt" } // Nhóm theo tháng của ngày mua
                },
                TongTien: { $sum: "$tongTien" }, // Tổng số tiền
                TongSoKhachHang: { $addToSet: "$id_KhachHang" }, // Sử dụng $addToSet để đếm số lượng khách hàng duy nhất
                TongHoaDon: { $sum: 1 } // Đếm tổng số hóa đơn
            }
        },
        {
            $sort: { "_id.month": 1 } // Sắp xếp theo tháng tăng dần
        }
    ]);

    res.json({
        status: 200,
        masenge: "Đây là doanh thu",
        data: {
            Tongtien: Tongtien,
            TongSoKhachHang: TongSoKhachHang,
            TongHoaDon: TongHoaDon,
            TongHoaDonOK: TongHoaDonOK,
            TongHoaDonFail: TongHoaDonFail,
            TongHoaDonLoad: TongHoaDonLoad,
            ThongKeByMonth: hoadonsByMonth
        }
    });
});

router.get('/doanhthu-in-date', async (req, res) => {
    const { fromDate, toDate } = req.query;

    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    const createdAt = { createdAt: { $gte: startDate, $lte: endDate } };
    // $gte : lon hon hoac bang, $ge : lon hon
    // $lte : nho hon hoac bang, $le : nho hon

    const hoadons = await HoadonModel.find(createdAt, "_id Tongtien")
        .populate('id_NhanVien id_KhachHang')
        .sort({ quantity: -1 }) // giam dan : -1 , tang dan : 1 
        .skip(0) // bo qua so luong row

    if (hoadons.length == 0) {
        return res.send('Không có hóa đơn nào');
    }

    let Tongtien = 0;
    for (let hoadon of hoadons) {
        Tongtien += hoadon.tongTien;
    }

    res.json({
        status: 200,
        masenge: "Đây là doanh thu",
        data: Tongtien
    })
})

router.get('/doanhthu-in-month', async (req, res) => {
    // Lấy năm hiện tại hoặc năm được chỉ định trong yêu cầu
    const year = req.query.year || new Date().getFullYear();

    // Tạo mảng các promise để lấy doanh thu từng tháng trong năm
    const promises = [];
    for (let month = 0; month < 12; month++) {
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        const createdAt = {
            createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
            trangThai: 1
        };

        const promise = HoadonModel.aggregate([
            { $match: createdAt },
            { $group: { _id: null, totalRevenue: { $sum: "$tongTien" } } } // Sử dụng $group để tổng hợp tổng doanh thu của các hóa đơn trong tháng
        ]).exec();

        promises.push(promise);
    }

    // Chờ tất cả các promise hoàn thành
    const monthlyRevenues = await Promise.all(promises);

    res.json({
        status: 200,
        message: `Tổng doanh thu trong năm ${year} là`,
        data: monthlyRevenues
    });
});

module.exports = router;