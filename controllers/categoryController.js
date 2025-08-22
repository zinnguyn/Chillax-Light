const { Category, post } = require('../models');
const slugify = require('slugify');

const categoryController = {
  index: async (req, res) => {
    const categories = await Category.findAll();
    res.render('admin/categories/index', { title: 'Quản lý danh mục', categories });
  },

  showForm: async (req, res) => {
    let category = null;
    if (req.params.id) {
      category = await Category.findByPk(req.params.id);
    }
    res.render('admin/categories/form', { title: category ? 'Sửa danh mục' : 'Thêm danh mục', category });
  },

  create: async (req, res) => {
    const { name, description } = req.body;
    await Category.create({ name, slug: slugify(name), description });
    req.flash('success_msg', 'Tạo danh mục thành công');
    res.redirect('/admin/categories');
  },

  update: async (req, res) => {
    const { name, description } = req.body;
    await Category.update({ name, slug: slugify(name), description }, { where: { id: req.params.id } });
    req.flash('success_msg', 'Cập nhật danh mục thành công');
    res.redirect('/admin/categories');
  },

  delete: async (req, res) => {
    await Category.destroy({ where: { id: req.params.id } });
    req.flash('success_msg', 'Xóa danh mục thành công');
    res.redirect('/admin/categories');
  }
};

module.exports = categoryController;
