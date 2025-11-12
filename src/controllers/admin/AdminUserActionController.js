/**
 * Admin user action controller handling user updates, bulk operations, and creation
 */
class AdminUserActionController {
  constructor(adminService) {
    this.adminService = adminService;
  }

  /**
   * Update user credits
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateUserCredits(req, res) {
    try {
      const { userId } = req.params;
      const { credits } = req.body;

      if (!credits || isNaN(credits)) {
        return res.status(400).json({
          success: false,
          error: 'Valid credits amount is required',
        });
      }

      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const user = await this.adminService.updateUserCredits(
        parseInt(userId),
        parseInt(credits),
        adminInfo
      );

      res.json({
        success: true,
        user,
        message: 'User credits updated successfully',
      });
    } catch (error) {
      console.error('Error updating user credits:', error);

      if (error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          success: false,
          error: error.firstError,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while updating user credits',
      });
    }
  }

  /**
   * Update user role
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateUserRole(req, res) {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!role) {
        return res.status(400).json({
          success: false,
          error: 'Role is required',
        });
      }

      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const user = await this.adminService.updateUserRole(
        parseInt(userId),
        role,
        adminInfo
      );

      res.json({
        success: true,
        user,
        message: 'User role updated successfully',
      });
    } catch (error) {
      console.error('Error updating user role:', error);

      if (error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          success: false,
          error: error.firstError,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while updating user role',
      });
    }
  }

  /**
   * Update user status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateUserStatus(req, res) {
    try {
      const { userId } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          error: 'Status is required',
        });
      }

      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const user = await this.adminService.updateUserStatus(
        parseInt(userId),
        status,
        adminInfo
      );

      res.json({
        success: true,
        user,
        message: 'User status updated successfully',
      });
    } catch (error) {
      console.error('Error updating user status:', error);

      if (error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          success: false,
          error: error.firstError,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while updating user status',
      });
    }
  }

  /**
   * Update user banned status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateUserBanned(req, res) {
    try {
      const { userId } = req.params;
      const { banned, reason } = req.body;

      if (typeof banned !== 'boolean') {
        return res.status(400).json({
          success: false,
          error: 'Banned status must be a boolean',
        });
      }

      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const user = await this.adminService.updateUserBanned(
        parseInt(userId),
        banned,
        reason || '',
        adminInfo
      );

      res.json({
        success: true,
        user,
        message: `User ${banned ? 'banned' : 'unbanned'} successfully`,
      });
    } catch (error) {
      console.error('Error updating user banned status:', error);

      if (error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          success: false,
          error: error.firstError,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while updating user banned status',
      });
    }
  }

  /**
   * Reset user password
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async resetUserPassword(req, res) {
    try {
      const { userId } = req.params;

      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const result = await this.adminService.resetUserPassword(
        parseInt(userId),
        adminInfo
      );

      res.json({
        success: true,
        result,
        message: 'Password reset successfully',
      });
    } catch (error) {
      console.error('Error resetting user password:', error);

      if (error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          success: false,
          error: error.firstError,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while resetting user password',
      });
    }
  }

  /**
   * Delete user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteUser(req, res) {
    try {
      const { userId } = req.params;

      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const success = await this.adminService.deleteUser(
        parseInt(userId),
        adminInfo
      );

      if (success) {
        res.json({
          success: true,
          message: 'User deleted successfully',
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);

      if (error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          success: false,
          error: error.firstError,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while deleting user',
      });
    }
  }

  /**
   * Bulk update user credits
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async bulkUpdateCredits(req, res) {
    try {
      const { updates } = req.body;

      if (!Array.isArray(updates) || updates.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Updates array is required',
        });
      }

      const results = await this.adminService.bulkUpdateCredits(updates);

      res.json({
        success: true,
        results,
        message: `${results.length} users updated successfully`,
      });
    } catch (error) {
      console.error('Error bulk updating credits:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred during bulk update',
      });
    }
  }

  /**
   * Bulk update user roles
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async bulkUpdateRoles(req, res) {
    try {
      const { userIds, role } = req.body;

      if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'User IDs array is required',
        });
      }

      if (!role) {
        return res.status(400).json({
          success: false,
          error: 'Role is required',
        });
      }

      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const results = await this.adminService.bulkUpdateRoles(
        userIds,
        role,
        adminInfo
      );

      res.json({
        success: true,
        results,
        message: `${results.filter((r) => r.success).length} users updated successfully`,
      });
    } catch (error) {
      console.error('Error bulk updating roles:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred during bulk role update',
      });
    }
  }

  /**
   * Create a new user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createUser(req, res) {
    try {
      const { email, firstName, lastName, password, role, credits } = req.body;

      if (!email || !firstName || !lastName || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email, first name, last name, and password are required',
        });
      }

      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const user = await this.adminService.createUser(
        {
          email,
          firstName,
          lastName,
          password,
          role: role || 'startup',
          credits: credits || 0,
        },
        adminInfo
      );

      res.status(201).json({
        success: true,
        user,
        message: 'User created successfully',
      });
    } catch (error) {
      console.error('Error creating user:', error);

      if (error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          success: false,
          error: error.firstError,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while creating user',
      });
    }
  }

  /**
   * Impersonate user (API)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async impersonateUser(req, res) {
    try {
      const { userId } = req.params;

      // Get the user to impersonate
      const user = await this.adminService.getUserById(parseInt(userId));

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      // Store original admin user in session
      req.session.originalUser = req.session.user;
      req.session.originalUserId = req.session.userId;

      // Set session to impersonated user
      req.session.user = user;
      req.session.userId = user.id;

      res.json({
        success: true,
        message: 'Successfully impersonating user',
      });
    } catch (error) {
      console.error('Error impersonating user:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while impersonating user',
      });
    }
  }

  /**
   * Impersonate user (page redirect)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async impersonateUserPage(req, res) {
    try {
      const { userId } = req.params;

      // Get the user to impersonate
      const user = await this.adminService.getUserById(parseInt(userId));

      if (!user) {
        return res.status(404).render('pages/error/page-not-found', {
          title: 'User Not Found - Admin Panel',
          layout: 'admin',
          message: 'The user you are trying to impersonate does not exist.',
        });
      }

      // Store original admin user in session
      req.session.originalUser = req.session.user;
      req.session.originalUserId = req.session.userId;

      // Set session to impersonated user
      req.session.user = user;
      req.session.userId = user.id;

      // Redirect to user dashboard
      res.redirect('/pages/dashboard');
    } catch (error) {
      console.error('Error impersonating user:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'admin',
        message: 'An error occurred while impersonating the user.',
      });
    }
  }
}

module.exports = AdminUserActionController;
