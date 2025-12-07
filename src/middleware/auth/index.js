import { createClient } from '@supabase/supabase-js';
import config from '../../config/index.js';
import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// Create Supabase client for server-side auth verification with timeout
const supabase = createClient(config.supabase.url, config.supabase.key, {
  auth: {
    autoRefreshToken: false, // Disable auto-refresh for performance
  },
  global: {
    timeout: 5000, // 5 second timeout
  },
});

// Auth caching to reduce Supabase API calls
const authCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Extract auth token from request (headers or cookies)
 */
const extractToken = (req) => {
  // First, check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // If no header token, check cookies
  const cookies = req.headers.cookie;
  if (cookies) {
    const supabaseUrl = config.supabase.url;
    const projectMatch = supabaseUrl.match(/https:\/\/(.+)\.supabase\.co/);
    const projectId = projectMatch ? projectMatch[1] : null;

    if (projectId) {
      const cookiePairs = cookies.split(';');
      for (const cookiePair of cookiePairs) {
        const [name, value] = cookiePair.trim().split('=');
        if (
          name.includes(`sb-${projectId}-auth-token`) ||
          name === 'sb-access-token'
        ) {
          try {
            return decodeURIComponent(value);
          } catch (e) {
            logger.warn('Failed to decode auth token cookie:', e.message);
          }
        }
      }
    }
  }

  return null;
};

/**
 * Validate token with Supabase and return user
 */
const validateToken = async (token) => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
    if (error || !user) {
      logger.warn('Invalid auth token:', error?.message);
      return null;
    }
    return user;
  } catch (error) {
    logger.error('Token validation error:', error);
    return null;
  }
};

/**
 * Cached token validation to reduce Supabase API calls
 */
const cachedValidateToken = async (token) => {
  if (!token) return null;

  const cacheKey = token.substring(0, 16); // Use partial token as cache key
  const cached = authCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.user;
  }

  const user = await validateToken(token);
  if (user) {
    authCache.set(cacheKey, { user, timestamp: Date.now() });
  }
  return user;
};

/**
 * Middleware to verify Supabase JWT token and attach user to request
 * This should be used for API routes that require authentication
 */
export const authenticateUser = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      logger.debug('No auth token provided');
      return res
        .status(401)
        .json({ error: 'No authentication token provided' });
    }

    const user = await cachedValidateToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid authentication token' });
    }

    req.user = user;
    logger.debug(`Authenticated user: ${user.id}`);
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

/**
 * Middleware for web routes that require authentication
 * Redirects to login if not authenticated
 */
export const requireAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      console.log('requireAuth: No token found for path:', req.path);
      return res.redirect('/auth/login');
    }

    const authUser = await cachedValidateToken(token);
    if (!authUser) {
      console.log('requireAuth: Invalid token for path:', req.path);
      return res.redirect('/auth/login');
    }

    // User is authenticated
    req.user = {
      ...authUser,
      // Ensure user_metadata exists with fallback values
      user_metadata: authUser.user_metadata || {},
      // Add display name fallback
      firstName:
        authUser.user_metadata?.firstName ||
        authUser.email?.split('@')[0] ||
        'User',
      lastName: authUser.user_metadata?.lastName || '',
    };

    // Fetch user settings for template rendering
    try {
      const theme = await databaseService.getUserSetting(
        req.user.id,
        'appearance',
        'theme'
      );
      res.locals.userTheme = theme || 'light';
      logger.debug(
        `Loaded theme for user ${req.user.id}: ${res.locals.userTheme}`
      );
    } catch (error) {
      logger.error(`Failed to load user theme for ${req.user.id}:`, error);
      res.locals.userTheme = 'light'; // Fallback
    }

    logger.debug(`Authenticated user: ${req.user.id}`);
    return next();
  } catch (error) {
    console.log('requireAuth: Error for path:', req.path, error.message);
    logger.error('Require auth middleware error:', error);
    return res.redirect('/auth/login');
  }
};

/**
 * Middleware for web routes - checks auth and attaches user if available
 * Does not fail if not authenticated (for conditional rendering)
 */
export const checkAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (token) {
      const authUser = await cachedValidateToken(token);
      if (authUser) {
        // For now, use Supabase auth user data directly
        // TODO: Implement proper user profile system
        req.user = {
          ...authUser,
          // Ensure user_metadata exists with fallback values
          user_metadata: authUser.user_metadata || {},
          // Add display name fallback
          firstName:
            authUser.user_metadata?.firstName ||
            authUser.email?.split('@')[0] ||
            'User',
          lastName: authUser.user_metadata?.lastName || '',
        };
        logger.debug(`Authenticated user: ${req.user.id}`);
      } else {
        req.user = null;
      }
    } else {
      req.user = null;
    }
    next();
  } catch (error) {
    logger.error('Check auth middleware error:', error);
    req.user = null;
    next();
  }
};

export default {
  authenticateUser,
  checkAuth,
  requireAuth,
  cachedValidateToken,
};
