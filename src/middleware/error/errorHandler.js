import config from '../../config/index.js';
import logger from '../../utils/logger.js';

// Helper to check if request is from HTMX
const isHtmxRequest = (req) => {
  return (
    req.headers['hx-request'] ||
    req.headers['HX-Request'] ||
    req.get('HX-Request')
  );
};

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(err.stack);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    error = { message, statusCode: 400 };
  }

  // Check if request is from HTMX
  if (isHtmxRequest(req)) {
    // Return HTML error for HTMX requests
    res.status(error.statusCode || 500).send(`
      <div class="alert alert-error p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-800">${error.message || 'An error occurred'}</p>
      </div>
    `);
  } else {
    // Return JSON error for API requests
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Server Error',
      ...(config.nodeEnv === 'development' && { stack: err.stack }),
    });
  }
};

export default errorHandler;
