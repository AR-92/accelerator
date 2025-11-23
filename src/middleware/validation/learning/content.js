import { body, param } from 'express-validator';
import { handleValidationErrors } from '../common.js';

// Learning content validation rules
export const validateLearningContentCreation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters')
    .notEmpty()
    .withMessage('Title is required'),

  body('content')
    .trim()
    .isLength({ min: 1, max: 50000 })
    .withMessage('Content must be between 1 and 50000 characters')
    .notEmpty()
    .withMessage('Content is required'),

  body('type')
    .isIn(['article', 'video', 'course', 'tutorial', 'quiz'])
    .withMessage('Type must be article, video, course, tutorial, or quiz'),

  body('category_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid category ID is required'),

  body('difficulty')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Difficulty must be beginner, intermediate, or advanced'),

  body('duration_minutes')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive integer'),

  body('is_published')
    .optional()
    .isBoolean()
    .withMessage('Is published must be a boolean'),

  handleValidationErrors,
];

export const validateLearningContentUpdate = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid learning content ID'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),

  body('content')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50000 })
    .withMessage('Content must be between 1 and 50000 characters'),

  body('type')
    .optional()
    .isIn(['article', 'video', 'course', 'tutorial', 'quiz'])
    .withMessage('Type must be article, video, course, tutorial, or quiz'),

  body('category_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid category ID is required'),

  body('difficulty')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Difficulty must be beginner, intermediate, or advanced'),

  body('duration_minutes')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive integer'),

  body('is_published')
    .optional()
    .isBoolean()
    .withMessage('Is published must be a boolean'),

  handleValidationErrors,
];

export const validateLearningContentDeletion = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid learning content ID'),

  handleValidationErrors,
];