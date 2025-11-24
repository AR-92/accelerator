import { body, param } from 'express-validator';
import { handleValidationErrors } from '../common.js';

// Idea validation rules
export const validateIdeaCreation = [
  body('user_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid user ID is required'),

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

  body('type')
    .optional()
    .isIn(['product', 'service', 'app', 'platform', 'tool', 'other'])
    .withMessage('Invalid idea type'),

  body('href')
    .optional()
    .isURL()
    .withMessage('Href must be a valid URL'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  handleValidationErrors,
];

export const validateIdeaUpdate = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid idea ID'),

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

  body('type')
    .optional()
    .isIn(['product', 'service', 'app', 'platform', 'tool', 'other'])
    .withMessage('Invalid idea type'),

  body('status')
    .optional()
    .isIn(['draft', 'pending', 'active', 'rejected', 'archived'])
    .withMessage('Invalid status'),

  body('href')
    .optional()
    .isURL()
    .withMessage('Href must be a valid URL'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  handleValidationErrors,
];

export const validateIdeaDeletion = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid idea ID'),

  handleValidationErrors,
];