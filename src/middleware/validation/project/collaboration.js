import { body, param } from 'express-validator';
import { handleValidationErrors } from '../common.js';

// Collaboration validation rules
export const validateCollaborationCreation = [
  body('user_id').isInt({ min: 1 }).withMessage('Valid user ID is required'),

  body('project_id')
    .isInt({ min: 1 })
    .withMessage('Valid project ID is required'),

  body('role')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Role must be between 1 and 100 characters'),

  body('permissions')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Permissions must not exceed 500 characters'),

  body('status')
    .optional()
    .isIn(['pending', 'active', 'inactive'])
    .withMessage('Status must be pending, active, or inactive'),

  handleValidationErrors,
];

export const validateCollaborationUpdate = [
  param('id').isInt({ min: 1 }).withMessage('Invalid collaboration ID'),

  body('user_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid user ID is required'),

  body('project_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid project ID is required'),

  body('role')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Role must be between 1 and 100 characters'),

  body('permissions')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Permissions must not exceed 500 characters'),

  body('status')
    .optional()
    .isIn(['pending', 'active', 'inactive'])
    .withMessage('Status must be pending, active, or inactive'),

  handleValidationErrors,
];

export const validateCollaborationDeletion = [
  param('id').isInt({ min: 1 }).withMessage('Invalid collaboration ID'),

  handleValidationErrors,
];
