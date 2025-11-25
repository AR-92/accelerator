import { createClient } from '@supabase/supabase-js';
import config from '../../config/index.js';
import logger from '../../utils/logger.js';

// Create Supabase client for server-side auth verification
const supabase = createClient(config.supabase.url, config.supabase.key);

/**
 * Middleware to verify Supabase JWT token and attach user to request
 */
export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    if (!token) {
      logger.debug('No auth token provided');
      return res
        .status(401)
        .json({ error: 'No authentication token provided' });
    }

    // Verify the JWT token with Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      logger.warn('Invalid auth token:', error?.message);
      return res.status(401).json({ error: 'Invalid authentication token' });
    }

    // Attach user to request object
    req.user = user;
    logger.debug(`Authenticated user: ${user.id}`);
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

/**
 * Optional middleware - redirects to login if not authenticated
 * Useful for web routes that require auth
 */
export const requireAuth = (req, res, next) => {
  if (!req.user) {
    logger.debug('User not authenticated, redirecting to login');
    return res.redirect('/auth');
  }
  next();
};

/**
 * Middleware for web routes - redirects to login if no session
 * This is a placeholder since session validation happens client-side
 */
export const requireWebAuth = (req, res, next) => {
  // For web routes, we rely on client-side session checking
  // This middleware just ensures the route exists but doesn't block
  // The actual auth checking happens in the main layout
  next();
};

/**
 * Middleware to check if user is authenticated (doesn't fail if not)
 * Useful for conditional rendering
 */
export const checkAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    if (token) {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token);
      if (!error && user) {
        req.user = user;
        logger.debug(`User authenticated: ${user.id}`);
      }
    }
    next();
  } catch (error) {
    logger.error('Check auth middleware error:', error);
    next();
  }
};

export default {
  authenticateUser,
  requireAuth,
  checkAuth,
};
