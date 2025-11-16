const BaseModel = require('../../shared/models/BaseModel');

/**
 * Project model representing a collaborative project
 */
class Project extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.userId = data.user_id || data.userId;
    this.title = data.title;
    this.description = data.description;
    this.status = data.status || 'active';
  }

  /**
   * Convert to public JSON (for API responses)
   * @returns {Object}
   */
  toPublicJSON() {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      description: this.description,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Validate project data
   * @throws {ValidationError}
   */
  validate() {
    const errors = [];

    if (!this.title || this.title.trim().length < 1) {
      errors.push('Title is required');
    }

    if (!this.userId || isNaN(this.userId)) {
      errors.push('Valid user ID is required');
    }

    if (
      !['active', 'inactive', 'completed', 'archived'].includes(this.status)
    ) {
      errors.push('Invalid status');
    }

    if (errors.length > 0) {
      const ValidationError = require('../../utils/errors/ValidationError');
      throw new ValidationError('Project validation failed', errors);
    }
  }

  /**
   * Get validation rules for project creation
   * @returns {Object}
   */
  static getValidationRules() {
    return {
      title: { required: true, minLength: 1 },
      description: { required: false, type: 'string' },
      userId: { required: true, type: 'number' },
      status: {
        required: false,
        enum: ['active', 'inactive', 'completed', 'archived'],
      },
    };
  }
}

module.exports = Project;
