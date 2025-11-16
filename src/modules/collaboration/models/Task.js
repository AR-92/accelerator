const BaseModel = require('../../../shared/models/BaseModel');

/**
 * Task model representing a task in a project
 */
class Task extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.projectId = data.project_id || data.projectId;
    this.title = data.title;
    this.description = data.description;
    this.assigneeUserId = data.assignee_user_id || data.assigneeUserId;
    this.status = data.status || 'todo';
  }

  /**
   * Convert to public JSON (for API responses)
   * @returns {Object}
   */
  toPublicJSON() {
    return {
      id: this.id,
      projectId: this.projectId,
      title: this.title,
      description: this.description,
      assigneeUserId: this.assigneeUserId,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Validate task data
   * @throws {ValidationError}
   */
  validate() {
    const errors = [];

    if (!this.title || this.title.trim().length < 1) {
      errors.push('Title is required');
    }

    if (!this.projectId || isNaN(this.projectId)) {
      errors.push('Valid project ID is required');
    }

    if (!['todo', 'in_progress', 'done', 'cancelled'].includes(this.status)) {
      errors.push('Invalid status');
    }

    if (this.assigneeUserId && isNaN(this.assigneeUserId)) {
      errors.push('Invalid assignee user ID');
    }

    if (errors.length > 0) {
      const ValidationError = require('../../../utils/errors/ValidationError');
      throw new ValidationError('Task validation failed', errors);
    }
  }

  /**
   * Get validation rules for task creation
   * @returns {Object}
   */
  static getValidationRules() {
    return {
      title: { required: true, minLength: 1 },
      description: { required: false, type: 'string' },
      projectId: { required: true, type: 'number' },
      assigneeUserId: { required: false, type: 'number' },
      status: {
        required: false,
        enum: ['todo', 'in_progress', 'done', 'cancelled'],
      },
    };
  }
}

module.exports = Task;
