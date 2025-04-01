const ProductService = require('../services/ProductService');

const createProduct = async (req, res) => {
  try {
    const response = await ProductService.createProduct(req.body);

    if (response.status === 'NguyenMTK_ERR') {
      return res.status(400).json(response);
    }

    return res.status(201).json(response);
  } catch (e) {
    return res.status(500).json({ status: "Nguyen_ERROR", message: e.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).json({
        status: "NguyenMTK_ERR",
        message: "Không tìm thấy ID sản phẩm"
      });
    }

    const response = await ProductService.updateProduct(productId, req.body);

    if (response.status === 'NguyenMTK_ERR') {
      return res.status(400).json(response);
    }

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ status: "Nguyen_ERROR", message: e.message });
  }
};

const getDetailProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).json({
        status: "NguyenMTK_ERR",
        message: "Không tìm thấy ID sản phẩm"
      });
    }

    const response = await ProductService.getDetailProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ status: "Nguyen_ERROR", message: e.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).json({
        status: "NguyenMTK_ERR",
        message: "Không tìm thấy ID sản phẩm"
      });
    }

    const response = await ProductService.deleteProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ status: "Nguyen_ERROR", message: e.message });
  }
};

const deleteMany = async (req, res) => {
  try {
    const ids = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        status: "NguyenMTK_ERR",
        message: "Danh sách ID không hợp lệ"
      });
    }

    const response = await ProductService.deleteManyProduct(ids);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ status: "Nguyen_ERROR", message: e.message });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;

    const response = await ProductService.getAllProduct(
      Number(limit) || 8,
      Number(page) || 0,
      sort,
      filter
    );

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ status: "Nguyen_ERROR", message: e.message });
  }
};

const getProductsByPriceRange = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;

    if (!minPrice || !maxPrice) {
      return res.status(400).json({
        status: "NguyenMTK_ERR",
        message: "Vui lòng cung cấp minPrice và maxPrice hợp lệ"
      });
    }

    const response = await ProductService.getProductsByPriceRange(
      Number(minPrice),
      Number(maxPrice)
    );

    if (response.status === 'NguyenMTK_ERR') {
      return res.status(400).json(response);
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ status: "Nguyen_ERROR", message: error.message });
  }
};

const getAllType = async (req, res) => {
  try {
    const response = await ProductService.getAllType();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ status: "Nguyen_ERROR", message: e.message });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailProduct,
  deleteProduct,
  deleteMany,
  getAllProduct,
  getProductsByPriceRange,
  getAllType
};
