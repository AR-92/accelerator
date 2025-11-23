import { body, param } from 'express-validator';
import { handleValidationErrors } from '../common.js';

// Project validation rules
export const validateProjectCreation = [
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

  body('visibility')
    .optional()
    .isIn(['public', 'private'])
    .withMessage('Visibility must be either public or private'),

  body('owner_user_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid owner user ID is required'),

  handleValidationErrors,
];

export const validateProjectUpdate = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid project ID'),

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

  body('visibility')
    .optional()
    .isIn(['public', 'private'])
    .withMessage('Visibility must be either public or private'),

  handleValidationErrors,
];

export const validateProjectDeletion = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid project ID'),

  handleValidationErrors,
];