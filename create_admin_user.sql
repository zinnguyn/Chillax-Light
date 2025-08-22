-- Script tạo admin user mới
USE db_zinnguyen;

-- Tạo admin user mới với password đơn giản
INSERT INTO users (username, email, password, role, createdAt, updatedAt) VALUES
('admin', 'admin@example.com', 'admin123', 'admin', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    password = VALUES(password),
    updatedAt = NOW();

-- Kiểm tra kết quả
SELECT 
    id,
    username,
    email,
    password,
    role,
    createdAt,
    updatedAt
FROM users 
WHERE role = 'admin'
ORDER BY id;

-- Hiển thị thông báo
SELECT 'Admin user created/updated successfully!' as message; 