const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const cartController = require('../controllers/cartController');
const Category = require('../models/Category');
const path = require('path'); // Added for path.join
// Trang chủ
router.get('/', homeController.index);

// Trang sản phẩm
router.get('/products', homeController.products);

// API lấy danh sách sản phẩm dạng JSON
router.get('/api/products', homeController.getProductsJson);

// Trang danh mục
router.get('/category/:slug', homeController.category);

// Trang chi tiết sản phẩm
router.get('/product/:id', homeController.productDetail);

// Tìm kiếm sản phẩm
router.get('/search', homeController.search);

// Cart routes
router.post('/api/cart/add', cartController.addToCart);
router.get('/api/cart', cartController.getCart);
router.put('/api/cart/update', cartController.updateQuantity);
router.delete('/api/cart/:cartItemId', cartController.removeFromCart);
router.delete('/api/cart', cartController.clearCart);

// API Routes cho đơn hàng
const orderController = require('../controllers/orderController');

// Tạo đơn hàng mới
router.post('/api/orders', orderController.createOrder);

// Lấy đơn hàng theo session
router.get('/api/orders', orderController.getOrdersBySession);

// Lấy chi tiết đơn hàng
router.get('/api/orders/:orderId', orderController.getOrderById);

// Hủy đơn hàng
router.put('/api/orders/:orderId/cancel', orderController.cancelOrder);

// Admin: Lấy tất cả đơn hàng
router.get('/api/admin/orders', orderController.getAllOrders);

// Admin: Cập nhật trạng thái đơn hàng
router.put('/api/admin/orders/:orderId/status', orderController.updateOrderStatus);

// Admin: Thống kê đơn hàng
router.get('/api/admin/orders/stats', orderController.getOrderStats);

// Test route cho giỏ hàng
router.get('/test-cart', (req, res) => {
    res.sendFile(path.join(__dirname, '../test_cart.html'));
});

// Test route cho giỏ hàng đơn giản
router.get('/test-cart-simple', (req, res) => {
    res.sendFile(path.join(__dirname, '../test_cart_simple.html'));
});

// Test route cho debug giỏ hàng
router.get('/test-cart-debug', (req, res) => {
    res.sendFile(path.join(__dirname, '../test_cart_debug.html'));
});

// Test route đơn giản
router.get('/test-simple', (req, res) => {
    res.sendFile(path.join(__dirname, '../test_simple.html'));
});

// Trang giỏ hàng
router.get('/cart', (req, res) => {
    res.render('pages/cart', {
        pageTitle: 'Giỏ Hàng - Chillax Light',
        currentUser: req.session.user || null
    });
});

// Trang Tin Tức (News/Blog overview page)
router.get('/news', (req, res) => {
  // Render the news.ejs template.
  // Optionally, pass data like currentPage to highlight the active menu item in the header.
  res.render('pages/news', { pageTitle: 'Tin Tức - Chillax Light', currentPage: 'news' });
});

// Trang thanh toán
router.get('/checkout', (req, res) => {
    res.render('pages/checkout', {
        pageTitle: 'Thanh Toán - Chillax Light',
        currentUser: req.session.user || null
    });
});

// Trang user (lịch sử đơn hàng)
router.get('/user', (req, res) => {
    res.render('pages/user', {
        pageTitle: 'Tài Khoản - Chillax Light',
        currentUser: req.session.user || null
    });
});


// Trang tĩnh
router.get('/about', (req, res) => {
  res.render('pages/about', { pageTitle: 'Chillax Light - Về chúng tôi' });
});

router.get('/contact', (req, res) => {
  res.render('pages/contact', { pageTitle: 'Liên hệ - Chillax Light' });
});

// Xử lý form liên hệ
router.post('/contact', (req, res) => {
  req.flash('success_msg', 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
  res.redirect('/contact');
});



module.exports = router;
