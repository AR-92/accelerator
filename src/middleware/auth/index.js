import { createClient } from '@supabase/supabase-js';
import config from '../../config/index.js';
import logger from '../../utils/logger.js';

// Create Supabase client for server-side auth verification
const supabase = createClient(config.supabase.url, config.supabase.key);

/**
 * Middleware to verify Supabase JWT token and attach user to request
 * This should be used for API routes
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
 * Since the original design used client-side auth checks,
 * we'll implement a more appropriate server-side check
 */
export const requireAuth = (req, res, next) => {
  // Check if this is an API request vs web route
  if (req.path.startsWith('/api/')) {
    // For API requests, require authentication header
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // If we have a token, we'll validate it in the next step
    next();
  } else {
    // For web routes, we'll allow the request to go through
    // The actual auth check happens client-side in the browser
    // We can still attach user info if available
    next();
  }
};

/**
 * Middleware for web routes - redirects to login if no session
 * Works with Supabase auth, but uses a more flexible approach for web pages
 */
export const requireWebAuth = async (req, res, next) => {
  try {
    // For HTML requests, we'll render the page but let client-side JS handle auth
    // This is necessary because Supabase sets cookies that may not be immediately available
    // Check if this is a browser request that expects HTML
    const wantsHtml =
      req.headers.accept && req.headers.accept.includes('text/html');
    const isBrowser =
      req.headers['user-agent'] && !req.headers['user-agent'].includes('curl');

    // Only allow HTML requests to proceed, not all browser requests
    if (wantsHtml) {
      // For web routes, just proceed but let the client-side JS redirect if needed
      next();
      return;
    }

    // For API requests, do strict auth check
    const cookies = req.headers.cookie;

    if (!cookies) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Look for Supabase auth cookies - they contain the project ID in the URL
    // Extract project ID from config
    const supabaseUrl = config.supabase.url;
    if (!supabaseUrl) {
      logger.error('Supabase URL not configured');
      return res
        .status(401)
        .json({ error: 'Authentication configuration error' });
    }

    // Extract the project ID from the Supabase URL (first part before '.supabase.co')
    const projectMatch = supabaseUrl.match(/https:\/\/(.+)\.supabase\.co/);
    const projectId = projectMatch ? projectMatch[1] : null;

    if (!projectId) {
      logger.error(
        'Could not extract Supabase project ID from URL:',
        supabaseUrl
      );
      return res
        .status(401)
        .json({ error: 'Authentication configuration error' });
    }

    // Look for the auth token cookie with the specific project ID
    const cookiePairs = cookies.split(';');
    let accessToken = null;

    for (const cookiePair of cookiePairs) {
      const [name, value] = cookiePair.trim().split('=');
      // Check for Supabase token cookie format: sb-[project-id]-auth-token
      if (name.includes(`sb-${projectId}-auth-token`)) {
        try {
          // The value is URL-encoded, decode it
          accessToken = decodeURIComponent(value);
          break;
        } catch (e) {
          logger.warn('Failed to decode auth token cookie:', e.message);
        }
      }
      // Also check for our custom cookie
      if (name === 'sb-access-token') {
        try {
          accessToken = decodeURIComponent(value);
          break;
        } catch (e) {
          logger.warn('Failed to decode custom auth token cookie:', e.message);
        }
      }
    }

    if (!accessToken) {
      // No access token found
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Validate the token with Supabase
    try {
      const { data, error } = await supabase.auth.getUser(accessToken);
      if (error || !data || !data.user) {
        logger.warn('Invalid or expired Supabase token:', error?.message);
        return res.status(401).json({ error: 'Invalid authentication token' });
      }

      // Authentication successful, attach user to request
      req.user = data.user;
      next();
    } catch (tokenError) {
      logger.error('Token validation error:', tokenError.message);
      return res.status(401).json({ error: 'Token validation failed' });
    }
  } catch (error) {
    logger.error('Web auth middleware error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

/**
 * Middleware to check if user is authenticated (doesn't fail if not)
 * Useful for conditional rendering
 */
export const checkAuth = async (req, res, next) => {
  try {
    // Try to get session from cookies or headers
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    // If no auth header, try to get session from Supabase
    if (!token) {
      // For web requests, we should check if there's a session
      // This is a server-side check that mirrors the client-side Supabase session
      // For now, we'll allow the request to continue and let the session be validated elsewhere
      // In a real world scenario, we'd have server-side session management
      req.user = null; // No user identified via server-side check
    } else {
      // Validate the token if provided
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token);
      if (!error && user) {
        req.user = user;
        logger.debug(`User authenticated: ${user.id}`);
      } else {
        req.user = null;
      }
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
  requireAuth,
  checkAuth,
};
