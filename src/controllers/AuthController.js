/**
 * Authentication controller handling HTTP requests for auth operations
 */
class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  /**
   * Handle user login
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).render('pages/auth/auth', {
          title: 'Sign In - Accelerator Platform',
          layout: 'auth',
          error: 'Email and password are required',
        });
      }

      const user = await this.authService.login(email, password);

      // Set session
      req.session.userId = user.id;
      req.session.user = user;

      // Redirect to dashboard on successful login
      res.redirect('/pages/dashboard');
    } catch (error) {
      console.error('Login error:', error);

      if (error.name === 'ValidationError') {
        return res.status(error.statusCode).render('pages/auth/auth', {
          title: 'Sign In - Accelerator Platform',
          layout: 'auth',
          error: error.firstError,
        });
      }

      res.status(500).render('pages/auth/auth', {
        title: 'Sign In - Accelerator Platform',
        layout: 'auth',
        error: 'An error occurred during login',
      });
    }
  }

  /**
   * Handle user registration
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async register(req, res) {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        role = 'startup',
      } = req.body;

      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'All fields are required',
        });
      }

      const user = await this.authService.register({
        email,
        password,
        firstName,
        lastName,
        role,
      });

      res.status(201).json({
        success: true,
        user,
        message: 'Registration successful',
      });
    } catch (error) {
      console.error('Registration error:', error);

      if (error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          error: error.name,
          message: error.firstError,
          details: error.errors,
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred during registration',
      });
    }
  }

  /**
   * Handle user logout
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async logout(req, res) {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error('Logout error:', err);
          return res.status(500).json({
            error: 'Internal Server Error',
            message: 'An error occurred during logout',
          });
        }

        res.clearCookie('connect.sid');
        res.json({
          success: true,
          message: 'Logout successful',
        });
      });
    } catch (error) {
      console.error('Logout error:', error);
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
    try {
      const user = await this.authService.getUserById(req.user.id);
      res.json({
        success: true,
        user,
      });
    } catch (error) {
      console.error('Get profile error:', error);

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
    try {
      const { firstName, lastName, role } = req.body;
      const user = await this.authService.updateProfile(req.user.id, {
        firstName,
        lastName,
        role,
      });

      // Update session
      req.session.user = user;

      res.json({
        success: true,
        user,
        message: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Update profile error:', error);

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

  /**
   * Change user password
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Current password and new password are required',
        });
      }

      await this.authService.changePassword(
        req.user.id,
        currentPassword,
        newPassword
      );

      res.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      console.error('Change password error:', error);

      if (error.name === 'NotFoundError' || error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          error: error.name,
          message: error.firstError,
          details: error.errors,
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while changing password',
      });
    }
  }

  /**
   * Get users by role (admin function)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUsersByRole(req, res) {
    try {
      const { role } = req.params;

      if (!role) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Role parameter is required',
        });
      }

      const users = await this.authService.getUsersByRole(role);
      res.json({
        success: true,
        users,
      });
    } catch (error) {
      console.error('Get users by role error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while fetching users',
      });
    }
  }

  /**
   * Search users
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async searchUsers(req, res) {
    try {
      const { q: query } = req.query;

      if (!query || query.trim().length < 2) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Search query must be at least 2 characters',
        });
      }

      const users = await this.authService.searchUsers(query);
      res.json({
        success: true,
        users,
      });
    } catch (error) {
      console.error('Search users error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while searching users',
      });
    }
  }
}

module.exports = AuthController;
