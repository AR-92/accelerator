const express = require('express');
const { requireAuth } = require('../../../../shared/middleware/auth/auth');
const {
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange,
} = require('../../validators/authValidators');

module.exports = (authController) => {
  const express = require('express');
  const router = express.Router();

  // GET main auth page (unified login/signup)
  router.get('/', (req, res) => {
    if (req.session.userId) {
      // Redirect based on user role
      const user = req.session.user;
      if (user.role === 'admin') {
        return res.redirect('/admin/dashboard');
      } else if (user.role === 'enterprise') {
        return res.redirect('/pages/enterprise-dashboard');
      } else if (user.role === 'corporate') {
        return res.redirect('/pages/corporate-dashboard');
      } else {
        return res.redirect('/pages/dashboard');
      }
    }
    res.render('pages/auth/auth', {
      title: 'Sign In - Accelerator Platform',
      layout: 'auth',
    });
  });

  // GET login page (redirects to main auth page)
  router.get('/login', (req, res) => {
    if (req.session.userId) {
      // Redirect based on user role
      const user = req.session.user;
      if (user.role === 'admin') {
        return res.redirect('/admin/dashboard');
      } else if (user.role === 'enterprise') {
        return res.redirect('/pages/enterprise-dashboard');
      } else if (user.role === 'corporate') {
        return res.redirect('/pages/corporate-dashboard');
      } else {
        return res.redirect('/pages/dashboard');
      }
    }
    res.redirect('/auth');
  });

  // POST login
  router.post('/login', validateLogin, async (req, res) => {
    await authController.login(req, res);
  });

  // GET signup page
  router.get('/signup', (req, res) => {
    if (req.session.userId) {
      // Redirect based on user role
      const user = req.session.user;
      if (user.role === 'admin') {
        return res.redirect('/admin/dashboard');
      } else if (user.role === 'enterprise') {
        return res.redirect('/pages/enterprise-dashboard');
      } else if (user.role === 'corporate') {
        return res.redirect('/pages/corporate-dashboard');
      } else {
        return res.redirect('/pages/dashboard');
      }
    }
    res.render('pages/auth/auth-signup', {
      title: 'Create Account - Accelerator Platform',
      layout: 'auth',
    });
  });

  // POST signup
  router.post('/signup', validateRegistration, async (req, res) => {
    await authController.register(req, res);
  });

  // POST logout
  router.post('/logout', (req, res) => {
    authController.logout(req, res);
  });

  // GET logout
  router.get('/logout', (req, res) => {
    authController.logout(req, res);
  });

  // POST switch back from impersonation
  router.post('/switch-back', requireAuth, (req, res) => {
    const container5 = getContainer();
    const authController = container5.get('authController');
    authController.switchBack(req, res);
  });

  // GET switch back from impersonation
  router.get('/switch-back', requireAuth, (req, res) => {
    authController.switchBack(req, res);
  });

  // GET signup page
  router.get('/signup', (req, res) => {
    if (req.session.userId) {
      // Redirect based on user role
      const user = req.session.user;
      if (user.role === 'admin') {
        return res.redirect('/admin/dashboard');
      } else if (user.role === 'enterprise') {
        return res.redirect('/pages/enterprise-dashboard');
      } else if (user.role === 'corporate') {
        return res.redirect('/pages/corporate-dashboard');
      } else {
        return res.redirect('/pages/dashboard');
      }
    }
    res.render('pages/auth/auth-signup', {
      title: 'Create Account - Accelerator Platform',
      layout: 'auth',
    });
  });

  // GET forgot password page
  router.get('/forgot-password', (req, res) => {
    if (req.session.userId) {
      // Redirect based on user role
      const user = req.session.user;
      if (user.role === 'admin') {
        return res.redirect('/admin/dashboard');
      } else if (user.role === 'enterprise') {
        return res.redirect('/pages/enterprise-dashboard');
      } else if (user.role === 'corporate') {
        return res.redirect('/pages/corporate-dashboard');
      } else {
        return res.redirect('/pages/dashboard');
      }
    }
    res.render('pages/auth/forgot-password', {
      title: 'Forgot Password - Accelerator Platform',
      layout: 'auth',
    });
  });

  // POST signup
  router.post('/signup', validateRegistration, async (req, res) => {
    const container2 = getContainer();
    const authController = container2.get('authController');
    await authController.register(req, res);
  });

  // POST logout
  router.post('/logout', (req, res) => {
    authController.logout(req, res);
  });

  // GET logout
  router.get('/logout', (req, res) => {
    authController.logout(req, res);
  });

  // POST switch back from impersonation
  router.post('/switch-back', requireAuth, (req, res) => {
    authController.switchBack(req, res);
  });

  // GET switch back from impersonation
  router.get('/switch-back', requireAuth, (req, res) => {
    authController.switchBack(req, res);
  });

  return router;
};
