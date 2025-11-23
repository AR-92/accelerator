import { body, param } from 'express-validator';
import { handleValidationErrors } from '../common.js';

// Learning assessment validation rules
export const validateLearningAssessmentCreation = [
  body('content_id')
    .isInt({ min: 1 })
    .withMessage('Valid content ID is required'),

  body('user_id')
    .isInt({ min: 1 })
    .withMessage('Valid user ID is required'),

  body('score')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Score must be between 0 and 100'),

  body('max_score')
    .isFloat({ min: 1 })
    .withMessage('Max score must be at least 1'),

  body('passed')
    .optional()
    .isBoolean()
    .withMessage('Passed must be a boolean'),

  body('time_spent_minutes')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Time spent must be a non-negative integer'),

  handleValidationErrors,
];

export const validateLearningAssessmentUpdate = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid learning assessment ID'),

  body('score')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Score must be between 0 and 100'),

  body('max_score')
    .optional()
    .isFloat({ min: 1 })
    .withMessage('Max score must be at least 1'),

  body('passed')
    .optional()
    .isBoolean()
    .withMessage('Passed must be a boolean'),

  body('time_spent_minutes')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Time spent must be a non-negative integer'),

  handleValidationErrors,
];

export const validateLearningAssessmentDeletion = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid learning assessment ID'),

  handleValidationErrors,
];