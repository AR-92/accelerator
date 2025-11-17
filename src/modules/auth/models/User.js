const BaseModel = require('../../../../src/shared/models/BaseModel');
const bcrypt = require('bcrypt');

/**
 * User model representing a system user
 */
class User extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.email = data.email;
    this.passwordHash = data.password_hash;
    this.firstName = data.first_name || data.firstName;
    this.lastName = data.last_name || data.lastName;
    this.role = data.user_type || data.role || 'startup';
    this.theme = data.theme || 'system';
    this.bio = data.bio || '';
    this.credits = data.credits || 0;
    this.status = data.status || 'active';
    this.banned = data.banned || false;
    this.bannedReason = data.banned_reason || data.bannedReason || '';
    this.bannedAt = data.banned_at || data.bannedAt;
    this.rowid = data.rowid;
  }

  /**
   * Get the user's full name
   * @returns {string}
   */
  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  /**
   * Set the user's password (hashes it)
   * @param {string} password - Plain text password
   */
  async setPassword(password) {
    this.passwordHash = await bcrypt.hash(password, 12);
  }

  /**
   * Verify a password against the stored hash
   * @param {string} password - Plain text password
   * @returns {boolean}
   */
  async verifyPassword(password) {
    return await bcrypt.compare(password, this.passwordHash);
  }

  /**
   * Convert to JSON (excludes sensitive data)
   * @returns {Object}
   */
  toJSON() {
    const obj = super.toJSON();
    delete obj.passwordHash;
    return obj;
  }

  /**
   * Convert to public JSON (for API responses)
   * @returns {Object}
   */
  toPublicJSON() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role,
      theme: this.theme,
      bio: this.bio,
      credits: this.credits,
      status: this.status,
      banned: this.banned,
      bannedReason: this.bannedReason,
      bannedAt: this.bannedAt,
      fullName: this.fullName,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Validate user data
   * @throws {ValidationError}
   */
  validate() {
    const errors = [];

    if (!this.email || !this.email.includes('@')) {
      errors.push('Valid email is required');
    }

    if (!this.firstName || this.firstName.trim().length < 2) {
      errors.push('First name must be at least 2 characters');
    }

    if (!this.lastName || this.lastName.trim().length < 2) {
      errors.push('Last name must be at least 2 characters');
    }

    if (!['startup', 'corporate', 'enterprise', 'admin'].includes(this.role)) {
      errors.push('Invalid role');
    }

    if (!['active', 'inactive'].includes(this.status)) {
      errors.push('Invalid status');
    }

    if (this.credits < 0) {
      errors.push('Credits cannot be negative');
    }

    if (errors.length > 0) {
      const ValidationError = require('../../utils/errors/ValidationError');
      throw new ValidationError('User validation failed', errors);
    }
  }

  /**
   * Get validation rules for user creation
   * @returns {Object}
   */
  static getValidationRules() {
    return {
      email: { required: true, type: 'email' },
      firstName: { required: true, minLength: 2 },
      lastName: { required: true, minLength: 2 },
      password: { required: true, minLength: 6 },
      role: {
        required: false,
        enum: ['startup', 'corporate', 'enterprise', 'admin'],
      },
      credits: { required: false, type: 'number', min: 0 },
      status: {
        required: false,
        enum: ['active', 'inactive'],
      },
      banned: { required: false, type: 'boolean' },
      bannedReason: { required: false, type: 'string' },
    };
  }
}

module.exports = User;
