const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

// bKash routes
router.post('/bkash/create', paymentController.createBkashPayment);
router.post('/bkash/execute', paymentController.executeBkashPayment);
router.get('/bkash/callback', paymentController.bkashCallback);

// COD route
router.post('/cod', paymentController.processCOD);

module.exports = router;
