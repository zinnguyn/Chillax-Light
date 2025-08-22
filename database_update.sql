-- Database Update Script
-- Thêm các cột mới vào bảng products

USE db_zinnguyen;

-- Thêm cột originalPrice
ALTER TABLE products ADD COLUMN originalPrice DECIMAL(10,2) NULL AFTER price;

-- Thêm cột isFeatured
ALTER TABLE products ADD COLUMN isFeatured BOOLEAN NOT NULL DEFAULT FALSE AFTER imageUrl;

-- Thêm cột isFavorite
ALTER TABLE products ADD COLUMN isFavorite BOOLEAN NOT NULL DEFAULT FALSE AFTER isFeatured;

-- Thêm cột isNew
ALTER TABLE products ADD COLUMN isNew BOOLEAN NOT NULL DEFAULT TRUE AFTER isFavorite;

-- Thêm cột salePercentage
ALTER TABLE products ADD COLUMN salePercentage INT NULL CHECK (salePercentage >= 0 AND salePercentage <= 100) AFTER isNew;

-- Thêm cột soldCount
ALTER TABLE products ADD COLUMN soldCount INT NOT NULL DEFAULT 0 AFTER salePercentage;

-- Cập nhật dữ liệu mẫu
UPDATE products SET 
    originalPrice = price * 1.2,
    isFeatured = TRUE,
    isFavorite = TRUE,
    isNew = TRUE,
    salePercentage = 20,
    soldCount = 0
WHERE id IN (1, 2, 3, 4);

-- Hiển thị cấu trúc bảng sau khi cập nhật
DESCRIBE products; 