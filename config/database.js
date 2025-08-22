// config/database.js - Cấu hình database local
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'db_zinnguyen',  // Database name
  process.env.DB_USER || 'root',          // Username
  process.env.DB_PASSWORD || '',          // Password (để trống nếu không có)
  {
    host: process.env.DB_HOST || '89.233.105.193',  // Remote MySQL server
    port: process.env.DB_PORT || 3306,               // MySQL default port
    dialect: 'mysql',
    logging: false,        // Tắt log SQL
    dialectOptions: {
      // Loại bỏ allowPublicKeyRetrieval không hợp lệ
      // MySQL 8+ sẽ tự động xử lý authentication
    },
    pool: {
      max: 5,              // Maximum connections
      min: 0,              // Minimum connections
      acquire: 30000,      // Timeout for acquiring connection
      idle: 10000          // Timeout for idle connection
    },
    retry: {
      max: 3               // Retry connection 3 times
    }
  }
);

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully.');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

module.exports = { sequelize, testConnection }; 