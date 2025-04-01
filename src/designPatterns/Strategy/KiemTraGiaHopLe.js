const IKiemTra = require('./IKiemTra');

class KiemTraGiaHopLe extends IKiemTra {
  async kiemTra(sanPham) {
    if (isNaN(sanPham.price) || sanPham.price <= 0) {
      return {
        status: 'NguyenMTK_ERR',
        message: 'Giá sản phẩm phải là một số hợp lệ và lớn hơn 0.'
      };
    }
    return null; // hợp lệ
  }
}

module.exports = KiemTraGiaHopLe;
