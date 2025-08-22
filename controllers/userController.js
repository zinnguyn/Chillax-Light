exports.getDashboard = async (req, res) => {
  try {
    console.log('🎯 getDashboard called:', {
      session: req.session,
      user: req.session?.user,
      url: req.url
    });
    
    // Kiểm tra xem user có tồn tại trong session không
    if (!req.session.user) {
      console.log('❌ No user in session, redirecting to login');
      return res.redirect('/auth/login');
    }
    
    console.log('✅ Rendering user dashboard for:', req.session.user.username);
    
    // Tạm thời hiển thị dashboard đơn giản không có orders
    // Vì chưa có model Order cho Sequelize
    res.render('user/dashboard', {
      orders: [], // Tạm thời để trống
      pageTitle: 'Tài khoản của tôi',
      user: req.session.user
    });
  } catch (err) {
    console.error('❌ Dashboard error:', err);
    res.status(500).render('pages/error', { message: 'Lỗi khi tải dashboard' });
  }
};
