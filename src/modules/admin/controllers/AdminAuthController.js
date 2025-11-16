const bcrypt = require('bcrypt');

/**
 * Admin Authentication controller handling HTTP requests for admin auth operations
 */
class AdminAuthController {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Handle admin login
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        const errorMessage = 'Email and password are required';

        // Check if this is an HTMX request
        if (req.headers['hx-request']) {
          return res.status(400).json({
            success: false,
            error: errorMessage,
            type: 'validation',
          });
        }

        return res.status(400).render('pages/admin/login', {
          title: 'Admin Login - Accelerator Platform',
          layout: 'admin-login',
          error: errorMessage,
        });
      }

      // Find user by email
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        const errorMessage = 'Invalid email or password';

        // Check if this is an HTMX request
        if (req.headers['hx-request']) {
          return res.status(401).json({
            success: false,
            error: errorMessage,
            type: 'authentication',
          });
        }

        return res.status(401).render('pages/admin/login', {
          title: 'Admin Login - Accelerator Platform',
          layout: 'admin-login',
          error: errorMessage,
        });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        const errorMessage = 'Invalid email or password';

        // Check if this is an HTMX request
        if (req.headers['hx-request']) {
          return res.status(401).json({
            success: false,
            error: errorMessage,
            type: 'authentication',
          });
        }

        return res.status(401).render('pages/admin/login', {
          title: 'Admin Login - Accelerator Platform',
          layout: 'admin-login',
          error: errorMessage,
        });
      }

      // Check if user has admin role
      if (user.role !== 'admin') {
        const errorMessage = 'Access denied. Admin privileges required.';

        // Check if this is an HTMX request
        if (req.headers['hx-request']) {
          return res.status(403).json({
            success: false,
            error: errorMessage,
            type: 'authorization',
          });
        }

        return res.status(403).render('pages/admin/login', {
          title: 'Admin Login - Accelerator Platform',
          layout: 'admin-login',
          error: errorMessage,
        });
      }

      // Set session with proper user object structure
      req.session.userId = user.id;
      req.session.user = {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.user_type, // Map user_type to role
        status: user.status,
        banned: user.banned,
      };

      // Check if this is an HTMX request
      if (req.headers['hx-request']) {
        return res.json({
          success: true,
          message: 'Admin login successful! Redirecting...',
          redirect: '/admin/dashboard',
        });
      }

      // Redirect to admin dashboard on successful login
      res.redirect('/admin/dashboard');
    } catch (error) {
      console.error('Admin login error:', error);

      if (error.name === 'ValidationError') {
        const errorMessage = error.firstError;

        // Check if this is an HTMX request
        if (req.headers['hx-request']) {
          return res.status(error.statusCode).json({
            success: false,
            error: errorMessage,
            type: 'validation',
          });
        }

        return res.status(error.statusCode).render('pages/admin/login', {
          title: 'Admin Login - Accelerator Platform',
          layout: 'admin-login',
          error: errorMessage,
        });
      }

      const errorMessage = 'An error occurred during admin login';

      // Check if this is an HTMX request
      if (req.headers['hx-request']) {
        return res.status(500).json({
          success: false,
          error: errorMessage,
          type: 'server',
        });
      }

      res.status(500).render('pages/admin/login', {
        title: 'Admin Login - Accelerator Platform',
        layout: 'admin-login',
        error: errorMessage,
      });
    }
  }

  /**
   * Handle admin logout
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async logout(req, res) {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error('Admin logout error:', err);
          return res.status(500).json({
            error: 'Internal Server Error',
            message: 'An error occurred during admin logout',
          });
        }

        res.clearCookie('connect.sid');
        res.redirect('/admin/login');
      });
    } catch (error) {
      console.error('Admin logout error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred during admin logout',
      });
    }
  }

  /**
   * Show admin login page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  showLogin(req, res) {
    // If already logged in as admin, redirect to dashboard
    if (
      req.session.userId &&
      req.session.user &&
      req.session.user.role === 'admin'
    ) {
      return res.redirect('/admin/dashboard');
    }

    res.render('pages/admin/login', {
      title: 'Admin Login - Accelerator Platform',
      layout: 'admin-login',
    });
  }
}

module.exports = AdminAuthController;
