const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Production security settings
const productionSecurity = {
  // Helmet security headers for production
  helmet: helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:", "https://fonts.googleapis.com", "'strict-dynamic'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https:", "'strict-dynamic'"],
        scriptSrcAttr: ["'unsafe-inline'"], // Allow inline event handlers like onclick
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'", "https:", "data:", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "https:"],
        mediaSrc: ["'self'"],
        objectSrc: ["'none'"],
        childSrc: ["'self'"],
        frameSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin',
    },
    hsts: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true,
    },
    noSniff: true,
    xssFilter: true,
    frameguard: {
      action: 'deny'
    },
  }),

  // Rate limiting for production
  rateLimit: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  }),

  // API rate limiting (stricter)
  apiRateLimit: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // limit each IP to 50 requests per windowMs to the API
    message: 'Too many API requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  }),
};

// Development security settings (less restrictive)
const developmentSecurity = {
  helmet: helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        scriptSrcAttr: ["'unsafe-inline'"], // Allow inline event handlers like onclick
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'", "https:", "data:"],
        connectSrc: ["'self'", "http:", "https:"],
        frameSrc: ["'self'", "https://www.google.com"],
      },
    },
  }),
  rateLimit: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // higher limit in development
    message: 'Too many requests from this IP, please try again later.',
  }),
  apiRateLimit: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // higher limit in development
    message: 'Too many API requests from this IP, please try again later.',
  }),
};

// Get security settings based on environment
const getSecuritySettings = () => {
  if (process.env.NODE_ENV === 'production') {
    return productionSecurity;
  } else {
    return developmentSecurity;
  }
};

module.exports = {
  getSecuritySettings,
};