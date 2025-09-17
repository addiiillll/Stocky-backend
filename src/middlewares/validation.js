const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

const validateReward = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('stockSymbol').notEmpty().withMessage('Stock symbol is required'),
  body('quantity').isFloat({ min: 0.000001 }).withMessage('Quantity must be a positive number'),
  body('timestamp').optional().isISO8601().withMessage('Invalid timestamp format'),
  handleValidationErrors
];

const validateUserId = [
  param('userId').notEmpty().withMessage('User ID is required'),
  handleValidationErrors
];

module.exports = {
  validateReward,
  validateUserId,
  handleValidationErrors
};