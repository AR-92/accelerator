/**
 * Not Found Error class for handling resource not found cases
 */
class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }

  /**
   * Convert to JSON for API responses
   * @returns {Object}
   */
  toJSON() {
    return {
      error: this.name,
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}

module.exports = NotFoundError;
