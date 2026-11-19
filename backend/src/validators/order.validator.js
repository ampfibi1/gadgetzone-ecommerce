const { body } = require('express-validator');

const createOrderValidation = [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.productId').notEmpty().withMessage('Product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress').trim().notEmpty().withMessage('Shipping address is required'),
  body('shippingCity').trim().notEmpty().withMessage('City is required'),
  body('shippingZip').optional().trim(),
  body('paymentMethod').isIn(['BKASH', 'COD']).withMessage('Invalid payment method'),
  body('guestEmail')
    .if((value, { req }) => !req.user)
    .trim()
    .isEmail()
    .withMessage('Email is required for guest checkout'),
  body('guestName')
    .if((value, { req }) => !req.user)
    .trim()
    .notEmpty()
    .withMessage('Name is required for guest checkout'),
  body('guestPhone')
    .if((value, { req }) => !req.user)
    .trim()
    .notEmpty()
    .withMessage('Phone is required for guest checkout'),
];

module.exports = { createOrderValidation };
