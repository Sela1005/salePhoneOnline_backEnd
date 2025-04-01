// src/controllers/OrderController.js
const OrderFacade = require('../facades/OrderFacade'); // ✅ Gọi Facade

// ✅ Đặt hàng - sử dụng Facade
const createOrder = async (req, res) => {
    try {
        const { paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone } = req.body;
        if (!paymentMethod || !itemsPrice || !shippingPrice || !totalPrice || !fullName || !address || !city || !phone) {
            return res.status(200).json({ status: 'Nguyen_ERR', message: 'The input is required' });
        }
        const response = await OrderFacade.datHang(req.body); // ✅ Gọi phương thức từ Facade
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({ message: e });
    }
};

// ✅ Lấy chi tiết đơn hàng
const getDetailOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!orderId) {
            return res.status(200).json({ status: 'Nguyen_ERR', message: 'The orderId is required' });
        }
        const response = await OrderFacade.layChiTietDonHang(orderId); // ✅ Dùng Facade
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({ message: e });
    }
};

// ✅ Lấy toàn bộ đơn hàng
const getAllOrder = async (req, res) => {
    try {
        const data = await OrderFacade.layTatCaDonHang(); // ✅ Gọi Facade
        return res.status(200).json(data);
    } catch (e) {
        return res.status(404).json({ message: e });
    }
};

// ✅ Cập nhật trạng thái đơn hàng
const updateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const data = req.body;
        if (!orderId) {
            return res.status(200).json({ status: 'Nguyen_ERR', message: 'The orderId is required' });
        }
        const response = await OrderFacade.capNhatTrangThaiDonHang(orderId, data); // ✅ Gọi Facade
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({ message: e });
    }
};

// ✅ Lấy đơn hàng theo người dùng
const getAllOrderByUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ status: 'Nguyen_ERR', message: 'The userId is required' });
        }
        const response = await OrderFacade.layDonHangTheoNguoiDung(userId); // ✅ Gọi Facade
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};

// ✅ Hủy đơn hàng
const cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!orderId) {
            return res.status(400).json({ status: 'Nguyen_ERR', message: 'Order ID is required' });
        }
        const response = await OrderFacade.huyDonHang(orderId); // ✅ Gọi Facade
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};

// ✅ Tổng doanh thu
const totalRevenue = async (req, res) => {
    try {
        const totalRevenue = await OrderFacade.tongDoanhThu(); // ✅ Gọi Facade
        res.json({ totalRevenue });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Doanh thu theo tháng
const monthlyRevenue = async (req, res) => {
    const { year } = req.params;
    try {
        const revenue = await OrderFacade.doanhThuTheoThang(parseInt(year)); // ✅ Gọi Facade
        res.json(revenue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Doanh thu theo năm
const yearlyRevenue = async (req, res) => {
    try {
        const revenue = await OrderFacade.doanhThuTheoNam(); // ✅ Gọi Facade
        res.json(revenue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getDetailOrder,
    getAllOrder,
    updateOrder,
    totalRevenue,
    yearlyRevenue,
    monthlyRevenue,
    getAllOrderByUser,
    cancelOrder
};