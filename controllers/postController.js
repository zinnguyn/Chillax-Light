const multer = require('multer');
const path = require('path');
const slugify = require('slugify');
const { body, validationResult } = require('express-validator');
const { User, Category, post } = require('../models');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|avi|mkv|zip|rar|exe|apk/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('File không hợp lệ'));
    }
  }
});

const postController = {
  // Danh sách bài viết
  index: async (req, res) => {
    // Lấy danh sách bài viết
    try {
      const posts = await post.findAll({
        include: [
          { model: Category, as: 'category' },
          { model: User, as: 'author', attributes: ['username'] }
        ],
        order: [['createdAt', 'DESC']]
      });
      res.render('admin/posts/index', {
        title: 'Quản lý bài viết',
        posts
      });
    } catch (error) {
      console.error('Lỗi danh sách bài viết:', error);
      req.flash('error_msg', 'Lỗi tải bài viết');
      res.redirect('/admin');
    }
  },

  // Hiển thị form thêm/sửa bài viết
  showForm: async (req, res) => {
    try {
      let post = null;
      if (req.params.id) {
        post = await post.findByPk(req.params.id);
        if (!post) {
          req.flash('error_msg', 'Không thấy bài viết');
          return res.redirect('/admin/posts');
        }
      }
      const categories = await Category.findAll();
      res.render('admin/posts/form', {
        title: post ? 'Sửa bài viết' : 'Thêm bài viết',
        post,
        categories,
        isEdit: !!post
      });
    } catch (error) {
      console.error('Không thể mở form:', error);
      req.flash('error_msg', 'Không thể tải form');
      res.redirect('/admin/posts');
    }
  },

  // Tạo bài viết mới
  create: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash('error_msg', errors.array()[0].msg);
        return res.redirect('/admin/posts/add');
      }
      const {
        title, content, excerpt, type, category_id, download_url,
        file_size, version, tags, status, featured
      } = req.body;
      const slug = slugify(title, { lower: true, strict: true });
      // Check if slug exists
      const existingPost = await post.findOne({ where: { slug } });
      if (existingPost) {
        req.flash('error_msg', 'Tiêu đề đã tồn tại');
        return res.redirect('/admin/posts/add');
      }
      const postData = {
        title,
        slug,
        content,
        excerpt,
        type,
        category_id: parseInt(category_id),
        download_url,
        file_size,
        version,
        tags,
        status: status || 'draft',
        featured: featured === 'on',
        author_id: req.session.user.id
      };
      if (req.file) {
        postData.featured_image = req.file.filename;
      }
      await post.create(postData);
      req.flash('success_msg', 'Tạo bài viết thành công');
      res.redirect('/admin/posts');
    } catch (error) {
      console.error('Không thể tạo mới:', error);
      req.flash('error_msg', 'Không thể tạo mới');
      res.redirect('/admin/posts/add');
    }
  },

  // Cập nhật bài viết
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await post.findByPk(id);
      if (!post) {
        req.flash('error_msg', 'Không tìm thấy bài viết');
        return res.redirect('/admin/posts');
      }
      const {
        title, content, excerpt, type, category_id, download_url,
        file_size, version, tags, status, featured
      } = req.body;
      const updateData = {
        title,
        content,
        excerpt,
        type,
        category_id: parseInt(category_id),
        download_url,
        file_size,
        version,
        tags,
        status: status || 'draft',
        featured: featured === 'on'
      };
      if (title !== post.title) {
        updateData.slug = slugify(title, { lower: true, strict: true });
      }
      if (req.file) {
        updateData.featured_image = req.file.filename;
      }
      await post.update(updateData);
      req.flash('success_msg', 'Bài viết cập nhật thành công');
      res.redirect('/admin/posts');
    } catch (error) {
      console.error('Update post error:', error);
      req.flash('error_msg', 'Lỗi cập nhật bài viết');
      res.redirect(`/admin/posts/edit/${req.params.id}`);
    }
  },

  // Xoá bài viết
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await post.findByPk(id);
      if (!post) {
        req.flash('error_msg', 'Không tìm thấy bài viết');
        return res.redirect('/admin/posts');
      }
      await post.destroy();
      req.flash('success_msg', 'Bài viết xoá thành công');
      res.redirect('/admin/posts');
    } catch (error) {
      console.error('Lỗi xoá bài viết:', error);
      req.flash('error_msg', 'Lỗi xoá bài viết');
      res.redirect('/admin/posts');
    }
  },

  // chuyển đổi trạng thái bài viết
  toggleStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await post.findByPk(id);
      if (!post) {
        req.flash('error_msg', 'Không tìm thấy bài viết');
        return res.redirect('/admin/posts');
      }
      
      const newStatus = post.status === 'published' ? 'draft' : 'published';
      await post.update({ status: newStatus });
      
      req.flash('success_msg', `Bài viết đã ${newStatus === 'published' ? 'xuất bản' : 'ẩn'}`);
      res.redirect('/admin/posts');
    } catch (error) {
      console.error('Lỗi chuyển đổi trạng thái:', error);
      req.flash('error_msg', 'Lỗi chuyển đổi trạng thái');
      res.redirect('/admin/posts');
    }
  },
  
  // Các thao tác chọn nhiều
  bulkAction: async (req, res) => {
    try {
      const { action, postIds } = req.body;
      if (!action || !postIds || !Array.isArray(postIds)) {
        req.flash('error_msg', 'Thông tin không hợp lệ');
        return res.redirect('/admin/posts');
      }
      
      switch (action) {
        case 'delete':
          await post.destroy({ where: { id: postIds } });
          req.flash('success_msg', `Đã xóa ${postIds.length} bài viết`);
          break;
        case 'publish':
          await post.update({ status: 'published' }, { where: { id: postIds } });
          req.flash('success_msg', `Đã xuất bản ${postIds.length} bài viết`);
          break;
        case 'draft':
          await post.update({ status: 'draft' }, { where: { id: postIds } });
          req.flash('success_msg', `Đã ẩn ${postIds.length} bài viết`);
          break;
        default:
          req.flash('error_msg', 'Hành động không hợp lệ');
      }
      
      res.redirect('/admin/posts');
    } catch (error) {
      console.error('Lỗi bulk action:', error);
      req.flash('error_msg', 'Lỗi thực hiện hành động');
      res.redirect('/admin/posts');
    }
  },
  upload: upload
};

module.exports = postController;