const express = require('express');
const router = express.Router();

// GET login page
router.get('/login', (req, res) => {
  res.render('pages/login', { 
    title: 'Login - Minimal Dark UI',
    layout: 'auth' // Use auth layout for login page
  });
});

// POST login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email && password && password.length >= 6) {
    res.send(`
      <div class="text-green-500 text-center">Login successful! Redirecting...</div>
      <script>
        setTimeout(function() {
          window.location.href = '/pages/dashboard';
        }, 1000);
      </script>
    `);
  } else {
    res.send('<div class="text-red-500 text-center">Invalid credentials. Please try again.</div>');
  }
});

// GET signup page
router.get('/signup', (req, res) => {
  res.render('pages/signup', { 
    title: 'Sign Up - Minimal Dark UI',
    layout: 'auth' // Use auth layout for signup page
  });
});

// POST signup
router.post('/signup', (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  
  if (password !== confirmPassword) {
    res.send('<div class="text-red-500 text-center">Passwords do not match. Please try again.</div>');
  } else if (password.length < 6) {
    res.send('<div class="text-red-500 text-center">Password must be at least 6 characters.</div>');
  } else {
    res.send(`
      <div class="text-green-500 text-center">Account created successfully! Redirecting to login...</div>
      <script>
        setTimeout(function() {
          window.location.href = '/auth/login';
        }, 1500);
      </script>
    `);
  }
});

// POST logout
router.post('/logout', (req, res) => {
  res.redirect('/auth/login');
});

module.exports = router;