const express = require('express');
const router = express.Router();

// GET main auth page (unified login/signup)
router.get('/', (req, res) => {
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
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Simple validation
  if (email && password && password.length >= 6) {
    // In a real application, you would authenticate the user here
    res.redirect('/pages/dashboard');
  } else {
    res
      .status(400)
      .send(
        '<div class="text-red-500 text-center">Invalid credentials. Please try again.</div>'
      );
  }
});

// GET signup page
router.get('/signup', (req, res) => {
  res.render('pages/auth/auth-signup', {
    title: 'Create Account - Accelerator Platform',
    layout: 'auth',
  });
});

// POST signup
router.post('/signup', (req, res) => {
  const { password, confirmPassword, terms } = req.body;

  // Simple validation
  if (!terms) {
    res
      .status(400)
      .send(
        '<div class="text-red-500 text-center">Please agree to the Terms and Conditions.</div>'
      );
  } else if (password !== confirmPassword) {
    res
      .status(400)
      .send(
        '<div class="text-red-500 text-center">Passwords do not match. Please try again.</div>'
      );
  } else if (password.length < 6) {
    res
      .status(400)
      .send(
        '<div class="text-red-500 text-center">Password must be at least 6 characters.</div>'
      );
  } else {
    // In a real application, you would create the user account here
    res.send(`
      <div class="text-green-500 text-center">Account created successfully! Redirecting to login...</div>
      <script>
        setTimeout(function() {
          window.location.href = '/auth';
        }, 2000);
      </script>
    `);
  }
});

// POST logout
router.post('/logout', (req, res) => {
  // In a real application, you would destroy the session here
  res.redirect('/auth');
});

// GET logout
router.get('/logout', (req, res) => {
  // In a real application, you would destroy the session here
  res.redirect('/auth');
});

module.exports = router;
