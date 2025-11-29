import config from '../../config/index.js';
import { createClient } from '@supabase/supabase-js';
import logger from '../../utils/logger.js';
import { authRateLimiter } from '../../middleware/security/rate-limit.js';
import {
  csrfProtection,
  verifyCsrfToken,
} from '../../middleware/security/csrf.js';

const supabase = createClient(config.supabase.url, config.supabase.key);

export default function authRoutes(app) {
  app.get('/auth', csrfProtection, (req, res) => {
    res.render('auth/login', {
      layout: 'auth',
      title: 'Sign In - Accelerator Platform',
      supabaseUrl: config.supabase.url,
      supabaseKey: config.supabase.publicKey, // Use public key for client-side
    });
  });

  app.get('/auth/signup', csrfProtection, (req, res) => {
    res.render('auth/signup', {
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
        const { email, password, firstName, lastName } = req.body;

        if (!email || !password) {
          return res
            .status(400)
            .json({ error: 'Email and password are required' });
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
        res.json({
          success: true,
          user: data.user,
          session: data.session,
          redirect: '/dashboard',
        });
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

        if (!email || !password) {
          return res
            .status(400)
            .json({ error: 'Email and password are required' });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          logger.error('Login error:', error);
          return res.status(401).json({ error: error.message });
        }

        logger.info(`User logged in: ${email}`);

        // Set Supabase cookies for client-side session persistence
        const supabaseUrl = config.supabase.url;
        const projectMatch = supabaseUrl.match(/https:\/\/(.+)\.supabase\.co/);
        const projectId = projectMatch ? projectMatch[1] : null;

        if (projectId) {
          // Set the standard Supabase cookies
          res.cookie(`sb-${projectId}-auth-token`, data.session.access_token, {
            httpOnly: false, // Allow client-side access
            secure: false, // Allow on localhost
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: 'lax',
            path: '/',
          });

          if (data.session.refresh_token) {
            res.cookie(
              `sb-${projectId}-refresh-token`,
              data.session.refresh_token,
              {
                httpOnly: false, // Allow client-side access
                secure: false, // Allow on localhost
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                sameSite: 'lax',
                path: '/',
              }
            );
          }
        }

        // Also set our custom cookie as fallback
        res.cookie('sb-access-token', data.session.access_token, {
          httpOnly: false, // Allow client-side access
          secure: false, // Allow on localhost
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          sameSite: 'lax',
          path: '/',
        });

        res.json({
          success: true,
          user: data.user,
          session: data.session,
          redirect: '/dashboard',
        });
      } catch (error) {
        logger.error('Login server error:', error);
        res.status(500).json({ error: 'Login failed' });
      }
    }
  );

  // Session verification endpoint
  app.get('/auth/session', async (req, res) => {
    try {
      logger.debug('Session verification request received');

      // Try to get session token from headers or cookies
      const authHeader =
        req.headers.authorization || req.headers['x-auth-token'];
      let token = authHeader?.startsWith('Bearer ')
        ? authHeader.substring(7)
        : null;

      logger.debug('Auth header token:', !!token);

      // Also check for our custom cookie
      if (!token && req.cookies) {
        token = req.cookies['sb-access-token'];
        logger.debug('Cookie token found:', !!token);
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

  // Server-side logout endpoint (for API consistency)
  app.post('/auth/logout', authRateLimiter, verifyCsrfToken, (req, res) => {
    logger.info('User logged out via server endpoint');
    res.json({ success: true, message: 'Logged out successfully' });
  });
}
