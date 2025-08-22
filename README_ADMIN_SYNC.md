# 🚀 Hệ Thống Đồng Bộ Dữ Liệu Admin

## 📋 Tổng Quan

Hệ thống này cho phép đồng bộ dữ liệu giữa các trang admin một cách real-time, đảm bảo khi thêm/sửa/xóa sản phẩm, tất cả các trang liên quan sẽ được cập nhật ngay lập tức.

## ✨ Tính Năng Chính

### 🔄 Đồng Bộ Real-time
- **Cross-tab Communication**: Sử dụng BroadcastChannel API để giao tiếp giữa các tab
- **LocalStorage Sync**: Đồng bộ dữ liệu qua localStorage
- **Automatic Updates**: Tự động cập nhật dashboard, products page khi có thay đổi

### 📊 Quản Lý Dữ Liệu
- **Products Management**: Thêm, sửa, xóa sản phẩm
- **Categories Management**: Quản lý danh mục sản phẩm
- **Stats Synchronization**: Đồng bộ thống kê giữa các trang

### 🔔 Thông Báo
- **Success Notifications**: Thông báo khi thao tác thành công
- **Error Handling**: Xử lý lỗi và hiển thị thông báo phù hợp
- **Real-time Alerts**: Thông báo ngay lập tức khi có thay đổi

## 🏗️ Cấu Trúc Hệ Thống

### 📁 Files Chính
```
views/admin/
├── products/
│   ├── add.ejs          # Trang thêm sản phẩm mới
│   └── index.ejs        # Trang quản lý sản phẩm
├── dashboard.ejs         # Trang dashboard chính
└── ...

public/js/
└── admin-sync.js         # Hệ thống đồng bộ chính
```

### 🔧 Core Components

#### 1. AdminDataSync Class
```javascript
class AdminDataSync {
    constructor() {
        this.channel = null;
        this.init();
    }
    
    // Quản lý sản phẩm
    addProduct(product)
    updateProduct(productId, updatedProduct)
    deleteProduct(productId)
    
    // Quản lý danh mục
    addCategory(category)
    
    // Quản lý thống kê
    updateStats()
    getStats()
    
    // Tiện ích
    broadcast(type, data)
    showNotification(message, type)
}
```

#### 2. Cross-tab Communication
```javascript
// Gửi thông điệp đến các tab khác
this.broadcast('product-added', { product });

// Nhận thông điệp từ các tab khác
this.channel.onmessage = (event) => {
    switch (event.data.type) {
        case 'product-added':
            this.handleProductAdded(event.data.product);
            break;
    }
};
```

## 🚀 Cách Sử Dụng

### 1. Thêm Sản Phẩm Mới

#### Bước 1: Truy cập trang thêm sản phẩm
```
/admin/products/add
```

#### Bước 2: Điền thông tin sản phẩm
- Tên sản phẩm (bắt buộc)
- Danh mục (bắt buộc)
- Giá (bắt buộc)
- Số lượng tồn kho (bắt buộc)
- Mô tả
- Hình ảnh
- Trạng thái
- Mã SKU
- Sản phẩm nổi bật

#### Bước 3: Lưu sản phẩm
- Click "💾 Lưu sản phẩm"
- Hệ thống sẽ hiển thị thông báo thành công
- Tự động chuyển hướng về trang quản lý sản phẩm sau 2 giây

### 2. Đồng Bộ Dữ Liệu

#### Tự Động
- Dữ liệu được đồng bộ tự động mỗi 30 giây
- Khi có thay đổi, tất cả các tab sẽ được cập nhật ngay lập tức

#### Thủ Công
```javascript
// Cập nhật thống kê
window.adminSync.updateStats();

// Cập nhật hiển thị dashboard
window.adminSync.updateDashboardDisplay();

// Cập nhật hiển thị products page
window.adminSync.updateProductsDisplay();
```

### 3. Quản Lý Danh Mục

#### Thêm Danh Mục Mới
```javascript
const newCategory = {
    id: Date.now(),
    name: 'Tên danh mục',
    description: 'Mô tả danh mục',
    status: 'active',
    createdAt: new Date()
};

window.adminSync.addCategory(newCategory);
```

## 🔧 Tùy Chỉnh

### 1. Thay Đổi Thời Gian Đồng Bộ
```javascript
// Trong admin-sync.js
setupPeriodicSync() {
    // Thay đổi từ 30000ms (30s) thành 60000ms (1 phút)
    setInterval(() => {
        this.syncData();
    }, 60000);
}
```

### 2. Thêm Loại Thông Báo Mới
```javascript
// Trong admin-sync.js
showNotification(message, type = 'success') {
    const bgColor = type === 'success' ? 'linear-gradient(135deg, #d81b60 0%, #c2185b 100%)' : 
                   type === 'error' ? 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)' :
                   type === 'warning' ? 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)' :
                   'linear-gradient(135deg, #17a2b8 0%, #138496 100%)'; // info
    // ... rest of the function
}
```

### 3. Thêm Loại Dữ Liệu Mới
```javascript
// Trong admin-sync.js
initializeStorage() {
    // Thêm dữ liệu mới
    if (!localStorage.getItem('newDataType')) {
        localStorage.setItem('newDataType', '[]');
    }
}
```

## 🐛 Xử Lý Lỗi

### 1. Lỗi Thường Gặp

#### BroadcastChannel không hỗ trợ
```javascript
// Fallback cho trình duyệt cũ
if (typeof BroadcastChannel !== 'undefined') {
    this.channel = new BroadcastChannel('admin-data-sync');
} else {
    console.warn('BroadcastChannel not supported, using localStorage fallback');
}
```

#### LocalStorage đầy
```javascript
try {
    localStorage.setItem('key', 'value');
} catch (error) {
    if (error.name === 'QuotaExceededError') {
        // Xóa dữ liệu cũ
        this.cleanupOldData();
    }
}
```

### 2. Debug Mode
```javascript
// Bật debug mode
localStorage.setItem('adminDebugMode', 'true');

// Trong admin-sync.js
if (localStorage.getItem('adminDebugMode') === 'true') {
    console.log('Debug mode enabled');
    // Log tất cả hoạt động
}
```

## 📱 Responsive Design

### Mobile Support
- Sidebar tự động ẩn trên mobile
- Toggle button để hiện/ẩn sidebar
- Form responsive với grid layout

### Tablet Support
- Sidebar thu nhỏ trên tablet
- Layout tối ưu cho màn hình trung bình

## 🔒 Bảo Mật

### 1. Data Validation
```javascript
// Kiểm tra dữ liệu trước khi lưu
validateProduct(product) {
    if (!product.name || !product.price || !product.category_id) {
        throw new Error('Missing required fields');
    }
    
    if (product.price < 0) {
        throw new Error('Price cannot be negative');
    }
    
    return true;
}
```

### 2. XSS Prevention
```javascript
// Sanitize input data
sanitizeInput(input) {
    return input.replace(/[<>]/g, '');
}
```

## 🚀 Performance Optimization

### 1. Debouncing
```javascript
// Tránh gọi function quá nhiều lần
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Sử dụng
const debouncedUpdate = debounce(() => {
    this.updateStats();
}, 300);
```

### 2. Lazy Loading
```javascript
// Chỉ load dữ liệu khi cần
loadProductsData() {
    if (!this.productsLoaded) {
        this.fetchProductsFromServer();
        this.productsLoaded = true;
    }
}
```

## 📊 Monitoring & Analytics

### 1. Performance Metrics
```javascript
// Đo thời gian thực thi
performance.mark('sync-start');
this.syncData();
performance.mark('sync-end');
performance.measure('data-sync', 'sync-start', 'sync-end');
```

### 2. Error Tracking
```javascript
// Log lỗi để phân tích
logError(error, context) {
    console.error('Error in AdminDataSync:', {
        error: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString()
    });
}
```

## 🔄 Migration & Updates

### 1. Cập Nhật Schema
```javascript
// Kiểm tra version và migrate nếu cần
checkAndMigrate() {
    const currentVersion = localStorage.getItem('adminSyncVersion') || '1.0.0';
    const latestVersion = '1.1.0';
    
    if (currentVersion !== latestVersion) {
        this.migrateData(currentVersion, latestVersion);
        localStorage.setItem('adminSyncVersion', latestVersion);
    }
}
```

### 2. Backup & Restore
```javascript
// Backup dữ liệu
backupData() {
    const data = {
        products: localStorage.getItem('productsData'),
        categories: localStorage.getItem('categoriesData'),
        stats: localStorage.getItem('adminStats'),
        timestamp: new Date().toISOString()
    };
    
    return JSON.stringify(data);
}

// Restore dữ liệu
restoreData(backupString) {
    try {
        const data = JSON.parse(backupString);
        Object.keys(data).forEach(key => {
            if (key !== 'timestamp') {
                localStorage.setItem(key, data[key]);
            }
        });
        return true;
    } catch (error) {
        console.error('Restore failed:', error);
        return false;
    }
}
```

## 📚 API Reference

### Methods

#### `addProduct(product)`
Thêm sản phẩm mới vào hệ thống

**Parameters:**
- `product` (Object): Thông tin sản phẩm

**Returns:**
- `Object`: Sản phẩm đã được thêm

**Example:**
```javascript
const newProduct = {
    id: Date.now(),
    name: 'iPhone 15',
    price: 25000000,
    category_id: 1,
    stock: 10,
    status: 'active'
};

const addedProduct = adminSync.addProduct(newProduct);
```

#### `updateProduct(productId, updatedProduct)`
Cập nhật thông tin sản phẩm

**Parameters:**
- `productId` (Number|String): ID sản phẩm
- `updatedProduct` (Object): Dữ liệu cập nhật

**Returns:**
- `Object|null`: Sản phẩm đã cập nhật hoặc null nếu không tìm thấy

#### `deleteProduct(productId)`
Xóa sản phẩm

**Parameters:**
- `productId` (Number|String): ID sản phẩm

**Returns:**
- `Boolean`: true nếu xóa thành công

#### `getStats()`
Lấy thống kê hiện tại

**Returns:**
- `Object`: Object chứa thống kê

**Example:**
```javascript
const stats = adminSync.getStats();
console.log('Total products:', stats.totalProducts);
console.log('Active products:', stats.activeProducts);
```

## 🎯 Best Practices

### 1. Error Handling
```javascript
try {
    const result = adminSync.addProduct(product);
    console.log('Product added successfully:', result);
} catch (error) {
    console.error('Failed to add product:', error);
    // Hiển thị thông báo lỗi cho user
}
```

### 2. Data Validation
```javascript
// Luôn validate dữ liệu trước khi gửi
if (!product.name || product.name.trim().length === 0) {
    throw new Error('Product name is required');
}
```

### 3. Performance
```javascript
// Sử dụng debouncing cho các thao tác thường xuyên
const debouncedUpdate = debounce(() => {
    adminSync.updateStats();
}, 500);
```

## 🔮 Roadmap

### Version 1.1.0 (Q1 2024)
- [ ] Support cho Posts management
- [ ] Advanced filtering và search
- [ ] Bulk operations (thêm/sửa/xóa nhiều items)

### Version 1.2.0 (Q2 2024)
- [ ] Real-time collaboration
- [ ] Offline support
- [ ] Advanced analytics dashboard

### Version 1.3.0 (Q3 2024)
- [ ] Multi-language support
- [ ] Advanced permissions system
- [ ] API endpoints cho mobile apps

## 📞 Support

Nếu bạn gặp vấn đề hoặc có câu hỏi:

1. **Check Console**: Mở Developer Tools và xem console logs
2. **Check Network**: Kiểm tra network requests trong tab Network
3. **Check Storage**: Kiểm tra localStorage trong tab Application
4. **Create Issue**: Tạo issue với thông tin chi tiết về lỗi

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

---

**Made with ❤️ by Admin Team** 