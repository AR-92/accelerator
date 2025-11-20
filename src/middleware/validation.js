import { body, param, query, validationResult } from 'express-validator';

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
    });
  }
  next();
};

// Todo validation rules
export const validateTodoCreation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters')
    .notEmpty()
    .withMessage('Title is required'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),

  handleValidationErrors,
];

export const validateTodoUpdate = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid todo ID'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),

  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean'),

  query('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed query parameter must be a boolean'),

  handleValidationErrors,
];

export const validateTodoDeletion = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid todo ID'),

  handleValidationErrors,
];