import rateLimit from 'express-rate-limit';
import config from '../../config/index.js';

// General rate limiting - disabled in development
export const rateLimiter =
  config.nodeEnv === 'development'
    ? (req, res, next) => next() // Skip rate limiting in development
    : rateLimit({
        windowMs: config.rateLimit.windowMs,
        max: config.rateLimit.max,
        message: {
          success: false,
          error: 'Too many requests from this IP, please try again later.',
        },
        standardHeaders: true,
        legacyHeaders: false,
      });

// Stricter rate limiting for authentication endpoints - disabled in development
export const authRateLimiter =
  config.nodeEnv === 'development'
    ? (req, res, next) => next() // Skip rate limiting in development
    : rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5, // 5 attempts per 15 minutes for auth endpoints
        message: {
          success: false,
          error:
            'Too many authentication attempts from this IP. Please try again in 15 minutes.',
        },
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests: true, // Don't count successful requests
      });
