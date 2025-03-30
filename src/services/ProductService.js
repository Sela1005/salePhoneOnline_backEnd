const Product = require("../models/ProductModel");


const productPrototype = {
  name: "",
  image: "",
  type: "",
  price: 0,
  countInStock: 0,
  rating: 0,
  description: "",
  screenSize: "",
  chipset: "",
  ram: "",
  storage: "",
  battery: "",
  screenResolution: "",
};


const cloneProduct = (overrides) => {
  return Object.assign({}, productPrototype, overrides);
};

const createProduct = (newProductInput) => {
  return new Promise(async (resolve, reject) => {
    const {
      name,
      image,
      type,
      price,
      countInStock,
      rating,
      description,
      screenSize,
      chipset,
      ram,
      storage,
      battery,
      screenResolution,
    } = newProductInput;

    try {
      const existingProduct = await Product.findOne({ name });
      if (existingProduct !== null) {
        resolve({
          status: "ERR",
          message: "Tên sản phẩm đã tồn tại!",
        });
        return;
      }

      if (isNaN(price) || price <= 0) {
        resolve({
          status: "ERR",
          message: "Giá sản phẩm phải là một số hợp lệ và lớn hơn 0.",
        });
        return;
      }
      if (isNaN(countInStock) || countInStock < 0) {
        resolve({
          status: "ERR",
          message: "Số lượng tồn kho phải là một số hợp lệ và không âm.",
        });
        return;
      }
      if (description && description.length <= 20) {
        resolve({
          status: "ERR",
          message: "Mô tả sản phẩm phải dài hơn 20 ký tự.",
        });
        return;
      }


      const productData = cloneProduct({
        name,
        image,
        type,
        price,
        countInStock: Number(countInStock),
        rating,
        description,
        screenSize,
        chipset,
        ram,
        storage,
        battery,
        screenResolution,
      });


      const createdProduct = await Product.create(productData);

      if (createdProduct) {
        resolve({
          status: "OK",
          message: "Thêm sản phẩm thành công!",
          data: createdProduct,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};


const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({ _id: id });
      if (checkProduct == null) {
        resolve({
          status: "ERR",
          message: "Sản phẩm không tồn tại.",
        });
        return;
      }
      const { price, countInStock, rating, description } = data;
      if (price !== undefined && (isNaN(price) || price <= 0)) {
        resolve({
          status: "ERR",
          message: "Giá sản phẩm phải là một số hợp lệ và lớn hơn 0.",
        });
        return;
      }
      if (countInStock !== undefined && (isNaN(countInStock) || countInStock < 0)) {
        resolve({
          status: "ERR",
          message: "Số lượng tồn kho phải là một số hợp lệ và không âm.",
        });
        return;
      }
      if (rating !== undefined && (isNaN(rating) || rating < 1 || rating > 5)) {
        resolve({
          status: "ERR",
          message: "Đánh giá phải là một số và trong khoảng từ 1 đến 5.",
        });
        return;
      }
      if (description !== undefined && description.length <= 20) {
        resolve({
          status: "ERR",
          message: "Mô tả sản phẩm phải dài hơn 20 ký tự.",
        });
        return;
      }
      const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });
      resolve({
        status: "OK",
        message: "Cập nhật sản phẩm thành công.",
        data: updatedProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({ _id: id });
      if (checkProduct == null) {
        resolve({
          status: "OK",
          message: "Không tìm thấy sản phẩm",
        });
        return;
      }
      await Product.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Xóa sản phẩm thành công!",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyProduct = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Product.deleteMany({ _id: ids });
      resolve({
        status: "OK",
        message: "Xóa sản phẩm thành công",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({ _id: id });
      if (product == null) {
        resolve({
          status: "OK",
          message: "Không tìm thấy sản phẩm",
        });
        return;
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: product,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProduct = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalProduct = await Product.countDocuments();
      let query = {};
      let sortObject = {};

      if (filter && Array.isArray(filter) && filter.length >= 2) {
        const label = filter[0];
        const value = filter[1];
        if (Object.keys(Product.schema.paths).includes(label)) {
          query[label] = { "$regex": new RegExp(value, "i") };
        }
      }
      if (sort) {
        const [field, order] = sort.split(",");
        if (Object.keys(Product.schema.paths).includes(field)) {
          sortObject[field] = order === "asc" ? 1 : -1;
        }
      }
      const allProducts = await Product.find(query)
        .limit(limit)
        .skip(page * limit)
        .sort(sortObject);
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: allProducts,
        total: totalProduct,
        pageCurrent: Number(page) + 1,
        totalPage: Math.ceil(totalProduct / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getProductsByPriceRange = (minPrice, maxPrice) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = {
        price: { $gte: minPrice, $lte: maxPrice },
      };
      const products = await Product.find(query);
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: products,
        total: products.length,
      });
    } catch (error) {
      reject({
        status: "ERROR",
        message: error.message,
      });
    }
  });
};

const getAllType = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allType = await Product.distinct("type");
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: allType,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailProduct,
  deleteProduct,
  getAllProduct,
  deleteManyProduct,
  getAllType,
  getProductsByPriceRange,
};
