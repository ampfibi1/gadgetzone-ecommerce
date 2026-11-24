const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/banner.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Public storefront
router.get('/', bannerController.getPublicBanners);

// Admin-only management
router.get('/admin/all', authenticateToken, authorizeRoles('ADMIN'), bannerController.getAllBanners);
router.post('/', authenticateToken, authorizeRoles('ADMIN'), bannerController.createBanner);
router.put('/:id', authenticateToken, authorizeRoles('ADMIN'), bannerController.updateBanner);
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), bannerController.deleteBanner);

module.exports = router;
