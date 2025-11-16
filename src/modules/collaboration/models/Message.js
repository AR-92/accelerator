const BaseModel = require('../../../shared/models/BaseModel');

/**
 * Message model representing a message in a project
 */
class Message extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.projectId = data.project_id || data.projectId;
    this.userId = data.user_id || data.userId;
    this.body = data.body;
    this.type = data.type || 'message';
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
      body: this.body,
      type: this.type,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Validate message data
   * @throws {ValidationError}
   */
  validate() {
    const errors = [];

    if (!this.body || this.body.trim().length < 1) {
      errors.push('Message body is required');
    }

    if (!this.projectId || isNaN(this.projectId)) {
      errors.push('Valid project ID is required');
    }

    if (!this.userId || isNaN(this.userId)) {
      errors.push('Valid user ID is required');
    }

    if (!['message', 'chat', 'system', 'notification'].includes(this.type)) {
      errors.push('Invalid message type');
    }

    if (errors.length > 0) {
      const ValidationError = require('../../../utils/errors/ValidationError');
      throw new ValidationError('Message validation failed', errors);
    }
  }

  /**
   * Get validation rules for message creation
   * @returns {Object}
   */
  static getValidationRules() {
    return {
      body: { required: true, minLength: 1 },
      projectId: { required: true, type: 'number' },
      userId: { required: true, type: 'number' },
      type: {
        required: false,
        enum: ['message', 'chat', 'system', 'notification'],
      },
    };
  }
}

module.exports = Message;
