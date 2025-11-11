const { Logger } = require('../../utils/logger');

/**
 * Authentication controller part 1 handling login, register, logout, profile operations
 */
class AuthControllerPart1 {
  constructor(authService) {
    this.authService = authService;
    this.logger = new Logger('AuthController');
  }

  /**
   * Handle user login
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async login(req, res) {
    this.logger.info('Login request received', { 
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });

    try {
      const { email, password } = req.body;

      if (!email || !password) {
        const errorMessage = 'Email and password are required';
        this.logger.warn('Login failed - missing credentials', { 
          email, 
          ip: req.ip || req.connection.remoteAddress 
        });

        // Check if this is an HTMX request
        if (req.headers['hx-request']) {
          return res.status(400).json({
            success: false,
            error: errorMessage,
            type: 'validation',
          });
        }

        return res.status(400).render('pages/auth/auth', {
          title: 'Sign In - Accelerator Platform',
          layout: 'auth',
          error: errorMessage,
        });
      }

      // Attempt to authenticate user
      const user = await this.authService.login(email, password);

      // Set session
      req.session.userId = user.id;
      req.session.user = user;

      this.logger.logAuthEvent('login', user.id, email, req.ip || req.connection.remoteAddress);

      // Check if this is an HTMX request
      if (req.headers['hx-request']) {
        return res.json({
          success: true,
          message: 'Login successful! Redirecting...',
          redirect: '/pages/dashboard',
        });
      }

      // Redirect to dashboard on successful login
      res.redirect('/pages/dashboard');
    } catch (error) {
      this.logger.error('Login error:', error, { 
        email: req.body.email,
        ip: req.ip || req.connection.remoteAddress 
      });

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

        return res.status(error.statusCode).render('pages/auth/auth', {
          title: 'Sign In - Accelerator Platform',
          layout: 'auth',
          error: errorMessage,
        });
      }

      const errorMessage = 'An error occurred during login';

      // Check if this is an HTMX request
      if (req.headers['hx-request']) {
        return res.status(500).json({
          success: false,
          error: errorMessage,
          type: 'server',
        });
      }

      res.status(500).render('pages/auth/auth', {
        title: 'Sign In - Accelerator Platform',
        layout: 'auth',
        error: errorMessage,
      });
    }
  }

  /**
   * Handle user registration
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async register(req, res) {
    this.logger.info('Registration request received', { 
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });

    try {
      const {
        email,
        password,
        firstName,
        lastName,
        role = 'startup',
      } = req.body;

      if (!email || !password || !firstName || !lastName) {
        const errorMessage = 'All fields are required';
        this.logger.warn('Registration failed - missing required fields', { 
          email, 
          firstName, 
          lastName,
          ip: req.ip || req.connection.remoteAddress 
        });

        // Check if this is an HTMX request
        if (req.headers['hx-request']) {
          return res.status(400).json({
            success: false,
            error: errorMessage,
            type: 'validation',
          });
        }

        return res.status(400).json({
          error: 'Validation Error',
          message: errorMessage,
        });
      }

      const user = await this.authService.register({
        email,
        password,
        firstName,
        lastName,
        role,
      });

      this.logger.logAuthEvent('register', user.id, email, req.ip || req.connection.remoteAddress);

      // Check if this is an HTMX request
      if (req.headers['hx-request']) {
        return res.json({
          success: true,
          message: 'Registration successful! You can now log in.',
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        });
      }

      res.status(201).json({
        success: true,
        user,
        message: 'Registration successful',
      });
    } catch (error) {
      this.logger.error('Registration error:', error, { 
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        ip: req.ip || req.connection.remoteAddress 
      });

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

        return res.status(error.statusCode).json({
          error: error.name,
          message: errorMessage,
          details: error.errors,
        });
      }

      const errorMessage = 'An error occurred during registration';

      // Check if this is an HTMX request
      if (req.headers['hx-request']) {
        return res.status(500).json({
          success: false,
          error: errorMessage,
          type: 'server',
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: errorMessage,
      });
    }
  }

  /**
   * Handle user logout
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async logout(req, res) {
    this.logger.info('Logout request', { 
      userId: req.session.userId,
      ip: req.ip || req.connection.remoteAddress 
    });

    try {
      const userId = req.session.userId;
      
      req.session.destroy((err) => {
        if (err) {
          this.logger.error('Logout error:', err, { 
            userId,
            ip: req.ip || req.connection.remoteAddress 
          });
          
          return res.status(500).json({
            error: 'Internal Server Error',
            message: 'An error occurred during logout',
          });
        }

        this.logger.logAuthEvent('logout', userId, null, req.ip || req.connection.remoteAddress);
        res.clearCookie('connect.sid');
        res.json({
          success: true,
          message: 'Logout successful',
        });
      });
    } catch (error) {
      this.logger.error('Logout error:', error, { 
        userId: req.session.userId,
        ip: req.ip || req.connection.remoteAddress 
      });
      
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred during logout',
      });
    }
  }

  /**
   * Get current user profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getProfile(req, res) {
    this.logger.info('Get profile request', { 
      userId: req.user.id,
      ip: req.ip || req.connection.remoteAddress 
    });

    try {
      const user = await this.authService.getUserById(req.user.id);
      res.json({
        success: true,
        user,
      });
    } catch (error) {
      this.logger.error('Get profile error:', error, { 
        userId: req.user.id,
        ip: req.ip || req.connection.remoteAddress 
      });

      if (error.name === 'NotFoundError') {
        return res.status(error.statusCode).json({
          error: error.name,
          message: error.message,
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while fetching profile',
      });
    }
  }

  /**
   * Update user profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateProfile(req, res) {
    this.logger.info('Update profile request', { 
      userId: req.user.id,
      ip: req.ip || req.connection.remoteAddress 
    });

    try {
      const { firstName, lastName, role } = req.body;
      const user = await this.authService.updateProfile(req.user.id, {
        firstName,
        lastName,
        role,
      });

      // Update session
      req.session.user = user;

      this.logger.info('Profile updated successfully', { 
        userId: req.user.id,
        firstName,
        lastName,
        role
      });

      res.json({
        success: true,
        user,
        message: 'Profile updated successfully',
      });
    } catch (error) {
      this.logger.error('Update profile error:', error, { 
        userId: req.user.id,
        ip: req.ip || req.connection.remoteAddress 
      });

      if (error.name === 'NotFoundError' || error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          error: error.name,
          message: error.firstError,
          details: error.errors,
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while updating profile',
      });
    }
  }
}

module.exports = AuthControllerPart1;
