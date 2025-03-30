const express = require("express");
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const routes = require('./routes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('./utils/logger');
dotenv.config();

const app = express();
const port = process.env.PORT || 5082;

const corsOptions = {
    origin: [
        process.env.FRONTEND_URL, 
    ],
    credentials: true, // Cho phép gửi cookie
};
// origin: process.env.FRONTEND_URL || 'https://frontend-salephones.vercel.app', // địa chỉ frontEnd

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
        logger.info('Connect DB Success!');
    })
    .catch((err) => {
        console.error('Database connection error:', err);
        logger.error('Database connection error: '+ err);
    });
    // Middleware để log thời gian xử lý MongoDB
const logQueryTime = (req, res, next) => {
    console.time('MongoDB Query Time');

    res.on('finish', () => {
        console.timeEnd('MongoDB Query Time');
    });
    next();
};

app.use(logQueryTime);

// Khởi động server
app.listen(port, '0.0.0.0', () => {
    console.log('Server running on port:', port);
    logger.info('Server running on port: '+ port);
});

