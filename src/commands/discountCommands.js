// commands/discountCommands.js
const DiscountCode = require('../models/DiscountCodeModel');

class Command {
    async execute() {
        console.log('Method "execute" must be implemented');
        return;
    }
}

class ApplyDiscountCodeCommand extends Command {
    constructor(userId, code, totalAmount) {
        super();
        this.userId = userId;       // ID người dùng
        this.code = code;           // Mã giảm giá
        this.totalAmount = totalAmount; // Tổng tiền trước khi giảm
        this.previousUsedCount = null;  // Trạng thái trước khi thực thi
    }

    async execute() {
        const discountCode = await DiscountCode.findOne({ code: this.code });
        if (!discountCode) {
            console.log('Mã giảm giá không tồn tại!');
            return { status: "ERR", message: "Mã giảm giá không tồn tại!" };
        }
        if (discountCode.usedCount >= discountCode.maxUses) {
            console.log('Mã giảm giá đã hết số lần sử dụng!');
            return { status: "ERR", message: "Mã giảm giá đã hết số lần sử dụng!" };
        }

        this.previousUsedCount = discountCode.usedCount;
        discountCode.usedCount += 1;
        await discountCode.save();

        const discountAmount = this.totalAmount * (discountCode.discountPercentage / 100);
        const newTotal = this.totalAmount - discountAmount;

        return {
            discountCode,
            discountAmount,
            newTotal,
            message: 'Áp dụng mã giảm giá thành công!',
        };
    }

    async undo() {
        if (this.previousUsedCount === null) {
            console.log('Không thể hủy vì chưa thực thi!');
            return { status: "ERR", message: "Không thể hủy vì chưa thực thi!" };
        }

        const discountCode = await DiscountCode.findOne({ code: this.code });
        if (discountCode) {
            discountCode.usedCount = this.previousUsedCount;
            await discountCode.save();
            return { message: 'Đã hủy áp dụng mã giảm giá!' };
        }
    }
}

module.exports = { Command, ApplyDiscountCodeCommand };