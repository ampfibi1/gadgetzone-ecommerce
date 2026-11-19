const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { createProductValidation, updateProductValidation } = require('../validators/product.validator');

// Public routes
router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/:slug', productController.getProduct);

// Admin-only routes
router.get('/admin/all', authenticateToken, authorizeRoles('ADMIN'), productController.getAllProductsAdmin);
router.post('/', authenticateToken, authorizeRoles('ADMIN'), validate(createProductValidation), productController.createProduct);
router.put('/:id', authenticateToken, authorizeRoles('ADMIN'), validate(updateProductValidation), productController.updateProduct);
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), productController.deleteProduct);

module.exports = router;
