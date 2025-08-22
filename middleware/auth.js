const authMiddleware = {
  // Kiểm tra đăng nhập
  requireAuth: (req, res, next) => {
    console.log('🔍 requireAuth middleware:');
    console.log('📍 URL:', req.url);
    console.log('🔧 Method:', req.method);
    console.log('🆔 Session ID:', req.sessionID);
    
    if (req.session && req.session.user) {
      console.log('👤 User đang truy cập:', req.session.user.username);
      console.log('🔑 Role:', req.session.user.role);
      console.log('🆔 User ID:', req.session.user.id);
    } else {
      console.log('❌ Không có user đăng nhập');
    }
    
    if (!req.session || !req.session.user) {
      console.log('❌ No session or user, redirecting to login');
      console.log('🔍 Session details:', {
        sessionExists: !!req.session,
        sessionID: req.sessionID,
        sessionData: req.session,
        cookies: req.headers.cookie
      });
      // Tạm thời không sử dụng req.flash để tránh lỗi
      return res.redirect('/auth/login');
    }
    console.log('✅ User authenticated, proceeding to dashboard');
    next();
  },

  // Chỉ cho admin
  requireAdmin: (req, res, next) => {
    console.log('🔐 requireAdmin middleware:');
    console.log('📍 URL:', req.url);
    
    if (!req.session || !req.session.user) {
      console.log('❌ Không có user đăng nhập, redirect to login');
      return res.redirect('/auth/login');
    }
    
    console.log('👤 User:', req.session.user.username);
    console.log('🔑 Role:', req.session.user.role);
    
    if (req.session.user.role !== 'admin') {
      console.log('🚫 User không phải admin, redirect to home');
      return res.redirect('/');
    }
    
    console.log('✅ Admin user được phép truy cập');
    next();
  },

  // Không cho user đã đăng nhập vào trang login/register
  requireGuest: (req, res, next) => {
    console.log('🔍 requireGuest middleware:', {
      session: req.session,
      user: req.session?.user,
      url: req.url
    });
    
    if (req.session.user) {
      console.log('✅ User already logged in, redirecting based on role');
      return req.session.user.role === 'admin'
        ? res.redirect('/admin')
        : res.redirect('/user/dashboard'); // Redirect user về dashboard
    }
    console.log('✅ Guest user, proceeding');
    next();
  },

  // Cho phép chủ sở hữu hoặc admin chỉnh sửa
  requireOwnerOrAdmin: (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.redirect('/auth/login');
    }
    if (req.session.user.role === 'admin') return next();

    // Nếu user là chủ sở hữu bài viết (id của bài == id user)
    if (req.params.id && parseInt(req.session.user.id) === parseInt(req.params.id)) {
      return next();
    }

    return res.redirect('/');
  },

  // Gán thông tin user cho tất cả view EJS
  setCurrentUser: (req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    
    // In thông tin user nếu có
    if (req.session && req.session.user) {
      console.log('👤 Current user in session:', req.session.user.username);
      console.log('🔑 Role:', req.session.user.role);
    }
    
    next();
  }
};

module.exports = authMiddleware;
