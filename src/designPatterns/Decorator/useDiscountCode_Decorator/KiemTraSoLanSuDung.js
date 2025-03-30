class KiemTraSoLanSuDung {
    constructor(baseService) {
        this.baseService = baseService; // Lớp cơ bản hoặc Decorator khác
    }

    async useDiscountCode(code, order, discountCode) {
        if (discountCode.usedCount >= discountCode.maxUses) {
            return { status: "NguyenMTK_ERR", message: "Mã giảm giá đã hết số lần sử dụng!", order };
        }

        // Gọi lớp cơ bản hoặc lớp Decorator khác
        return this.baseService.useDiscountCode(code, order, discountCode);
    }
}

module.exports = KiemTraSoLanSuDung;