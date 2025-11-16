const BaseModel = require('../../common/models/BaseModel');

/**
 * Idea model representing a business idea
 */
class Idea extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.userId = data.owner_user_id || data.user_id;
    this.href = data.href;
    this.title = data.title;
    this.type = data.type;
    this.typeIcon = data.typeIcon;
    this.rating = data.rating || (data.upvotes || 0) - (data.downvotes || 0);
    this.description = data.description;
    this.tags = data.tags
      ? Array.isArray(data.tags)
        ? data.tags
        : JSON.parse(data.tags)
      : [];
    this.isFavorite = data.isFavorite || data.is_favorite || false;
  }

  /**
   * Add a tag to the idea
   * @param {string} tag
   */
  addTag(tag) {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      this.touch();
    }
  }

  /**
   * Remove a tag from the idea
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
   * Check if idea has a specific tag
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
   * Convert to JSON
   * @returns {Object}
   */
  toJSON() {
    const obj = super.toJSON();
    obj.tags = this.tags;
    return obj;
  }

  /**
   * Validate idea data
   * @throws {ValidationError}
   */
  validate() {
    const errors = [];

    if (!this.title || this.title.trim().length < 3) {
      errors.push('Title must be at least 3 characters');
    }

    if (!this.href || this.href.trim().length === 0) {
      errors.push('Href is required');
    }

    if (!this.type || this.type.trim().length === 0) {
      errors.push('Type is required');
    }

    if (this.rating < 0 || this.rating > 5) {
      errors.push('Rating must be between 0 and 5');
    }

    if (errors.length > 0) {
      const ValidationError = require('../../utils/errors/ValidationError');
      throw new ValidationError('Idea validation failed', errors);
    }
  }

  /**
   * Get validation rules for idea creation
   * @returns {Object}
   */
  static getValidationRules() {
    return {
      title: { required: true, minLength: 3 },
      href: { required: true },
      type: { required: true },
      typeIcon: { required: true },
      rating: { required: false, min: 0, max: 5 },
      description: { required: false },
      tags: { required: false, type: 'array' },
    };
  }
}

module.exports = Idea;
