// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.token;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Authorization header is missing or invalid',
            status: 'ERROR',
        });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(403).json({
                message: 'Invalid token',
                status: 'ERROR',
            });
        }
        req.user = user; // Gắn thông tin user (bao gồm userId) vào req
        next();
    });
};

const authUserMiddleware = (req, res, next) => {
    const authHeader = req.headers.token;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Authorization header is missing or invalid',
            status: 'ERROR',
        });
    }

    const token = authHeader.split(' ')[1];
    const userId = req.params.id;

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err || (!user?.isAdmin && user?.id !== userId)) {
            return res.status(403).json({
                message: 'Unauthorized: You do not have permission',
                status: 'ERROR',
            });
        }
        req.user = user; // Gắn thông tin user vào req
        next();
    });
};

module.exports = {
    authMiddleware,
    authUserMiddleware,
};