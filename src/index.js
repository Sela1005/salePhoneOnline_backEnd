const express = require("express");
const dotenv = require('dotenv');
const routes = require('./routes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const Database = require('./models/Database');
const Database2 = require('./models/Database');


dotenv.config();

// Kết nối database
Database.getInstance();

//dù có getInstance lần nữa thì cũng chỉ 1 lần kết nối vì cơ chế cache của nodejs có sẵn
Database2.getInstance();

const app = express();
const port = process.env.PORT;

const corsOptions = {
    origin: [
        process.env.FRONTEND_URL, 
    ],
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

// Khởi động server
app.listen(port, '0.0.0.0', () => {
    console.log('Server running on port:', port);
});

