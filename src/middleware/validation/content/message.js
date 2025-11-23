import { body, param } from 'express-validator';
import { handleValidationErrors } from '../common.js';

// Message validation rules
export const validateMessageCreation = [
  body('sender_id')
    .isInt({ min: 1 })
    .withMessage('Valid sender ID is required'),

  body('receiver_id')
    .isInt({ min: 1 })
    .withMessage('Valid receiver ID is required'),

  body('subject')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Subject must be between 1 and 200 characters')
    .notEmpty()
    .withMessage('Subject is required'),

  body('content')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Content must be between 1 and 5000 characters')
    .notEmpty()
    .withMessage('Content is required'),

  body('is_read')
    .optional()
    .isBoolean()
    .withMessage('Is read must be a boolean'),

  handleValidationErrors,
];

export const validateMessageUpdate = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid message ID'),

  body('subject')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Subject must be between 1 and 200 characters'),

  body('content')
    .optional()
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Content must be between 1 and 5000 characters'),

  body('is_read')
    .optional()
    .isBoolean()
    .withMessage('Is read must be a boolean'),

  handleValidationErrors,
];

export const validateMessageDeletion = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid message ID'),

  handleValidationErrors,
];