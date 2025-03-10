# salePhoneOnline Backend 🚀

![Node.js](https://img.shields.io/badge/Node.js-v14.17.0-green)
![Express.js](https://img.shields.io/badge/Express.js-v4.17.1-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-v4.4.6-orange)

## 📦 Tổng Quan

Đây là **backend** của dự án **salePhoneOnline**, một ứng dụng MERN stack được thiết kế để bán điện thoại trực tuyến. Backend xử lý logic phía server, tương tác với cơ sở dữ liệu, và cung cấp các API RESTful để frontend sử dụng. Nó được xây dựng bằng **Node.js**, **Express.js**, và **MongoDB**, đảm bảo một kiến trúc mạnh mẽ và có khả năng mở rộng cho hoạt động thương mại điện tử.

---

## 🛠️ Công Nghệ Sử Dụng

- **Node.js**: Môi trường chạy JavaScript để xây dựng ứng dụng mạng có khả năng mở rộng.
- **Express.js**: Framework web cho Node.js để xử lý định tuyến và middleware.
- **MongoDB**: Cơ sở dữ liệu NoSQL để lưu trữ dữ liệu sản phẩm, người dùng và đơn hàng.
- **Mongoose**: Thư viện ODM cho MongoDB để quản lý schema và truy vấn dữ liệu.
- **JWT**: JSON Web Tokens để xác thực người dùng an toàn.

---

## 🚀 Hướng Dẫn Cài Đặt

Để chạy backend này trên máy local, làm theo các bước sau:

### Điều Kiện Tiên Quyết

- **Node.js** (phiên bản 14.x trở lên)
- **MongoDB** (cài đặt cục bộ hoặc sử dụng MongoDB Atlas)

### Các Bước

1. **Clone repository**:
   ```bash
   git clone https://github.com/Sela1005/salePhoneOnline_backEnd.git
   cd salePhoneOnline_backEnd
2. **Cài đặt dependencies**:
    ```bash
   npm install
3. **Thiết lập biến môi trường**:
    ```bash
    PORT=5000
    MONGO_DB=<chuỗi_kết_nối_mongodb_của_bạn>
    ACCESS_TOKEN=<access_token>
    REFRESH_TOKEN=<refresh_token>
    CLIENT_ID=<client_id>
    GOOGLE_CLIENT_ID=<google_client_id>
    SECRET_KEY=<secret_key>
    ACCESS_KEY=<access_key>
    FRONTEND_URL=https://frontend-salephones.vercel.app
4. **Chạy server**:
    ```bash
    npm start


📬 Liên Hệ và Tài Nguyên
- Frontend Repository: https://github.com/Sela1005/salePhoneOnline_frontEnd
- Live Demo: https://frontend-salephones.vercel.app/
- Liên hệ: Có thắc mắc? Liên hệ qua GitHub Profile hoặc email [tranghoangphuchatien07@gmail.com].
