-- Script khôi phục dữ liệu users
USE db_zinnguyen;

-- Tắt foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Xóa dữ liệu cũ trong bảng users (nếu có)
TRUNCATE TABLE users;

-- Khôi phục dữ liệu users
INSERT INTO users (username, email, password, role, createdAt, updatedAt) VALUES
('admin', 'admin@example.com', 'admin123', 'admin', NOW(), NOW()),
('user1', 'user1@example.com', '123456', 'user', NOW(), NOW()),
('user2', 'user2@example.com', '123456', 'user', NOW(), NOW()),
('moderator', 'mod@example.com', 'mod123', 'moderator', NOW(), NOW()),
('testuser', 'test@example.com', 'test123', 'user', NOW(), NOW());

-- Bật lại foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Kiểm tra dữ liệu đã khôi phục
SELECT COUNT(*) as user_count FROM users;
SELECT * FROM users;

-- Hiển thị thông báo thành công
SELECT 'Users data restored successfully!' as message; 