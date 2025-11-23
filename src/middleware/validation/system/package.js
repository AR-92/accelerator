import { body, param } from 'express-validator';
import { handleValidationErrors } from '../common.js';

// Package validation rules
export const validatePackageCreation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters')
    .notEmpty()
    .withMessage('Name is required'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),

  body('package_type')
    .isIn(['basic', 'premium', 'enterprise', 'custom'])
    .withMessage('Package type must be basic, premium, enterprise, or custom'),

  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('currency')
    .optional()
    .isIn(['USD', 'EUR', 'GBP', 'CAD', 'AUD'])
    .withMessage('Currency must be USD, EUR, GBP, CAD, or AUD'),

  body('billing_cycle')
    .optional()
    .isIn(['monthly', 'yearly', 'one-time'])
    .withMessage('Billing cycle must be monthly, yearly, or one-time'),

  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array'),

  body('max_users')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Max users must be a positive integer'),

  body('storage_limit_gb')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Storage limit must be a positive integer'),

  body('is_popular')
    .optional()
    .isBoolean()
    .withMessage('Is popular must be a boolean'),

  body('status')
    .optional()
    .isIn(['active', 'inactive', 'archived'])
    .withMessage('Status must be active, inactive, or archived'),

  handleValidationErrors,
];

export const validatePackageUpdate = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid package ID'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),

  body('package_type')
    .optional()
    .isIn(['basic', 'premium', 'enterprise', 'custom'])
    .withMessage('Package type must be basic, premium, enterprise, or custom'),

  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('currency')
    .optional()
    .isIn(['USD', 'EUR', 'GBP', 'CAD', 'AUD'])
    .withMessage('Currency must be USD, EUR, GBP, CAD, or AUD'),

  body('billing_cycle')
    .optional()
    .isIn(['monthly', 'yearly', 'one-time'])
    .withMessage('Billing cycle must be monthly, yearly, or one-time'),

  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array'),

  body('max_users')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Max users must be a positive integer'),

  body('storage_limit_gb')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Storage limit must be a positive integer'),

  body('is_popular')
    .optional()
    .isBoolean()
    .withMessage('Is popular must be a boolean'),

  body('status')
    .optional()
    .isIn(['active', 'inactive', 'archived'])
    .withMessage('Status must be active, inactive, or archived'),

  handleValidationErrors,
];

export const validatePackageDeletion = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid package ID'),

  handleValidationErrors,
];