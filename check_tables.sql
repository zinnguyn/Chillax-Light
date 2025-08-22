-- Script kiểm tra bảng hiện tại trong database
USE db_zinnguyen;

-- Hiển thị tất cả bảng
SHOW TABLES;

-- Kiểm tra cấu trúc bảng Posts nếu có
DESCRIBE Posts;

-- Kiểm tra cấu trúc bảng categories nếu có
DESCRIBE categories;

-- Kiểm tra cấu trúc bảng users nếu có
DESCRIBE users;

-- Kiểm tra foreign key constraints
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
WHERE REFERENCED_TABLE_SCHEMA = 'db_zinnguyen'; 