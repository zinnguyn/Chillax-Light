const express = require('express');
const router = express.Router();
const { Product, Category, User, post } = require('../models');

// Route để seed dữ liệu mẫu
router.get('/', async (req, res) => {
    try {
        console.log('🌱 Starting database seeding...');

        // Tạo categories
        const categories = await Category.bulkCreate([
            { name: 'Đèn Hiệu Ứng Bầu Trời', description: 'Đèn tạo hiệu ứng bầu trời đẹp mắt' },
            { name: 'Đèn Trang Trí', description: 'Đèn trang trí nội thất' },
            { name: 'Đèn phòng ngủ', description: 'Đèn dành cho phòng ngủ' },
            { name: 'Đèn Quà Tặng', description: 'Đèn làm quà tặng' }
        ]);
        console.log('✅ Categories created:', categories.length);

        // Tạo products với các trường mới
        const products = await Product.bulkCreate([
            {
                name: 'Đèn LED Đám mây Tuyết - Mây Hoa',
                description: 'Đèn LED tạo hiệu ứng đám mây tuyết đẹp mắt',
                price: 590000,
                originalPrice: 790000,
                stock: 50,
                category_id: categories[0].id,
                imageUrl: '/img/gia1.png',
                isFeatured: true,
                isFavorite: true,
                isNew: true,
                salePercentage: 25,
                soldCount: 15
            },
            {
                name: 'Đèn LED Vườn Hoa Tulip mini',
                description: 'Đèn LED trang trí vườn hoa tulip mini',
                price: 590000,
                originalPrice: 790000,
                stock: 30,
                category_id: categories[1].id,
                imageUrl: '/img/gia2.png',
                isFeatured: true,
                isFavorite: false,
                isNew: false,
                salePercentage: 25,
                soldCount: 8
            },
            {
                name: 'Đèn LED Trang Trí Phòng Ngủ',
                description: 'Đèn LED trang trí phòng ngủ ấm áp',
                price: 450000,
                originalPrice: 600000,
                stock: 25,
                category_id: categories[2].id,
                imageUrl: '/img/gia3.png',
                isFeatured: false,
                isFavorite: true,
                isNew: true,
                salePercentage: null,
                soldCount: 12
            },
            {
                name: 'Đèn LED Quà Tặng Chill',
                description: 'Đèn LED làm quà tặng với thiết kế độc đáo',
                price: 390000,
                originalPrice: 550000,
                stock: 40,
                category_id: categories[3].id,
                imageUrl: '/img/gia4.png',
                isFeatured: false,
                isFavorite: true,
                isNew: true,
                salePercentage: 29,
                soldCount: 20
            }
        ]);
        console.log('✅ Products created:', products.length);

        // Tạo user admin nếu chưa có
        const adminUser = await User.findOrCreate({
            where: { username: 'admin' },
            defaults: {
                username: 'admin',
                email: 'admin@example.com',
                password: 'admin123', // Trong thực tế nên hash password
                role: 'admin'
            }
        });
        console.log('✅ Admin user ready');

        res.json({
            success: true,
            message: 'Database seeded successfully!',
            data: {
                categories: categories.length,
                products: products.length,
                adminUser: adminUser[0].username
            }
        });

    } catch (error) {
        console.error('❌ Seeding error:', error);
        res.status(500).json({
            success: false,
            message: 'Seeding failed: ' + error.message
        });
    }
});

module.exports = router;
