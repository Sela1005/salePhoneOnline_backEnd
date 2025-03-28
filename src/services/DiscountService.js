// services/DiscountService.js
const DiscountCode = require('../models/DiscountCodeModel');
const discountCommandInvoker = require('../commands/discountCommandInvoker');
const { ApplyDiscountCodeCommand } = require('../commands/discountCommands');

// Các hàm khác giữ nguyên
const createDiscountCode = async (newDiscountCode) => {
    try {
        const { code } = newDiscountCode;
        if (code.length > 10) {
            return { status: "ERR", message: "Mã giảm giá không được quá 10 ký tự!" };
        }
        const isValidCode = /^[a-zA-Z0-9]+$/.test(code);
        if (!isValidCode) {
            return { status: "ERR", message: "Mã giảm giá không được chứa dấu hoặc khoảng trắng!" };
        }
        const existingCode = await DiscountCode.findOne({ code });
        if (existingCode) {
            return { status: "ERR", message: "Mã giảm giá đã tồn tại!" };
        }
        const discountCode = await DiscountCode.create(newDiscountCode);
        return { status: "OK", message: "Tạo mã giảm giá thành công!", data: discountCode };
    } catch (e) {
        throw { status: "ERR", message: e.message };
    }
};

const getAllDiscountCodes = async () => {
    try {
        const discountCodes = await DiscountCode.find();
        return { status: "OK", message: "Lấy danh sách mã giảm giá thành công!", data: discountCodes };
    } catch (e) {
        throw { status: "ERR", message: e.message };
    }
};

const getDiscountCode = async (code) => {
    try {
        const discountCode = await DiscountCode.findOne({ code });
        if (!discountCode) {
            return { status: "ERR", message: "Mã giảm giá không tồn tại!" };
        }
        if (discountCode.usedCount >= discountCode.maxUses) {
            return { status: "ERR", message: "Mã giảm giá đã hết số lần sử dụng!" };
        }
        return { status: "OK", message: "Lấy mã giảm giá thành công!", data: discountCode };
    } catch (e) {
        throw { status: "ERR", message: e.message };
    }
};

const updateDiscountCode = async (code, updates) => {
    try {
        if (updates.code) {
            if (updates.code.length > 10) {
                return { status: "ERR", message: "Mã giảm giá không được quá 10 ký tự!" };
            }
            const isValidCode = /^[a-zA-Z0-9]+$/.test(updates.code);
            if (!isValidCode) {
                return { status: "ERR", message: "Mã giảm giá không được chứa dấu hoặc khoảng trắng!" };
            }
            const existingCode = await DiscountCode.findOne({ code: updates.code });
            if (existingCode) {
                return { status: "ERR", message: "Mã giảm giá đã tồn tại!" };
            }
        }
        const discountCode = await DiscountCode.findOneAndUpdate({ code }, updates, { new: true });
        if (!discountCode) {
            return { status: "ERR", message: "Mã giảm giá không tồn tại!" };
        }
        return { status: "OK", message: "Cập nhật mã giảm giá thành công!", data: discountCode };
    } catch (e) {
        throw { status: "ERR", message: e.message };
    }
};

const deleteDiscountCode = async (code) => {
    try {
        const discountCode = await DiscountCode.findOneAndDelete({ code });
        if (!discountCode) {
            return { status: "ERR", message: "Mã giảm giá không tồn tại!" };
        }
        return { status: "OK", message: "Xóa mã giảm giá thành công!" };
    } catch (e) {
        throw { status: "ERR", message: e.message };
    }
};

// Sử dụng mã giảm giá với Command
const useDiscountCode = async (userId, code, totalAmount) => {
    try {
        const command = new ApplyDiscountCodeCommand(userId, code, totalAmount);
        const result = await discountCommandInvoker.executeCommand(userId, command);
        if (result?.status === "ERR") {
            return result; // Trả về lỗi nếu có
        }
        return { status: "OK", ...result };
    } catch (e) {
        throw { status: "ERR", message: e.message };
    }
};

// Hủy áp dụng mã giảm giá
const undoDiscountCode = async (userId) => {
    try {
        const result = await discountCommandInvoker.undoLastCommand(userId);
        if (result?.status === "ERR") {
            return result; // Trả về lỗi nếu có
        }
        return { status: "OK", ...result };
    } catch (e) {
        throw { status: "ERR", message: e.message };
    }
};

// Thực thi lại mã giảm giá
const redoDiscountCode = async (userId) => {
    try {
        const result = await discountCommandInvoker.redoLastCommand(userId);
        if (result?.status === "ERR") {
            return result; // Trả về lỗi nếu có
        }
        return { status: "OK", ...result };
    } catch (e) {
        throw { status: "ERR", message: e.message };
    }
};

module.exports = {
    createDiscountCode,
    getAllDiscountCodes,
    getDiscountCode,
    updateDiscountCode,
    deleteDiscountCode,
    useDiscountCode,
    undoDiscountCode,
    redoDiscountCode,
};