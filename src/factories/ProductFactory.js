// Abstract Factory cho sản phẩm
class ProductFactory {
    createProduct(data) {
        throw new Error("Method 'createProduct' must be implemented.");
    }
}

module.exports = ProductFactory;
