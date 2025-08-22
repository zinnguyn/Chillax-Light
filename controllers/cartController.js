// controllers/cartController.js
const { Cart, Product } = require('../models');

const cartController = {
    // Thêm sản phẩm vào giỏ hàng
    addToCart: async (req, res) => {
        try {
            const { productId, quantity = 1 } = req.body;
            const sessionId = req.sessionID || req.session.id;

            if (!productId) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Thiếu ID sản phẩm' 
                });
            }

            // Kiểm tra sản phẩm tồn tại
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Sản phẩm không tồn tại' 
                });
            }

            // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
            let cartItem = await Cart.findOne({
                where: { sessionId, productId }
            });

            if (cartItem) {
                // Cập nhật số lượng
                await cartItem.update({
                    quantity: cartItem.quantity + parseInt(quantity),
                    price: product.price
                });
            } else {
                // Tạo mới item
                await Cart.create({
                    sessionId,
                    productId,
                    quantity: parseInt(quantity),
                    price: product.price
                });
            }

            // Lấy thông tin giỏ hàng mới
            const cartData = await cartController.getCartData(sessionId);

            res.json({
                success: true,
                message: 'Đã thêm vào giỏ hàng',
                cart: cartData
            });

        } catch (error) {
            console.error('Lỗi thêm vào giỏ hàng:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server'
            });
        }
    },

    // Lấy thông tin giỏ hàng
    getCart: async (req, res) => {
        try {
            const sessionId = req.sessionID || req.session.id;
            const cartData = await cartController.getCartData(sessionId);

            res.json({
                success: true,
                cart: cartData
            });

        } catch (error) {
            console.error('Lỗi lấy giỏ hàng:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server'
            });
        }
    },

    // Cập nhật số lượng sản phẩm
    updateQuantity: async (req, res) => {
        try {
            const { cartItemId, quantity } = req.body;
            const sessionId = req.sessionID || req.session.id;

            if (!cartItemId || !quantity) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin'
                });
            }

            const cartItem = await Cart.findOne({
                where: { id: cartItemId, sessionId }
            });

            if (!cartItem) {
                return res.status(404).json({
                    success: false,
                    message: 'Item không tồn tại'
                });
            }

            if (quantity <= 0) {
                await cartItem.destroy();
            } else {
                await cartItem.update({ quantity });
            }

            const cartData = await cartController.getCartData(sessionId);

            res.json({
                success: true,
                message: 'Cập nhật thành công',
                cart: cartData
            });

        } catch (error) {
            console.error('Lỗi cập nhật giỏ hàng:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server'
            });
        }
    },

    // Xóa sản phẩm khỏi giỏ hàng
    removeFromCart: async (req, res) => {
        try {
            const { cartItemId } = req.params;
            const sessionId = req.sessionID || req.session.id;

            const cartItem = await Cart.findOne({
                where: { id: cartItemId, sessionId }
            });

            if (!cartItem) {
                return res.status(404).json({
                    success: false,
                    message: 'Item không tồn tại'
                });
            }

            await cartItem.destroy();

            const cartData = await cartController.getCartData(sessionId);

            res.json({
                success: true,
                message: 'Đã xóa khỏi giỏ hàng',
                cart: cartData
            });

        } catch (error) {
            console.error('Lỗi xóa khỏi giỏ hàng:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server'
            });
        }
    },

    // Xóa toàn bộ giỏ hàng
    clearCart: async (req, res) => {
        try {
            const sessionId = req.sessionID || req.session.id;

            await Cart.destroy({
                where: { sessionId }
            });

            res.json({
                success: true,
                message: 'Đã xóa giỏ hàng',
                cart: { items: [], totalItems: 0, totalPrice: 0 }
            });

        } catch (error) {
            console.error('Lỗi xóa giỏ hàng:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server'
            });
        }
    },

    // Helper function để lấy dữ liệu giỏ hàng
    getCartData: async (sessionId) => {
        const cartItems = await Cart.findAll({
            where: { sessionId },
            include: [{
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'imageUrl', 'price', 'stock']
            }],
            order: [['createdAt', 'DESC']]
        });

        let totalItems = 0;
        let totalPrice = 0;

        cartItems.forEach(item => {
            totalItems += item.quantity;
            totalPrice += item.price * item.quantity;
        });

        return {
            items: cartItems,
            totalItems,
            totalPrice: Math.round(totalPrice * 100) / 100
        };
    }
};

module.exports = cartController; 