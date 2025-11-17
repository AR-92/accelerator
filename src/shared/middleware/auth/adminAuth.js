// Admin authentication middleware
// This can be used to protect routes that require admin authentication

const { createDatabaseInterface } = require('../../../../config/database');
const ConfigService = require('../../../utils/configService');
const { createLogger } = require('../../../utils/logger');

const configService = new ConfigService();
const logger = createLogger(configService);
const dbInterface = createDatabaseInterface(configService, () => logger);
const { dbGet } = dbInterface;

const requireAdminAuth = async (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/admin/login');
  }

  // Check if user exists and has admin role in the database
  try {
    const user = await dbGet(
      'SELECT id, email, user_type as role, status, banned FROM users WHERE id = ?',
      [req.session.userId]
    );

    if (
      !user ||
      user.role !== 'admin' ||
      user.status !== 'active' ||
      user.banned
    ) {
      return res.status(403).render('pages/error/access-denied', {
        title: 'Access Denied - Admin Panel',
        layout: 'error-admin',
        message: 'You do not have permission to access the admin panel.',
        user: req.session.user || null,
      });
    }

    // Update session with fresh user data
    req.session.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      banned: user.banned,
    };
    req.user = req.session.user;
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    return res.status(500).render('pages/error/access-denied', {
      title: 'Access Denied - Admin Panel',
      layout: 'error-admin',
      message: 'An error occurred during admin authentication.',
      user: req.session.user || null,
    });
  }
};

const optionalAdminAuth = async (req, res, next) => {
  if (req.session.userId) {
    try {
      const user = await dbGet(
        'SELECT id, email, user_type as role, status, banned FROM users WHERE id = ?',
        [req.session.userId]
      );

      if (
        user &&
        user.role === 'admin' &&
        user.status === 'active' &&
        !user.banned
      ) {
        req.session.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          status: user.status,
          banned: user.banned,
        };
        req.user = req.session.user;
      }
    } catch (error) {
      console.error('Optional admin auth middleware error:', error);
      // Continue without admin auth instead of failing
    }
  }
  next();
};

module.exports = {
  requireAdminAuth,
  optionalAdminAuth,
};
