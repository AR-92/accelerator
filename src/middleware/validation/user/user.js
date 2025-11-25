import { body, param } from 'express-validator';
import { handleValidationErrors } from '../common.js';

// User validation rules
export const validateUserCreation = [
  body('display_name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Display name must be between 1 and 100 characters')
    .notEmpty()
    .withMessage('Display name is required'),

  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),

  body('role')
    .optional()
    .isIn(['user', 'moderator', 'admin'])
    .withMessage('Role must be user, moderator, or admin'),

  body('status')
    .optional()
    .isIn(['active', 'inactive', 'suspended'])
    .withMessage('Status must be active, inactive, or suspended'),

  handleValidationErrors,
];

export const validateUserUpdate = [
  param('id').isInt({ min: 1 }).withMessage('Invalid user ID'),

  body('display_name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Display name must be between 1 and 100 characters'),

  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),

  body('role')
    .optional()
    .isIn(['user', 'moderator', 'admin'])
    .withMessage('Role must be user, moderator, or admin'),

  body('status')
    .optional()
    .isIn(['active', 'inactive', 'suspended'])
    .withMessage('Status must be active, inactive, or suspended'),

  handleValidationErrors,
];

export const validateUserDeletion = [
  param('id').isInt({ min: 1 }).withMessage('Invalid user ID'),

  handleValidationErrors,
];

// Account validation rules
export const validateAccountCreation = [
  body('user_id').isInt({ min: 1 }).withMessage('Valid user ID is required'),

  body('account_type')
    .isIn(['personal', 'business'])
    .withMessage('Account type must be either personal or business'),

  body('display_name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Display name must be between 1 and 100 characters'),

  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters'),

  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio must not exceed 500 characters'),

  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location must not exceed 100 characters'),

  body('website').optional().isURL().withMessage('Website must be a valid URL'),

  body('linkedin_url')
    .optional()
    .isURL()
    .withMessage('LinkedIn URL must be a valid URL'),

  body('twitter_url')
    .optional()
    .isURL()
    .withMessage('Twitter URL must be a valid URL'),

  body('github_url')
    .optional()
    .isURL()
    .withMessage('GitHub URL must be a valid URL'),

  handleValidationErrors,
];

export const validateAccountUpdate = [
  param('id').isInt({ min: 1 }).withMessage('Invalid account ID'),

  body('account_type')
    .optional()
    .isIn(['personal', 'business'])
    .withMessage('Account type must be either personal or business'),

  body('display_name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Display name must be between 1 and 100 characters'),

  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters'),

  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio must not exceed 500 characters'),

  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location must not exceed 100 characters'),

  body('website').optional().isURL().withMessage('Website must be a valid URL'),

  body('linkedin_url')
    .optional()
    .isURL()
    .withMessage('LinkedIn URL must be a valid URL'),

  body('twitter_url')
    .optional()
    .isURL()
    .withMessage('Twitter URL must be a valid URL'),

  body('github_url')
    .optional()
    .isURL()
    .withMessage('GitHub URL must be a valid URL'),

  body('is_verified')
    .optional()
    .isBoolean()
    .withMessage('Is verified must be a boolean'),

  handleValidationErrors,
];

export const validateAccountDeletion = [
  param('id').isInt({ min: 1 }).withMessage('Invalid account ID'),

  handleValidationErrors,
];

// Notification validation rules
export const validateNotificationCreation = [
  body('user_id').isInt({ min: 1 }).withMessage('Valid user ID is required'),

  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters')
    .notEmpty()
    .withMessage('Title is required'),

  body('message')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Message must not exceed 1000 characters'),

  body('type')
    .optional()
    .isIn(['info', 'warning', 'error', 'success'])
    .withMessage('Type must be info, warning, error, or success'),

  body('is_read')
    .optional()
    .isBoolean()
    .withMessage('Is read must be a boolean'),

  handleValidationErrors,
];

export const validateNotificationUpdate = [
  param('id').isInt({ min: 1 }).withMessage('Invalid notification ID'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),

  body('message')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Message must not exceed 1000 characters'),

  body('type')
    .optional()
    .isIn(['info', 'warning', 'error', 'success'])
    .withMessage('Type must be info, warning, error, or success'),

  body('is_read')
    .optional()
    .isBoolean()
    .withMessage('Is read must be a boolean'),

  handleValidationErrors,
];

export const validateNotificationDeletion = [
  param('id').isInt({ min: 1 }).withMessage('Invalid notification ID'),

  handleValidationErrors,
];
