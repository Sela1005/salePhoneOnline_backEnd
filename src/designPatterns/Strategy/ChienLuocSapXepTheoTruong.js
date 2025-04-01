const ITruyVanSanPham = require('./ITruyVanSanPham');
const Product = require('../../models/ProductModel');

class ChienLuocSapXepTheoTruong extends ITruyVanSanPham {
  constructor(field, order) {
    super();
    this.field = field;
    this.order = order; // 'asc' hoặc 'desc'
  }

  apDung(queryBuilder) {
    if (Object.keys(Product.schema.paths).includes(this.field)) {
      queryBuilder.sort[this.field] = this.order === 'asc' ? 1 : -1;
    }
  }
}

module.exports = ChienLuocSapXepTheoTruong;
