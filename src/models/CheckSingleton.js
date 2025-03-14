const db1 = require('./Database');
const db2 = require('./Database');

// Nếu đúng Singleton, kết quả sẽ là true
console.log("db1 === db2:", db1._connect === db2._connect); 