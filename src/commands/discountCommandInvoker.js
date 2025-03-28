// commands/discountCommandInvoker.js
class DiscountCommandInvoker {
    constructor() {
        this.history = []; // Lưu lịch sử command
        this.currentIndex = -1; // Con trỏ chỉ đến hành động hiện tại (-1 nghĩa là chưa có hành động)
    }

    async executeCommand(command) {
        const result = await command.execute();
        // Nếu có hành động mới, xóa các hành động phía sau con trỏ (nếu có) và thêm hành động mới
        if (this.currentIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentIndex + 1);
        }
        this.history.push({ command, result });
        this.currentIndex += 1; // Di chuyển con trỏ lên
        return result;
    }

    async undoLastCommand() {
        if (this.currentIndex < 0) {
            console.log('Không có hành động nào để huỷ!');
            return; 
        }

        const lastAction = this.history[this.currentIndex];
        if (lastAction && lastAction.command.undo) {
            await lastAction.command.undo();
            this.currentIndex -= 1; // Lùi con trỏ về trước
            return { message: 'Đã hủy áp dụng mã giảm giá!' };
        }
        throw new Error('Không có hành động nào để hủy!');
    }

    async redoLastCommand() {
        if (this.currentIndex >= this.history.length - 1) {
            console.log('Không có hành động nào để thực thi lại!');
            return; 
        }

        const nextAction = this.history[this.currentIndex + 1];
        if (nextAction && nextAction.command.execute) {
            const result = await nextAction.command.execute();
            this.currentIndex += 1; // Tiến con trỏ lên
            return result;
        }
        console.log('Không có hành động nào để thực thi lại!');
        return; 
    }

    getHistory() {
        return this.history;
    }
}

module.exports = new DiscountCommandInvoker(); // Singleton instance