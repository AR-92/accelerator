import { body, param } from 'express-validator';
import { handleValidationErrors } from '../common.js';

// Calendar validation rules
export const validateCalendarCreation = [
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

  body('event_date')
    .isISO8601()
    .withMessage('Event date must be a valid date'),

  body('start_time')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in HH:MM format'),

  body('end_time')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in HH:MM format'),

  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location must not exceed 200 characters'),

  body('event_type')
    .optional()
    .isIn(['meeting', 'deadline', 'reminder', 'appointment', 'other'])
    .withMessage('Event type must be meeting, deadline, reminder, appointment, or other'),

  body('is_recurring')
    .optional()
    .isBoolean()
    .withMessage('Is recurring must be a boolean'),

  body('recurrence_pattern')
    .optional()
    .isIn(['daily', 'weekly', 'monthly', 'yearly'])
    .withMessage('Recurrence pattern must be daily, weekly, monthly, or yearly'),

  body('user_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid user ID is required'),

  handleValidationErrors,
];

export const validateCalendarUpdate = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid calendar ID'),

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

  body('event_date')
    .optional()
    .isISO8601()
    .withMessage('Event date must be a valid date'),

  body('start_time')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in HH:MM format'),

  body('end_time')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in HH:MM format'),

  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location must not exceed 200 characters'),

  body('event_type')
    .optional()
    .isIn(['meeting', 'deadline', 'reminder', 'appointment', 'other'])
    .withMessage('Event type must be meeting, deadline, reminder, appointment, or other'),

  body('is_recurring')
    .optional()
    .isBoolean()
    .withMessage('Is recurring must be a boolean'),

  body('recurrence_pattern')
    .optional()
    .isIn(['daily', 'weekly', 'monthly', 'yearly'])
    .withMessage('Recurrence pattern must be daily, weekly, monthly, or yearly'),

  handleValidationErrors,
];

export const validateCalendarDeletion = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid calendar ID'),

  handleValidationErrors,
];