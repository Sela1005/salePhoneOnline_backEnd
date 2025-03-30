const ProductFactory = require("./ProductFactory");
const Product = require("../models/ProductModel");

class PhoneFactory extends ProductFactory {
    createProduct(data) {
        return new Product({
            ...data,
            type: "phone", // Đảm bảo type là 'phone'
        });
    }
}

module.exports = PhoneFactory;
