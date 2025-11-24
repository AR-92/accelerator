import { body, param } from 'express-validator';
import { handleValidationErrors } from '../common.js';

// Business model validation rules
export const validateBusinessModelCreation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Name must be between 1 and 200 characters')
    .notEmpty()
    .withMessage('Name is required'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),

  body('model_type')
    .isIn([
      'subscription',
      'freemium',
      'advertising',
      'transactional',
      'marketplace',
      'other',
    ])
    .withMessage(
      'Model type must be subscription, freemium, advertising, transactional, marketplace, or other'
    ),

  body('revenue_streams')
    .optional()
    .isArray()
    .withMessage('Revenue streams must be an array'),

  body('cost_structure')
    .optional()
    .isArray()
    .withMessage('Cost structure must be an array'),

  body('key_partners')
    .optional()
    .isArray()
    .withMessage('Key partners must be an array'),

  body('key_activities')
    .optional()
    .isArray()
    .withMessage('Key activities must be an array'),

  body('key_resources')
    .optional()
    .isArray()
    .withMessage('Key resources must be an array'),

  body('value_propositions')
    .optional()
    .isArray()
    .withMessage('Value propositions must be an array'),

  body('customer_segments')
    .optional()
    .isArray()
    .withMessage('Customer segments must be an array'),

  body('channels')
    .optional()
    .isArray()
    .withMessage('Channels must be an array'),

  body('customer_relationships')
    .optional()
    .isArray()
    .withMessage('Customer relationships must be an array'),

  body('is_template')
    .optional()
    .isBoolean()
    .withMessage('Is template must be a boolean'),

  body('industry')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Industry must not exceed 100 characters'),

  body('user_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid user ID is required'),

  handleValidationErrors,
];

export const validateBusinessModelUpdate = [
  param('id').isInt({ min: 1 }).withMessage('Invalid business model ID'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Name must be between 1 and 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),

  body('model_type')
    .optional()
    .isIn([
      'subscription',
      'freemium',
      'advertising',
      'transactional',
      'marketplace',
      'other',
    ])
    .withMessage(
      'Model type must be subscription, freemium, advertising, transactional, marketplace, or other'
    ),

  body('revenue_streams')
    .optional()
    .isArray()
    .withMessage('Revenue streams must be an array'),

  body('cost_structure')
    .optional()
    .isArray()
    .withMessage('Cost structure must be an array'),

  body('key_partners')
    .optional()
    .isArray()
    .withMessage('Key partners must be an array'),

  body('key_activities')
    .optional()
    .isArray()
    .withMessage('Key activities must be an array'),

  body('key_resources')
    .optional()
    .isArray()
    .withMessage('Key resources must be an array'),

  body('value_propositions')
    .optional()
    .isArray()
    .withMessage('Value propositions must be an array'),

  body('customer_segments')
    .optional()
    .isArray()
    .withMessage('Customer segments must be an array'),

  body('channels')
    .optional()
    .isArray()
    .withMessage('Channels must be an array'),

  body('customer_relationships')
    .optional()
    .isArray()
    .withMessage('Customer relationships must be an array'),

  body('is_template')
    .optional()
    .isBoolean()
    .withMessage('Is template must be a boolean'),

  body('industry')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Industry must not exceed 100 characters'),

  handleValidationErrors,
];

export const validateBusinessModelDeletion = [
  param('id').isInt({ min: 1 }).withMessage('Invalid business model ID'),

  handleValidationErrors,
];
