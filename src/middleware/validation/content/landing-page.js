import { body, param } from 'express-validator';
import { handleValidationErrors } from '../common.js';

// Landing page validation rules
export const validateLandingPageCreation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters')
    .notEmpty()
    .withMessage('Title is required'),

  body('slug')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Slug must be between 1 and 100 characters')
    .notEmpty()
    .withMessage('Slug is required')
    .matches(/^[a-z0-9-]+$/)
    .withMessage(
      'Slug can only contain lowercase letters, numbers, and hyphens'
    ),

  body('content')
    .optional()
    .trim()
    .isLength({ max: 50000 })
    .withMessage('Content must not exceed 50000 characters'),

  body('meta_description')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Meta description must not exceed 300 characters'),

  body('is_published')
    .optional()
    .isBoolean()
    .withMessage('Is published must be a boolean'),

  body('template')
    .optional()
    .isIn(['default', 'hero', 'features', 'pricing'])
    .withMessage('Template must be default, hero, features, or pricing'),

  handleValidationErrors,
];

export const validateLandingPageUpdate = [
  param('id').isInt({ min: 1 }).withMessage('Invalid landing page ID'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),

  body('slug')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Slug must be between 1 and 100 characters')
    .matches(/^[a-z0-9-]+$/)
    .withMessage(
      'Slug can only contain lowercase letters, numbers, and hyphens'
    ),

  body('content')
    .optional()
    .trim()
    .isLength({ max: 50000 })
    .withMessage('Content must not exceed 50000 characters'),

  body('meta_description')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Meta description must not exceed 300 characters'),

  body('is_published')
    .optional()
    .isBoolean()
    .withMessage('Is published must be a boolean'),

  body('template')
    .optional()
    .isIn(['default', 'hero', 'features', 'pricing'])
    .withMessage('Template must be default, hero, features, or pricing'),

  handleValidationErrors,
];

export const validateLandingPageDeletion = [
  param('id').isInt({ min: 1 }).withMessage('Invalid landing page ID'),

  handleValidationErrors,
];
