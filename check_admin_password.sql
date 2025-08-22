-- Script kiểm tra password admin user
USE db_zinnguyen;

-- Kiểm tra thông tin admin user
SELECT 
    id,
    username,
    email,
    password,
    role,
    createdAt,
    updatedAt
FROM users 
WHERE role = 'admin' OR username LIKE '%admin%';

-- Kiểm tra tất cả users để so sánh
SELECT 
    id,
    username,
    email,
    password,
    role
FROM users 
ORDER BY id; 