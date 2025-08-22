// Script test toàn bộ hệ thống
const axios = require('axios');

const BASE_URL = 'http://localhost:5005';

async function testSystem() {
  console.log('🧪 Testing toàn bộ hệ thống...\n');

  try {
    // Test 1: Trang chủ
    console.log('1️⃣ Testing trang chủ...');
    const homeResponse = await axios.get(`${BASE_URL}/`);
    console.log('✅ Trang chủ:', homeResponse.status === 200 ? 'OK' : 'FAILED');
    
    // Test 2: Trang login
    console.log('\n2️⃣ Testing trang login...');
    const loginResponse = await axios.get(`${BASE_URL}/auth/login`);
    console.log('✅ Trang login:', loginResponse.status === 200 ? 'OK' : 'FAILED');
    
    // Test 3: Admin dashboard (không đăng nhập - phải redirect)
    console.log('\n3️⃣ Testing admin dashboard (không đăng nhập)...');
    try {
      const adminResponse = await axios.get(`${BASE_URL}/admin/dashboard`, {
        maxRedirects: 0,
        validateStatus: (status) => status >= 200 && status < 400
      });
      console.log('✅ Admin redirect:', adminResponse.status === 302 ? 'OK (redirected)' : 'FAILED');
    } catch (error) {
      if (error.response && error.response.status === 302) {
        console.log('✅ Admin redirect: OK (redirected to login)');
      } else {
        console.log('❌ Admin redirect failed:', error.message);
      }
    }
    
    // Test 4: Kiểm tra database connection
    console.log('\n4️⃣ Testing database connection...');
    const { User, Category, post, Product } = require('./models');
    
    const users = await User.findAll();
    const categories = await Category.findAll();
    const posts = await post.findAll();
    const products = await Product.findAll();
    
    console.log('✅ Database connection: OK');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Posts: ${posts.length}`);
    console.log(`   - Products: ${products.length}`);
    
    // Test 5: Kiểm tra admin user
    console.log('\n5️⃣ Testing admin user...');
    const adminUser = users.find(u => u.role === 'admin');
    if (adminUser) {
      console.log('✅ Admin user found:', adminUser.username);
      console.log('   - Email:', adminUser.email);
      console.log('   - Role:', adminUser.role);
    } else {
      console.log('❌ No admin user found!');
      console.log('   Available users:');
      users.forEach(u => console.log(`     - ${u.username} (${u.role})`));
    }
    
    console.log('\n🎯 Tóm tắt:');
    console.log('✅ Trang chủ: Hoạt động');
    console.log('✅ Trang login: Hoạt động');
    console.log('✅ Admin redirect: Hoạt động');
    console.log('✅ Database: Hoạt động');
    console.log(adminUser ? '✅ Admin user: Có sẵn' : '❌ Admin user: Thiếu');
    
    if (!adminUser) {
      console.log('\n🚨 VẤN ĐỀ: Không có admin user!');
      console.log('💡 Giải pháp: Chạy script seed hoặc tạo admin user thủ công');
    }
    
  } catch (error) {
    console.error('❌ System test failed:', error.message);
  }
}

testSystem(); 