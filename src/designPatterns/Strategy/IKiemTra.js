class IKiemTra {
    async kiemTra(sanPham) {
      throw new Error("Bạn phải override phương thức kiemTra");
    }
  }
  
  module.exports = IKiemTra; 
  