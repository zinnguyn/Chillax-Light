const { Product, Category } = require('../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Cấu hình multer cho upload file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/products';
    // Tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Tạo tên file unique với timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
  },
  fileFilter: function (req, file, cb) {
    // Chỉ cho phép upload image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ cho phép upload file hình ảnh!'), false);
    }
  }
});

const productController = {
  // Danh sách sản phẩm
  index: async (req, res) => {
    try {
      const products = await Product.findAll({
        include: [{ model: Category, as: 'category' }],
        order: [['createdAt', 'DESC']]
      });
      
      // Đếm số lượng sản phẩm theo trạng thái
      const totalProducts = products.length;
      const publishedProducts = products.filter(p => p.stock > 0).length;
      const outOfStockProducts = products.filter(p => p.stock === 0).length;
      
      res.render('admin/products/index', {
        title: 'Quản lý sản phẩm',
        products,
        categories: await Category.findAll({ order: [['name', 'ASC']] }),
        stats: {
          total: totalProducts,
          published: publishedProducts,
          outOfStock: outOfStockProducts
        }
      });
    } catch (error) {
      console.error('Lỗi danh sách sản phẩm:', error);
      req.flash('error_msg', 'Lỗi tải sản phẩm');
      res.redirect('/admin');
    }
  },

  // Form thêm hoặc sửa sản phẩm
  showForm: async (req, res) => {
    try {
      const categories = await Category.findAll({ order: [['name', 'ASC']] });
      let product = null;

      if (req.params.id) {
        product = await Product.findByPk(req.params.id);
        if (!product) {
          req.flash('error_msg', 'Sản phẩm không tồn tại');
          return res.redirect('/admin/products');
        }
      }

      res.render('admin/products/form', {
        title: product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm',
        product,
        categories,
        action: product ? `/admin/products/edit/${product.id}` : '/admin/products/add'
      });
    } catch (error) {
      console.error('Lỗi form sản phẩm:', error);
      req.flash('error_msg', 'Lỗi tải form sản phẩm');
      res.redirect('/admin/products');
    }
  },

  // Tạo sản phẩm mới
  create: async (req, res) => {
    try {
      console.log('🔄 Starting product creation...');
      console.log('📝 Request body:', req.body);
      console.log('📁 Request file:', req.file);
      
      const { 
        productName: name, 
        productDescription: description, 
        productPrice: price, 
        productStock: stock, 
        productCategory: category_id,
        productOriginalPrice: originalPrice,
        productIsFeatured: isFeatured,
        productIsFavorite: isFavorite,
        productIsNew: isNew,
        productSalePercentage: salePercentage
      } = req.body;

      console.log('🔍 Extracted data:', {
        name,
        description,
        price,
        stock,
        category_id,
        originalPrice,
        isFeatured,
        isFavorite,
        isNew,
        salePercentage
      });

      // Validation
      if (!name || !description || !price || !stock || !category_id) {
        console.log('❌ Validation failed:', { name, description, price, stock, category_id });
        req.flash('error_msg', 'Vui lòng điền đầy đủ thông tin bắt buộc');
        return res.redirect('/admin/products/add');
      }

      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        console.log('❌ Price validation failed:', { price, parsedPrice });
        req.flash('error_msg', 'Giá sản phẩm không hợp lệ');
        return res.redirect('/admin/products/add');
      }

      const parsedStock = parseInt(stock);
      if (isNaN(parsedStock) || parsedStock < 0) {
        console.log('❌ Stock validation failed:', { stock, parsedStock });
        req.flash('error_msg', 'Số lượng tồn kho không hợp lệ');
        return res.redirect('/admin/products/add');
      }

      let imageUrl = '/images/default-product.png';
      if (req.file) {
        imageUrl = '/uploads/products/' + req.file.filename;
        console.log('📸 Image uploaded:', imageUrl);
      }

      const productData = {
        name: name.trim(),
        description: description.trim(),
        price: parsedPrice,
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        stock: parsedStock,
        imageUrl: imageUrl,
        category_id: parseInt(category_id),
        isFeatured: isFeatured === 'on',
        isFavorite: isFavorite === 'on',
        isNew: isNew === 'on',
        salePercentage: salePercentage ? parseInt(salePercentage) : null,
        soldCount: 0
      };

      console.log('💾 Attempting to save product:', productData);

      const newProduct = await Product.create(productData);
      
      console.log('✅ Product created successfully:', newProduct.toJSON());
      console.log('🆔 New product ID:', newProduct.id);

      req.flash('success_msg', 'Tạo sản phẩm thành công!');
      res.redirect('/admin/products');
    } catch (error) {
      console.error('❌ Error creating product:', error);
      console.error('❌ Error stack:', error.stack);
      req.flash('error_msg', 'Lỗi tạo sản phẩm: ' + error.message);
      res.redirect('/admin/products/add');
    }
  },

  // Cập nhật sản phẩm
  update: async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Product.findByPk(productId);
      
      if (!product) {
        req.flash('error_msg', 'Sản phẩm không tồn tại');
        return res.redirect('/admin/products');
      }

      const { 
        productName: name, 
        productDescription: description, 
        productPrice: price, 
        productStock: stock, 
        productCategory: category_id,
        productOriginalPrice: originalPrice,
        productIsFeatured: isFeatured,
        productIsFavorite: isFavorite,
        productIsNew: isNew,
        productSalePercentage: salePercentage
      } = req.body;

      // Validation
      if (!name || !description || !price || !stock || !category_id) {
        req.flash('error_msg', 'Vui lòng điền đầy đủ thông tin bắt buộc');
        return res.redirect(`/admin/products/edit/${productId}`);
      }

      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        req.flash('error_msg', 'Giá sản phẩm không hợp lệ');
        return res.redirect(`/admin/products/edit/${productId}`);
      }

      const parsedStock = parseInt(stock);
      if (isNaN(parsedStock) || parsedStock < 0) {
        req.flash('error_msg', 'Số lượng tồn kho không hợp lệ');
        return res.redirect(`/admin/products/edit/${productId}`);
      }

      // Xử lý hình ảnh
      let imageUrl = product.imageUrl;
      if (req.file) {
        // Xóa hình ảnh cũ nếu không phải default
        if (product.imageUrl && product.imageUrl !== '/images/default-product.png') {
          const oldImagePath = product.imageUrl.replace('/uploads/', 'uploads/');
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        imageUrl = '/uploads/products/' + req.file.filename;
      }

      await product.update({
        name: name.trim(),
        description: description.trim(),
        price: parsedPrice,
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        stock: parsedStock,
        imageUrl: imageUrl,
        category_id: parseInt(category_id),
        isFeatured: isFeatured === 'on',
        isFavorite: isFavorite === 'on',
        isNew: isNew === 'on',
        salePercentage: salePercentage ? parseInt(salePercentage) : null
      });

      req.flash('success_msg', 'Cập nhật sản phẩm thành công!');
      res.redirect('/admin/products');
    } catch (error) {
      console.error('Lỗi cập nhật sản phẩm:', error);
      req.flash('error_msg', 'Lỗi cập nhật sản phẩm: ' + error.message);
      res.redirect(`/admin/products/edit/${req.params.id}`);
    }
  },

  // Xóa sản phẩm
  delete: async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Product.findByPk(productId);
      
      if (!product) {
        req.flash('error_msg', 'Sản phẩm không tồn tại');
        return res.redirect('/admin/products');
      }

      // Xóa hình ảnh nếu không phải default
      if (product.imageUrl && product.imageUrl !== '/images/default-product.png') {
        const imagePath = product.imageUrl.replace('/uploads/', 'uploads/');
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await product.destroy();
      req.flash('success_msg', 'Xóa sản phẩm thành công!');
      res.redirect('/admin/products');
    } catch (error) {
      console.error('Lỗi xóa sản phẩm:', error);
      req.flash('error_msg', 'Lỗi xóa sản phẩm: ' + error.message);
      res.redirect('/admin/products');
    }
  }
};

module.exports = {
  ...productController,
  upload
};
