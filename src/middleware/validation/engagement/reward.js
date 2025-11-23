import { body, param } from 'express-validator';
import { handleValidationErrors } from '../common.js';

// Reward validation rules
export const validateRewardCreation = [
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

  body('points_required')
    .isInt({ min: 0 })
    .withMessage('Points required must be a non-negative integer'),

  body('type')
    .isIn(['badge', 'certificate', 'discount', 'access'])
    .withMessage('Type must be badge, certificate, discount, or access'),

  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('Is active must be a boolean'),

  handleValidationErrors,
];

export const validateRewardUpdate = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid reward ID'),

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

  body('points_required')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Points required must be a non-negative integer'),

  body('type')
    .optional()
    .isIn(['badge', 'certificate', 'discount', 'access'])
    .withMessage('Type must be badge, certificate, discount, or access'),

  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('Is active must be a boolean'),

  handleValidationErrors,
];

export const validateRewardDeletion = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid reward ID'),

  handleValidationErrors,
];