// utils/logger.js
const fs = require('fs');
const path = require('path');
const chalk = require('chalk'); // Cài đặt: npm install chalk

class Logger {
    constructor() {
        if (Logger.instance) {
            return Logger.instance; // Trả về instance hiện có
        }

        this.logFilePath = path.join(__dirname, '../logs/app.log'); // Đường dẫn file log
        this.ensureLogFileExists();
        Logger.instance = this; // Lưu instance Singleton
    }

    // Đảm bảo file log tồn tại
    ensureLogFileExists() {
        const dir = path.dirname(this.logFilePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        if (!fs.existsSync(this.logFilePath)) {
            fs.writeFileSync(this.logFilePath, '');
        }
    }

    // Định dạng timestamp
    getTimestamp() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `[${day}-${month}-${year} ${hours}:${minutes}:${seconds}]`;
    }

    // Ghi log vào file
    writeToFile(level, message) {
        const logMessage = `${this.getTimestamp()} [${level.toUpperCase()}] ${message}\n`;
        fs.appendFileSync(this.logFilePath, logMessage, 'utf8');
    }

    // Log mức info
    info(message) {
        const formattedMessage = `[INFO] ${message}`;
        // console.log(chalk.green(formattedMessage));
        this.writeToFile('info', message);
    }

    // Log mức warn
    warn(message) {
        const formattedMessage = `[WARN] ${message}`;
        // console.log(chalk.yellow(formattedMessage));
        this.writeToFile('warn', message);
    }

    // Log mức error
    error(message) {
        const formattedMessage = `[ERROR] ${message}`;
        // console.log(chalk.red(formattedMessage));
        this.writeToFile('error', message);
    }
}

// Tạo Singleton instance
const logger = new Logger();
Object.freeze(logger); // Đóng băng instance để tránh thay đổi

module.exports = logger;