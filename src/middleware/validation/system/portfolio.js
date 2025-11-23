import { body, param } from 'express-validator';
import { handleValidationErrors } from '../common.js';

// Portfolio validation rules
export const validatePortfolioCreation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters')
    .notEmpty()
    .withMessage('Title is required'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),

  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Category must not exceed 100 characters'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  body('technologies')
    .optional()
    .isArray()
    .withMessage('Technologies must be an array'),

  body('is_public')
    .optional()
    .isBoolean()
    .withMessage('Is public must be a boolean'),

  body('image')
    .optional()
    .isURL()
    .withMessage('Image must be a valid URL'),

  body('demo_url')
    .optional()
    .isURL()
    .withMessage('Demo URL must be a valid URL'),

  body('source_url')
    .optional()
    .isURL()
    .withMessage('Source URL must be a valid URL'),

  body('github_url')
    .optional()
    .isURL()
    .withMessage('GitHub URL must be a valid URL'),

  body('project_date')
    .optional()
    .isISO8601()
    .withMessage('Project date must be a valid date'),

  body('client_name')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Client name must not exceed 200 characters'),

  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),

  body('user_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid user ID is required'),

  handleValidationErrors,
];

export const validatePortfolioUpdate = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid portfolio ID'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),

  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Category must not exceed 100 characters'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  body('technologies')
    .optional()
    .isArray()
    .withMessage('Technologies must be an array'),

  body('is_public')
    .optional()
    .isBoolean()
    .withMessage('Is public must be a boolean'),

  body('image')
    .optional()
    .isURL()
    .withMessage('Image must be a valid URL'),

  body('demo_url')
    .optional()
    .isURL()
    .withMessage('Demo URL must be a valid URL'),

  body('source_url')
    .optional()
    .isURL()
    .withMessage('Source URL must be a valid URL'),

  body('github_url')
    .optional()
    .isURL()
    .withMessage('GitHub URL must be a valid URL'),

  body('project_date')
    .optional()
    .isISO8601()
    .withMessage('Project date must be a valid date'),

  body('client_name')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Client name must not exceed 200 characters'),

  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),

  handleValidationErrors,
];

export const validatePortfolioDeletion = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid portfolio ID'),

  handleValidationErrors,
];