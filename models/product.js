// models/Product.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Category = require('./Category'); // Quan hệ với Category

const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    originalPrice: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: null,
        validate: {
            min: 0
        }
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '/images/default-product.png'
    },
    isFeatured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isFavorite: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isNew: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    salePercentage: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        validate: {
            min: 0,
            max: 100
        }
    },
    soldCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    }
}, {
    tableName: 'products',
    timestamps: true // Sequelize tự tạo createdAt & updatedAt
});

// Associations được định nghĩa trong models/index.js

module.exports = Product;
