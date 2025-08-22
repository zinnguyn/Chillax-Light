// routes/adminRoutes.js
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const adminController = require('../controllers/adminController');
const categoryController = require('../controllers/categoryController');
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');
const productController = require('../controllers/productController');

// Tắt layout cho admin routes (sử dụng inline layout)
router.use((req, res, next) => {
  res.locals.layout = false;
  next();
});

// ✅ Bảo vệ tất cả route
router.use(authMiddleware.requireAuth);

/* DASHBOARD */
router.get('/', authMiddleware.requireAdmin, adminController.dashboard);

/* CATEGORY MANAGEMENT */
router.get('/categories', authMiddleware.requireAdmin, categoryController.index);
router.get('/categories/add', authMiddleware.requireAdmin, categoryController.showForm);
router.post(
  '/categories/add',
  authMiddleware.requireAdmin,
  [body('name').notEmpty().withMessage('Category name is required')],
  categoryController.create
);
router.get('/categories/edit/:id', authMiddleware.requireAdmin, categoryController.showForm);
router.post('/categories/edit/:id', authMiddleware.requireAdmin, categoryController.update);
router.post('/categories/delete/:id', authMiddleware.requireAdmin, categoryController.delete);

/* POST MANAGEMENT */
router.get('/posts', authMiddleware.requireAdmin, postController.index);
router.get('/posts/add', authMiddleware.requireAdmin, postController.showForm);
router.post(
  '/posts/add',
  authMiddleware.requireAdmin,
  postController.upload.single('featured_image'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('type').isIn(['tool', 'app', 'game', 'video', 'article']).withMessage('Invalid post type'),
    body('category_id').notEmpty().withMessage('Category is required')
  ],
  postController.create
);
router.get('/posts/edit/:id', authMiddleware.requireAuth, postController.showForm);
router.post('/posts/edit/:id', authMiddleware.requireAuth, postController.update);
router.post('/posts/delete/:id', authMiddleware.requireAuth, postController.delete);
router.post('/posts/toggle/:id', authMiddleware.requireAdmin, postController.toggleStatus);
router.post('/posts/bulk', authMiddleware.requireAdmin, postController.bulkAction);

/* USERS MANAGEMENT */
router.get('/users', authMiddleware.requireAdmin, adminController.listUsers);

/* =====================
    PRODUCT MANAGEMENT
===================== */

router.get('/products', authMiddleware.requireAdmin, productController.index);
router.get('/products/add', authMiddleware.requireAdmin, productController.showForm);
router.post('/products/add', authMiddleware.requireAdmin, productController.upload.single('productImage'), productController.create);
router.get('/products/edit/:id', authMiddleware.requireAdmin, productController.showForm);
router.post('/products/edit/:id', authMiddleware.requireAdmin, productController.upload.single('productImage'), productController.update);
router.post('/products/delete/:id', authMiddleware.requireAdmin, productController.delete);

module.exports = router;
