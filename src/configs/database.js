require('dotenv').config();
const mysql = require('mysql2');

const dbPool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
dbPool.query('SELECT 1 + 1 AS solution', function (error, results) {
  if (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
});

module.exports = dbPool.promise();
