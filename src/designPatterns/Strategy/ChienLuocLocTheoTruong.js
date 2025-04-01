// src/designPatterns/Strategy/ChienLuocLocTheoTruong.js
const ITruyVanSanPham = require('./ITruyVanSanPham'); // ✅ Đúng cách

const Product = require('../../models/ProductModel');

class ChienLuocLocTheoTruong extends ITruyVanSanPham {
  constructor(label, value) {
    super();
    this.label = label;
    this.value = value;
  }

  apDung(queryBuilder) {
    if (Object.keys(Product.schema.paths).includes(this.label)) {
      queryBuilder.query[this.label] = { $regex: new RegExp(this.value, 'i') };
    }
  }
}

module.exports = ChienLuocLocTheoTruong;
