-- Script reset password admin user
USE db_zinnguyen;

-- Cập nhật password admin thành 'admin123' (không hash - để test)
-- Trong thực tế nên hash password
UPDATE users 
SET password = 'admin123', updatedAt = NOW()
WHERE role = 'admin' OR username LIKE '%admin%';

-- Kiểm tra kết quả
SELECT 
    id,
    username,
    email,
    password,
    role,
    updatedAt
FROM users 
WHERE role = 'admin' OR username LIKE '%admin%';

-- Hiển thị thông báo thành công
SELECT 'Admin password reset to: admin123' as message; 