/**
 * Base model class with common functionality
 */
class BaseModel {
  constructor(data = {}) {
    this.id = data.id;
    this.createdAt = data.created_at ? new Date(data.created_at) : new Date();
    this.updatedAt = data.updated_at ? new Date(data.updated_at) : new Date();
  }

  /**
   * Convert model to plain object for JSON serialization
   * @returns {Object}
   */
  toJSON() {
    const obj = {};
    Object.keys(this).forEach((key) => {
      if (this[key] instanceof Date) {
        obj[key] = this[key].toISOString();
      } else {
        obj[key] = this[key];
      }
    });
    return obj;
  }

  /**
   * Update the updatedAt timestamp
   */
  touch() {
    this.updatedAt = new Date();
  }

  /**
   * Validate the model data
   * @throws {ValidationError} If validation fails
   */
  validate() {
    // Override in subclasses
  }

  /**
   * Get validation rules for the model
   * @returns {Object} Validation rules
   */
  static getValidationRules() {
    // Override in subclasses
    return {};
  }
}

module.exports = BaseModel;
