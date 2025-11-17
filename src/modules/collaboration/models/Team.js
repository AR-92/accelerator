const BaseModel = require('../../../../src/shared/models/BaseModel');

/**
 * Team model representing a team member in a project
 */
class Team extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.projectId = data.project_id || data.projectId;
    this.userId = data.user_id || data.userId;
    this.role = data.role || 'member';
    this.joinedAt = data.joined_at ? new Date(data.joined_at) : new Date();
  }

  /**
   * Convert to public JSON (for API responses)
   * @returns {Object}
   */
  toPublicJSON() {
    return {
      id: this.id,
      projectId: this.projectId,
      userId: this.userId,
      role: this.role,
      joinedAt: this.joinedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Validate team data
   * @throws {ValidationError}
   */
  validate() {
    const errors = [];

    if (!this.projectId || isNaN(this.projectId)) {
      errors.push('Valid project ID is required');
    }

    if (!this.userId || isNaN(this.userId)) {
      errors.push('Valid user ID is required');
    }

    if (!['owner', 'admin', 'member'].includes(this.role)) {
      errors.push('Invalid role');
    }

    if (errors.length > 0) {
      const ValidationError = require('../../../utils/errors/ValidationError');
      throw new ValidationError('Team validation failed', errors);
    }
  }

  /**
   * Get validation rules for team creation
   * @returns {Object}
   */
  static getValidationRules() {
    return {
      projectId: { required: true, type: 'number' },
      userId: { required: true, type: 'number' },
      role: {
        required: false,
        enum: ['owner', 'admin', 'member'],
      },
    };
  }
}

module.exports = Team;
