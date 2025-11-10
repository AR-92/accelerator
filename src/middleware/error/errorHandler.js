/**
 * Centralized error handling middleware
 */

/**
 * Global error handler middleware
 */
const errorHandler = (error, req, res, next) => {
  // Log the error
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    userId: req.user ? req.user.id : 'anonymous',
    timestamp: new Date().toISOString(),
  });

  // Handle different error types
  if (error.name === 'ValidationError') {
    return res.status(error.statusCode || 400).json({
      error: 'Validation Error',
      message: error.firstError,
      details: error.errors,
    });
  }

  if (error.name === 'NotFoundError') {
    return res.status(error.statusCode || 404).json({
      error: 'Not Found',
      message: error.message,
    });
  }

  if (error.name === 'UnauthorizedError') {
    return res.status(error.statusCode || 401).json({
      error: 'Unauthorized',
      message: error.message,
    });
  }

  if (error.name === 'ForbiddenError') {
    return res.status(error.statusCode || 403).json({
      error: 'Forbidden',
      message: error.message,
    });
  }

  // Handle database errors
  if (error.code === 'SQLITE_CONSTRAINT') {
    return res.status(409).json({
      error: 'Conflict',
      message: 'A resource with this data already exists',
    });
  }

  if (error.code === 'SQLITE_BUSY') {
    return res.status(503).json({
      error: 'Service Unavailable',
      message: 'Database is temporarily busy, please try again',
    });
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid authentication token',
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication token has expired',
    });
  }

  // Handle multer/file upload errors
  if (error.name === 'MulterError') {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'File size too large',
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Unexpected file field',
      });
    }
  }

  // Default error response
  res.status(500).json({
    error: 'Internal Server Error',
    message:
      process.env.NODE_ENV === 'development'
        ? error.message
        : 'Something went wrong',
  });
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
};

/**
 * Async error wrapper to catch async errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
};
