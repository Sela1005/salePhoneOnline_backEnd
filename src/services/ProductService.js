const Product = require("../models/ProductModel")
const ProductRepository = require("../repository/ProductRepository");
const productRepository = new ProductRepository(Product);


const createProduct = (newProduct) => {
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
        } = newProduct;

        try {
            // Kiểm tra tên sản phẩm đã tồn tại
            const checkProduct = await productRepository.findByName(name);
            if (checkProduct !== null) {
                resolve({
                    status: "ERR",
                    message: "Tên sản phẩm đã tồn tại!",
                });
                return;
            }

            // Kiểm tra các điều kiện cơ bản
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

            // Tạo sản phẩm mới
            const createdProduct = await productRepository.create({
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
            // Kiểm tra sản phẩm có tồn tại không
            const checkProduct = await productRepository.findById(id);
            if (!checkProduct) {
                resolve({
                    status: "ERR",
                    message: "Sản phẩm không tồn tại.",
                });
                return;
            }

            // Kiểm tra các điều kiện dữ liệu
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

            // Cập nhật sản phẩm
            const updatedProduct = await productRepository.update(id, data);
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
            const checkProduct = await productRepository.findById(id);
            if (!checkProduct) {
                resolve({
                    status: "OK",
                    message: "Không tìm thấy sản phẩm",
                });
                return;
            }

            await productRepository.delete(id);
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
            await productRepository.deleteMany(ids);
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
            const product = await productRepository.findById(id);
            if (!product) {
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
            let query = {};
            let sortObject = {};

            // Xử lý filter nếu có
            if (filter && Array.isArray(filter) && filter.length >= 2) {
                const label = filter[0];
                const value = filter[1];
                if (Object.keys(Product.schema.paths).includes(label)) {
                    query[label] = { $regex: new RegExp(value, "i") };
                }
            }

            // Xử lý sort nếu có
            if (sort) {
                const [field, order] = sort.split(",");
                if (Object.keys(Product.schema.paths).includes(field)) {
                    sortObject[field] = order === "asc" ? 1 : -1;
                }
            }

            const skip = page * limit;
            const allProducts = await productRepository.findWithFiltersAndPagination(
                query,
                limit,
                skip,
                sortObject
            );
            const totalProduct = await productRepository.countDocuments(query);

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
            const products = await productRepository.findByPriceRange(minPrice, maxPrice);
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: products,
                total: products.length,
            });
        } catch (e) {
            reject({
                status: "ERROR",
                message: e.message,
            });
        }
    });
};

const getAllType = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allType = await productRepository.getAllTypes();
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