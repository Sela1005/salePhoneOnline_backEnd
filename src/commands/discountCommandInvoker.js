// commands/discountCommandInvoker.js
class DiscountCommandInvoker {
    constructor() {
        this.histories = new Map(); // Lưu lịch sử theo userId
    }

    // Lấy hoặc tạo lịch sử cho userId
    getUserHistory(userId) {
        if (!this.histories.has(userId)) {
            this.histories.set(userId, { actions: [], currentIndex: -1 });
        }
        return this.histories.get(userId);
    }

    async executeCommand(userId, command) {
        const userHistory = this.getUserHistory(userId);
        const result = await command.execute();

        // Xóa các hành động phía sau nếu thêm hành động mới
        if (userHistory.currentIndex < userHistory.actions.length - 1) {
            userHistory.actions = userHistory.actions.slice(0, userHistory.currentIndex + 1);
        }
        userHistory.actions.push({ command, result });
        userHistory.currentIndex += 1;

        console.log(`User ${userId} - History:`, userHistory.actions, 'Index:', userHistory.currentIndex);
        return result;
    }

    async undoLastCommand(userId) {
        const userHistory = this.getUserHistory(userId);
        if (userHistory.currentIndex < 0) {
            console.log(`User ${userId} - Không có hành động nào để hủy!`);
            return { status: "ERR", message: "Không có hành động nào để hủy!" };
        }

        const lastAction = userHistory.actions[userHistory.currentIndex];
        if (lastAction && lastAction.command.undo) {
            await lastAction.command.undo();
            userHistory.currentIndex -= 1;
            console.log(`User ${userId} - Sau undo:`, userHistory.actions, 'Index:', userHistory.currentIndex);
            return { message: 'Đã hủy áp dụng mã giảm giá!' };
        }
        throw new Error('Không có hành động nào để hủy!');
    }

    async redoLastCommand(userId) {
        const userHistory = this.getUserHistory(userId);
        if (userHistory.currentIndex >= userHistory.actions.length - 1) {
            console.log(`User ${userId} - Không có hành động nào để thực thi lại!`);
            return { status: "ERR", message: "Không có hành động nào để thực thi lại!" };
        }

        const nextAction = userHistory.actions[userHistory.currentIndex + 1];
        if (nextAction && nextAction.command.execute) {
            const result = await nextAction.command.execute();
            userHistory.currentIndex += 1;
            console.log(`User ${userId} - Sau redo:`, userHistory.actions, 'Index:', userHistory.currentIndex);
            return result;
        }
        console.log(`User ${userId} - Không có hành động nào để thực thi lại!`);
        return { status: "ERR", message: "Không có hành động nào để thực thi lại!" };
    }

    getHistory(userId) {
        return this.getUserHistory(userId).actions;
    }
}

module.exports = new DiscountCommandInvoker();