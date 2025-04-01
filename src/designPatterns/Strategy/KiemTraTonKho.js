const IKiemTra = require('./IKiemTra');
const SanPham = require('../../models/ProductModel');

class KiemTraTenTrung extends IKiemTra {
  async kiemTra(sanPham) {
    const tonTai = await SanPham.findOne({ name: sanPham.name });
    if (tonTai) {
      return { status: 'NguyenMTK_ERR', message: 'Tên sản phẩm đã tồn tại!' };
    }
    return null;
  }
}

module.exports = KiemTraTenTrung;
