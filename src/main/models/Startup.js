const BaseModel = require('../../common/models/BaseModel');

/**
 * Startup model representing a startup company
 */
class Startup extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.userId = data.user_id;
    this.name = data.name;
    this.description = data.description;
    this.industry = data.industry;
    this.foundedDate = data.founded_date;
    this.website = data.website;
    this.status = data.status || 'active';
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
   * Validate startup data
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

    if (errors.length > 0) {
      const ValidationError = require('../../utils/errors/ValidationError');
      throw new ValidationError('Startup validation failed', errors);
    }
  }

  /**
   * Get validation rules for startup creation
   * @returns {Object}
   */
  static getValidationRules() {
    return {
      name: { required: true, minLength: 2 },
      description: { required: false },
      industry: { required: true },
      foundedDate: { required: false, type: 'date' },
      website: { required: false, type: 'url' },
      status: {
        required: false,
        enum: ['active', 'inactive', 'acquired', 'failed'],
      },
    };
  }
}

module.exports = Startup;
