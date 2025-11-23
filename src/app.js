import express from 'express';
import exphbs from 'express-handlebars';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import config from './config/index.js';
import logger from './utils/logger.js';
import { corsMiddleware, securityHeaders, rateLimiter, sanitizeInput } from './middleware/security/index.js';
import { errorHandler } from './middleware/error/index.js';
import { handlebarsHelpers } from './helpers/handlebars.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Security middleware
app.use(securityHeaders);
app.use(corsMiddleware);
app.use(rateLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization
app.use(sanitizeInput);

// Logging middleware
app.use((req, res, next) => {
  logger.http(`${req.method} ${req.url}`);
  next();
});

// Configure Handlebars
app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main',
  layoutsDir: __dirname + '/../views/layouts',
  partialsDir: __dirname + '/../views/partials',
  helpers: handlebarsHelpers
}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/../views');

// No cache for CSS in development
if (config.nodeEnv === 'development') {
  app.use('/css', (req, res, next) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
  });
}

// Serve static files
app.use(express.static('public'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    version: '1.0.0'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;