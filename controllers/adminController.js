// controllers/adminController.js
const { User, Category, post, Product } = require('../models');
const slugify = require('slugify');

const adminController = {
  // Trang Dashboard
  dashboard: async (req, res) => {
    try {
      // Lấy tất cả dữ liệu cần thiết
      const [products, categories, posts, users] = await Promise.all([
        Product.findAll({
          include: [{ model: Category, as: 'category' }],
          order: [['createdAt', 'DESC']]
        }),
        Category.findAll({ order: [['createdAt', 'DESC']] }),
        post.findAll({
          include: [{ model: Category, as: 'category' }],
          order: [['createdAt', 'DESC']]
        }),
        User.findAll({ order: [['createdAt', 'DESC']] })
      ]);

      // Tính toán thống kê
      const stats = {
        totalPosts: posts.length,
        publishedPosts: posts.filter(p => p.status === 'published').length,
        totalUsers: users.length,
        totalCategories: categories.length,
        totalProducts: products.length,
        publishedProducts: products.filter(p => p.stock > 0).length,
        outOfStockProducts: products.filter(p => p.stock === 0).length,
        totalViews: posts.reduce((sum, post) => sum + (post.views || 0), 0),
        totalDownloads: posts.reduce((sum, post) => sum + (post.downloads || 0), 0)
      };

      console.log('Dashboard data loaded:', {
        products: products.length,
        categories: categories.length,
        posts: posts.length,
        users: users.length,
        stats
      });

      res.render('admin/dashboard', {
        title: 'Admin Dashboard',
        stats,
        products,
        categories,
        posts,
        users,
        recentProducts: products.slice(0, 5),
        recentPosts: posts.slice(0, 5)
      });
    } catch (error) {
      console.error('🔥 Dashboard Error:', error);
      res.status(500).send('Dashboard Error: ' + error.message);
    }
  },

  // Quản lý danh mục
  listCategories: async (req, res) => {
    try {
      const categories = await Category.findAll({ order: [['createdAt', 'DESC']] });
      res.render('admin/categories/index', { title: 'Quản lý danh mục', categories });
    } catch (error) {
      console.error('Lỗi danh mục:', error);
      res.redirect('/admin');
    }
  },

  addCategory: async (req, res) => {
    try {
      const { name, description, color } = req.body;
      const slug = slugify(name, { lower: true, strict: true });

      await Category.create({ name, slug, description, color: color || '#6366f1' });

      req.flash('success_msg', 'Tạo danh mục thành công');
      res.redirect('/admin/categories');
    } catch (error) {
      console.error('Create category error:', error);
      res.redirect('/admin/categories');
    }
  },

  // Quản lý bài viết
  listPosts: async (req, res) => {
    try {
      const posts = await post.findAll({
        include: [{ model: Category, as: 'category' }, { model: User, as: 'author', attributes: ['username'] }],
        order: [['createdAt', 'DESC']]
      });

      res.render('admin/posts/index', { title: 'Quản lý bài viết', posts });
    } catch (error) {
      console.error('Lỗi danh sách bài viết:', error);
      res.redirect('/admin');
    }
  },

  // Quản lý sản phẩm
  listProducts: async (req, res) => {
    try {
      const products = await Product.findAll({
        include: [{ model: Category, as: 'category' }],
        order: [['createdAt', 'DESC']]
      });

      res.render('admin/products/index', { title: 'Quản lý sản phẩm', products });
    } catch (error) {
      console.error('Lỗi danh sách sản phẩm:', error);
      res.redirect('/admin');
    }
  },

  // Quản lý người dùng
  listUsers: async (req, res) => {
    try {
      const users = await User.findAll({ order: [['createdAt', 'DESC']] });
      res.render('admin/users/index', { title: 'Quản lý người dùng', users });
    } catch (error) {
      console.error('Lỗi danh sách người dùng:', error);
      res.redirect('/admin');
    }
  }
};

module.exports = adminController;
