-- Script tạo bảng Posts thủ công (không có foreign key constraints)
-- Chạy trong MySQL Workbench hoặc phpMyAdmin

USE db_zinnguyen;

-- Tắt foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Tạo bảng Posts (không có foreign key constraints)
CREATE TABLE IF NOT EXISTS `Posts` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255),
  `content` TEXT,
  `image_url` VARCHAR(255) DEFAULT '/images/default-post.png',
  `author_name` VARCHAR(255) DEFAULT 'Admin',
  `category_id` INTEGER,
  `author_id` INTEGER,
  `status` ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  `views` INTEGER DEFAULT 0,
  `downloads` INTEGER DEFAULT 0,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Bật lại foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Kiểm tra bảng đã tạo
DESCRIBE Posts;

-- Hiển thị tất cả bảng
SHOW TABLES; 