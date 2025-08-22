/**
 * Admin Data Synchronization System
 * Quản lý việc đồng bộ dữ liệu giữa các trang admin
 */

class AdminDataSync {
    constructor() {
        this.channel = null;
        this.init();
    }
    
    init() {
        // Initialize BroadcastChannel for cross-tab communication
        if (typeof BroadcastChannel !== 'undefined') {
            this.channel = new BroadcastChannel('admin-data-sync');
            this.setupMessageListener();
        }
        
        // Initialize localStorage data
        this.initializeStorage();
        
        // Set up periodic sync
        this.setupPeriodicSync();
    }
    
    setupMessageListener() {
        this.channel.onmessage = (event) => {
            switch (event.data.type) {
                case 'product-added':
                    this.handleProductAdded(event.data.product);
                    break;
                case 'product-updated':
                    this.handleProductUpdated(event.data.product);
                    break;
                case 'product-deleted':
                    this.handleProductDeleted(event.data.productId);
                    break;
                case 'category-added':
                    this.handleCategoryAdded(event.data.category);
                    break;
                case 'stats-updated':
                    this.handleStatsUpdated(event.data.stats);
                    break;
            }
        };
    }
    
    initializeStorage() {
        // Initialize products data
        if (!localStorage.getItem('productsData')) {
            localStorage.setItem('productsData', '[]');
        }
        
        // Initialize categories data
        if (!localStorage.getItem('categoriesData')) {
            localStorage.setItem('categoriesData', '[]');
        }
        
        // Initialize stats
        if (!localStorage.getItem('adminStats')) {
            localStorage.setItem('adminStats', JSON.stringify({
                totalProducts: 0,
                activeProducts: 0,
                outOfStock: 0,
                totalCategories: 0,
                totalPosts: 0,
                totalUsers: 0
            }));
        }
    }
    
    setupPeriodicSync() {
        // Sync data every 30 seconds
        setInterval(() => {
            this.syncData();
        }, 30000);
    }
    
    // Product Management
    addProduct(product) {
        const products = JSON.parse(localStorage.getItem('productsData') || '[]');
        products.push(product);
        localStorage.setItem('productsData', JSON.stringify(products));
        
        // Update stats
        this.updateStats();
        
        // Broadcast to other tabs
        this.broadcast('product-added', { product });
        
        // Show notification
        this.showNotification('✅ Sản phẩm mới đã được thêm thành công!');
        
        return product;
    }
    
    updateProduct(productId, updatedProduct) {
        const products = JSON.parse(localStorage.getItem('productsData') || '[]');
        const index = products.findIndex(p => p.id == productId);
        
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedProduct };
            localStorage.setItem('productsData', JSON.stringify(products));
            
            // Update stats
            this.updateStats();
            
            // Broadcast to other tabs
            this.broadcast('product-updated', { product: products[index] });
            
            this.showNotification('✅ Sản phẩm đã được cập nhật thành công!');
            return products[index];
        }
        
        return null;
    }
    
    deleteProduct(productId) {
        const products = JSON.parse(localStorage.getItem('productsData') || '[]');
        const filteredProducts = products.filter(p => p.id != productId);
        
        if (filteredProducts.length !== products.length) {
            localStorage.setItem('productsData', JSON.stringify(filteredProducts));
            
            // Update stats
            this.updateStats();
            
            // Broadcast to other tabs
            this.broadcast('product-deleted', { productId });
            
            this.showNotification('✅ Sản phẩm đã được xóa thành công!');
            return true;
        }
        
        return false;
    }
    
    // Category Management
    addCategory(category) {
        const categories = JSON.parse(localStorage.getItem('categoriesData') || '[]');
        categories.push(category);
        localStorage.setItem('categoriesData', JSON.stringify(categories));
        
        // Update stats
        this.updateStats();
        
        // Broadcast to other tabs
        this.broadcast('category-added', { category });
        
        this.showNotification('✅ Danh mục mới đã được thêm thành công!');
        
        return category;
    }
    
    // Stats Management
    updateStats() {
        const products = JSON.parse(localStorage.getItem('productsData') || '[]');
        const categories = JSON.parse(localStorage.getItem('categoriesData') || '[]');
        
        const stats = {
            totalProducts: products.length,
            activeProducts: products.filter(p => p.status === 'active').length,
            outOfStock: products.filter(p => p.stock === 0 || !p.stock).length,
            totalCategories: categories.length,
            totalPosts: parseInt(localStorage.getItem('totalPosts') || '0'),
            totalUsers: parseInt(localStorage.getItem('totalUsers') || '0')
        };
        
        localStorage.setItem('adminStats', JSON.stringify(stats));
        
        // Broadcast stats update
        this.broadcast('stats-updated', { stats });
        
        return stats;
    }
    
    getStats() {
        return JSON.parse(localStorage.getItem('adminStats') || '{}');
    }
    
    // Utility Functions
    broadcast(type, data) {
        if (this.channel) {
            this.channel.postMessage({ type, ...data });
        }
    }
    
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        const bgColor = type === 'success' ? 'linear-gradient(135deg, #d81b60 0%, #c2185b 100%)' : 
                       type === 'error' ? 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)' :
                       'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)';
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            font-weight: 500;
            animation: slideIn 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        notification.textContent = message;
        
        // Add animation CSS if not exists
        if (!document.querySelector('#admin-notification-style')) {
            const style = document.createElement('style');
            style.id = 'admin-notification-style';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
    
    // Event Handlers
    handleProductAdded(product) {
        console.log('Product added event received:', product);
        this.updateStats();
        this.refreshDisplay();
    }
    
    handleProductUpdated(product) {
        console.log('Product updated event received:', product);
        this.updateStats();
        this.refreshDisplay();
    }
    
    handleProductDeleted(productId) {
        console.log('Product deleted event received:', productId);
        this.updateStats();
        this.refreshDisplay();
    }
    
    handleCategoryAdded(category) {
        console.log('Category added event received:', category);
        this.updateStats();
        this.refreshDisplay();
    }
    
    handleStatsUpdated(stats) {
        console.log('Stats updated event received:', stats);
        this.refreshDisplay();
    }
    
    refreshDisplay() {
        // Update dashboard stats if on dashboard page
        if (document.querySelector('.stats-container')) {
            this.updateDashboardDisplay();
        }
        
        // Update products page if on products page
        if (document.querySelector('#tab-products')) {
            this.updateProductsDisplay();
        }
    }
    
    updateDashboardDisplay() {
        const stats = this.getStats();
        const statsCards = document.querySelectorAll('.stat-card .number');
        
        if (statsCards.length >= 4) {
            // Update products count
            if (statsCards[1]) statsCards[1].textContent = stats.totalProducts || 0;
            // Update active products count
            if (statsCards[2]) statsCards[2].textContent = stats.activeProducts || 0;
            // Update out of stock count
            if (statsCards[3]) statsCards[3].textContent = stats.outOfStock || 0;
        }
    }
    
    updateProductsDisplay() {
        const stats = this.getStats();
        const statsNumbers = document.querySelectorAll('.stat-card .number');
        const tabCounts = document.querySelectorAll('.tab-button .count');
        
        if (statsNumbers.length >= 4) {
            statsNumbers[0].textContent = stats.totalProducts || 0;
            statsNumbers[1].textContent = stats.activeProducts || 0;
            statsNumbers[2].textContent = stats.outOfStock || 0;
            statsNumbers[3].textContent = stats.totalCategories || 0;
        }
        
        if (tabCounts.length >= 2) {
            tabCounts[0].textContent = stats.totalProducts || 0;
            tabCounts[1].textContent = stats.totalCategories || 0;
        }
    }
    
    // Data sync with server
    async syncData() {
        try {
            // Fetch latest data from server
            const response = await fetch('/admin/api/sync-data');
            if (response.ok) {
                const data = await response.json();
                
                // Update localStorage with server data
                if (data.products) {
                    localStorage.setItem('productsData', JSON.stringify(data.products));
                }
                if (data.categories) {
                    localStorage.setItem('categoriesData', JSON.stringify(data.categories));
                }
                if (data.stats) {
                    localStorage.setItem('adminStats', JSON.stringify(data.stats));
                }
                
                // Refresh display
                this.refreshDisplay();
                
                console.log('Data synced with server successfully');
            }
        } catch (error) {
            console.error('Error syncing data with server:', error);
        }
    }
}

// Initialize the sync system
const adminSync = new AdminDataSync();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminDataSync;
} else {
    window.AdminDataSync = AdminDataSync;
    window.adminSync = adminSync;
} 