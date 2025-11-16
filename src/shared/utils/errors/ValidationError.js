/**
 * Validation Error class for handling validation failures
 */
class ValidationError extends Error {
  constructor(message, errors = []) {
    super(message);
    this.name = 'ValidationError';
    this.errors = Array.isArray(errors) ? errors : [errors];
    this.statusCode = 400;
  }

  /**
   * Get the first error message
   * @returns {string}
   */
  get firstError() {
    return this.errors[0] || this.message;
  }

  /**
   * Convert to JSON for API responses
   * @returns {Object}
   */
  toJSON() {
    return {
      error: this.name,
      message: this.message,
      errors: this.errors,
      statusCode: this.statusCode,
    };
  }
}

module.exports = ValidationError;
