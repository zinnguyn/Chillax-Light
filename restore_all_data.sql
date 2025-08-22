-- Script khôi phục dữ liệu hoàn chỉnh
USE db_zinnguyen;

-- Tắt foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- ================== KHÔI PHỤC USERS ==================
-- Xóa dữ liệu cũ trong bảng users (nếu có)
TRUNCATE TABLE users;

-- Khôi phục dữ liệu users
INSERT INTO users (username, email, password, role, createdAt, updatedAt) VALUES
('admin', 'admin@example.com', 'admin123', 'admin', NOW(), NOW()),
('user1', 'user1@example.com', '123456', 'user', NOW(), NOW()),
('user2', 'user2@example.com', '123456', 'user', NOW(), NOW()),
('moderator', 'mod@example.com', 'mod123', 'moderator', NOW(), NOW()),
('testuser', 'test@example.com', 'test123', 'user', NOW(), NOW());

-- ================== KHÔI PHỤC CATEGORIES ==================
-- Xóa dữ liệu cũ trong bảng categories (nếu có)
TRUNCATE TABLE categories;

-- Khôi phục dữ liệu categories
INSERT INTO categories (name, description, createdAt, updatedAt) VALUES
('Đèn Hiệu Ứng Bầu Trời', 'Đèn tạo hiệu ứng bầu trời đẹp mắt', NOW(), NOW()),
('Đèn Trang Trí', 'Đèn trang trí nội thất', NOW(), NOW()),
('Đèn phòng ngủ', 'Đèn dành cho phòng ngủ', NOW(), NOW()),
('Đèn Quà Tặng', 'Đèn làm quà tặng', NOW(), NOW());

-- ================== KHÔI PHỤC PRODUCTS ==================
-- Xóa dữ liệu cũ trong bảng products (nếu có)
TRUNCATE TABLE products;

-- Khôi phục dữ liệu products
INSERT INTO products (name, description, price, originalPrice, stock, category_id, imageUrl, isFeatured, isFavorite, isNew, salePercentage, soldCount, createdAt, updatedAt) VALUES
('Đèn LED Đám mây Tuyết - Mây Hoa', 'Đèn LED tạo hiệu ứng đám mây tuyết đẹp mắt', 590000, 790000, 50, 1, '/img/gia1.png', TRUE, TRUE, TRUE, 25, 15, NOW(), NOW()),
('Đèn LED Vườn Hoa Tulip mini', 'Đèn LED trang trí vườn hoa tulip mini', 590000, 790000, 30, 2, '/img/gia2.png', TRUE, FALSE, FALSE, 25, 8, NOW(), NOW()),
('Đèn LED Trang Trí Phòng Ngủ', 'Đèn LED trang trí phòng ngủ ấm áp', 450000, 600000, 25, 3, '/img/gia3.png', FALSE, TRUE, TRUE, NULL, 12, NOW(), NOW()),
('Đèn LED Quà Tặng Chill', 'Đèn LED làm quà tặng với thiết kế độc đáo', 390000, 550000, 40, 4, '/img/gia4.png', FALSE, TRUE, TRUE, 29, 20, NOW(), NOW());

-- ================== KHÔI PHỤC POSTS ==================
-- Xóa dữ liệu cũ trong bảng posts (nếu có)
TRUNCATE TABLE posts;

-- Khôi phục dữ liệu posts
INSERT INTO posts (title, content, image_url, author_name, category_id, author_id, status, views, downloads, createdAt, updatedAt) VALUES
('Hướng dẫn chọn đèn trang trí phòng ngủ', 'Bài viết hướng dẫn cách chọn đèn trang trí phòng ngủ phù hợp...', '/img/post1.jpg', 'Admin', 3, 1, 'published', 150, 25, NOW(), NOW()),
('Top 10 đèn LED trang trí đẹp nhất 2024', 'Danh sách 10 đèn LED trang trí đẹp nhất trong năm 2024...', '/img/post2.jpg', 'Admin', 2, 1, 'published', 200, 30, NOW(), NOW()),
('Cách sử dụng đèn hiệu ứng bầu trời', 'Hướng dẫn chi tiết cách sử dụng đèn hiệu ứng bầu trời...', '/img/post3.jpg', 'Admin', 1, 1, 'published', 120, 18, NOW(), NOW());

-- Bật lại foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ================== KIỂM TRA KẾT QUẢ ==================
-- Hiển thị tổng quan dữ liệu đã khôi phục
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Posts', COUNT(*) FROM posts;

-- Hiển thị thông báo thành công
SELECT 'All data restored successfully!' as message; 