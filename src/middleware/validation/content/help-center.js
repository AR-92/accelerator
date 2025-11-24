import { body, param } from 'express-validator';
import { handleValidationErrors } from '../common.js';

// Help center validation rules
export const validateHelpCenterCreation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters')
    .notEmpty()
    .withMessage('Title is required'),

  body('content')
    .trim()
    .isLength({ min: 1, max: 10000 })
    .withMessage('Content must be between 1 and 10000 characters')
    .notEmpty()
    .withMessage('Content is required'),

  body('category')
    .isIn(['getting-started', 'account', 'billing', 'technical', 'other'])
    .withMessage(
      'Category must be getting-started, account, billing, technical, or other'
    ),

  body('is_published')
    .optional()
    .isBoolean()
    .withMessage('Is published must be a boolean'),

  body('tags').optional().isArray().withMessage('Tags must be an array'),

  handleValidationErrors,
];

export const validateHelpCenterUpdate = [
  param('id').isInt({ min: 1 }).withMessage('Invalid help center ID'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),

  body('content')
    .optional()
    .trim()
    .isLength({ min: 1, max: 10000 })
    .withMessage('Content must be between 1 and 10000 characters'),

  body('category')
    .optional()
    .isIn(['getting-started', 'account', 'billing', 'technical', 'other'])
    .withMessage(
      'Category must be getting-started, account, billing, technical, or other'
    ),

  body('is_published')
    .optional()
    .isBoolean()
    .withMessage('Is published must be a boolean'),

  body('tags').optional().isArray().withMessage('Tags must be an array'),

  handleValidationErrors,
];

export const validateHelpCenterDeletion = [
  param('id').isInt({ min: 1 }).withMessage('Invalid help center ID'),

  handleValidationErrors,
];
