// models/Category.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // kết nối Sequelize đã cấu hình

const Category = sequelize.define('Category', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
        // unique: true // Tạm thời comment để tránh lỗi database sync
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'categories', // tên bảng
    timestamps: true // tự tạo createdAt, updatedAt
});

module.exports = Category;
