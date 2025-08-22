const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306, // nếu .env chưa có thì mặc định 3306
    dialect: 'mysql',
    logging: false, // tắt log SQL
    dialectOptions: {
      // Loại bỏ allowPublicKeyRetrieval không hợp lệ
      // MySQL 8+ sẽ tự động xử lý authentication
    },
    pool: {
      max: 5,              // Maximum connections
      min: 0,              // Minimum connections
      acquire: 30000,      // Timeout for acquiring connection
      idle: 10000          // Timeout for idle connection
    }
  }
);

// Kiểm tra kết nối
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;
