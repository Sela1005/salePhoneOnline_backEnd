class KiemTraDoDaiMa {
    constructor(baseService) {
        this.baseService = baseService; // Lớp cơ bản hoặc Decorator khác
    }

    async updateDiscountCode(code, updates) {
        if (updates.code && updates.code.length > 10) {
            return { status: "NguyenMTK_ERR", message: "Mã giảm giá không được quá 10 ký tự!" };
        }

        // Gọi lớp cơ bản hoặc lớp Decorator khác
        return this.baseService.updateDiscountCode(code, updates);
    }
}

module.exports = KiemTraDoDaiMa;