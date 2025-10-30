require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { handlebarsConfig } = require('./config/handlebars');
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler');
const { getSecuritySettings } = require('./config/security');
const { logger, logRequest } = require('./config/logger');

// Import routes
const authRoutes = require('./src/routes/pages/auth');
const pageRoutes = require('./src/routes/pages/main');
const apiRoutes = require('./src/routes/api/v1/api');

const app = express();
const port = process.env.PORT || 3000;

// Get security settings based on environment
const securitySettings = getSecuritySettings();

// Security middleware
app.use(securitySettings.helmet);

// Rate limiting
app.use(securitySettings.rateLimit);

// API rate limiting (stricter)
app.use('/api/', securitySettings.apiRateLimit);

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [process.env.BASE_URL || 'http://localhost:3000'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(logRequest);

// Set up Handlebars as the templating engine
app.engine('hbs', handlebarsConfig);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',
  etag: true
}));

// Use routes
app.use('/auth', authRoutes);
app.use('/pages', pageRoutes);
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check basic server status
    const healthCheck = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: require('./package.json').version,
    };

    // Check database connection if in production or if explicitly enabled
    if (process.env.NODE_ENV === 'production' || process.env.CHECK_DATABASE_HEALTH === 'true') {
      const { testConnection } = require('./config/database');
      const dbConnected = await testConnection();
      healthCheck.database = dbConnected ? 'Connected' : 'Disconnected';
    } else {
      healthCheck.database = 'Not checked (dev mode)';
    }

    // Additional checks can be added here (redis, external APIs, etc.)

    res.status(200).json(healthCheck);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      message: error.message,
    });
  }
});

// Home route (redirect to login)
app.get('/', (req, res) => {
  res.redirect('/auth/login');
});

// 404 handler
app.use('*', notFoundHandler);

// Error handler
app.use(require('./config/logger').logError);
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
app.listen(port, async () => {
  logger.info(`Server running at http://localhost:${port}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Node version: ${process.version}`);
  
  // Test Supabase connection
  try {
    const { testConnection } = require('./config/database');
    const isConnected = await testConnection();
    if (isConnected) {
      logger.info('Supabase connection established successfully');
    } else {
      logger.warn('Warning: Supabase connection failed');
    }
  } catch (error) {
    logger.error('Warning: Supabase connection test failed:', { error: error.message });
  }
});