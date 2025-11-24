import { body, param } from 'express-validator';
import { handleValidationErrors } from '../common.js';

// Content validation rules
export const validateContentCreation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters')
    .notEmpty()
    .withMessage('Title is required'),

  body('content')
    .optional()
    .trim()
    .isLength({ max: 10000 })
    .withMessage('Content must not exceed 10000 characters'),

  body('content_type')
    .isIn(['article', 'blog', 'page', 'tutorial', 'documentation'])
    .withMessage(
      'Content type must be article, blog, page, tutorial, or documentation'
    ),

  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Status must be draft, published, or archived'),

  body('author_id')
    .isInt({ min: 1 })
    .withMessage('Valid author ID is required'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),

  handleValidationErrors,
];

export const validateContentUpdate = [
  param('id').isInt({ min: 1 }).withMessage('Invalid content ID'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),

  body('content')
    .optional()
    .trim()
    .isLength({ max: 10000 })
    .withMessage('Content must not exceed 10000 characters'),

  body('content_type')
    .optional()
    .isIn(['article', 'blog', 'page', 'tutorial', 'documentation'])
    .withMessage(
      'Content type must be article, blog, page, tutorial, or documentation'
    ),

  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Status must be draft, published, or archived'),

  body('author_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid author ID is required'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),

  handleValidationErrors,
];

export const validateContentDeletion = [
  param('id').isInt({ min: 1 }).withMessage('Invalid content ID'),

  handleValidationErrors,
];
