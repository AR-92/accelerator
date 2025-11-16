const BaseModel = require('../../common/models/BaseModel');

/**
 * Reward model representing user rewards, achievements, and bonuses
 */
class Reward extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.userId = data.user_id || data.userId;
    this.type = data.type; // 'achievement', 'bonus', 'referral', 'milestone', etc.
    this.title = data.title;
    this.description = data.description || '';
    this.credits = data.credits || 0;
    this.status = data.status || 'active';
    this.earnedAt = data.earned_at ? new Date(data.earned_at) : null;
    this.expiresAt = data.expires_at ? new Date(data.expires_at) : null;
    this.metadata = data.metadata || {};
    this.adminId = data.admin_id || data.adminId; // Admin who granted the reward
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
      type: this.type,
      title: this.title,
      description: this.description,
      credits: this.credits,
      status: this.status,
      earnedAt: this.earnedAt,
      expiresAt: this.expiresAt,
      metadata: this.metadata,
      adminId: this.adminId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Check if reward is expired
   * @returns {boolean}
   */
  isExpired() {
    return this.expiresAt && new Date() > this.expiresAt;
  }

  /**
   * Check if reward is active
   * @returns {boolean}
   */
  isActive() {
    return this.status === 'active' && !this.isExpired();
  }

  /**
   * Validate reward data
   * @throws {ValidationError}
   */
  validate() {
    const errors = [];

    if (!this.userId) {
      errors.push('User ID is required');
    }

    if (!this.type) {
      errors.push('Reward type is required');
    }

    if (!this.title || this.title.trim().length < 2) {
      errors.push('Reward title must be at least 2 characters');
    }

    if (this.credits < 0) {
      errors.push('Credits cannot be negative');
    }

    if (!['active', 'used', 'expired', 'cancelled'].includes(this.status)) {
      errors.push('Invalid status');
    }

    if (this.expiresAt && this.expiresAt <= new Date()) {
      errors.push('Expiration date must be in the future');
    }

    if (errors.length > 0) {
      const ValidationError = require('../../utils/errors/ValidationError');
      throw new ValidationError('Reward validation failed', errors);
    }
  }

  /**
   * Get validation rules for reward creation
   * @returns {Object}
   */
  static getValidationRules() {
    return {
      userId: { required: true, type: 'number' },
      type: { required: true, type: 'string' },
      title: { required: true, minLength: 2 },
      description: { required: false, type: 'string' },
      credits: { required: false, type: 'number', min: 0 },
      status: {
        required: false,
        enum: ['active', 'used', 'expired', 'cancelled'],
      },
      earnedAt: { required: false, type: 'date' },
      expiresAt: { required: false, type: 'date' },
      metadata: { required: false, type: 'object' },
      adminId: { required: false, type: 'number' },
    };
  }
}

module.exports = Reward;
