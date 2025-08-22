// Script test models
const { User, Category, post, Product } = require('./models');

console.log('🔍 Testing models...');

// Kiểm tra xem models có được import đúng không
console.log('User model:', typeof User);
console.log('Category model:', typeof Category);
console.log('post model:', typeof post);
console.log('Product model:', typeof Product);

// Kiểm tra xem models có method findAll không
console.log('User.findAll:', typeof User.findAll);
console.log('Category.findAll:', typeof Category.findAll);
console.log('post.findAll:', typeof post.findAll);
console.log('Product.findAll:', typeof Product.findAll);

// Test một query đơn giản
async function testQuery() {
  try {
    console.log('🧪 Testing User.findAll()...');
    const users = await User.findAll();
    console.log('✅ Users found:', users.length);
    
    console.log('🧪 Testing Category.findAll()...');
    const categories = await Category.findAll();
    console.log('✅ Categories found:', categories.length);
    
    console.log('🧪 Testing post.findAll()...');
    const posts = await post.findAll();
    console.log('✅ Posts found:', posts.length);
    
    console.log('🧪 Testing Product.findAll()...');
    const products = await Product.findAll();
    console.log('✅ Products found:', products.length);
    
  } catch (error) {
    console.error('❌ Error testing models:', error.message);
  }
}

testQuery(); 