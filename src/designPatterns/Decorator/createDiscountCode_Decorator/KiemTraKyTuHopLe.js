
class KiemTraKyTuHopLe {
    constructor(baseService) {
        this.baseService = baseService; // Lớp cơ bản hoặc Decorator khác
    }

    async createDiscountCode(newDiscountCode) {
        const { code } = newDiscountCode;

        // Kiểm tra nếu mã chứa khoảng trắng hoặc dấu
        const isValidCode = /^[a-zA-Z0-9]+$/.test(code);
        if (!isValidCode) {
            return { status: "NguyenMTK_ERR", message: "Mã giảm giá không được chứa dấu hoặc khoảng trắng!" };
        }

        // Gọi lớp cơ bản hoặc lớp Decorator khác
        return this.baseService.createDiscountCode(newDiscountCode);
    }
}

module.exports = KiemTraKyTuHopLe;