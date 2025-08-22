const fs = require('fs');
const path = require('path');
const { Product, Category, post } = require('../models');

// ======= HÀM ĐỌC BÀI VIẾT JSON =======
const getPosts = () => {
  try {
    const rawData = fs.readFileSync(path.join(__dirname, '../data/post.json'), 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Lỗi khi đọc post.json:', error);
    return [];
  }
};

// ======= TRANG CHỦ =======
const index = async (req, res) => {
  try {
    // Lấy sản phẩm thực từ database
    const [products, categories, posts] = await Promise.all([
      Product.findAll({
        include: [{ model: Category, as: 'category' }],
        order: [['createdAt', 'DESC']]
      }),
      Category.findAll({ order: [['name', 'ASC']] }),
      post.findAll({
        where: { status: 'published' },
        order: [['createdAt', 'DESC']],
        limit: 6
      })
    ]);

    // Lấy sản phẩm nổi bật
    const featuredProducts = products
      .filter(product => product.isFeatured)
      .slice(0, 4)
      .map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        oldPrice: product.originalPrice || product.price * 1.3,
        image: product.imageUrl || '/img/default-product.png',
        category: product.category ? product.category.name : 'Chưa phân loại',
        badge: product.salePercentage ? `Sale ${product.salePercentage}%` : (product.isNew ? 'New' : 'Hot'),
        isNew: product.isNew,
        salePercentage: product.salePercentage
      }));

    // Lấy sản phẩm yêu thích
    const favoriteProducts = products
      .filter(product => product.isFavorite)
      .slice(0, 4)
      .map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        oldPrice: product.originalPrice || product.price * 1.2,
        image: product.imageUrl || '/img/default-product.png',
        category: product.category ? product.category.name : 'Chưa phân loại',
        badge: product.salePercentage ? `Sale ${product.salePercentage}%` : (product.isNew ? 'New' : ''),
        isNew: product.isNew,
        salePercentage: product.salePercentage
      }));

    // Lấy sản phẩm bán chạy (dựa trên soldCount)
    const bestSellingProducts = products
      .filter(product => product.soldCount > 0)
      .sort((a, b) => b.soldCount - a.soldCount)
      .slice(0, 4)
      .map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        oldPrice: product.originalPrice || product.price * 1.2,
        image: product.imageUrl || '/img/default-product.png',
        category: product.category ? product.category.name : 'Chưa phân loại',
        badge: `Bán chạy`,
        soldCount: product.soldCount
      }));

    // Lấy sản phẩm mới
    const newProducts = products
      .filter(product => product.isNew)
      .slice(0, 4)
      .map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        oldPrice: product.originalPrice || product.price * 1.2,
        image: product.imageUrl || '/img/default-product.png',
        category: product.category ? product.category.name : 'Chưa phân loại',
        badge: 'New',
        isNew: true
      }));

    // Chuyển đổi categories
    const displayCategories = categories.map(cat => ({
      name: cat.name,
      slug: cat.name.toLowerCase().replace(/\s+/g, '-'),
      image: '/img/den1.png', // Giữ nguyên ảnh mặc định
      count: products.filter(p => p.category_id === cat.id).length
    }));

    // Lấy bài viết từ database nếu có, nếu không thì dùng JSON
    let articles = posts.length > 0 ? posts : getPosts();

    res.render('pages/home', {
      featuredProducts,
      favoriteProducts,
      bestSellingProducts,
      newProducts,
      categories: displayCategories,
      articles,
      pageTitle: 'Chillax Light - Đèn Bật Chill, Bật Mood'
    });
  } catch (error) {
    console.error('Lỗi render trang chủ:', error);
    // Fallback về dữ liệu cũ nếu có lỗi
    const featuredProducts = [
      { id: 1, name: 'Đèn LED Đám mây Tuyết - Mây Hoa', price: 59, oldPrice: 79, image: '/img/gia1.png', category: 'Đèn Hiệu Ứng Bầu Trời', badge: 'Hot' },
      { id: 2, name: 'Đèn LED Vườn Hoa Tulip mini', price: 59, oldPrice: 79, image: '/img/gia2.png', category: 'Đèn Trang Trí', badge: 'Sale' }
    ];
    const favoriteProducts = [
      { id: 3, name: 'Đèn LED Trang Trí Phòng Ngủ', price: 45, oldPrice: 60, image: '/img/gia3.png', category: 'Đèn phòng ngủ', badge: '' },
      { id: 4, name: 'Đèn LED Quà Tặng Chill', price: 39, oldPrice: 55, image: '/img/gia4.png', category: 'Đèn Quà Tặng', badge: 'New' }
    ];
    const bestSellingProducts = [];
    const newProducts = [];
    const categories = [
      { name: 'Đèn Hiệu Ứng Bầu Trời', slug: 'den-hieu-ung-bau-troi', image: '/img/den1.png', count: 2 },
      { name: 'Đèn Quà Tặng', slug: 'den-qua-tang', image: '/img/den2.png', count: 5 },
      { name: 'Đèn Trang Trí', slug: 'den-trang-tri', image: '/img/den3.png', count: 8 },
      { name: 'Đèn phòng ngủ', slug: 'den-phong-ngu', image: '/img/den4.png', count: 12 }
    ];
    const articles = getPosts();

    res.render('pages/home', {
      featuredProducts,
      favoriteProducts,
      bestSellingProducts,
      newProducts,
      categories,
      articles,
      pageTitle: 'Chillax Light - Đèn Bật Chill, Bật Mood'
    });
  }
};

// ======= TRANG TẤT CẢ SẢN PHẨM =======
const products = async (req, res) => {
  try {
    const { category } = req.query;
    const articles = getPosts();

    // Lấy sản phẩm từ database
    const [allProducts, categories] = await Promise.all([
      Product.findAll({
        include: [{ model: Category, as: 'category' }],
        order: [['createdAt', 'DESC']]
      }),
      Category.findAll({ order: [['name', 'ASC']] })
    ]);

    let filteredProducts = allProducts;
    let activeCategory = '';

    if (category) {
      activeCategory = category;
      filteredProducts = allProducts.filter(
        p => p.category && p.category.name.toLowerCase() === category.toLowerCase()
      );
    }

    // Chuyển đổi dữ liệu database thành format hiển thị
    const displayProducts = filteredProducts.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.price * 1.3,
      image: product.imageUrl || '/img/default-product.png',
      category: product.category ? product.category.name : 'Chưa phân loại',
      badge: product.stock > 0 ? 'Hot' : 'Hết hàng'
    }));

    // Chuyển đổi categories
    const displayCategories = categories.map(cat => ({
      name: cat.name,
      slug: cat.name.toLowerCase().replace(/\s+/g, '-'),
      image: '/img/den1.png',
      count: allProducts.filter(p => p.category_id === cat.id).length
    }));

    res.render('pages/products', {
      products: displayProducts,
      featuredProducts: displayProducts,
      activeCategory,
      categories: displayCategories,
      articles,
      pageTitle: activeCategory
          ? `Danh mục: ${activeCategory} - Chillax Light`
          : 'Tất cả sản phẩm - Chillax Light'
    });
  
  } catch (error) {
    console.error('Lỗi render trang sản phẩm:', error);
    res.status(500).send('Lỗi server');
  }
};

// ======= API JSON SẢN PHẨM =======
const getProductsJson = async (req, res) => {
  try {
    const category = req.query.category || '';
    
    const products = await Product.findAll({
      include: [{ model: Category, as: 'category' }],
      order: [['createdAt', 'DESC']]
    });

    const filteredProducts = category
      ? products.filter(p => p.category && p.category.name.toLowerCase() === category.toLowerCase())
      : products;

    // Chuyển đổi dữ liệu database thành format JSON
    const jsonProducts = filteredProducts.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl || '/img/default-product.png',
      category: product.category ? product.category.name : 'Chưa phân loại',
      stock: product.stock,
      description: product.description
    }));

    res.json(jsonProducts);
  } catch (error) {
    console.error('Lỗi API sản phẩm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// ======= DANH MỤC =======
const category = async (req, res) => {
  try {
    const { slug } = req.params;

    // Lấy danh mục từ database
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    const slugMap = {};
    
    categories.forEach(cat => {
      const catSlug = cat.name.toLowerCase().replace(/\s+/g, '-');
      slugMap[catSlug] = cat.name;
    });

    const categoryName = slugMap[slug];
    if (!categoryName) {
      return res.status(404).send('Danh mục không tồn tại');
    }

    // Lấy sản phẩm theo danh mục
    const products = await Product.findAll({
      include: [{ model: Category, as: 'category' }],
      where: { '$category.name$': categoryName },
      order: [['createdAt', 'DESC']]
    });

    // Chuyển đổi dữ liệu
    const displayProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.price * 1.3,
      image: product.imageUrl || '/img/default-product.png',
      category: product.category ? product.category.name : 'Chưa phân loại',
      badge: product.stock > 0 ? 'Hot' : 'Hết hàng'
    }));

    const displayCategories = categories.map(cat => ({
      name: cat.name,
      slug: cat.name.toLowerCase().replace(/\s+/g, '-'),
      image: '/img/den1.png',
      count: products.filter(p => p.category_id === cat.id).length
    }));

    res.render('pages/category', {
      products: displayProducts,
      category: categoryName,
      categories: displayCategories,
      pageTitle: `${categoryName} - Chillax Light`
    });

  } catch (error) {
    console.error('Lỗi render trang danh mục:', error);
    res.status(500).send('Lỗi server');
  }
};

// ======= CHI TIẾT SẢN PHẨM =======
const productDetail = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByPk(id, {
      include: [{ model: Category, as: 'category' }]
    });

    if (!product) {
      return res.status(404).send('Sản phẩm không tồn tại');
    }

    // Lấy sản phẩm liên quan
    const relatedProducts = await Product.findAll({
      include: [{ model: Category, as: 'category' }],
      where: { 
        category_id: product.category_id,
        id: { [require('sequelize').Op.ne]: product.id }
      },
      limit: 4,
      order: [['createdAt', 'DESC']]
    });

    // Chuyển đổi dữ liệu
    const displayProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.price * 1.3,
      image: product.imageUrl || '/img/default-product.png',
      category: product.category ? product.category.name : 'Chưa phân loại',
      description: product.description,
      stock: product.stock
    };

    const displayRelatedProducts = relatedProducts.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      oldPrice: p.price * 1.3,
      image: p.imageUrl || '/img/default-product.png',
      category: p.category ? p.category.name : 'Chưa phân loại'
    }));

    res.render('pages/product-detail', {
      product: displayProduct,
      relatedProducts: displayRelatedProducts,
      pageTitle: `${product.name} - Chillax Light`
    });

  } catch (error) {
    console.error('Lỗi render chi tiết sản phẩm:', error);
    res.status(500).send('Lỗi server');
  }
};

// ======= TÌM KIẾM =======
const search = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.redirect('/products');
    }

    // Tìm kiếm sản phẩm trong database
    const { Op } = require('sequelize');
    const products = await Product.findAll({
      include: [{ model: Category, as: 'category' }],
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } }
        ]
      },
      order: [['createdAt', 'DESC']]
    });

    // Chuyển đổi dữ liệu
    const displayProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.price * 1.3,
      image: product.imageUrl || '/img/default-product.png',
      category: product.category ? product.category.name : 'Chưa phân loại',
      badge: product.stock > 0 ? 'Hot' : 'Hết hàng'
    }));

    res.render('pages/search', {
      products: displayProducts,
      query: q,
      pageTitle: `Tìm kiếm: ${q} - Chillax Light`
    });

  } catch (error) {
    console.error('Lỗi tìm kiếm:', error);
    res.status(500).send('Lỗi server');
  }
};

module.exports = {
  index,
  products,
  getProductsJson,
  category,
  productDetail,
  search
};
