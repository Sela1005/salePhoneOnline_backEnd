class TrinhKiemTraSanPham {
    constructor() {
      this.dsChienLuoc = [];
    }
  
    themChienLuoc(chienLuoc) {
      this.dsChienLuoc.push(chienLuoc);
    }
  
    async kiemTraTatCa(sanPham) {
      for (const chienLuoc of this.dsChienLuoc) {
        const loi = await chienLuoc.kiemTra(sanPham);
        if (loi) return loi;
      }
      return null;
    }
  }
  
  module.exports = TrinhKiemTraSanPham;
  