// Lớp OrderBuilder giúp xây dựng đối tượng Order theo từng bước
class OrderBuilder {
    constructor() {
        // Khởi tạo đối tượng order rỗng
        this.order = {};
    }

    // Thiết lập danh sách sản phẩm trong đơn hàng
    setOrderItems(orderItems) {
        this.order.orderItems = orderItems;
        return this; // Trả về chính đối tượng OrderBuilder để có thể gọi phương thức khác liên tiếp
    }

    // Thiết lập địa chỉ giao hàng
    setShippingAddress(fullName, address, city, phone) {
        this.order.shippingAddress = { fullName, address, city, phone };
        return this;
    }

    // Thiết lập phương thức thanh toán
    setPaymentMethod(paymentMethod) {
        this.order.paymentMethod = paymentMethod;
        return this;
    }

    // Thiết lập giá của các sản phẩm
    setItemsPrice(itemsPrice) {
        this.order.itemsPrice = itemsPrice;
        return this;
    }

    // Thiết lập giá vận chuyển
    setShippingPrice(shippingPrice) {
        this.order.shippingPrice = shippingPrice;
        return this;
    }

    // Thiết lập mã giảm giá
    setDiscountCode(discountCode) {
        this.order.discountCode = discountCode;
        return this;
    }

    // Thiết lập phần trăm giảm giá
    setDiscountPercentage(discountPercentage) {
        this.order.discountPercentage = discountPercentage;
        return this;
    }

    // Thiết lập tổng giá trị đơn hàng
    setTotalPrice(totalPrice) {
        this.order.totalPrice = totalPrice;
        return this;
    }

    // Thiết lập người dùng đặt hàng
    setUser(user) {
        this.order.user = user;
        return this;
    }

    // Thiết lập trạng thái thanh toán
    setIsPaid(isPaid) {
        this.order.isPaid = isPaid;
        return this;
    }

    // Thiết lập thời gian thanh toán
    setPaidAt(paidAt) {
        this.order.paidAt = paidAt;
        return this;
    }

    // Phương thức build() trả về đối tượng order đã được xây dựng
    build() {
        return this.order;
    }
}

// Xuất lớp OrderBuilder để sử dụng ở nơi khác
module.exports = OrderBuilder; 
module.exports = OrderBuilder; 

 
    