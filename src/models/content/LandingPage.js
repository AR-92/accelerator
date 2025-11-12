const BaseModel = require('../common/BaseModel');

/**
 * LandingPage model representing landing page content sections
 */
class LandingPage extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.sectionType = data.section_type || data.sectionType || 'hero'; // hero, features, testimonials, cta, etc.
    this.title = data.title || '';
    this.subtitle = data.subtitle || '';
    this.content = data.content || '';
    this.imageUrl = data.image_url || data.imageUrl || '';
    this.buttonText = data.button_text || data.buttonText || '';
    this.buttonUrl = data.button_url || data.buttonUrl || '';
    this.order = data.sort_order || data.order || 0;
    this.isActive =
      data.is_active !== undefined
        ? data.is_active
        : data.isActive !== undefined
          ? data.isActive
          : true;
    this.metadata = data.metadata || {}; // JSON field for additional data
  }

  /**
   * Convert to JSON (excludes sensitive data)
   * @returns {Object}
   */
  toJSON() {
    const obj = super.toJSON();
    if (this.metadata && typeof this.metadata === 'string') {
      try {
        obj.metadata = JSON.parse(this.metadata);
      } catch (e) {
        obj.metadata = {};
      }
    }
    return obj;
  }

  /**
   * Validate the landing page section data
   * @throws {ValidationError} If validation fails
   */
  validate() {
    const errors = [];

    if (!this.sectionType || typeof this.sectionType !== 'string') {
      errors.push('Section type is required');
    }

    if (!this.title || this.title.trim().length < 1) {
      errors.push('Title is required');
    }

    if (this.order < 0) {
      errors.push('Order must be non-negative');
    }

    const validSectionTypes = [
      'hero',
      'features',
      'testimonials',
      'cta',
      'about',
      'pricing',
      'contact',
    ];
    if (!validSectionTypes.includes(this.sectionType)) {
      errors.push('Invalid section type');
    }

    if (errors.length > 0) {
      const ValidationError = require('../../utils/errors/ValidationError');
      throw new ValidationError(errors.join(', '));
    }
  }
}

module.exports = LandingPage;
