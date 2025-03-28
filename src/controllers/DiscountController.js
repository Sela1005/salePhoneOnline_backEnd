// controllers/DiscountController.js
const DiscountCodeService = require('../services/DiscountService');

const createDiscountCode = async (req, res) => {
    try {
        const response = await DiscountCodeService.createDiscountCode(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json(e);
    }
};

const getAllDiscountCodes = async (req, res) => {
    try {
        const response = await DiscountCodeService.getAllDiscountCodes();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json(e);
    }
};

const getDiscountCode = async (req, res) => {
    try {
        const { code } = req.params;
        const response = await DiscountCodeService.getDiscountCode(code);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json(e);
    }
};

const updateDiscountCode = async (req, res) => {
    try {
        const { code } = req.params;
        const updates = req.body;
        const response = await DiscountCodeService.updateDiscountCode(code, updates);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json(e);
    }
};

const deleteDiscountCode = async (req, res) => {
    try {
        const { code } = req.params;
        const response = await DiscountCodeService.deleteDiscountCode(code);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json(e);
    }
};

const useDiscountCode = async (req, res) => {
    try {
        const { code } = req.params;
        const { totalAmount } = req.body;
        const userId = req.user?.id; // Lấy userId từ token qua authMiddleware
        if (!userId) {
            return res.status(401).json({ status: "ERR", message: "Không tìm thấy userId!" });
        }
        const response = await DiscountCodeService.useDiscountCode(userId, code, totalAmount);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json(e);
    }
};

const undoDiscountCode = async (req, res) => {
    try {
        const userId = req.user?.id; // Lấy userId từ token
        if (!userId) {
            return res.status(401).json({ status: "ERR", message: "Không tìm thấy userId!" });
        }
        const response = await DiscountCodeService.undoDiscountCode(userId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json(e);
    }
};

const redoDiscountCode = async (req, res) => {
    try {
        const userId = req.user?.id; // Lấy userId từ token
        if (!userId) {
            return res.status(401).json({ status: "ERR", message: "Không tìm thấy userId!" });
        }
        const response = await DiscountCodeService.redoDiscountCode(userId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json(e);
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