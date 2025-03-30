const PhoneFactory = require("../factories/PhoneFactory");

class FactorySelector {
    static getFactory(type) {
        switch (type) {
            case "phone":
                return new PhoneFactory();
            default:
                throw new Error(`Không tìm thấy Factory cho loại sản phẩm: ${type}`);
        }
    }
}

module.exports = FactorySelector;
