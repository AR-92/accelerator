/**
 * Express Application Factory
 * Creates and configures the Express application
 */

const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const fs = require('fs');
const createHandlebarsConfig = require('../config/handlebars');
const {
  errorHandler,
  notFoundHandler,
} = require('./shared/middleware/error/errorHandler');
const { getSecuritySettings } = require('../config/security');

/**
 * Create and configure Express application
 * @param {Container} container - Dependency injection container
 * @returns {Express.Application} Configured Express app
 */
const createApp = (container) => {
  const configService = container.get('configService');
  const pathService = container.get('pathService');
  const createLogger = container.get('createLogger');
  const logger = createLogger('App');

  const app = express();

  // Session configuration
  const sessionConfig = {
    secret: configService.sessionSecret,
    resave: true,
    saveUninitialized: false,
    cookie: {
      secure: configService.isProduction,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  };

  // Temporarily use memory store for sessions
  // When SKIP_DB_MIGRATION=true, use default memory store

  app.use(session(sessionConfig));

  // Middleware to set user in res.locals for all routes
  app.use((req, res, next) => {
    if (req.session.userId && req.session.user) {
      res.locals.user = req.session.user;
      res.locals.originalUser = req.session.originalUser;
    }
    next();
  });

  // Get security settings based on environment
  const securitySettings = getSecuritySettings(configService);

  // Security middleware
  app.use(securitySettings.helmet);

  // Rate limiting
  app.use(securitySettings.rateLimit);

  // API rate limiting (stricter)
  app.use('/api/', securitySettings.apiRateLimit);

  // Admin rate limiting
  app.use('/admin/', securitySettings.adminRateLimit);

  // CORS configuration
  app.use(
    cors({
      origin: configService.allowedOrigins,
      credentials: true,
    })
  );

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Set up Handlebars as the templating engine
  const { handlebarsConfig } = createHandlebarsConfig(pathService);
  app.engine('hbs', handlebarsConfig);
  app.set('view engine', 'hbs');
  app.set('views', [
    path.join(pathService.views, 'main'),
    path.join(pathService.views, 'admin'),
  ]);

  // Serve static files
  app.use(
    express.static(pathService.public, {
      maxAge: '1d',
      etag: true,
    })
  );

  // Import and use the request logging middleware
  // const {
  //   requestLogger,
  // } = require('./src/shared/middleware/logging/requestLogger');
  // app.use(requestLogger);

  // Use routes - these will be registered by modules or in bootstrap
  // Routes are mounted in bootstrap.js

  // Home route (redirect based on auth status)
  app.get('/', (req, res) => {
    if (req.session.userId && req.session.user) {
      const user = req.session.user;
      if (user.role === 'admin') {
        return res.redirect('/admin/dashboard');
      } else if (user.role === 'enterprise') {
        return res.redirect('/pages/enterprise-dashboard');
      } else if (user.role === 'corporate') {
        return res.redirect('/pages/corporate-dashboard');
      } else {
        return res.redirect('/pages/dashboard');
      }
    }
    res.redirect('/auth');
  });

  // Direct route for idea-detail (without /pages prefix)
  app.get('/idea-detail', (req, res) => {
    res.render('pages/content/view-idea', {
      title: 'Idea Detail - Accelerator Platform',
      mainPadding: 'py-8',
      layout: 'main',
    });
  });

  // Error handler
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
