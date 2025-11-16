/**
 * Collaboration model
 */
class Collaboration {
  constructor(data = {}) {
    this.id = data.id;
    this.projectId = data.project_id || data.projectId;
    this.userId = data.user_id || data.userId;
    this.message = data.message;
    this.timestamp = data.timestamp || new Date().toISOString();
  }

  /**
   * Validate collaboration data
   */
  validate() {
    if (!this.projectId) {
      throw new Error('Project ID is required');
    }
    if (!this.userId) {
      throw new Error('User ID is required');
    }
    if (!this.message || this.message.trim().length === 0) {
      throw new Error('Message is required');
    }
  }

  /**
   * Convert to JSON
   */
  toJSON() {
    return {
      id: this.id,
      projectId: this.projectId,
      userId: this.userId,
      message: this.message,
      timestamp: this.timestamp,
    };
  }

  /**
   * Convert to public JSON (for API responses)
   */
  toPublicJSON() {
    return this.toJSON();
  }
}

module.exports = Collaboration;
