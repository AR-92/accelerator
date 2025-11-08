const winston = require('winston');
const path = require('path');

// Logging configuration - console only
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'accelerator' },
  transports: [],
});

// If not in production, also output to console
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

// Additional logging utility functions
const logRequest = (req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.session?.userId || 'anonymous',
  });
  next();
};

const logError = (error, req, res, next) => {
  logger.error(`Error: ${error.message}`, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    body: req.body,
    params: req.params,
    query: req.query,
    stack: error.stack,
  });
  next(error);
};

module.exports = {
  logger,
  logRequest,
  logError,
};
