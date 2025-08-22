const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// Route dashboard không dùng middleware để tránh loop
router.get('/dashboard', (req, res) => {
  console.log('🔍 Direct dashboard access:', {
    session: req.session,
    user: req.session?.user,
    url: req.url,
    sessionID: req.sessionID,
    cookies: req.headers.cookie
  });
  
  if (!req.session || !req.session.user) {
    console.log('❌ No session, redirecting to login');
    return res.redirect('/auth/login');
  }
  
  console.log('✅ User authenticated, rendering dashboard');
  return userController.getDashboard(req, res);
});

// Route test dashboard đơn giản
router.get('/test', (req, res) => {
  console.log('🔍 Test dashboard access:', {
    session: req.session,
    user: req.session?.user,
    url: req.url
  });
  
  if (!req.session || !req.session.user) {
    return res.send('❌ Không có session');
  }
  
  return res.send(`✅ Hello ${req.session.user.username}! Role: ${req.session.user.role}`);
});

// Route test dashboard đơn giản
router.get('/test2', (req, res) => {
  console.log('🔍 Test2 dashboard access:', {
    session: req.session,
    user: req.session?.user,
    url: req.url
  });
  
  if (!req.session || !req.session.user) {
    return res.send('❌ Không có session');
  }
  
  return res.send(`✅ Hello ${req.session.user.username}! Role: ${req.session.user.role}`);
});

// Route test dashboard đơn giản
router.get('/test3', (req, res) => {
  console.log('🔍 Test3 dashboard access:', {
    session: req.session,
    user: req.session?.user,
    url: req.url
  });
  
  if (!req.session || !req.session.user) {
    return res.send('❌ Không có session');
  }
  
  return res.send(`✅ Hello ${req.session.user.username}! Role: ${req.session.user.role}`);
});

module.exports = router;
