import express from 'express';
import cookieParser from 'cookie-parser';
import exphbs from 'express-handlebars';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import config from './config/index.js';
import logger from './utils/logger.js';
import {
  corsMiddleware,
  securityHeaders,
  rateLimiter,
  sanitizeInput,
} from './middleware/security/index.js';
import { errorHandler } from './middleware/error/index.js';
import { handlebarsHelpers } from './helpers/handlebars.js';
import { authenticateUser, checkAuth } from './middleware/auth/index.js';
import { csrfProtection } from './middleware/security/csrf.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Security middleware
app.use(securityHeaders);
app.use(corsMiddleware);
app.use(rateLimiter);
app.use(csrfProtection);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parsing middleware
app.use(cookieParser());

// Input sanitization
app.use(sanitizeInput);

// Logging middleware - less verbose in development for performance
app.use((req, res, next) => {
  if (config.nodeEnv !== 'development' || req.url.startsWith('/api')) {
    logger.http(`${req.method} ${req.url}`);
  }
  next();
});

// Configure Handlebars with caching for performance
app.engine(
  'handlebars',
  exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: __dirname + '/../views/layouts',
    partialsDir: __dirname + '/../views/components',
    helpers: handlebarsHelpers,
    cache: true, // Enable template caching always for performance
  })
);
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/../views');

// Enable caching for static assets in development for better performance
if (config.nodeEnv === 'development') {
  // Cache static assets for 1 hour in development
  app.use('/css', (req, res, next) => {
    res.set('Cache-Control', 'public, max-age=3600');
    next();
  });
  app.use('/js', (req, res, next) => {
    res.set('Cache-Control', 'public, max-age=3600');
    next();
  });
  app.use('/images', (req, res, next) => {
    res.set('Cache-Control', 'public, max-age=3600');
    next();
  });
}

// Serve static files with caching
app.use(
  express.static('public', {
    maxAge: config.nodeEnv === 'production' ? '1d' : '1h', // 1 day in production, 1 hour in development
    etag: true,
    lastModified: true,
  })
);

// Supabase config locals removed - using server-side auth only

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    version: '1.0.0',
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
