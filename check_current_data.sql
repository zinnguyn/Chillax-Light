-- Script kiểm tra dữ liệu hiện tại trong database
USE db_zinnguyen;

-- Kiểm tra tất cả bảng
SHOW TABLES;

-- Kiểm tra dữ liệu trong bảng users
SELECT 'users' as table_name, COUNT(*) as record_count FROM users;
SELECT * FROM users;

-- Kiểm tra dữ liệu trong bảng categories
SELECT 'categories' as table_name, COUNT(*) as record_count FROM categories;
SELECT * FROM categories;

-- Kiểm tra dữ liệu trong bảng products
SELECT 'products' as table_name, COUNT(*) as record_count FROM products;
SELECT * FROM products;

-- Kiểm tra dữ liệu trong bảng posts
SELECT 'posts' as table_name, COUNT(*) as record_count FROM posts;
SELECT * FROM posts;

-- Kiểm tra cấu trúc bảng users
DESCRIBE users; 