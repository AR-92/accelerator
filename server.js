require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const { handlebarsConfig } = require('./config/handlebars');
const {
  errorHandler,
  notFoundHandler,
} = require('./src/middleware/error/errorHandler');
const { getSecuritySettings } = require('./config/security');

// Import container and routes
const container = require('./src/container');
const authRoutes = require('./src/routes/pages/auth');
const pageRoutes = require('./src/routes/pages');
const aiAssistantModelsRoutes = require('./src/routes/pages/ai-assistant-models');
const apiRoutes = require('./src/routes/api/v1');
const adminRoutes = require('./src/routes/api/v1/admin');

const app = express();
const port = process.env.PORT || 3000;

// Session configuration
app.use(
  session({
    store: new SQLiteStore({ db: 'sessions.db', dir: __dirname }),
    secret:
      process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

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
app.set('views', path.join(__dirname, 'src', 'views'));

// Serve static files
app.use(
  express.static(path.join(__dirname, 'public'), {
    maxAge: '1d',
    etag: true,
  })
);

// Use routes
app.use('/auth', authRoutes);
app.use('/pages', pageRoutes);
app.use('/pages', aiAssistantModelsRoutes);
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);

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
    if (
      process.env.NODE_ENV === 'production' ||
      process.env.CHECK_DATABASE_HEALTH === 'true'
    ) {
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

// Direct route for explore-ideas (without /pages prefix)
app.get('/explore-ideas', (req, res) => {
  res.render('pages/content/browse-ideas', {
    title: 'Explore Ideas - Accelerator Platform',
    isActiveExploreIdeas: true,
    mainPadding: 'py-8',
    layout: 'main',
  });
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

// Start the server
const server = app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Node version: ${process.version}`);

  // Test SQLite connection
  try {
    const { testConnection } = require('./config/database');
    const isConnected = await testConnection();
    if (isConnected) {
      console.log('SQLite connection established successfully');
    } else {
      console.warn('Warning: SQLite connection failed');
    }
  } catch (error) {
    console.error('Warning: SQLite connection test failed:', {
      error: error.message,
    });
  }
});

server.on('error', (error) => {
  console.error('Server error:', error);
});
