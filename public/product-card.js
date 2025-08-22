document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.product-list').forEach(listContainer => {
        listContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.main-action-button');
            if (btn && btn.dataset.action === 'add-to-cart') {
                e.preventDefault();

                const productCard = btn.closest('.product-card');
                const productId = productCard.dataset.productId;

                // Thay nút thành XEM CHI TIẾT
                const newBtn = document.createElement('a');
                newBtn.href = `/product-details/${productId}`;
                newBtn.textContent = 'XEM CHI TIẾT';
                newBtn.className = 'main-action-button view-cart-text-only';

                btn.replaceWith(newBtn);

                // Update cart count
                const cartCount = document.getElementById('cart-count');
                if (cartCount) {
                    let count = parseInt(cartCount.textContent || '0');
                    cartCount.textContent = count + 1;
                }
            }
        });
    });
});
