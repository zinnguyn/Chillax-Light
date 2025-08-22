const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// ==========================
// 🔐 LOGIN ROUTES
// ==========================

// Hiển thị trang đăng nhập (chỉ cho người chưa đăng nhập)
router.get('/login', authMiddleware.requireGuest, authController.showLogin);

// Xử lý đăng nhập (KHÔNG cần requireGuest vì đã kiểm soát ở GET)
router.post('/login', [
  body('email').isEmail().withMessage('Vui lòng nhập email hợp lệ'),
  body('password').notEmpty().withMessage('Mật khẩu là bắt buộc')
], authController.processLogin);

// ==========================
// 📝 REGISTER ROUTES
// ==========================

// Đăng ký tài khoản (chỉ xử lý POST vì dùng popup/modal)
router.post('/register', [
  body('username').notEmpty().withMessage('Tên người dùng là bắt buộc'),
  body('email').isEmail().withMessage('Vui lòng nhập email hợp lệ'),
  body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Mật khẩu xác nhận không khớp');
    }
    return true;
  })
], authController.processRegister);

// ==========================
// 🚪 LOGOUT ROUTE
// ==========================

// Đăng xuất (chỉ cho người đã đăng nhập)
router.get('/logout', authMiddleware.requireAuth, authController.logout);

module.exports = router;
