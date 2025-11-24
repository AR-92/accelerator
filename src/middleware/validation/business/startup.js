import { body, param } from 'express-validator';
import { handleValidationErrors } from '../common.js';

// Startup validation rules
export const validateStartupCreation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Name must be between 1 and 200 characters')
    .notEmpty()
    .withMessage('Name is required'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),

  body('industry')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Industry must not exceed 100 characters'),

  body('founded_date')
    .optional()
    .isISO8601()
    .withMessage('Founded date must be a valid date'),

  body('website').optional().isURL().withMessage('Website must be a valid URL'),

  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be either active or inactive'),

  body('funding_stage')
    .optional()
    .isIn(['idea', 'mvp', 'seed', 'series_a', 'series_b', 'growth', 'ipo'])
    .withMessage(
      'Funding stage must be idea, mvp, seed, series_a, series_b, growth, or ipo'
    ),

  body('team_size')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Team size must be a positive integer'),

  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location must not exceed 200 characters'),

  body('user_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid user ID is required'),

  handleValidationErrors,
];

export const validateStartupUpdate = [
  param('id').isInt({ min: 1 }).withMessage('Invalid startup ID'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Name must be between 1 and 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),

  body('industry')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Industry must not exceed 100 characters'),

  body('founded_date')
    .optional()
    .isISO8601()
    .withMessage('Founded date must be a valid date'),

  body('website').optional().isURL().withMessage('Website must be a valid URL'),

  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be either active or inactive'),

  body('funding_stage')
    .optional()
    .isIn(['idea', 'mvp', 'seed', 'series_a', 'series_b', 'growth', 'ipo'])
    .withMessage(
      'Funding stage must be idea, mvp, seed, series_a, series_b, growth, or ipo'
    ),

  body('team_size')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Team size must be a positive integer'),

  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location must not exceed 200 characters'),

  handleValidationErrors,
];

export const validateStartupDeletion = [
  param('id').isInt({ min: 1 }).withMessage('Invalid startup ID'),

  handleValidationErrors,
];
