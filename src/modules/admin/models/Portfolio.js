const BaseModel = require('../../../shared/models/BaseModel');

/**
 * Portfolio model representing a portfolio item
 */
class Portfolio extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.userId = data.user_id;
    this.title = data.title;
    this.description = data.description;
    this.category = data.category;
    this.tags = data.tags
      ? Array.isArray(data.tags)
        ? data.tags
        : JSON.parse(data.tags)
      : [];
    this.votes = data.votes || 0;
    this.isPublic = data.isPublic || data.is_public || true;
    this.image = data.image;
    this.createdDate =
      data.createdDate || data.created_date
        ? new Date(data.createdDate || data.created_date)
        : new Date();
    this.updatedDate =
      data.updatedDate || data.updated_date
        ? new Date(data.updatedDate || data.updated_date)
        : new Date();
  }

  /**
   * Add a tag to the portfolio
   * @param {string} tag
   */
  addTag(tag) {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      this.touch();
    }
  }

  /**
   * Remove a tag from the portfolio
   * @param {string} tag
   */
  removeTag(tag) {
    const index = this.tags.indexOf(tag);
    if (index > -1) {
      this.tags.splice(index, 1);
      this.touch();
    }
  }

  /**
   * Check if portfolio has a specific tag
   * @param {string} tag
   * @returns {boolean}
   */
  hasTag(tag) {
    return this.tags.includes(tag);
  }

  /**
   * Get tags as comma-separated string
   * @returns {string}
   */
  get tagsString() {
    return this.tags.join(', ');
  }

  /**
   * Set tags from comma-separated string
   * @param {string} tagsString
   */
  set tagsString(tagsString) {
    this.tags = tagsString
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag);
  }

  /**
   * Increment vote count
   */
  incrementVotes() {
    this.votes += 1;
    this.touch();
  }

  /**
   * Decrement vote count
   */
  decrementVotes() {
    if (this.votes > 0) {
      this.votes -= 1;
      this.touch();
    }
  }

  /**
   * Convert to JSON
   * @returns {Object}
   */
  toJSON() {
    const obj = super.toJSON();
    obj.tags = this.tags;
    obj.createdDate = this.createdDate.toISOString();
    obj.updatedDate = this.updatedDate.toISOString();
    return obj;
  }

  /**
   * Validate portfolio data
   * @throws {ValidationError}
   */
  validate() {
    const errors = [];

    if (!this.title || this.title.trim().length < 3) {
      errors.push('Title must be at least 3 characters');
    }

    if (!this.category || this.category.trim().length === 0) {
      errors.push('Category is required');
    }

    if (this.votes < 0) {
      errors.push('Votes cannot be negative');
    }

    if (errors.length > 0) {
      const ValidationError = require('../../utils/errors/ValidationError');
      throw new ValidationError('Portfolio validation failed', errors);
    }
  }

  /**
   * Get validation rules for portfolio creation
   * @returns {Object}
   */
  static getValidationRules() {
    return {
      title: { required: true, minLength: 3 },
      description: { required: false },
      category: { required: true },
      tags: { required: false, type: 'array' },
      isPublic: { required: false, type: 'boolean' },
      image: { required: false },
    };
  }
}

module.exports = Portfolio;
