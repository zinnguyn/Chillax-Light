-- Script xóa bảng theo thứ tự đúng để tránh foreign key constraint
-- Chạy trong MySQL Workbench hoặc phpMyAdmin

USE db_zinnguyen;

-- Tắt foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Xóa bảng theo thứ tự (từ con đến cha)
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- Bật lại foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Kiểm tra xem còn bảng nào không
SHOW TABLES; 