const IKiemTra = require('./IKiemTra');

class KiemTraMoTa extends IKiemTra {
  async kiemTra(sanPham) {
    if (sanPham.description && sanPham.description.length <= 20) {
      return { status: 'NguyenMTK_ERR', message: 'Mô tả phải dài hơn 20 ký tự.' };
    }
    return null;
  }
}

module.exports = KiemTraMoTa;
