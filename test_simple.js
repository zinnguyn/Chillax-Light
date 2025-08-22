// Script test đơn giản
const { User, Category, post, Product } = require('./models');

async function testSimple() {
  console.log('🧪 Testing hệ thống đơn giản...\n');

  try {
    // Test 1: Kiểm tra models
    console.log('1️⃣ Testing models...');
    console.log('✅ User model:', typeof User);
    console.log('✅ Category model:', typeof Category);
    console.log('✅ post model:', typeof post);
    console.log('✅ Product model:', typeof Product);
    
    // Test 2: Kiểm tra database
    console.log('\n2️⃣ Testing database...');
    const users = await User.findAll();
    const categories = await Category.findAll();
    const posts = await post.findAll();
    const products = await Product.findAll();
    
    console.log('✅ Database connection: OK');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Posts: ${posts.length}`);
    console.log(`   - Products: ${products.length}`);
    
    // Test 3: Kiểm tra admin user
    console.log('\n3️⃣ Testing admin user...');
    const adminUser = users.find(u => u.role === 'admin');
    if (adminUser) {
      console.log('✅ Admin user found:', adminUser.username);
      console.log('   - Email:', adminUser.email);
      console.log('   - Role:', adminUser.role);
      console.log('   - ID:', adminUser.id);
    } else {
      console.log('❌ No admin user found!');
      console.log('   Available users:');
      users.forEach(u => console.log(`     - ${u.username} (${u.role}) - ID: ${u.id}`));
    }
    
    // Test 4: Kiểm tra user đầu tiên
    if (users.length > 0) {
      console.log('\n4️⃣ Testing first user...');
      const firstUser = users[0];
      console.log('   - Username:', firstUser.username);
      console.log('   - Email:', firstUser.email);
      console.log('   - Role:', firstUser.role);
      console.log('   - ID:', firstUser.id);
      
      // Test login với user này
      console.log('\n5️⃣ Testing login simulation...');
      console.log('💡 Để đăng nhập admin, bạn cần:');
      console.log(`   - Username: ${firstUser.username}`);
      console.log(`   - Email: ${firstUser.email}`);
      console.log(`   - Password: (kiểm tra database)`);
      console.log(`   - Role: ${firstUser.role}`);
      
      if (firstUser.role !== 'admin') {
        console.log('\n🚨 VẤN ĐỀ: User đầu tiên không phải admin!');
        console.log('💡 Giải pháp: Cập nhật role thành admin hoặc tạo admin user mới');
      }
    }
    
    console.log('\n🎯 Tóm tắt:');
    console.log('✅ Models: Hoạt động');
    console.log('✅ Database: Hoạt động');
    console.log(adminUser ? '✅ Admin user: Có sẵn' : '❌ Admin user: Thiếu');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSimple(); 