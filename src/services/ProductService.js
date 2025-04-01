// const Product = require('../models/ProductModel');
// const TrinhKiemTraSanPham = require('../StrategySanPham/TrinhKiemTraSanPham');
// const KiemTraTenTrung = require('../StrategySanPham/KiemTraTenTrung');
// const KiemTraGiaHopLe = require('../StrategySanPham/KiemTraGiaHopLe');
// const KiemTraTonKho = require('../StrategySanPham/KiemTraTonKho');
// const KiemTraMoTa = require('../StrategySanPham/KiemTraMoTa');

// const createProduct = async (newProduct) => {
//     try {
//       const trinh = new TrinhKiemTraSanPham();
//       trinh.themChienLuoc(new KiemTraTenTrung());
//       trinh.themChienLuoc(new KiemTraGiaHopLe());
//       trinh.themChienLuoc(new KiemTraTonKho());
//       trinh.themChienLuoc(new KiemTraMoTa());
  
//       const loi = await trinh.kiemTraTatCa(newProduct, false);
//       if (loi) return loi;
  
//       const product = await Product.create(newProduct);
//       return {
//         status: 'NguyenMTK_OK',
//         message: 'Thêm sản phẩm thành công!',
//         data: product
//       };
//     } catch (e) {
//       throw e;
//     }
//   };



//   const updateProduct = async (id, data) => {
//     try {
//       const product = await Product.findById(id);
//       if (!product) {
//         return { status: 'ERR', message: 'Sản phẩm không tồn tại.' };
//       }
  
//       const trinh = new TrinhKiemTraSanPham();
//       trinh.themChienLuoc(new KiemTraGiaHopLe());
//       trinh.themChienLuoc(new KiemTraTonKho());
//       trinh.themChienLuoc(new KiemTraMoTa());
  
//       const loi = await trinh.kiemTraTatCa(data, true); // ⚠️ update = true
//       if (loi) return loi;
  
//       const updated = await Product.findByIdAndUpdate(id, data, { new: true });
//       return {
//         status: 'NguyenMTK_OK',
//         message: 'Cập nhật sản phẩm thành công!',
//         data: updated
//       };
//     } catch (e) {
//       throw e;
//     }
//   };



// const deleteProduct = (id) => {
//     return new Promise( async (resolve, reject) => {
//         try {
//             const checkProduct = await Product.findOne({
//                 _id: id

//             })
//            if(checkProduct == null) {
//                 resolve({
//                     status: "OK",
//                     message: "Không tìm thấy sản phẩm"
//                 })
//            }
           
//            await Product.findByIdAndDelete(id)
//             resolve({
//                 status: "OK",
//                 message: "Xóa sản phẩm thành công!",
//                 })
//         } catch (e) {
//             reject(e)
//         }
//     })
// }

// const deleteManyProduct = (ids) => {
//     return new Promise( async (resolve, reject) => {
//         try {
           
//            await Product.deleteMany({_id: ids})
//             resolve({
//                 status: "OK",
//                 message: "Xóa sản phẩm thành công",
//                 })
//         } catch (e) {
//             reject(e)
//         }
//     })
// }

// const getDetailProduct  = (id) => {
//     return new Promise( async (resolve, reject) => {
//         try {
//             const product = await Product.findOne({
//                 _id: id

//             })
//            if(product == null) {
//                 resolve({
//                     status: "NguyenMTK_OK",
//                     message: "Không tìm thấy sản phẩm"
//                 })
//            }
           
//             resolve({
//                 status: "NguyenMTK_OK",
//                 message: "SUCCESS",
//                 data: product
//                 })
//         } catch (e) {
//             reject(e)
//         }
//     })
// }
 
// const getAllProduct = (limit, page, sort, filter) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const totalProduct = await Product.countDocuments();
            
//             // Khởi tạo truy vấn cơ bản
//             let query = {};
//             let sortObject = {};

//             // Xử lý filter nếu có
//             if (filter && Array.isArray(filter) && filter.length >= 2) {
//                 const label = filter[0];
//                 const value = filter[1];
                
//                 // Kiểm tra trường có trong mô hình hay không
//                 if (Object.keys(Product.schema.paths).includes(label)) {
//                     query[label] = { '$regex': new RegExp(value, 'i') }; // Sử dụng regex không phân biệt chữ hoa chữ thường
//                 }
//             }

//             // Xử lý sort nếu có
//             if (sort) {
//                 const [field, order] = sort.split(','); // Tách field và order từ sort query
//                 if (Object.keys(Product.schema.paths).includes(field)) {
//                     sortObject[field] = order === 'asc' ? 1 : -1; // 'asc' thành 1, 'desc' thành -1
//                 }
//             }

//             // Lấy dữ liệu sản phẩm với các tùy chọn limit, skip, sort và filter
//             const allProducts = await Product.find(query)
//                 .limit(limit)
//                 .skip(page * limit)
//                 .sort(sortObject);

//             resolve({
//                 status: "OK",
//                 message: "SUCCESS",
//                 data: allProducts,
//                 total: totalProduct,
//                 pageCurrent: Number(page) + 1,
//                 totalPage: Math.ceil(totalProduct / limit)
//             });

//         } catch (e) {
//             reject(e);
//         }
//     });
// };
// const getProductsByPriceRange = (minPrice, maxPrice) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             // Điều kiện lọc theo khoảng giá
//             const query = {
//                 price: { $gte: minPrice, $lte: maxPrice }
//             };

//             // Lấy danh sách sản phẩm
//             const products = await Product.find(query);

//             resolve({
//                 status: "OK",
//                 message: "SUCCESS",
//                 data: products,
//                 total: products.length // Tổng số sản phẩm trả về
//             });

//         } catch (error) {
//             reject({
//                 status: "ERROR",
//                 message: error.message
//             });
//         }
//     });
// };






// const getAllType = () => {
//     return new Promise( async (resolve, reject) => {
//         try {

//            const allType = await Product.distinct('type')
//             resolve({
//                 status: "OK",
//                 message: "SUCCESS",
//                 data: allType,
//                 })
//         } catch (e) {
//             reject(e)
//         }
//     })
// }



// module.exports = {
//     createProduct,
//     updateProduct,
//     getDetailProduct,
//     deleteProduct,
//     getAllProduct,
//     deleteManyProduct,
//     getAllType,
//     getProductsByPriceRange
// }




// src/services/ProductService.js
const Product = require('../models/ProductModel');

// Giao diện kiểm tra sản phẩm
class IKiemTra {
  async kiemTra(sanPham, isUpdate = false) {
    throw new Error("Phải override phương thức kiemTra");
  }
}

// Giao diện chiến lược truy vấn sản phẩm
class ITruyVanSanPham {
  apDung(queryBuilder) {
    throw new Error("Phải override phương thức apDung");
  }
}

// Chiến lược kiểm tra sản phẩm
const TrinhKiemTraSanPham = require('../designPatterns/Strategy/TrinhKiemTraSanPham');
const KiemTraTenTrung = require('../designPatterns/Strategy/KiemTraTenTrung');
const KiemTraGiaHopLe = require('../designPatterns/Strategy/KiemTraGiaHopLe');
const KiemTraTonKho = require('../designPatterns/Strategy/KiemTraTonKho');
const KiemTraMoTa = require('../designPatterns/Strategy/KiemTraMoTa');

// Chiến lược truy vấn sản phẩm
const TrinhTruyVanSanPham = require('../designPatterns/Strategy/TrinhTruyVanSanPham');
const ChienLuocLocTheoTruong = require('../designPatterns/Strategy/ChienLuocLocTheoTruong');
const ChienLuocSapXepTheoTruong = require('../designPatterns/Strategy/ChienLuocSapXepTheoTruong');
const ChienLuocLocTheoKhoangGia = require('../designPatterns/Strategy/ChienLuocLocTheoKhoangGia');

const createProduct = async (newProduct) => {
  try {
    const trinh = new TrinhKiemTraSanPham();
    trinh.themChienLuoc(new KiemTraTenTrung());
    trinh.themChienLuoc(new KiemTraGiaHopLe());
    trinh.themChienLuoc(new KiemTraTonKho());
    trinh.themChienLuoc(new KiemTraMoTa());

    const loi = await trinh.kiemTraTatCa(newProduct);
    if (loi) return loi;

    const product = await Product.create(newProduct);
    return {
      status: 'NguyenMTK_OK',
      message: 'Thêm sản phẩm thành công!',
      data: product
    };
  } catch (e) {
    throw e;
  }
};

const updateProduct = async (id, data) => {
  try {
    const product = await Product.findById(id);
    if (!product) {
      return { status: 'NguyenMTK_ERR', message: 'Sản phẩm không tồn tại.' };
    }

    const trinh = new TrinhKiemTraSanPham();
    trinh.themChienLuoc(new KiemTraGiaHopLe());
    trinh.themChienLuoc(new KiemTraTonKho());
    trinh.themChienLuoc(new KiemTraMoTa());

    const loi = await trinh.kiemTraTatCa(data, true);
    if (loi) return loi;

    const updated = await Product.findByIdAndUpdate(id, data, { new: true });
    return {
      status: 'NguyenMTK_OK',
      message: 'Cập nhật sản phẩm thành công!',
      data: updated
    };
  } catch (e) {
    throw e;
  }
};

const deleteProduct = async (id) => {
  try {
    const checkProduct = await Product.findById(id);
    if (!checkProduct) {
      return { status: 'NguyenMTK_OK', message: 'Không tìm thấy sản phẩm' };
    }
    await Product.findByIdAndDelete(id);
    return { status: 'NguyenMTK_OK', message: 'Xóa sản phẩm thành công!' };
  } catch (e) {
    throw e;
  }
};

const deleteManyProduct = async (ids) => {
  try {
    await Product.deleteMany({ _id: ids });
    return { status: 'NguyenMTK_OK', message: 'Xóa sản phẩm thành công' };
  } catch (e) {
    throw e;
  }
};

const getDetailProduct = async (id) => {
  try {
    const product = await Product.findById(id);
    if (!product) {
      return { status: 'NguyenMTK_OK', message: 'Không tìm thấy sản phẩm' };
    }
    return {
      status: 'NguyenMTK_OK',
      message: 'SUCCESS',
      data: product
    };
  } catch (e) {
    throw e;
  }
};

const getAllProduct = async (limit, page, sort, filter) => {
  try {
    const totalProduct = await Product.countDocuments();
    const trinh = new TrinhTruyVanSanPham();

    if (filter && Array.isArray(filter) && filter.length >= 2) {
      trinh.themChienLuoc(new ChienLuocLocTheoTruong(filter[0], filter[1]));
    }

    if (sort) {
      const [field, order] = sort.split(',');
      trinh.themChienLuoc(new ChienLuocSapXepTheoTruong(field, order));
    }

    const { query, sort: sortObject } = trinh.apDungTatCa();
    const allProducts = await Product.find(query)
      .limit(limit)
      .skip(page * limit)
      .sort(sortObject);

    return {
      status: "NguyenMTK_OK",
      message: "SUCCESS",
      data: allProducts,
      total: totalProduct,
      pageCurrent: Number(page) + 1,
      totalPage: Math.ceil(totalProduct / limit)
    };
  } catch (e) {
    throw e;
  }
};

const getProductsByPriceRange = async (minPrice, maxPrice) => {
  try {
    const trinh = new TrinhTruyVanSanPham();
    trinh.themChienLuoc(new ChienLuocLocTheoKhoangGia(minPrice, maxPrice));
    const { query } = trinh.apDungTatCa();
    const products = await Product.find(query);

    return {
      status: 'NguyenMTK_OK',
      message: 'SUCCESS',
      data: products,
      total: products.length
    };
  } catch (e) {
    throw {
      status: 'NguyenMTK_ERROR',
      message: e.message
    };
  }
};

const getAllType = async () => {
  try {
    const allType = await Product.distinct('type');
    return {
      status: "Nguyen_OK",
      message: "SUCCESS",
      data: allType
    };
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailProduct,
  deleteProduct,
  getAllProduct,
  deleteManyProduct,
  getAllType,
  getProductsByPriceRange
};
