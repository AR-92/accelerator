import config from '../../config/index.js';
import { createClient } from '@supabase/supabase-js';
import logger from '../../utils/logger.js';
import { authRateLimiter } from '../../middleware/security/rate-limit.js';
import {
  csrfProtection,
  verifyCsrfToken,
} from '../../middleware/security/csrf.js';

// Helper function to extract auth token from request
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

const supabase = createClient(config.supabase.url, config.supabase.key, {
  auth: {
    autoRefreshToken: false, // Disable auto-refresh for performance
  },
  global: {
    timeout: 5000, // 5 second timeout
  },
});

export default function authRoutes(app) {
  app.get('/auth', (req, res) => {
    res.redirect('/auth/login');
  });

  app.get('/auth/login', csrfProtection, (req, res) => {
    res.render('pages/auth/login', {
      layout: 'auth',
      title: 'Sign In - Accelerator Platform',
      supabaseUrl: config.supabase.url,
      supabaseKey: config.supabase.publicKey, // Use public key for client-side
    });
  });

  app.get('/auth/signup', csrfProtection, (req, res) => {
    res.render('pages/auth/signup', {
      layout: 'auth',
      title: 'Create Account - Accelerator Platform',
      supabaseUrl: config.supabase.url,
      supabaseKey: config.supabase.publicKey, // Use public key for client-side
    });
  });

  // Server-side auth endpoints (for API usage) with rate limiting and CSRF protection
  app.post(
    '/auth/signup',
    authRateLimiter,
    verifyCsrfToken,
    async (req, res) => {
      try {
        const { email, password, firstName, lastName, confirmPassword, terms } =
          req.body;

        // Input validation
        if (!email || !password || !firstName || !lastName) {
          const error = 'All fields are required';
          if (req.headers['hx-request']) {
            return res.send(`<div class="error">${error}</div>`);
          }
          return res.status(400).json({ error });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          const error = 'Please enter a valid email address';
          if (req.headers['hx-request']) {
            return res.send(`<div class="error">${error}</div>`);
          }
          return res.status(400).json({ error });
        }

        // Password strength validation
        if (password.length < 8) {
          const error = 'Password must be at least 8 characters long';
          if (req.headers['hx-request']) {
            return res.send(`<div class="error">${error}</div>`);
          }
          return res.status(400).json({ error });
        }

        // Check for password confirmation if provided
        if (confirmPassword && password !== confirmPassword) {
          const error = 'Passwords do not match';
          if (req.headers['hx-request']) {
            return res.send(`<div class="error">${error}</div>`);
          }
          return res.status(400).json({ error });
        }

        // Check terms acceptance
        if (terms !== 'on' && terms !== true) {
          const error = 'You must agree to the terms and conditions';
          if (req.headers['hx-request']) {
            return res.send(`<div class="error">${error}</div>`);
          }
          return res.status(400).json({ error });
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { firstName, lastName },
          },
        });

        if (error) {
          logger.error('Signup error:', error);
          return res.status(400).json({ error: error.message });
        }

        logger.info(`User signed up: ${email}`);

        if (req.headers['hx-request']) {
          // For HTMX, set redirect header and return success message
          res.set('HX-Redirect', '/admin/new-project?showCard=true');
          res.send(
            '<div class="success">Account created successfully! Redirecting...</div>'
          );
        } else {
          res.json({
            success: true,
            user: data.user,
            session: data.session,
            redirect: '/admin/new-project?showCard=true',
          });
        }
      } catch (error) {
        logger.error('Signup server error:', error);
        res.status(500).json({ error: 'Signup failed' });
      }
    }
  );

  app.post(
    '/auth/login',
    authRateLimiter,
    verifyCsrfToken,
    async (req, res) => {
      try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
          const error = 'Email and password are required';
          if (req.headers['hx-request']) {
            return res.send(`<div class="error">${error}</div>`);
          }
          return res.status(400).json({ error });
        }

        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          const error = 'Please enter a valid email address';
          if (req.headers['hx-request']) {
            return res.send(`<div class="error">${error}</div>`);
          }
          return res.status(400).json({ error });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          logger.error('Login error:', error);
          if (req.headers['hx-request']) {
            return res.send(`<div class="error">${error.message}</div>`);
          }
          return res.status(401).json({ error: error.message });
        }

        logger.info(`User logged in: ${email}`);

        // Set Supabase cookies for client-side session persistence
        const supabaseUrl = config.supabase.url;
        const projectMatch = supabaseUrl.match(/https:\/\/(.+)\.supabase\.co/);
        const projectId = projectMatch ? projectMatch[1] : null;

        if (projectId) {
          // Set the standard Supabase cookies with proper security
          res.cookie(`sb-${projectId}-auth-token`, data.session.access_token, {
            httpOnly: true, // Prevent XSS access
            secure: config.nodeEnv === 'production', // HTTPS only in production
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: 'lax',
            path: '/',
          });

          if (data.session.refresh_token) {
            res.cookie(
              `sb-${projectId}-refresh-token`,
              data.session.refresh_token,
              {
                httpOnly: true, // Prevent XSS access
                secure: config.nodeEnv === 'production', // HTTPS only in production
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                sameSite: 'lax',
                path: '/',
              }
            );
          }
        }

        // Also set our custom cookie as fallback with proper security
        res.cookie('sb-access-token', data.session.access_token, {
          httpOnly: true, // Prevent XSS access
          secure: config.nodeEnv === 'production', // HTTPS only in production
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          sameSite: 'lax',
          path: '/',
        });

        if (req.headers['hx-request']) {
          // For HTMX, set redirect header
          res.set('HX-Redirect', '/admin/new-project?showCard=true');
          res.send('<div class="success">Login successful!</div>');
        } else {
          res.json({
            success: true,
            user: data.user,
            session: data.session,
            redirect: '/admin/new-project?showCard=true',
          });
        }
      } catch (error) {
        logger.error('Login server error:', error);
        if (req.headers['hx-request']) {
          res.send('<div class="error">Login failed</div>');
        } else {
          res.status(500).json({ error: 'Login failed' });
        }
      }
    }
  );

  app.get('/forgot-password', (req, res) => {
    res.render('pages/auth/forgot-password', {
      layout: 'auth',
      title: 'Reset Password',
    });
  });

  // Session verification endpoint (with rate limiting)
  app.get('/auth/session', authRateLimiter, async (req, res) => {
    try {
      logger.debug('Session verification request received');

      // Try to get session token from headers or cookies
      const authHeader =
        req.headers.authorization || req.headers['x-auth-token'];
      let token = authHeader?.startsWith('Bearer ')
        ? authHeader.substring(7)
        : null;

      logger.debug('Auth header token:', !!token);

      // Also check for our custom cookie and project-specific cookies
      if (!token && req.cookies) {
        // First try the custom cookie
        token = req.cookies['sb-access-token'];
        logger.debug('Custom cookie token found:', !!token);

        // If no custom cookie, try project-specific cookies
        if (!token) {
          const supabaseUrl = config.supabase.url;
          const projectMatch = supabaseUrl.match(
            /https:\/\/(.+)\.supabase\.co/
          );
          const projectId = projectMatch ? projectMatch[1] : null;

          if (projectId) {
            token = req.cookies[`sb-${projectId}-auth-token`];
            logger.debug('Project-specific cookie token found:', !!token);
          }
        }
      }

      if (!token) {
        logger.debug('No token found, returning not authenticated');
        return res.status(200).json({ authenticated: false });
      }

      logger.debug('Verifying token with Supabase...');

      // Verify the token with Supabase
      const { data, error } = await supabase.auth.getUser(token);

      if (error || !data || !data.user) {
        logger.debug('Token verification failed:', error?.message);
        return res.status(200).json({ authenticated: false });
      }

      logger.debug('Token verified successfully for user:', data.user.id);

      res.json({
        authenticated: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          user_metadata: data.user.user_metadata,
        },
      });
    } catch (error) {
      logger.error('Session verification error:', error);
      res.status(200).json({ authenticated: false });
    }
  });

  // Server-side logout endpoint
  app.post(
    '/auth/logout',
    authRateLimiter,
    verifyCsrfToken,
    async (req, res) => {
      try {
        logger.info('User logged out via server endpoint');

        // Clear Supabase cookies
        const supabaseUrl = config.supabase.url;
        const projectMatch = supabaseUrl.match(/https:\/\/(.+)\.supabase\.co/);
        const projectId = projectMatch ? projectMatch[1] : null;

        if (projectId) {
          res.clearCookie(`sb-${projectId}-auth-token`, { path: '/' });
          res.clearCookie(`sb-${projectId}-refresh-token`, { path: '/' });
        }

        // Clear custom cookie
        res.clearCookie('sb-access-token', { path: '/' });

        if (req.headers['hx-request']) {
          // For HTMX, redirect to login page
          res.set('HX-Redirect', '/auth');
          res.send('<div>Logged out successfully</div>');
        } else {
          res.json({ success: true, message: 'Logged out successfully' });
        }
      } catch (error) {
        logger.error('Logout error:', error);
        // Still clear cookies even if something fails
        res.clearCookie('sb-access-token', { path: '/' });

        if (req.headers['hx-request']) {
          res.set('HX-Redirect', '/auth');
          res.send('<div>Logged out</div>');
        } else {
          res.json({ success: true, message: 'Logged out (with warnings)' });
        }
      }
    }
  );
}
