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
        res.json({ success: true, user: data.user, session: data.session });
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
        res.json({ success: true, user: data.user, session: data.session });
      } catch (error) {
        logger.error('Login server error:', error);
        res.status(500).json({ error: 'Login failed' });
      }
    }
  );

  // Server-side logout endpoint (for API consistency)
  app.post('/auth/logout', authRateLimiter, verifyCsrfToken, (req, res) => {
    logger.info('User logged out via server endpoint');
    res.json({ success: true, message: 'Logged out successfully' });
  });
}
