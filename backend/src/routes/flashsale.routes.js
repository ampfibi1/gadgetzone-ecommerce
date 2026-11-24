const express = require('express');
const router = express.Router();
const flashSaleController = require('../controllers/flashsale.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Public storefront
router.get('/active', flashSaleController.getActiveFlashSale);

// Admin-only management
router.get('/admin/all', authenticateToken, authorizeRoles('ADMIN'), flashSaleController.getAllFlashSales);
router.post('/', authenticateToken, authorizeRoles('ADMIN'), flashSaleController.createFlashSale);
router.put('/:id', authenticateToken, authorizeRoles('ADMIN'), flashSaleController.updateFlashSale);
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), flashSaleController.deleteFlashSale);

module.exports = router;
