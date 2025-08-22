const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Review = sequelize.define('Review', {
  name: DataTypes.STRING,
  avatar: DataTypes.STRING,
  content: DataTypes.TEXT,
  rating: DataTypes.INTEGER
});

module.exports = Review;
