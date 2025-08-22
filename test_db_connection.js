// Script test kết nối database
const { sequelize, testConnection } = require('./config/database');

async function testDB() {
  console.log('🧪 Testing database connection...\n');
  
  try {
    const isConnected = await testConnection();
    
    if (isConnected) {
      console.log('✅ Database connection successful!');
      console.log('💡 Bây giờ bạn có thể khởi động server');
    } else {
      console.log('❌ Database connection failed!');
      console.log('💡 Kiểm tra:');
      console.log('   - MySQL server có chạy không?');
      console.log('   - Host, port, username, password có đúng không?');
      console.log('   - Database có tồn tại không?');
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
  
  // Đóng kết nối
  await sequelize.close();
}

testDB(); 