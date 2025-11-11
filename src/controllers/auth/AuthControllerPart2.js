const { Logger } = require('../../utils/logger');

/**
 * Authentication controller part 2 handling password change, user search operations
 */
class AuthControllerPart2 {
  constructor(authService) {
    this.authService = authService;
    this.logger = new Logger('AuthController');
  }

  /**
   * Change user password
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async changePassword(req, res) {
    this.logger.info('Password change request', { 
      userId: req.user.id,
      ip: req.ip || req.connection.remoteAddress 
    });

    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        const errorMessage = 'Current password and new password are required';
        this.logger.warn('Password change failed - missing required fields', { 
          userId: req.user.id,
          ip: req.ip || req.connection.remoteAddress 
        });

        return res.status(400).json({
          error: 'Validation Error',
          message: errorMessage,
        });
      }

      await this.authService.changePassword(
        req.user.id,
        currentPassword,
        newPassword
      );

      this.logger.info('Password changed successfully', { userId: req.user.id });
      res.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      this.logger.error('Password change error:', error, { 
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

module.exports = AuthControllerPart2;
