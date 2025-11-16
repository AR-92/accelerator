const { Logger } = require('../../utils/logger');

// Create a logger for the middleware with global context
const logger = new Logger('RequestLogger');

/**
 * Middleware to log all requests with timing and metadata
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Override res.end to measure response time
  const originalEnd = res.end;
  res.end = function (chunk, encoding) {
    const responseTime = Date.now() - start;

    // Log the request with timing and response information
    logger.logRequest(req, res, responseTime);

    // Call the original end method
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

module.exports = {
  requestLogger,
};
