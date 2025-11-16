const BaseModel = require('../../common/models/BaseModel');

/**
 * Help Category model representing categories for help content
 */
class HelpCategory extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.name = data.name;
    this.slug = data.slug;
    this.description = data.description;
    this.icon = data.icon;
    this.color = data.color || '#3B82F6';
    this.sortOrder = data.sort_order || 0;
    this.isActive = data.is_active !== false; // Default to true
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
   * Convert to public JSON (for API responses)
   * @returns {Object}
   */
  toPublicJSON() {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
      description: this.description,
      icon: this.icon,
      color: this.color,
      sortOrder: this.sortOrder,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Validate help category data
   * @throws {ValidationError}
   */
  validate() {
    const errors = [];

    if (!this.name || this.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!this.slug || this.slug.trim().length === 0) {
      errors.push('Slug is required');
    }

    // Validate slug format (only lowercase letters, numbers, and hyphens)
    if (this.slug && !/^[a-z0-9-]+$/.test(this.slug)) {
      errors.push(
        'Slug can only contain lowercase letters, numbers, and hyphens'
      );
    }

    if (this.sortOrder < 0) {
      errors.push('Sort order cannot be negative');
    }

    if (errors.length > 0) {
      const ValidationError = require('../../utils/errors/ValidationError');
      throw new ValidationError('Help category validation failed', errors);
    }
  }

  /**
   * Get validation rules for help category creation
   * @returns {Object}
   */
  static getValidationRules() {
    return {
      name: { required: true, minLength: 2 },
      slug: { required: true, pattern: '^[a-z0-9-]+$' },
      description: { required: false },
      icon: { required: false },
      color: { required: false, pattern: '^#[0-9A-Fa-f]{6}$' },
      sortOrder: { required: false, min: 0 },
      isActive: { required: false, type: 'boolean' },
    };
  }
}

module.exports = HelpCategory;
