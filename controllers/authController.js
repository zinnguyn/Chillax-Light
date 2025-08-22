const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { User } = require('../models');
const { Op } = require('sequelize');

const authController = {

  // Hiển thị trang đăng nhập (nếu cần, nhưng bạn dùng popup nên ít dùng)
  showLogin: (req, res) => {
    if (req.session.user) {
      return res.redirect('/admin');
    }
    res.render('auth/login', { title: 'Đăng nhập - Chillaxlight' });
  },

  // Xử lý đăng nhập
  processLogin: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash('error_msg', errors.array()[0].msg);
        return res.redirect('/');
      }

      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        req.flash('error_msg', 'Email hoặc mật khẩu không đúng');
        return res.redirect('/');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        req.flash('error_msg', 'Email hoặc mật khẩu không đúng');
        return res.redirect('/');
      }

      // Đăng nhập thành công
      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role
      };

      // In thông báo đăng nhập thành công
      console.log('🎉 ĐĂNG NHẬP THÀNH CÔNG!');
      console.log('👤 User:', user.username);
      console.log('📧 Email:', user.email);
      console.log('🔑 Role:', user.role);
      console.log('🆔 ID:', user.id);
      console.log('⏰ Thời gian:', new Date().toLocaleString('vi-VN'));
      console.log('🌐 IP:', req.ip || req.connection.remoteAddress);

      // Chuyển hướng theo vai trò
      if (user.role === 'admin') {
        return res.redirect('/admin');
      } else {
        return res.redirect('/user/dashboard');
      }

    } catch (error) {
      console.error('❌ Lỗi đăng nhập:', error);
      req.flash('error_msg', 'Lỗi máy chủ. Vui lòng thử lại');
      return res.redirect('/');
    }
  },

  // Xử lý đăng ký
  processRegister: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash('error_msg', errors.array()[0].msg);
        return res.redirect('/');
      }

      const { username, email, password } = req.body;

      const existingUser = await User.findOne({
        where: { [Op.or]: [{ email }, { username }] }
      });

      if (existingUser) {
        req.flash('error_msg', 'Email hoặc tên người dùng đã tồn tại');
        return res.redirect('/');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({
        username,
        email,
        password: hashedPassword,
        role: 'user'
      });

      req.flash('success_msg', 'Đăng ký thành công! Bạn có thể đăng nhập ngay');
      return res.redirect('/');

    } catch (error) {
      console.error('❌ Lỗi khi đăng ký:', error);
      req.flash('error_msg', 'Lỗi máy chủ. Vui lòng thử lại sau');
      return res.redirect('/');
    }
  },

  // Đăng xuất
  logout: (req, res) => {
    // In thông báo đăng xuất
    if (req.session && req.session.user) {
      console.log('🚪 ĐĂNG XUẤT!');
      console.log('👤 User:', req.session.user.username);
      console.log('🔑 Role:', req.session.user.role);
      console.log('🆔 ID:', req.session.user.id);
      console.log('⏰ Thời gian:', new Date().toLocaleString('vi-VN'));
      console.log('🌐 IP:', req.ip || req.connection.remoteAddress);
    }
    
    req.session.destroy(err => {
      if (err) {
        console.error('❌ Lỗi khi đăng xuất:', err);
      }
      res.redirect('/');
    });
  }

};

module.exports = authController;
