const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticateToken, optionalAuth, authorizeRoles } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { createOrderValidation } = require('../validators/order.validator');

// Public / Guest / Customer order creation
router.post('/', optionalAuth, validate(createOrderValidation), orderController.createOrder);

// Customer orders
router.get('/my-orders', authenticateToken, orderController.getMyOrders);

// Track order (public with order number)
router.get('/track/:orderNumber', orderController.trackOrder);

// Single order details (Customer sees own, Admin sees any)
router.get('/:id', authenticateToken, orderController.getOrder);

// Admin orders management
router.get('/', authenticateToken, authorizeRoles('ADMIN'), orderController.getOrders);
router.put('/:id/status', authenticateToken, authorizeRoles('ADMIN'), orderController.updateOrderStatus);

module.exports = router;
