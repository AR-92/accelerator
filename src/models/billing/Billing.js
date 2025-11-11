const BaseModel = require('../common/BaseModel');

/**
 * Billing model representing transactions, invoices, and payments
 */
class Billing extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.userId = data.user_id || data.userId;
    this.packageId = data.package_id || data.packageId;
    this.transactionId = data.transaction_id || data.transactionId;
    this.amount = data.amount || 0;
    this.currency = data.currency || 'USD';
    this.status = data.status || 'pending';
    this.paymentMethod = data.payment_method || data.paymentMethod;
    this.description = data.description || '';
    this.metadata = data.metadata || {};
    this.processedAt = data.processed_at ? new Date(data.processed_at) : null;
    this.invoiceUrl = data.invoice_url || data.invoiceUrl;
    this.refundAmount = data.refund_amount || data.refundAmount || 0;
    this.refundReason = data.refund_reason || data.refundReason;
  }

  /**
   * Convert to JSON (excludes sensitive data)
   * @returns {Object}
   */
  toJSON() {
    const obj = super.toJSON();
    return obj;
  }

  /**
   * Convert to public JSON (for API responses)
   * @returns {Object}
   */
  toPublicJSON() {
    return {
      id: this.id,
      userId: this.userId,
      packageId: this.packageId,
      transactionId: this.transactionId,
      amount: this.amount,
      currency: this.currency,
      status: this.status,
      paymentMethod: this.paymentMethod,
      description: this.description,
      metadata: this.metadata,
      processedAt: this.processedAt,
      invoiceUrl: this.invoiceUrl,
      refundAmount: this.refundAmount,
      refundReason: this.refundReason,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Validate billing data
   * @throws {ValidationError}
   */
  validate() {
    const errors = [];

    if (!this.userId) {
      errors.push('User ID is required');
    }

    if (this.amount < 0) {
      errors.push('Amount cannot be negative');
    }

    if (!this.currency || this.currency.length !== 3) {
      errors.push('Valid currency code is required');
    }

    if (
      ![
        'pending',
        'processing',
        'completed',
        'failed',
        'refunded',
        'cancelled',
      ].includes(this.status)
    ) {
      errors.push('Invalid status');
    }

    if (this.refundAmount < 0) {
      errors.push('Refund amount cannot be negative');
    }

    if (this.refundAmount > this.amount) {
      errors.push('Refund amount cannot exceed original amount');
    }

    if (errors.length > 0) {
      const ValidationError = require('../../utils/errors/ValidationError');
      throw new ValidationError('Billing validation failed', errors);
    }
  }

  /**
   * Get validation rules for billing creation
   * @returns {Object}
   */
  static getValidationRules() {
    return {
      userId: { required: true, type: 'number' },
      packageId: { required: false, type: 'number' },
      transactionId: { required: false, type: 'string' },
      amount: { required: true, type: 'number', min: 0 },
      currency: { required: false, type: 'string', length: 3 },
      status: {
        required: false,
        enum: [
          'pending',
          'processing',
          'completed',
          'failed',
          'refunded',
          'cancelled',
        ],
      },
      paymentMethod: { required: false, type: 'string' },
      description: { required: false, type: 'string' },
      metadata: { required: false, type: 'object' },
      invoiceUrl: { required: false, type: 'string' },
      refundAmount: { required: false, type: 'number', min: 0 },
      refundReason: { required: false, type: 'string' },
    };
  }
}

module.exports = Billing;
