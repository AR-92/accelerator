import { body, param } from 'express-validator';
import { handleValidationErrors } from '../common.js';

// Learning category validation rules
export const validateLearningCategoryCreation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters')
    .notEmpty()
    .withMessage('Name is required'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),

  body('parent_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid parent ID is required'),

  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('Is active must be a boolean'),

  handleValidationErrors,
];

export const validateLearningCategoryUpdate = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid learning category ID'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),

  body('parent_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid parent ID is required'),

  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('Is active must be a boolean'),

  handleValidationErrors,
];

export const validateLearningCategoryDeletion = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid learning category ID'),

  handleValidationErrors,
];