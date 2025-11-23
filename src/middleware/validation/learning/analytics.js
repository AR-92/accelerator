import { body, param } from 'express-validator';
import { handleValidationErrors } from '../common.js';

// Learning analytics validation rules
export const validateLearningAnalyticsCreation = [
  body('user_id')
    .isInt({ min: 1 })
    .withMessage('Valid user ID is required'),

  body('content_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid content ID is required'),

  body('event_type')
    .isIn(['view', 'start', 'complete', 'pause', 'resume', 'bookmark'])
    .withMessage('Event type must be view, start, complete, pause, resume, or bookmark'),

  body('duration_seconds')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Duration must be a non-negative integer'),

  body('progress_percentage')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Progress percentage must be between 0 and 100'),

  handleValidationErrors,
];

export const validateLearningAnalyticsUpdate = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid learning analytics ID'),

  body('event_type')
    .optional()
    .isIn(['view', 'start', 'complete', 'pause', 'resume', 'bookmark'])
    .withMessage('Event type must be view, start, complete, pause, resume, or bookmark'),

  body('duration_seconds')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Duration must be a non-negative integer'),

  body('progress_percentage')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Progress percentage must be between 0 and 100'),

  handleValidationErrors,
];

export const validateLearningAnalyticsDeletion = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid learning analytics ID'),

  handleValidationErrors,
];