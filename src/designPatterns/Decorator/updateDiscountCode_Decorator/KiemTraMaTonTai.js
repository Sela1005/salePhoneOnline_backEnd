const DiscountCode = require('../../../models/DiscountCodeModel');


class KiemTraMaTonTai {
    constructor(baseService) {
        this.baseService = baseService; // Lớp cơ bản hoặc Decorator khác
    }

    async createDiscountCode(newDiscountCode) {
        const { code } = newDiscountCode;

        // Kiểm tra nếu mã đã tồn tại
        const existingCode = await DiscountCode.findOne({ code });
        if (existingCode) {
            return { status: "NguyenMTK_ERR", message: "Mã giảm giá đã tồn tại!" };
        }

        // Gọi lớp cơ bản hoặc lớp Decorator khác
        return this.baseService.createDiscountCode(newDiscountCode);
    }
}

module.exports = KiemTraMaTonTai;