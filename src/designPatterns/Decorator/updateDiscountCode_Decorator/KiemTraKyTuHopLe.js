class KiemTraKyTuHopLe {
    constructor(baseService) {
        this.baseService = baseService; // Lớp cơ bản hoặc Decorator khác
    }

    async updateDiscountCode(code, updates) {
        if (updates.code) {
            const isValidCode = /^[a-zA-Z0-9]+$/.test(updates.code);
            if (!isValidCode) {
                return { status: "NguyenMTK_ERR", message: "Mã giảm giá không được chứa dấu hoặc khoảng trắng!" };
            }
        }

        // Gọi lớp cơ bản hoặc lớp Decorator khác
        return this.baseService.updateDiscountCode(code, updates);
    }
}

module.exports = KiemTraKyTuHopLe;