const express = require("express");
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const routes = require('./routes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 5082;

const corsOptions = {
    origin: 'http://localhost:5085', // Thay đổi thành địa chỉ frontend của bạn
    credentials: true, // Cho phép gửi cookie
};

// Sử dụng middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Kết nối routes
routes(app);

// Kết nối đến MongoDB
mongoose.connect(process.env.MONGO_DB)
    .then(() => { 
        console.log('Connect DB Success!');
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });

// Khởi động server
app.listen(port, () => {
    console.log('Server running on port:', port);
});

// Các biến khóa truy cập
const accessKey = 'F8BBA842ECF85';
const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
