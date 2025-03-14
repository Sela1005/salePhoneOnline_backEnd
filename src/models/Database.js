const mongoose = require("mongoose");
const dotenv = require('dotenv');


dotenv.config();

class Database {
    static instance;

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    constructor() {
        this.connect();
    }

    connect() {
        mongoose.connect(process.env.MONGO_DB).then(() => {
            console.log('Đã kết nối đến MongoDB');
        }).catch(err => {
            console.error('Lỗi kết nối:', err);
            throw err;
        });
    }
}

module.exports = Database;