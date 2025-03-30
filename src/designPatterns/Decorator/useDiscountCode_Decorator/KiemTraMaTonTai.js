const DiscountCode = require('../../../models/DiscountCodeModel');


class KiemTraMaTonTai {
    constructor(baseService) {
        this.baseService = baseService; // Lớp cơ bản hoặc Decorator khác
    }

    async useDiscountCode(code, order) {
        const discountCode = await DiscountCode.findOne({ code });
        if (!discountCode) {
            return { status: "NguyenMTk_ERR", message: "Mã giảm giá không tồn tại!", order };
        }

        // Gọi lớp cơ bản hoặc lớp Decorator khác
        return this.baseService.useDiscountCode(code, order, discountCode);
    }
}

module.exports = KiemTraMaTonTai;