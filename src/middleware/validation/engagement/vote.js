import { body, param } from 'express-validator';
import { handleValidationErrors } from '../common.js';

// Vote validation rules
export const validateVoteCreation = [
  body('user_id')
    .isInt({ min: 1 })
    .withMessage('Valid user ID is required'),

  body('idea_id')
    .isInt({ min: 1 })
    .withMessage('Valid idea ID is required'),

  body('vote_type')
    .isIn(['up', 'down'])
    .withMessage('Vote type must be up or down'),

  handleValidationErrors,
];

export const validateVoteUpdate = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid vote ID'),

  body('user_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid user ID is required'),

  body('idea_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid idea ID is required'),

  body('vote_type')
    .optional()
    .isIn(['up', 'down'])
    .withMessage('Vote type must be up or down'),

  handleValidationErrors,
];

export const validateVoteDeletion = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid vote ID'),

  handleValidationErrors,
];