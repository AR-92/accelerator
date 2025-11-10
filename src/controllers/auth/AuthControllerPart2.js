/**
 * Authentication controller part 2 handling password change, user search operations
 */
class AuthControllerPart2 {
  constructor(authService) {
    this.authService = authService;
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

module.exports = AuthControllerPart2;
