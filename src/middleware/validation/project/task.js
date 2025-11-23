import { body, param } from 'express-validator';
import { handleValidationErrors } from '../common.js';

// Task validation rules
export const validateTaskCreation = [
  body('project_id')
    .isInt({ min: 1 })
    .withMessage('Valid project ID is required'),

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

  body('assignee_user_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid assignee user ID is required'),

  body('status')
    .optional()
    .isIn(['todo', 'in_progress', 'review', 'completed'])
    .withMessage('Invalid status'),

  handleValidationErrors,
];

export const validateTaskUpdate = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid task ID'),

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

  body('assignee_user_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid assignee user ID is required'),

  body('status')
    .optional()
    .isIn(['todo', 'in_progress', 'review', 'completed'])
    .withMessage('Invalid status'),

  handleValidationErrors,
];

export const validateTaskDeletion = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid task ID'),

  handleValidationErrors,
];