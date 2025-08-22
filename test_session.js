// test_session.js - Test script để kiểm tra session và database
require('dotenv').config();
const { testConnection } = require('./config/database');

console.log('🧪 Testing Session and Database Configuration...\n');

// Test 1: Kiểm tra biến môi trường
console.log('📋 Environment Variables:');
console.log('DEBUG_SESSION:', process.env.DEBUG_SESSION);
console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? '✅ Set' : '❌ Not set');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('');

// Test 2: Kiểm tra database connection
console.log('🔌 Testing Database Connection...');
testConnection()
  .then(isConnected => {
    if (isConnected) {
      console.log('✅ Database connection successful');
    } else {
      console.log('❌ Database connection failed');
    }
  })
  .catch(error => {
    console.error('❌ Database test error:', error.message);
  })
  .finally(() => {
    console.log('\n🏁 Test completed');
    process.exit(0);
  });
