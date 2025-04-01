const ITruyVanSanPham = require('./ITruyVanSanPham');

class ChienLuocLocTheoKhoangGia extends ITruyVanSanPham {
  constructor(min, max) {
    super();
    this.min = min;
    this.max = max;
  }

  apDung(queryBuilder) {
    // Kiểm tra min/max hợp lệ
    if (isNaN(this.min) || isNaN(this.max) || this.min < 0 || this.max < 0) {
      return {
        status: 'NguyenMTK_ERR',
        message: 'Giá trị khoảng giá phải là số hợp lệ và không âm.'
      };
    }

    if (this.min > this.max) {
      return {
        status: 'NguyenMTK_ERR',
        message: 'Giá thấp nhất không được lớn hơn giá cao nhất.'
      };
    }

    // Gán vào query nếu hợp lệ
    queryBuilder.query.price = { $gte: this.min, $lte: this.max };

    return {
      status: 'NguyenMTK_OK',
      message: `Lọc theo khoảng giá từ ${this.min} đến ${this.max} thành công.`
    };
  }
}

module.exports = ChienLuocLocTheoKhoangGia;
