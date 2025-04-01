class TrinhTruyVanSanPham {
    constructor() {
      this.dsChienLuoc = [];
      this.queryBuilder = {
        query: {},
        sort: {}
      };
    }
  
    themChienLuoc(chienLuoc) {
      this.dsChienLuoc.push(chienLuoc);
    }
  
    apDungTatCa() {
      for (const chienLuoc of this.dsChienLuoc) {
        chienLuoc.apDung(this.queryBuilder);
      }
      return this.queryBuilder;
    }
  }
  
  module.exports = TrinhTruyVanSanPham;
  