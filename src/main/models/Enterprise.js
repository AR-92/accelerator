/**
 * Enterprise model representing an enterprise company
 */
const BaseModel = require('../../shared/models/BaseModel');

class Enterprise extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.userId = data.user_id || data.userId;
    this.name = data.name;
    this.description = data.description;
    this.industry = data.industry;
    this.foundedDate = data.founded_date || data.foundedDate;
    this.website = data.website;
    this.status = data.status || 'active';
    this.companySize = data.company_size || data.companySize;
    this.revenue = data.revenue;
    this.location = data.location;
  }

  /**
   * Convert to JSON
   * @returns {Object}
   */
  toJSON() {
    const obj = super.toJSON();
    return obj;
  }

  /**
   * Validate enterprise data
   * @throws {ValidationError}
   */
  validate() {
    const errors = [];

    if (!this.name || this.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    }

    if (!this.industry || this.industry.trim().length === 0) {
      errors.push('Industry is required');
    }

    if (this.website && !this.website.match(/^https?:\/\/.+/)) {
      errors.push('Website must be a valid URL');
    }

    if (!['active', 'inactive', 'acquired', 'failed'].includes(this.status)) {
      errors.push('Invalid status');
    }

    if (
      this.companySize &&
      !['small', 'medium', 'large', 'enterprise'].includes(this.companySize)
    ) {
      errors.push('Invalid company size');
    }

    if (errors.length > 0) {
      const ValidationError = require('../../utils/errors/ValidationError');
      throw new ValidationError('Enterprise validation failed', errors);
    }
  }

  /**
   * Get validation rules for enterprise creation
   * @returns {Object}
   */
  static getValidationRules() {
    return {
      name: {
        type: 'string',
        required: true,
        minLength: 2,
        maxLength: 255,
      },
      industry: {
        type: 'string',
        required: true,
        maxLength: 100,
      },
      description: {
        type: 'string',
        maxLength: 1000,
      },
      website: {
        type: 'string',
        pattern: /^https?:\/\/.+/,
      },
      status: {
        type: 'string',
        enum: ['active', 'inactive', 'acquired', 'failed'],
        default: 'active',
      },
      companySize: {
        type: 'string',
        enum: ['small', 'medium', 'large', 'enterprise'],
      },
      revenue: {
        type: 'number',
        min: 0,
      },
      location: {
        type: 'string',
        maxLength: 255,
      },
    };
  }
}

module.exports = Enterprise;
