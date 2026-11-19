const { body } = require('express-validator');

const createProductValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('comparePrice').optional().isFloat({ min: 0 }),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('categoryId').notEmpty().withMessage('Category is required'),
  body('sku').optional().trim(),
  body('isActive').optional().isBoolean(),
  body('isFeatured').optional().isBoolean(),
];

const updateProductValidation = [
  body('name').optional().trim().notEmpty(),
  body('description').optional().trim().notEmpty(),
  body('price').optional().isFloat({ min: 0 }),
  body('comparePrice').optional().isFloat({ min: 0 }),
  body('stock').optional().isInt({ min: 0 }),
  body('categoryId').optional().notEmpty(),
  body('sku').optional().trim(),
  body('isActive').optional().isBoolean(),
  body('isFeatured').optional().isBoolean(),
];

module.exports = { createProductValidation, updateProductValidation };
