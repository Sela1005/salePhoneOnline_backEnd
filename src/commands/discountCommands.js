// commands/discountCommands.js
const DiscountCode = require('../models/DiscountCodeModel');

class Command {
    async execute() {
        console.log('Method "execute" must be implemented');
        return;
    }
}

class ApplyDiscountCodeCommand extends Command {
    constructor(code) {
        super();
        this.code = code;        
        this.previousUsedCount = null; 
    }

    async execute() {
        const discountCode = await DiscountCode.findOne({ code: this.code });
        if (!discountCode) {
            console.log('Mã giảm giá không tồn tại!');
            return;
        }
        if (discountCode.usedCount >= discountCode.maxUses) {
            console.log('Mã giảm giá đã hết số lần sử dụng!');
            return;
        }
    
        // Lưu trạng thái trước khi thay đổi
        this.previousUsedCount = discountCode.usedCount;
    
        // Áp dụng mã giảm giá
        discountCode.usedCount += 1;
        await discountCode.save();
    
        return {
            discountCode,
            message: 'Áp dụng mã giảm giá thành công!',
        };
    }

    async undo() {
        if (this.previousUsedCount === null) {
            console.log('Không thể hủy vì chưa thực thi!');
            return; 
        }

        const discountCode = await DiscountCode.findOne({ code: this.code });
        if (discountCode) {
            discountCode.usedCount = this.previousUsedCount; // Khôi phục trạng thái
            await discountCode.save();
        }
    }
}

module.exports = { Command, ApplyDiscountCodeCommand };