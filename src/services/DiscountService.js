const DiscountCode = require('../models/DiscountCodeModel');

// Các lớp Decorator cho tạo mã
const KiemTraDoDaiMa = require('../designPatterns/Decorator/createDiscountCode_Decorator/KiemTraDoDaiMa');
const KiemTraKyTuHopLe = require('../designPatterns/Decorator/createDiscountCode_Decorator/KiemTraKyTuHopLe');
const KiemTraMaTonTai = require('../designPatterns/Decorator/createDiscountCode_Decorator/KiemTraMaTonTai');

// Các lớp Decorator cho sửa mã
const KiemTraDoDaiMa_Update = require('../designPatterns/Decorator/updateDiscountCode_Decorator/KiemTraDoDaiMa');
const KiemTraKyTuHopLe_Update = require('../designPatterns/Decorator/updateDiscountCode_Decorator/KiemTraKyTuHopLe');
const KiemTraMaTonTai_Update = require('../designPatterns/Decorator/updateDiscountCode_Decorator/KiemTraMaTonTai');

// Các lớp Decorator cho sử dụng mã
//const DecoratorDiscount = require('../designPatterns/Decorator/useDiscountCode_Decorator/DecoratorDiscount');
const KiemTraMaGiamGia = require('../designPatterns/Decorator/useDiscountCode_Decorator/KiemTraMaTonTai');
const KiemTraSoLanSuDung = require('../designPatterns/Decorator/useDiscountCode_Decorator/KiemTraSoLanSuDung');
const GiamGiaTheoPhanTram = require('../designPatterns/Decorator/useDiscountCode_Decorator/GiamGiaTheoPhanTram');
const GiamGiaCoDinh = require('../designPatterns/Decorator/useDiscountCode_Decorator/GiamGiaCoDinh');



// Lớp cơ bản
class DiscountService {
  async createDiscountCode(newDiscountCode) {
      const discountCode = await DiscountCode.create(newDiscountCode);
      return { status: "NguyeMTK_OK", message: "Tạo mã giảm giá thành công!", data: discountCode };
  }

  async updateDiscountCode(code, updates) {
      const discountCode = await DiscountCode.findOneAndUpdate({ code }, updates, { new: true });
      if (!discountCode) {
          return { status: "NguyenMTK_ERR", message: "Mã giảm giá không tồn tại!" };
      }
      return { status: "NguyenMTK_OK", message: "Cập nhật mã giảm giá thành công!", data: discountCode };
  }

  async useDiscountCode(code, order, discountCode) {
      return { status: "NguyenMTK_OK", message: "Áp dụng mã giảm giá thành công!", order };
  }
}
// Tạo dịch vụ cho createDiscountCode
let createDiscountService = new DiscountService();
createDiscountService = new KiemTraDoDaiMa(createDiscountService);
createDiscountService = new KiemTraKyTuHopLe(createDiscountService);
createDiscountService = new KiemTraMaTonTai(createDiscountService);
// Tạo dịch vụ cho updateDiscountCode
let updateDiscountService = new DiscountService();
updateDiscountService = new KiemTraDoDaiMa_Update(updateDiscountService);
updateDiscountService = new KiemTraKyTuHopLe_Update(updateDiscountService);
updateDiscountService = new KiemTraMaTonTai_Update(updateDiscountService);

// Tạo dịch vụ cho useDiscountCode
let useDiscountService = new DiscountService();
useDiscountService = new KiemTraSoLanSuDung(useDiscountService);
useDiscountService = new GiamGiaTheoPhanTram(useDiscountService);
useDiscountService = new GiamGiaCoDinh(useDiscountService);
useDiscountService = new KiemTraMaGiamGia(useDiscountService);

// Tạo mã giảm giá
const createDiscountCode = async (newDiscountCode) => {
  return createDiscountService.createDiscountCode(newDiscountCode);
};

// Xem tất cả mã giảm giá
const getAllDiscountCodes = async () => {
  try {
    const discountCodes = await DiscountCode.find();
    return { status: "NguyemMTK_OK", message: "Lấy danh sách mã giảm giá thành công!", data: discountCodes };
  } catch (e) {
    throw { status: "NguyenMTK_ERR", message: e.message };
  }
};
// Xem chi tiết mã giảm giá
const getDiscountCode = async (code) => {
  try {
    const discountCode = await DiscountCode.findOne({ code });
    if (!discountCode) {
      return { status: "NguyenMTK_ERR", message: "Mã giảm giá không tồn tại!" };
    }
    // Kiểm tra số lần sử dụng
    if (discountCode.usedCount >= discountCode.maxUses) {
      return { status: "NguyenMTK_ERR", message: "Mã giảm giá đã hết số lần sử dụng!" };
    }
    return { status: "NguyenMTK_OK", message: "Lấy mã giảm giá thành công!", data: discountCode };
  } catch (e) {
    throw { status: "NguyenMTK_ERR", message: e.message };
  }
};
// // Sửa mã giảm giá
// const updateDiscountCode = async (code, updates) => {
//   try {
//     // Kiểm tra mã mới (nếu có) trước khi cập nhật
//     if (updates.code) {
//       // Kiểm tra độ dài của mã mới
//       if (updates.code.length > 10) {
//         return { status: "ERR", message: "Mã giảm giá không được quá 10 ký tự!" };
//       }

//       // Kiểm tra nếu mã chứa khoảng trắng hoặc dấu (chỉ cho phép chữ cái và số)
//       const isValidCode = /^[a-zA-Z0-9]+$/.test(updates.code);
//       if (!isValidCode) {
//         return { status: "ERR", message: "Mã giảm giá không được chứa dấu hoặc khoảng trắng!" };
//       }

//       // Kiểm tra nếu mã mới đã tồn tại trong hệ thống
//       const existingCode = await DiscountCode.findOne({ code: updates.code });
//       if (existingCode) {
//         return { status: "ERR", message: "Mã giảm giá đã tồn tại!" };
//       }
//     }

//     // Tiến hành cập nhật mã giảm giá nếu các điều kiện trên được thỏa mãn
//     const discountCode = await DiscountCode.findOneAndUpdate({ code }, updates, { new: true });
//     if (!discountCode) {
//       return { status: "ERR", message: "Mã giảm giá không tồn tại!" };
//     }

//     return { status: "OK", message: "Cập nhật mã giảm giá thành công!", data: discountCode };
//   } catch (e) {
//     throw { status: "ERR", message: e.message };
//   }
// };
 // Update mã giảm giá trên Decorator
const updateDiscountCode = async (code, updates) => {
  return updateDiscountService.updateDiscountCode(code, updates);
};

// Xóa mã giảm giá
const deleteDiscountCode = async (code) => {
  try {
    const discountCode = await DiscountCode.findOneAndDelete({ code });
    if (!discountCode) {
      return { status: "NguyenMTK_ERR", message: "Mã giảm giá không tồn tại!" };
    }
    return { status: "NguyenMTK_OK", message: "Xóa mã giảm giá thành công!" };
  } catch (e) {
    throw { status: "NguyenMTK_ERR", message: e.message };
  }
};

// const useDiscountCode = async (code, order) => {
//   try {
//     // Tìm mã giảm giá trong cơ sở dữ liệu
//     const discountCode = await DiscountCode.findOne({ code });
//     if (!discountCode) {
//       return { status: "ERR", message: "Mã giảm giá không tồn tại!", order };
//     }

//     // Khởi tạo lớp cơ bản
//     let discount = new DecoratorDiscount();

//     // Thêm kiểm tra mã giảm giá
//     discount = new KiemTraMaGiamGia(discount, discountCode);

//     // Thêm kiểm tra số lần sử dụng
//     discount = new KiemTraSoLanSuDung(discount, discountCode);

//     // Áp dụng giảm giá theo phần trăm (nếu có)
//     if (discountCode.type === 'percentage') {
//       discount = new GiamGiaTheoPhanTram(discount, discountCode.value);
//     }

//     // Áp dụng giảm giá cố định (nếu có)
//     if (discountCode.type === 'fixed') {
//       discount = new GiamGiaCoDinh(discount, discountCode.value);
//     }

//     // Áp dụng giảm giá
//     const result = discount.applyDiscount(order);

//     // Nếu áp dụng thành công, cập nhật số lần sử dụng mã giảm giá
//     if (result.status === "OK") {
//       discountCode.usedCount += 1;
//       await discountCode.save();
//     }

//     return result;
//   } catch (e) {
//     return { status: "ERR", message: e.message, order };
//   }
// };


// Sử dụng mã giảm giá dựa vào mẫu Decoractor
const useDiscountCode = async (code, order) => {
  const discountCode = await DiscountCode.findOne({ code });
  if (!discountCode) {
      return { status: "NguyenMTK_ERR", message: "Mã giảm giá không tồn tại!", order };
  }
  return useDiscountService.useDiscountCode(code, order, discountCode);
};

module.exports = {
  createDiscountCode,
  getAllDiscountCodes,
  getDiscountCode,
  updateDiscountCode,
  deleteDiscountCode,
  useDiscountCode
};
