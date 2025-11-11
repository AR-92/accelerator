const BaseModel = require('../common/BaseModel');

/**
 * Package model representing a credit/package offering
 */
class Package extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.name = data.name;
    this.description = data.description || '';
    this.price = data.price || 0;
    this.credits = data.credits || 0;
    this.features = data.features || [];
    this.status = data.status || 'active';
    this.sortOrder = data.sort_order || 0;
    this.isPopular = data.is_popular || false;
    this.isRecommended = data.is_recommended || false;
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
      name: this.name,
      description: this.description,
      price: this.price,
      credits: this.credits,
      features: this.features,
      status: this.status,
      sortOrder: this.sortOrder,
      isPopular: this.isPopular,
      isRecommended: this.isRecommended,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Validate package data
   * @throws {ValidationError}
   */
  validate() {
    const errors = [];

    if (!this.name || this.name.trim().length < 2) {
      errors.push('Package name must be at least 2 characters');
    }

    if (this.price < 0) {
      errors.push('Price cannot be negative');
    }

    if (this.credits < 0) {
      errors.push('Credits cannot be negative');
    }

    if (!['active', 'inactive', 'archived'].includes(this.status)) {
      errors.push('Invalid status');
    }

    if (this.sortOrder < 0) {
      errors.push('Sort order cannot be negative');
    }

    if (errors.length > 0) {
      const ValidationError = require('../../utils/errors/ValidationError');
      throw new ValidationError('Package validation failed', errors);
    }
  }

  /**
   * Get validation rules for package creation
   * @returns {Object}
   */
  static getValidationRules() {
    return {
      name: { required: true, minLength: 2 },
      description: { required: false, type: 'string' },
      price: { required: false, type: 'number', min: 0 },
      credits: { required: false, type: 'number', min: 0 },
      features: { required: false, type: 'array' },
      status: {
        required: false,
        enum: ['active', 'inactive', 'archived'],
      },
      sortOrder: { required: false, type: 'number', min: 0 },
      isPopular: { required: false, type: 'boolean' },
      isRecommended: { required: false, type: 'boolean' },
    };
  }
}

module.exports = Package;
