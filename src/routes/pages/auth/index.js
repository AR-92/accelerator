const express = require('express');
const router = express.Router();
const container = require('../../../container');
const { requireAuth } = require('../../../middleware/auth');
const {
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange,
} = require('../../../validators/authValidators');

// GET main auth page (unified login/signup)
router.get('/', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/pages/dashboard');
  }
  res.render('pages/auth/auth', {
    title: 'Sign In - Accelerator Platform',
    layout: 'auth',
  });
});

// GET login page (redirects to main auth page)
router.get('/login', (req, res) => {
  res.redirect('/auth');
});

// POST login
router.post('/login', validateLogin, async (req, res) => {
  const authController = container.get('authController');
  await authController.login(req, res);
});

// GET signup page
router.get('/signup', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/pages/dashboard');
  }
  res.render('pages/auth/auth-signup', {
    title: 'Create Account - Accelerator Platform',
    layout: 'auth',
  });
});

// POST signup
router.post('/signup', validateRegistration, async (req, res) => {
  const authController = container.get('authController');
  await authController.register(req, res);
});

// POST logout
router.post('/logout', (req, res) => {
  const authController = container.get('authController');
  authController.logout(req, res);
});

// GET logout
router.get('/logout', (req, res) => {
  const authController = container.get('authController');
  authController.logout(req, res);
});

module.exports = router;
