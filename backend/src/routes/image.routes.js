const express = require('express');
const router = express.Router();
const imageController = require('../controllers/image.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Admin-only image upload and delete
router.post('/upload', authenticateToken, authorizeRoles('ADMIN'), upload.single('image'), imageController.uploadImage);
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), imageController.deleteImage);

module.exports = router;
