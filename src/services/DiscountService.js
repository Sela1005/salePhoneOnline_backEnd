const DiscountCode = require('../models/DiscountCodeModel');

// Thêm mã giảm giá
const createDiscountCode = async (newDiscountCode) => {
  try {
    const { code } = newDiscountCode;
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

// Xem tất cả mã giảm giá
const getAllDiscountCodes = async () => {
  try {
    const discountCodes = await DiscountCode.find();
    return { status: "OK", message: "Lấy danh sách mã giảm giá thành công!", data: discountCodes };
  } catch (e) {
    throw { status: "ERR", message: e.message };
  }
};

// Xem chi tiết mã giảm giá
const getDiscountCode = async (code) => {
  try {
    const discountCode = await DiscountCode.findOne({ code });
    if (!discountCode) {
      return { status: "ERR", message: "Mã giảm giá không tồn tại!" };
    }
    return { status: "OK", message: "Lấy mã giảm giá thành công!", data: discountCode };
  } catch (e) {
    throw { status: "ERR", message: e.message };
  }
};

// Sửa mã giảm giá
const updateDiscountCode = async (code, updates) => {
  try {
    const discountCode = await DiscountCode.findOneAndUpdate({ code }, updates, { new: true });
    if (!discountCode) {
      return { status: "ERR", message: "Mã giảm giá không tồn tại!" };
    }
    return { status: "OK", message: "Cập nhật mã giảm giá thành công!", data: discountCode };
  } catch (e) {
    throw { status: "ERR", message: e.message };
  }
};

// Xóa mã giảm giá
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

// Sử dụng mã giảm giá
const useDiscountCode = async (code) => {
  try {
    const discountCode = await DiscountCode.findOne({ code });
    if (!discountCode) {
      return { status: "ERR", message: "Mã giảm giá không tồn tại!" };
    }
    if (discountCode.usedCount >= discountCode.maxUses) {
      return { status: "ERR", message: "Mã giảm giá đã hết số lần sử dụng!" };
    }
    discountCode.usedCount += 1;
    await discountCode.save();
    return { status: "OK", message: "Sử dụng mã giảm giá thành công!", data: discountCode };
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
  useDiscountCode
};
