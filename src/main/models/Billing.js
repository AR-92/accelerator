const BaseModel = require('../../shared/models/BaseModel');

/**
 * Billing model representing transactions, invoices, and payments
 */
class Billing extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.userId = data.user_id || data.userId;
    this.packageId = data.package_id || data.packageId;
    this.transactionId = data.transaction_id || data.transactionId;
    // Convert amount_cents to dollars for the model
    this.amount = data.amount_cents
      ? data.amount_cents / 100
      : data.amount || 0;
    this.currency = data.currency || 'USD';
    this.status = data.status || 'pending';
    this.invoiceNumber = data.invoice_number || data.invoiceNumber;
    this.paymentMethod = data.payment_method || data.paymentMethod;
    this.provider = data.provider;
    this.providerTxId = data.provider_tx_id || data.providerTxId;
    this.description = data.description || '';
    this.metadata = data.metadata || {};
    this.processedAt = data.processed_at ? new Date(data.processed_at) : null;
    this.paidAt = data.paid_at ? new Date(data.paid_at) : null;
    this.expiresAt = data.expires_at ? new Date(data.expires_at) : null;
    this.invoiceUrl = data.invoice_url || data.invoiceUrl;
    // Convert refund_amount to dollars (assuming it's stored in cents in DB)
    this.refundAmount = data.refund_amount
      ? data.refund_amount / 100
      : data.refundAmount || 0;
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
   * Convert to database JSON (for database operations)
   * @returns {Object}
   */
  toDatabaseJSON() {
    return {
      user_id: this.userId,
      package_id: this.packageId,
      transaction_id: this.transactionId,
      amount_cents: Math.round(this.amount * 100), // Convert dollars to cents
      currency: this.currency,
      status: this.status,
      invoice_number: this.invoiceNumber,
      payment_method: this.paymentMethod,
      provider: this.provider,
      provider_tx_id: this.providerTxId,
      refund_amount: Math.round(this.refundAmount * 100), // Convert dollars to cents
      refund_reason: this.refundReason,
      paid_at: this.paidAt,
      expires_at: this.expiresAt,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
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
