class KiemTraDoDaiMa {
    constructor(baseService) {
        this.baseService = baseService; // Lớp cơ bản hoặc Decorator khác
    }

    async createDiscountCode(newDiscountCode) {
        const { code } = newDiscountCode;

        // Kiểm tra độ dài của mã giảm giá
        if (code.length > 10) {
            return { status: "NguyenMTK_ERR", message: "Mã giảm giá không được quá 10 ký tự!" };
        }

        // Gọi lớp cơ bản hoặc lớp Decorator khác
        return this.baseService.createDiscountCode(newDiscountCode);
    }
}

module.exports = KiemTraDoDaiMa;