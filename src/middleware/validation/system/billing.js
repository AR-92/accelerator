import { body, param } from 'express-validator';
import { handleValidationErrors } from '../common.js';

// Billing validation rules
export const validateBillingCreation = [
  body('user_id').isInt({ min: 1 }).withMessage('Valid user ID is required'),

  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),

  body('currency')
    .optional()
    .isIn(['USD', 'EUR', 'GBP', 'CAD', 'AUD'])
    .withMessage('Currency must be USD, EUR, GBP, CAD, or AUD'),

  body('billing_type')
    .isIn(['subscription', 'one-time', 'usage', 'refund'])
    .withMessage(
      'Billing type must be subscription, one-time, usage, or refund'
    ),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),

  body('status')
    .optional()
    .isIn(['pending', 'paid', 'failed', 'refunded', 'cancelled'])
    .withMessage(
      'Status must be pending, paid, failed, refunded, or cancelled'
    ),

  body('payment_method')
    .optional()
    .isIn(['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'crypto'])
    .withMessage(
      'Payment method must be credit_card, debit_card, paypal, bank_transfer, or crypto'
    ),

  body('invoice_number')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Invoice number must not exceed 100 characters'),

  body('due_date')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),

  body('paid_date')
    .optional()
    .isISO8601()
    .withMessage('Paid date must be a valid date'),

  handleValidationErrors,
];

export const validateBillingUpdate = [
  param('id').isInt({ min: 1 }).withMessage('Invalid billing ID'),

  body('amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),

  body('currency')
    .optional()
    .isIn(['USD', 'EUR', 'GBP', 'CAD', 'AUD'])
    .withMessage('Currency must be USD, EUR, GBP, CAD, or AUD'),

  body('billing_type')
    .optional()
    .isIn(['subscription', 'one-time', 'usage', 'refund'])
    .withMessage(
      'Billing type must be subscription, one-time, usage, or refund'
    ),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),

  body('status')
    .optional()
    .isIn(['pending', 'paid', 'failed', 'refunded', 'cancelled'])
    .withMessage(
      'Status must be pending, paid, failed, refunded, or cancelled'
    ),

  body('payment_method')
    .optional()
    .isIn(['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'crypto'])
    .withMessage(
      'Payment method must be credit_card, debit_card, paypal, bank_transfer, or crypto'
    ),

  body('invoice_number')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Invoice number must not exceed 100 characters'),

  body('due_date')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),

  body('paid_date')
    .optional()
    .isISO8601()
    .withMessage('Paid date must be a valid date'),

  handleValidationErrors,
];

export const validateBillingDeletion = [
  param('id').isInt({ min: 1 }).withMessage('Invalid billing ID'),

  handleValidationErrors,
];
