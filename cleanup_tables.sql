-- Script dọn dẹp bảng thừa
-- Chạy trong MySQL Workbench hoặc phpMyAdmin

USE db_zinnguyen;

-- Tắt foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Kiểm tra bảng nào có dữ liệu
SELECT 'post' as table_name, COUNT(*) as record_count FROM post
UNION ALL
SELECT 'posts', COUNT(*) FROM posts;

-- Xóa bảng post (số ít) - giữ lại bảng posts (số nhiều)
DROP TABLE IF EXISTS post;

-- Bật lại foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Kiểm tra bảng còn lại
SHOW TABLES LIKE '%post%';
DESCRIBE posts;

-- Hiển thị tất cả bảng
SHOW TABLES; 