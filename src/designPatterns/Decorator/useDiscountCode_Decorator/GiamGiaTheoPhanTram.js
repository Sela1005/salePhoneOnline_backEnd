class GiamGiaTheoPhanTram {
    constructor(baseService) {
        this.baseService = baseService; // Lớp cơ bản hoặc Decorator khác
    }

    async useDiscountCode(code, order, discountCode) {
        const result = await this.baseService.useDiscountCode(code, order, discountCode);

        if (result.status === "NguyenMTK_OK" && discountCode.type === "percentage") {
            const discountAmount = (order.tongTien * discountCode.value) / 100;
            order.tongTien -= discountAmount;

            // Kiểm tra tổng tiền không âm
            if (order.tongTien < 0) {
                order.tongTien = 0;
            }

            result.message = `Áp dụng giảm giá ${discountCode.value}% thành công!`;
        }

        return result;
    }
}

module.exports = GiamGiaTheoPhanTram;