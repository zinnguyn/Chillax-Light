const Order = require('../models/order');
const OrderItem = require('../models/OrderItem');
const Cart = require('../models/Cart');
const Product = require('../models/product');
const { Op } = require('sequelize');

// Tạo đơn hàng mới
const createOrder = async (req, res) => {
    try {
        const {
            customerName,
            customerPhone,
            customerEmail,
            shippingAddress,
            city,
            district,
            shippingNote,
            paymentMethod,
            cartItems,
            subtotal,
            shippingFee,
            totalAmount
        } = req.body;

        const sessionId = req.sessionID;

        // Tạo số đơn hàng duy nhất
        const orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();

        // Tạo đơn hàng
        const order = await Order.create({
            orderNumber,
            sessionId,
            customerName,
            customerPhone,
            customerEmail,
            shippingAddress,
            city,
            district,
            shippingNote,
            paymentMethod,
            subtotal,
            shippingFee,
            totalAmount,
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 ngày
        });

        // Tạo chi tiết đơn hàng
        const orderItems = [];
        for (const item of cartItems) {
            const orderItem = await OrderItem.create({
                orderId: order.id,
                productId: item.product.id,
                productName: item.product.name,
                productImage: item.product.imageUrl,
                quantity: item.quantity,
                unitPrice: item.price,
                totalPrice: item.price * item.quantity
            });
            orderItems.push(orderItem);

            // Cập nhật số lượng tồn kho
            await Product.update(
                { stock: Product.sequelize.literal(`stock - ${item.quantity}`) },
                { where: { id: item.product.id } }
            );
        }

        // Xóa giỏ hàng sau khi đặt hàng thành công
        await Cart.destroy({
            where: { sessionId }
        });

        // Lấy đơn hàng với chi tiết
        const orderWithItems = await Order.findByPk(order.id, {
            include: [{
                model: OrderItem,
                as: 'OrderItems'
            }]
        });

        res.json({
            success: true,
            message: 'Đặt hàng thành công!',
            order: orderWithItems
        });

    } catch (error) {
        console.error('Lỗi tạo đơn hàng:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi tạo đơn hàng'
        });
    }
};

// Lấy danh sách đơn hàng theo session
const getOrdersBySession = async (req, res) => {
    try {
        const sessionId = req.sessionID;
        
        const orders = await Order.findAll({
            where: { sessionId },
            include: [{
                model: OrderItem,
                as: 'OrderItems'
            }],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            orders
        });

    } catch (error) {
        console.error('Lỗi lấy đơn hàng:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi lấy đơn hàng'
        });
    }
};

// Lấy chi tiết đơn hàng
const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const sessionId = req.sessionID;

        const order = await Order.findOne({
            where: { 
                id: orderId,
                sessionId 
            },
            include: [{
                model: OrderItem,
                as: 'OrderItems'
            }]
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        res.json({
            success: true,
            order
        });

    } catch (error) {
        console.error('Lỗi lấy chi tiết đơn hàng:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi lấy chi tiết đơn hàng'
        });
    }
};

// Hủy đơn hàng
const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const sessionId = req.sessionID;

        const order = await Order.findOne({
            where: { 
                id: orderId,
                sessionId,
                status: 'pending'
            }
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không thể hủy đơn hàng này'
            });
        }

        // Cập nhật trạng thái
        await order.update({ status: 'cancelled' });

        // Hoàn trả số lượng tồn kho
        const orderItems = await OrderItem.findAll({
            where: { orderId }
        });

        for (const item of orderItems) {
            await Product.update(
                { stock: Product.sequelize.literal(`stock + ${item.quantity}`) },
                { where: { id: item.productId } }
            );
        }

        res.json({
            success: true,
            message: 'Đã hủy đơn hàng thành công'
        });

    } catch (error) {
        console.error('Lỗi hủy đơn hàng:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi hủy đơn hàng'
        });
    }
};

// Admin: Lấy tất cả đơn hàng
const getAllOrders = async (req, res) => {
    try {
        const { page = 1, limit = 20, status, paymentStatus } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {};
        if (status) whereClause.status = status;
        if (paymentStatus) whereClause.paymentStatus = paymentStatus;

        const { count, rows: orders } = await Order.findAndCountAll({
            where: whereClause,
            include: [{
                model: OrderItem,
                as: 'OrderItems'
            }],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            success: true,
            orders,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            totalOrders: count
        });

    } catch (error) {
        console.error('Lỗi lấy tất cả đơn hàng:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi lấy đơn hàng'
        });
    }
};

// Admin: Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, paymentStatus } = req.body;

        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        // Cập nhật trạng thái
        if (status) order.status = status;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        // Nếu đơn hàng được giao thành công
        if (status === 'delivered') {
            order.actualDelivery = new Date();
        }

        await order.save();

        res.json({
            success: true,
            message: 'Cập nhật trạng thái thành công',
            order
        });

    } catch (error) {
        console.error('Lỗi cập nhật trạng thái đơn hàng:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi cập nhật trạng thái'
        });
    }
};

// Admin: Thống kê đơn hàng
const getOrderStats = async (req, res) => {
    try {
        const { period = 'month' } = req.query;
        
        let dateFilter;
        const now = new Date();
        
        switch (period) {
            case 'week':
                dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                dateFilter = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'year':
                dateFilter = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                dateFilter = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        // Tổng đơn hàng
        const totalOrders = await Order.count({
            where: {
                createdAt: { [Op.gte]: dateFilter }
            }
        });

        // Đơn hàng thành công
        const successfulOrders = await Order.count({
            where: {
                createdAt: { [Op.gte]: dateFilter },
                status: 'delivered'
            }
        });

        // Tổng doanh thu
        const totalRevenue = await Order.sum('totalAmount', {
            where: {
                createdAt: { [Op.gte]: dateFilter },
                status: 'delivered'
            }
        });

        // Đơn hàng theo trạng thái
        const ordersByStatus = await Order.findAll({
            attributes: [
                'status',
                [Order.sequelize.fn('COUNT', Order.sequelize.col('id')), 'count']
            ],
            where: {
                createdAt: { [Op.gte]: dateFilter }
            },
            group: ['status']
        });

        // Sản phẩm bán chạy
        const topProducts = await OrderItem.findAll({
            attributes: [
                'productId',
                'productName',
                [Order.sequelize.fn('SUM', OrderItem.sequelize.col('quantity')), 'totalSold']
            ],
            include: [{
                model: Order,
                as: 'Order',
                where: {
                    createdAt: { [Op.gte]: dateFilter },
                    status: 'delivered'
                },
                attributes: []
            }],
            group: ['productId', 'productName'],
            order: [[OrderItem.sequelize.fn('SUM', OrderItem.sequelize.col('quantity')), 'DESC']],
            limit: 10
        });

        res.json({
            success: true,
            stats: {
                totalOrders,
                successfulOrders,
                totalRevenue: totalRevenue || 0,
                ordersByStatus,
                topProducts
            }
        });

    } catch (error) {
        console.error('Lỗi lấy thống kê:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi lấy thống kê'
        });
    }
};

module.exports = {
    createOrder,
    getOrdersBySession,
    getOrderById,
    cancelOrder,
    getAllOrders,
    updateOrderStatus,
    getOrderStats
};
