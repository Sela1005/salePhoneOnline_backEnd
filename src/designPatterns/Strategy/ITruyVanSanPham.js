// src/designPatterns/Strategy/ITruyVanSanPham.js
class ITruyVanSanPham {
    apDung(queryBuilder) {
      throw new Error("Phải override phương thức apDung");
    }
  }
  
  module.exports = ITruyVanSanPham; // ⛔ KHÔNG bọc trong dấu {}
  