const sequelize = require('../config/db');
const Product = require('./product');
const Category = require('./Category');
const Cart = require('./Cart');
const Post = require('./post');
const Review = require('./review');
const User = require('./user');
const Order = require('./order');
const OrderItem = require('./OrderItem');

// Associations
Product.belongsTo(Category);
Category.hasMany(Product);

Cart.belongsTo(Product);
Product.hasMany(Cart);

Review.belongsTo(Product);
Product.hasMany(Review);

// Order associations
Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

OrderItem.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(OrderItem, { foreignKey: 'productId' });

// Quan hệ Category ↔ Post
Category.hasMany(Post, { as: 'category_posts', foreignKey: 'category_id' });
Post.belongsTo(Category, { foreignKey: 'category_id' });

// Quan hệ Category ↔ Product
Category.hasMany(Product, { as: 'category_products', foreignKey: 'category_id' });
Product.belongsTo(Category, { as: 'category', foreignKey: 'category_id' });

// Quan hệ User ↔ Post
User.hasMany(Post, { as: 'user_posts', foreignKey: 'author_id' });
Post.belongsTo(User, { as: 'author', foreignKey: 'author_id' });

// Quan hệ Product ↔ Cart
Product.hasMany(Cart, { as: 'cartItems', foreignKey: 'productId' });
Cart.belongsTo(Product, { as: 'product', foreignKey: 'productId' });

// Function để sync database
const syncDatabase = async (force = false) => {
  try {
    if (force) {
      // Tắt foreign key checks để có thể xóa bảng theo thứ tự bất kỳ
      console.log('🔒 Disabling foreign key checks...');
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
      
      // Xóa bảng theo thứ tự để tránh foreign key constraint
      console.log('🗑️ Dropping existing tables...');
      try {
        await sequelize.drop();
        console.log('✅ All tables dropped successfully');
      } catch (dropError) {
        console.log('⚠️ Some tables may not exist, continuing...');
      }
      
      // Bật lại foreign key checks
      console.log('🔓 Re-enabling foreign key checks...');
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    }
    
    // Tạo bảng theo thứ tự đúng để tránh foreign key constraint
    console.log('🏗️ Creating tables in correct order...');
    
    // 1. Tạo bảng Users trước (không có foreign key)
    await User.sync({ force: false });
    console.log('✅ Users table ready');
    
    // 2. Tạo bảng Categories (không có foreign key)
    await Category.sync({ force: false });
    console.log('✅ Categories table ready');
    
    // 3. Tạo bảng Products (có foreign key đến Categories)
    await Product.sync({ force: false });
    console.log('✅ Products table ready');
    
    // 4. Tạo bảng Posts
    try {
      await Post.sync({ force: false });
      console.log('✅ Posts table ready');
    } catch (postError) {
      console.log('⚠️ Posts table sync failed, but continuing...');
      console.log('Error details:', postError.message);
    }
    
    // 5. Tạo bảng Cart
    try {
      await Cart.sync({ force: false });
      console.log('✅ Cart table ready');
    } catch (cartError) {
      console.log('⚠️ Cart table sync failed, but continuing...');
      console.log('Error details:', cartError.message);
    }
    
    // 6. Tạo bảng Review
    try {
      await Review.sync({ force: false });
      console.log('✅ Review table ready');
    } catch (reviewError) {
      console.log('⚠️ Review table sync failed, but continuing...');
      console.log('Error details:', reviewError.message);
    }
    
    // 7. Tạo bảng Order
    try {
      await Order.sync({ force: false });
      console.log('✅ Order table ready');
    } catch (orderError) {
      console.log('⚠️ Order table sync failed, but continuing...');
      console.log('Error details:', orderError.message);
    }
    
    // 8. Tạo bảng OrderItem
    try {
      await OrderItem.sync({ force: false });
      console.log('✅ OrderItem table ready');
    } catch (orderItemError) {
      console.log('⚠️ OrderItem table sync failed, but continuing...');
      console.log('Error details:', orderItemError.message);
    }
    
    console.log(`✅ Database synced successfully${force ? ' with new schema' : ' (preserved existing data)'}`);
    return true;
  } catch (error) {
    console.error('❌ Database sync error:', error);
    // Đảm bảo bật lại foreign key checks nếu có lỗi
    try {
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    } catch (e) {
      console.log('⚠️ Could not re-enable foreign key checks');
    }
    return false;
  }
};

// Export models
module.exports = {
  sequelize,
  Product,
  Post,
  Review,
  User,
  Category,
  Cart,
  Order,
  OrderItem,
  syncDatabase
};
