// public/js/cart.js
class CartManager {
    constructor() {
        this.cartCounter = document.getElementById('cart-counter');
        this.cartTotal = document.getElementById('cart-total');
        this.init();
    }

    init() {
        this.loadCart();
        this.bindEvents();
    }

    bindEvents() {
        // Bind add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                e.preventDefault();
                const productId = e.target.dataset.productId;
                const quantity = parseInt(e.target.dataset.quantity) || 1;
                this.addToCart(productId, quantity);
            }
        });
    }

    async addToCart(productId, quantity = 1) {
        try {
            const response = await fetch('/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId, quantity })
            });

            const result = await response.json();

            if (result.success) {
                this.updateCartDisplay(result.cart);
                this.showNotification('Đã thêm vào giỏ hàng!', 'success');
                
                // Redirect to cart if specified
                if (window.location.pathname.includes('/product/')) {
                    setTimeout(() => {
                        window.location.href = '/cart';
                    }, 1000);
                }
            } else {
                this.showNotification(result.message || 'Lỗi thêm vào giỏ hàng', 'error');
            }
        } catch (error) {
            console.error('Lỗi thêm vào giỏ hàng:', error);
            this.showNotification('Lỗi kết nối server', 'error');
        }
    }

    async loadCart() {
        try {
            const response = await fetch('/api/cart');
            const result = await response.json();

            if (result.success) {
                this.updateCartDisplay(result.cart);
                console.log('✅ Cart loaded successfully:', result.cart);
            } else {
                console.log('⚠️ Cart load failed:', result.message);
                // Hiển thị cart rỗng
                this.updateCartDisplay({ items: [], totalItems: 0, totalPrice: 0 });
            }
        } catch (error) {
            console.error('❌ Lỗi tải giỏ hàng:', error);
            // Hiển thị cart rỗng khi có lỗi
            this.updateCartDisplay({ items: [], totalItems: 0, totalPrice: 0 });
        }
    }

    updateCartDisplay(cart) {
        console.log('🛒 Updating cart display:', cart);
        
        // Đảm bảo cart có dữ liệu hợp lệ
        const safeCart = {
            items: cart?.items || [],
            totalItems: cart?.totalItems || 0,
            totalPrice: cart?.totalPrice || 0
        };
        
        // Cập nhật cart-counter
        if (this.cartCounter) {
            this.cartCounter.textContent = safeCart.totalItems;
            this.cartCounter.style.display = safeCart.totalItems > 0 ? 'inline-flex' : 'none';
            console.log('📊 Cart counter updated:', safeCart.totalItems);
        } else {
            console.log('⚠️ Cart counter element not found');
        }

        // Cập nhật cart-total
        if (this.cartTotal) {
            const formattedPrice = this.formatPrice(safeCart.totalPrice);
            this.cartTotal.textContent = formattedPrice;
            console.log('💰 Cart total updated:', formattedPrice);
        } else {
            console.log('⚠️ Cart total element not found');
        }
        
        // Debug log
        console.log('🛒 Cart display updated:', {
            totalItems: safeCart.totalItems,
            totalPrice: safeCart.totalPrice,
            items: safeCart.items,
            cartCounter: this.cartCounter,
            cartTotal: this.cartTotal
        });
    }

    formatPrice(price) {
        if (!price || price === 0) return '0₫';
        
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px'
        });

        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.background = '#28a745';
                break;
            case 'error':
                notification.style.background = '#dc3545';
                break;
            case 'warning':
                notification.style.background = '#ffc107';
                notification.style.color = '#212529';
                break;
            default:
                notification.style.background = '#17a2b8';
        }

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize cart manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const cartManager = new CartManager();
    // Lưu instance để có thể truy cập từ bên ngoài
    window.CartManager = {
        instance: cartManager
    };
}); 