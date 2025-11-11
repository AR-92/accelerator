const winston = require('winston');
const path = require('path');

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define custom format for logging
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Define a more readable format for console output with enhanced styling
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(({ timestamp, level, message, context, service, ...metadata }) => {
    // Add custom styling for different log levels with ANSI colors
    let styledLevel = level.toUpperCase();
    switch(level.toLowerCase()) {
      case 'error':
        styledLevel = '\x1b[31m\x1b[1m[ERROR]\x1b[0m'; // Red + Bold
        break;
      case 'warn':
        styledLevel = '\x1b[33m\x1b[1m[WARN]\x1b[0m';  // Yellow + Bold
        break;
      case 'info':
        styledLevel = '\x1b[36m[INFO]\x1b[0m';  // Cyan
        break;
      case 'debug':
        styledLevel = '\x1b[90m[DEBUG]\x1b[0m'; // Gray
        break;
      default:
        styledLevel = `[${level.toUpperCase()}]`;
    }
    
    // Style context with a different color
    const styledContext = context ? `\x1b[35m[${context}]\x1b[0m` : '';
    
    // Format metadata nicely if it exists
    const metaString = Object.keys(metadata).length ? 
      ` \x1b[90m|\x1b[0m \x1b[90m${JSON.stringify(metadata)}\x1b[0m` : '';
    
    // Create a visually appealing structured format
    return `${timestamp} ${styledLevel} ${styledContext} ${message}${metaString}`;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'accelerator-app' },
  transports: [
    // Log to file for all levels
    new winston.transports.File({ 
      filename: path.join(logsDir, 'combined.log'),
      maxsize: '20m', // Rotate when file reaches 20MB
      maxFiles: 5,    // Keep up to 5 log files
    }),
    
    // Log errors to a separate file
    new winston.transports.File({ 
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: '20m',
      maxFiles: 5,
    }),
    
    // Log to console in all environments with colorful, readable format
    new winston.transports.Console({
      format: consoleFormat
    })
  ],
});

/**
 * Logging utility with context and metadata
 */
class Logger {
  constructor(context = 'App') {
    this.context = context;
  }

  /**
   * Log an info message
   * @param {string} message - The message to log
   * @param {Object} meta - Additional metadata to log
   */
  info(message, meta = {}) {
    logger.info(message, { context: this.context, ...meta });
  }

  /**
   * Log a warning message
   * @param {string} message - The message to log
   * @param {Object} meta - Additional metadata to log
   */
  warn(message, meta = {}) {
    logger.warn(message, { context: this.context, ...meta });
  }

  /**
   * Log an error message
   * @param {string|Error} message - The message or error to log
   * @param {Object} meta - Additional metadata to log
   */
  error(message, meta = {}) {
    if (message instanceof Error) {
      logger.error(message.message, { 
        context: this.context,
        stack: message.stack,
        ...meta 
      });
    } else {
      logger.error(message, { context: this.context, ...meta });
    }
  }

  /**
   * Log a debug message
   * @param {string} message - The message to log
   * @param {Object} meta - Additional metadata to log
   */
  debug(message, meta = {}) {
    logger.debug(message, { context: this.context, ...meta });
  }

  /**
   * Log a request
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {number} responseTime - Response time in ms
   */
  logRequest(req, res, responseTime) {
    const logData = {
      context: this.context,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      userId: req.session?.userId || 'anonymous',
      sessionId: req.sessionID || 'none'
    };

    if (res.statusCode >= 400 && res.statusCode < 500) {
      logger.warn('Request completed with client error', logData);
    } else if (res.statusCode >= 500) {
      logger.error('Request completed with server error', logData);
    } else {
      logger.info('Request completed', logData);
    }
  }

  /**
   * Log a database query
   * @param {string} operation - Database operation name
   * @param {string} sql - SQL query
   * @param {Array} params - Query parameters
   * @param {number} duration - Query execution time in ms
   * @param {Object} meta - Additional metadata
   */
  logDatabaseQuery(operation, sql, params = [], duration, meta = {}) {
    logger.info('Database query executed', {
      context: this.context,
      operation,
      sql,
      params: this.sanitizeParams(params),
      duration: `${duration}ms`,
      ...meta
    });
  }

  /**
   * Log a database error
   * @param {string} operation - Database operation name
   * @param {string} sql - SQL query
   * @param {Array} params - Query parameters
   * @param {Error} error - Error that occurred
   * @param {Object} meta - Additional metadata
   */
  logDatabaseError(operation, sql, params = [], error, meta = {}) {
    logger.error('Database query failed', {
      context: this.context,
      operation,
      sql,
      params: this.sanitizeParams(params),
      error: error.message,
      stack: error.stack,
      ...meta
    });
  }

  /**
   * Log an authentication event
   * @param {string} action - Authentication action (login, register, logout)
   * @param {string} userId - User ID
   * @param {string} email - User email
   * @param {string} ip - User IP address
   * @param {Object} meta - Additional metadata
   */
  logAuthEvent(action, userId, email, ip, meta = {}) {
    logger.info('Authentication event', {
      context: this.context,
      action,
      userId,
      email,
      ip,
      ...meta
    });
  }

  /**
   * Log business logic operations
   * @param {string} operation - Operation name
   * @param {string} userId - User ID
   * @param {Object} details - Operation details
   */
  logBusinessOperation(operation, userId, details) {
    logger.info('Business operation completed', {
      context: this.context,
      operation,
      userId,
      details
    });
  }

  /**
   * Sanitize sensitive parameters
   * @param {Array} params - Parameters to sanitize
   * @returns {Array} Sanitized parameters
   */
  sanitizeParams(params) {
    if (!Array.isArray(params)) return params;
    
    return params.map(param => {
      // If param looks like a password, hide it
      if (typeof param === 'string' && 
          (param.toLowerCase().includes('password') || 
           param.toLowerCase().includes('hash'))) {
        return '[HIDDEN]';
      }
      return param;
    });
  }
}

module.exports = { logger, Logger };