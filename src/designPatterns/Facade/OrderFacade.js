// src/facades/OrderFacade.js
const OrderService = require('../services/OrderService');
const DiscountService = require('../services/DiscountService'); // nếu có
const EmailService = require('../services/EmailService'); // nếu có

class OrderFacade {
  static async datHang(orderData) {
    // Gọi service để tạo đơn hàng
    const result = await OrderService.createOrder(orderData);

    // Nếu thành công, gửi email xác nhận (nếu cần)
    if (result.status === 'NguyenMTK_OK') {
      try {
        await EmailService.sendOrderConfirmation(orderData.user, result.data);
      } catch (e) {
        console.log('[WARN] Không thể gửi email xác nhận:', e.message);
      }
    }

    return result;
  }

  static async chiTietDonHang(id) {
    return await OrderService.getOrderDetails(id);
  }

  static async danhSachTatCaDonHang() {
    return await OrderService.getAllOrder();
  }

  static async capNhatTrangThai(id, data) {
    return await OrderService.updateStatusOrder(id, data);
  }

  static async danhSachDonTheoUser(userId) {
    return await OrderService.getAllOrdersByUser(userId);
  }

  static async huyDon(orderId) {
    return await OrderService.cancelOrder(orderId);
  }

  static async tinhTongDoanhThu() {
    const total = await OrderService.calculateTotalRevenue();
    return {
      status: 'NguyenMTK_OK',
      message: 'Tổng doanh thu tính thành công',
      total
    };
  }

  static async tinhDoanhThuTheoThang(nam) {
    const data = await OrderService.calculateMonthlyRevenue(nam);
    return {
      status: 'NguyenMTK_OK',
      message: 'Doanh thu theo tháng tính thành công',
      data
    };
  }

  static async tinhDoanhThuTheoNam() {
    const data = await OrderService.calculateYearlyRevenue();
    return {
      status: 'NguyenMTK_OK',
      message: 'Doanh thu theo năm tính thành công',
      data
    };
  }
}

module.exports = OrderFacade;
