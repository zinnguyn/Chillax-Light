const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');
const authMiddleware = require('./middleware/auth');
const userRoutes = require('./routes/user');

// ================== Middleware cấu hình ==================
app.use(session({
    secret: process.env.SESSION_SECRET || 'secretKey',
    resave: true,
    saveUninitialized: true,
    cookie: { 
        maxAge: 1000 * 60 * 60, // 1 giờ
        secure: false, // Để test trên localhost
        httpOnly: true
    }
}));

// Debug session - Chỉ bật khi cần debug
if (process.env.DEBUG_SESSION === 'true') {
    app.use((req, res, next) => {
        console.log('🔍 Session middleware:', {
            sessionID: req.sessionID,
            session: req.session,
            cookies: req.headers.cookie
        });
        next();
    });
}

app.use(flash());

// Gắn flash message vào res.locals để EJS dùng
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.cartTotal = 0;
    next();
});

// ================== Thiết lập EJS ==================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Cấu hình express-ejs-layouts
app.use(expressLayouts);
// Tắt layout mặc định
app.set('layout', false);

app.use(authMiddleware.setCurrentUser);

// Static files & body parser
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Thêm middleware để xử lý JSON

// ================== Routes ==================
app.use('/', require('./routes'));
app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/admin')); // adminRoutes Sequelize version
app.use('/user', userRoutes); // Di chuyển xuống đây sau session middleware
app.use('/seed', require('./routes/seed')); 

// ================== Xử lý lỗi 404 ==================
app.use((req, res) => {
    res.status(404).render('pages/error', {
        message: 'Trang không tồn tại',
        pageTitle: 'Không tìm thấy - Chillax Light'
    });
});

// ================== Xử lý lỗi chung ==================
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err);
    res.status(500).render('pages/error', {
        message: 'Lỗi máy chủ',
        pageTitle: 'Lỗi - Chillax Light'
    });
});

// ================== Sync Database ==================
const { syncDatabase } = require('./models');

(async () => {
  try {
    // Sử dụng force: false để KHÔNG xóa bảng hiện tại
    // Chỉ thêm cột mới nếu cần thiết
    console.log('🔄 Starting database sync with force: false (preserve existing data)...');
    await syncDatabase(false);
  } catch (error) {
    console.error('❌ Database sync error:', error);
    console.log('⚠️ Sync failed, but server will continue running...');
  }
})();

// ================== Chạy server ==================
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
});
