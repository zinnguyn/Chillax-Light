const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Post = sequelize.define('Post', {
  title: DataTypes.STRING,
  content: DataTypes.TEXT,
  imageUrl: {
    type: DataTypes.STRING,
    field: 'image_url', // mapping với DB
    defaultValue: '/images/default-post.png'
  },
  authorName: {
    type: DataTypes.STRING,
    field: 'author_name',
    defaultValue: 'Admin'
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      defaultValue: 'draft'
  },
  views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
  },
  downloads: {
      type: DataTypes.INTEGER,
      defaultValue: 0
  }
}, {
  tableName: 'posts', // Sửa từ 'post' thành 'posts' để khớp với DB
  timestamps: true
});


module.exports = Post;
