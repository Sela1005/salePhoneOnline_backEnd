class ProductRepository {
    constructor(ProductModel) {
        this.ProductModel = ProductModel;
    }

    // Tạo sản phẩm mới
    async create(productData) {
        return this.ProductModel.create(productData);
    }

    // Tìm sản phẩm theo ID
    async findById(id) {
        return this.ProductModel.findOne({ _id: id });
    }

    // Tìm sản phẩm theo tên
    async findByName(name) {
        return this.ProductModel.findOne({ name });
    }

    // Lấy tất cả sản phẩm với bộ lọc, phân trang và sắp xếp
    async findWithFiltersAndPagination(query, limit, skip, sort) {
        return this.ProductModel.find(query)
            .limit(limit)
            .skip(skip)
            .sort(sort);
    }

    // Đếm số lượng sản phẩm theo điều kiện
    async countDocuments(query = {}) {
        return this.ProductModel.countDocuments(query);
    }

    // Cập nhật sản phẩm
    async update(id, data) {
        return this.ProductModel.findOneAndUpdate({ _id: id }, data, { new: true });
    }

    // Xóa một sản phẩm
    async delete(id) {
        return this.ProductModel.deleteOne({ _id: id });
    }

    // Xóa nhiều sản phẩm
    async deleteMany(ids) {
        return this.ProductModel.deleteMany({ _id: { $in: ids } });
    }

    // Lấy danh sách các loại sản phẩm (type) duy nhất
    async getAllTypes() {
        return this.ProductModel.distinct('type');
    }

    // Lấy sản phẩm theo khoảng giá
    async findByPriceRange(minPrice, maxPrice) {
        return this.ProductModel.find({
            price: { $gte: minPrice, $lte: maxPrice }
        });
    }
}

module.exports = ProductRepository;