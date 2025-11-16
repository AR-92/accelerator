require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const fs = require('fs');
const { Logger } = require('./src/shared/utils/logger');
const { handlebarsConfig } = require('./config/handlebars');
const {
  errorHandler,
  notFoundHandler,
} = require('./src/shared/middleware/error/errorHandler');
const { getSecuritySettings } = require('./config/security');

// Import container and routes
const container = require('./src/container');
const authRoutes = require('./src/modules/auth/routes/pages')(
  container.get('authController')
);
const pageRoutes = require('./src/main/routes/pages');
const aiAssistantModelsRoutes = require('./src/main/routes/pages/ai-assistant-models');
const apiRoutes = require('./src/shared/routes/api/v1');
const adminRoutes = require('./src/modules/admin/routes/api/v1/admin');
const adminPageRoutes = require('./src/modules/admin/routes/pages/admin');
const startupApiRoutes = require('./src/modules/startup/routes/api');
const learningApiRoutes = require('./src/modules/learning/routes/api');
const learningPageRoutes = require('./src/modules/learning/routes/pages');
const helpApiRoutes = require('./src/modules/help/routes/api');
const helpPageRoutes = require('./src/modules/help/routes/pages');
const collaborationApiRoutes = require('./src/modules/collaboration/routes/api');
const collaborationPageRoutes = require('./src/modules/collaboration/routes/pages');

const app = express();
const port = process.env.PORT || 3000;

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: true,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
};

// Temporarily use memory store for sessions
// if (process.env.SKIP_DB_MIGRATION !== 'true') {
//   // Use PostgreSQL store when database is available
//   sessionConfig.store = new pgSession({
//     pool: require('./config/database').pool,
//     tableName: 'session',
//     createTableIfMissing: true, // Create session table if it doesn't exist
//   });
// }
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
const securitySettings = getSecuritySettings();

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
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
      process.env.BASE_URL || 'http://localhost:3000',
    ],
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Set up Handlebars as the templating engine
app.engine('hbs', handlebarsConfig);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views/main'));

// Serve static files
app.use(
  express.static(path.join(__dirname, 'public'), {
    maxAge: '1d',
    etag: true,
  })
);

// Import and use the request logging middleware
const {
  requestLogger,
} = require('./src/shared/middleware/logging/requestLogger');
app.use(requestLogger);

// Use routes
app.use('/auth', authRoutes);
app.use('/pages', pageRoutes);
app.use('/pages', aiAssistantModelsRoutes);
app.use('/api', apiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/startups', startupApiRoutes);
app.use('/api/learning', learningApiRoutes);
app.use('/learn', learningPageRoutes);
app.use('/api/help', helpApiRoutes);
app.use('/help', helpPageRoutes);
app.use('/api/collaborate', collaborationApiRoutes);
app.use('/pages/collaborate', collaborationPageRoutes);
console.log('Mounting admin routes at /admin');
app.use('/admin', adminPageRoutes);

// Health check endpoint - lightweight version for fast startup
app.get('/health', (req, res) => {
  // Return basic health status immediately without database checks
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: require('./package.json').version,
    database: 'Initializing...', // Will be updated once DB is ready
  };

  res.status(200).json(healthCheck);
});

// Detailed health check endpoint
app.get('/health/detailed', async (req, res) => {
  try {
    // Check basic server status
    const healthCheck = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: require('./package.json').version,
    };

    // Check database connection
    const { testConnection } = require('./config/database');
    const dbConnected = await testConnection();
    healthCheck.database = dbConnected ? 'Connected' : 'Disconnected';

    res.status(200).json(healthCheck);
  } catch (error) {
    const { Logger } = require('./src/utils/logger');
    const healthLogger = new Logger('HealthCheck');
    healthLogger.error('Detailed health check error:', error);
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      message: error.message,
    });
  }
});

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

// 404 handler
app.use('*', notFoundHandler);

// Error handler
app.use(errorHandler);

// Graceful shutdown
// process.on('SIGTERM', () => {
//   console.log('SIGTERM received, shutting down gracefully');
//   process.exit(0);
// });

// process.on('SIGINT', () => {
//   console.log('SIGINT received, shutting down gracefully');
//   process.exit(0);
// });

// Initialize database and start server
(async () => {
  // Clear the server log file at startup
  const logFilePath = path.join(__dirname, 'logs', 'server.log');
  try {
    fs.writeFileSync(logFilePath, '');
  } catch (error) {
    console.error('Failed to clear log file:', error);
  }

  const startupLogger = new Logger('Server');

  if (false) {
    // Temporarily disable migrations
    try {
      const { testConnection, runMigrations } = require('./config/database');

      startupLogger.info('Initializing database...');

      // Run migrations first
      await runMigrations();

      // Then test the connection
      const isConnected = await testConnection();
      if (isConnected) {
        startupLogger.info('PostgreSQL connection established successfully');
      } else {
        startupLogger.warn('Warning: PostgreSQL connection failed');
        process.exit(1);
      }
    } catch (error) {
      startupLogger.error('Database initialization error:', error);
      process.exit(1);
    }
  } else {
    startupLogger.info('Skipping database migration (development mode)');
  }

  // Start the server after database is ready
  const server = app.listen(port, '0.0.0.0', () => {
    startupLogger.info(`Server running at http://localhost:${port}`);
    startupLogger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    startupLogger.info(`Node version: ${process.version}`);
    startupLogger.info('Server is ready to accept requests');
  });

  server.on('error', (error) => {
    const errorLogger = new Logger('Server');
    errorLogger.error('Server error', error);
  });
})();
