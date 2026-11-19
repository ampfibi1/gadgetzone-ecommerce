const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Public routes
router.get('/', categoryController.getCategories);
router.get('/:slug', categoryController.getCategory);

// Admin routes
router.post('/', authenticateToken, authorizeRoles('ADMIN'), categoryController.createCategory);
router.put('/:id', authenticateToken, authorizeRoles('ADMIN'), categoryController.updateCategory);
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), categoryController.deleteCategory);

module.exports = router;
