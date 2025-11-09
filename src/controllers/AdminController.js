/**
 * Admin controller handling HTTP requests for admin operations
 */
class AdminController {
  constructor(adminService) {
    this.adminService = adminService;
  }

  /**
   * Show admin dashboard
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showDashboard(req, res) {
    try {
      const stats = await this.adminService.getDashboardStats();

      res.render('pages/admin/dashboard', {
        title: 'Admin Dashboard - Accelerator Platform',
        layout: 'admin',
        stats,
        activeDashboard: true,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading admin dashboard:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'admin',
        message: 'An error occurred while loading the dashboard.',
        user: req.user,
      });
    }
  }

  /**
   * Show users management page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showUsers(req, res) {
    try {
      // Check if this is an AJAX request
      const isAjax =
        req.headers['x-requested-with'] === 'XMLHttpRequest' ||
        req.query.ajax === 'true';

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const role = req.query.role;
      const search = req.query.search;
      const sortBy = req.query.sortBy || 'created_at';
      const sortOrder = req.query.sortOrder || 'desc';

      const result = await this.adminService.getUsers({
        page,
        limit,
        role,
        search,
        sortBy,
        sortOrder,
      });

      if (isAjax) {
        // Return JSON for AJAX requests
        res.json({
          success: true,
          users: result.users,
          pagination: result.pagination,
          filters: { role, search, sortBy, sortOrder },
        });
      } else {
        // Render full page for regular requests
        res.render('pages/admin/users', {
          title: 'User Management - Admin Panel',
          layout: 'admin',
          users: result.users,
          pagination: result.pagination,
          filters: { role, search, sortBy, sortOrder },
          activeUsers: true,
          user: req.user,
        });
      }
    } catch (error) {
      console.error('Error loading users page:', error);
      if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        res.status(500).json({
          success: false,
          error: 'An error occurred while loading users.',
        });
      } else {
        res.status(500).render('pages/error/page-not-found', {
          title: 'Error - Admin Panel',
          layout: 'admin',
          message: 'An error occurred while loading users.',
          user: req.user,
        });
      }
    }
  }

  /**
   * Show user details page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showUserDetails(req, res) {
    try {
      const { userId } = req.params;
      const user = await this.adminService.getUserById(parseInt(userId));

      res.render('pages/admin/user-details', {
        title: `User Details - ${user.fullName} - Admin Panel`,
        layout: 'admin',
        user,
        activeUsers: true,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading user details page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'admin',
        message: 'An error occurred while loading user details.',
        user: req.user,
      });
    }
  }

  /**
   * Get user by ID (API endpoint)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUser(req, res) {
    try {
      const { userId } = req.params;
      const user = await this.adminService.getUserById(parseInt(userId));

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Error getting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
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
   * Export users to CSV
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async exportUsersToCSV(req, res) {
    try {
      const role = req.query.role;
      const search = req.query.search;

      // Get all users (no pagination for export)
      const result = await this.adminService.getUsers({
        page: 1,
        limit: 10000, // Large limit for export
        role,
        search,
        sortBy: 'created_at',
        sortOrder: 'desc',
      });

      // Convert to CSV
      const csvData = this.convertUsersToCSV(result.users);

      // Set headers for CSV download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="users_export.csv"'
      );

      res.send(csvData);
    } catch (error) {
      console.error('Error exporting users to CSV:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while exporting users',
      });
    }
  }

  /**
   * Convert users array to CSV string
   * @param {Array} users - Users array
   * @returns {string} CSV data
   */
  convertUsersToCSV(users) {
    const headers = [
      'ID',
      'Email',
      'First Name',
      'Last Name',
      'Role',
      'Status',
      'Banned',
      'Credits',
      'Created At',
      'Updated At',
    ];
    const csvRows = [headers.join(',')];

    users.forEach((user) => {
      const row = [
        user.id,
        `"${user.email}"`,
        `"${user.firstName}"`,
        `"${user.lastName}"`,
        user.role,
        user.status,
        user.banned ? 'Yes' : 'No',
        user.credits,
        user.createdAt,
        user.updatedAt,
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
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
   * Get startup details
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getStartup(req, res) {
    try {
      const { startupId } = req.params;
      const startup = await this.adminService.getStartupById(
        parseInt(startupId)
      );

      res.json({
        success: true,
        startup,
      });
    } catch (error) {
      console.error('Error getting startup:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while fetching startup details',
      });
    }
  }

  /**
   * Export startups to CSV
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async exportStartupsToCSV(req, res) {
    try {
      const industry = req.query.industry;
      const status = req.query.status;
      const search = req.query.search;

      // Get all startups (no pagination for export)
      const result = await this.adminService.getStartups({
        page: 1,
        limit: 10000, // Large limit for export
        industry,
        status,
        search,
        sortBy: 'created_at',
        sortOrder: 'desc',
      });

      // Convert to CSV
      const csvData = this.convertStartupsToCSV(result.startups);

      // Set headers for CSV download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="startups_export.csv"'
      );

      res.send(csvData);
    } catch (error) {
      console.error('Error exporting startups to CSV:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while exporting startups',
      });
    }
  }

  /**
   * Convert startups array to CSV string
   * @param {Array} startups - Startups array
   * @returns {string} CSV data
   */
  convertStartupsToCSV(startups) {
    const headers = [
      'ID',
      'Name',
      'Industry',
      'Status',
      'Description',
      'Website',
      'Founded Date',
      'User ID',
      'Created At',
      'Updated At',
    ];
    const csvRows = [headers.join(',')];

    startups.forEach((startup) => {
      const row = [
        startup.id,
        `"${startup.name}"`,
        `"${startup.industry}"`,
        startup.status,
        `"${startup.description || ''}"`,
        `"${startup.website || ''}"`,
        startup.foundedDate || '',
        startup.userId,
        startup.createdAt,
        startup.updatedAt,
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }

  /**
   * Show content management page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showContent(req, res) {
    try {
      const stats = await this.adminService.getDashboardStats();

      res.render('pages/admin/content', {
        title: 'Content Management - Admin Panel',
        layout: 'admin',
        stats,
        activeContent: true,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading content page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'admin',
        message: 'An error occurred while loading content.',
        user: req.user,
      });
    }
  }

  /**
   * Show help content management page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showHelpContent(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const category = req.query.category;
      const search = req.query.search;

      const result = await this.adminService.getHelpContent({
        page,
        limit,
        category,
        search,
      });

      res.render('pages/admin/help-content', {
        title: 'Help Content Management - Admin Panel',
        layout: 'admin',
        articles: result.articles,
        categories: result.categories,
        pagination: result.pagination,
        filters: { category, search },
        activeContent: true,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading help content page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'admin',
        message: 'An error occurred while loading help content.',
        user: req.user,
      });
    }
  }

  /**
   * Show learning content management page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showLearningContent(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const category = req.query.category;
      const search = req.query.search;

      const result = await this.adminService.getLearningContent({
        page,
        limit,
        category,
        search,
      });

      res.render('pages/admin/learning-content', {
        title: 'Learning Content Management - Admin Panel',
        layout: 'admin',
        articles: result.articles,
        categories: result.categories,
        pagination: result.pagination,
        filters: { category, search },
        activeContent: true,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading learning content page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'admin',
        message: 'An error occurred while loading learning content.',
        user: req.user,
      });
    }
  }

  /**
   * Show settings page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showSettings(req, res) {
    try {
      res.render('pages/admin/settings', {
        title: 'Settings - Admin Panel',
        layout: 'admin',
        activeSettings: true,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading settings page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'admin',
        message: 'An error occurred while loading settings.',
        user: req.user,
      });
    }
  }

  /**
   * Show startups management page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showStartups(req, res) {
    try {
      // Check if this is an AJAX request
      const isAjax =
        req.headers['x-requested-with'] === 'XMLHttpRequest' ||
        req.query.ajax === 'true';

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const industry = req.query.industry;
      const status = req.query.status;
      const search = req.query.search;
      const sortBy = req.query.sortBy || 'created_at';
      const sortOrder = req.query.sortOrder || 'desc';

      const result = await this.adminService.getStartups({
        page,
        limit,
        industry,
        status,
        search,
        sortBy,
        sortOrder,
        offset: (page - 1) * limit,
      });

      if (isAjax) {
        // Return JSON for AJAX requests
        res.json({
          success: true,
          startups: result.startups,
          pagination: result.pagination,
          filters: { industry, status, search, sortBy, sortOrder },
        });
      } else {
        // Render full page for regular requests
        res.render('pages/admin/startups', {
          title: 'Startup Management - Admin Panel',
          layout: 'admin',
          startups: result.startups,
          pagination: result.pagination,
          filters: { industry, status, search, sortBy, sortOrder },
          activeStartups: true,
          user: req.user,
        });
      }
    } catch (error) {
      console.error('Error loading startups page:', error);
      if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        res.status(500).json({
          success: false,
          error: 'An error occurred while loading startups.',
        });
      } else {
        res.status(500).render('pages/error/page-not-found', {
          title: 'Error - Admin Panel',
          layout: 'admin',
          message: 'An error occurred while loading startups.',
          user: req.user,
        });
      }
    }
  }

  /**
   * Show startup details page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showStartupDetails(req, res) {
    try {
      const { startupId } = req.params;
      const startup = await this.adminService.getStartupById(
        parseInt(startupId)
      );

      res.render('pages/admin/startup-details', {
        title: `Startup Details - ${startup.name} - Admin Panel`,
        layout: 'admin',
        startup,
        activeStartups: true,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading startup details page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'admin',
        message: 'An error occurred while loading startup details.',
        user: req.user,
      });
    }
  }

  /**
   * Create a new startup
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createStartup(req, res) {
    try {
      const {
        userId,
        name,
        description,
        industry,
        foundedDate,
        website,
        status,
      } = req.body;

      if (!userId || !name || !industry) {
        return res.status(400).json({
          success: false,
          error: 'User ID, name, and industry are required',
        });
      }

      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const startup = await this.adminService.createStartup(
        {
          userId: parseInt(userId),
          name,
          description,
          industry,
          foundedDate,
          website,
          status: status || 'active',
        },
        adminInfo
      );

      res.status(201).json({
        success: true,
        startup,
        message: 'Startup created successfully',
      });
    } catch (error) {
      console.error('Error creating startup:', error);

      if (error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          success: false,
          error: error.firstError,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while creating startup',
      });
    }
  }

  /**
   * Update a startup
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateStartup(req, res) {
    try {
      const { startupId } = req.params;
      const {
        userId,
        name,
        description,
        industry,
        foundedDate,
        website,
        status,
      } = req.body;

      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const startup = await this.adminService.updateStartup(
        parseInt(startupId),
        {
          userId: userId ? parseInt(userId) : undefined,
          name,
          description,
          industry,
          foundedDate,
          website,
          status,
        },
        adminInfo
      );

      res.json({
        success: true,
        startup,
        message: 'Startup updated successfully',
      });
    } catch (error) {
      console.error('Error updating startup:', error);

      if (error.name === 'NotFoundError' || error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          success: false,
          error: error.firstError,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while updating startup',
      });
    }
  }

  /**
   * Delete a startup
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteStartup(req, res) {
    try {
      const { startupId } = req.params;

      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const success = await this.adminService.deleteStartup(
        parseInt(startupId),
        adminInfo
      );

      if (success) {
        res.json({
          success: true,
          message: 'Startup deleted successfully',
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Startup not found',
        });
      }
    } catch (error) {
      console.error('Error deleting startup:', error);

      if (error.name === 'NotFoundError') {
        return res.status(error.statusCode).json({
          success: false,
          error: error.firstError,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while deleting startup',
      });
    }
  }

  /**
   * Get startup details
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getStartup(req, res) {
    try {
      const { startupId } = req.params;
      const startup = await this.adminService.getStartupById(
        parseInt(startupId)
      );

      res.json({
        success: true,
        startup,
      });
    } catch (error) {
      console.error('Error getting startup:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while fetching startup details',
      });
    }
  }

  /**
   * Show enterprises management page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showEnterprises(req, res) {
    try {
      // Check if this is an AJAX request
      const isAjax =
        req.headers['x-requested-with'] === 'XMLHttpRequest' ||
        req.query.ajax === 'true';

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const industry = req.query.industry;
      const status = req.query.status;
      const search = req.query.search;
      const companySize = req.query.companySize;
      const sortBy = req.query.sortBy || 'created_at';
      const sortOrder = req.query.sortOrder || 'desc';

      const result = await this.adminService.getEnterprises({
        page,
        limit,
        industry,
        status,
        search,
        companySize,
        sortBy,
        sortOrder,
        offset: (page - 1) * limit,
      });

      if (isAjax) {
        // Return JSON for AJAX requests
        res.json({
          success: true,
          enterprises: result.enterprises,
          pagination: result.pagination,
          filters: { industry, status, search, companySize, sortBy, sortOrder },
        });
      } else {
        // Render full page for regular requests
        res.render('pages/admin/enterprises', {
          title: 'Enterprise Management - Admin Panel',
          layout: 'admin',
          enterprises: result.enterprises,
          pagination: result.pagination,
          filters: { industry, status, search, companySize, sortBy, sortOrder },
          activeEnterprises: true,
          user: req.user,
        });
      }
    } catch (error) {
      console.error('Error loading enterprises page:', error);
      if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        res.status(500).json({
          success: false,
          error: 'An error occurred while loading enterprises.',
        });
      } else {
        res.status(500).render('pages/error/page-not-found', {
          title: 'Error - Admin Panel',
          layout: 'admin',
          message: 'An error occurred while loading enterprises.',
          user: req.user,
        });
      }
    }
  }

  /**
   * Show enterprise details page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showEnterpriseDetails(req, res) {
    try {
      const { enterpriseId } = req.params;
      const enterprise = await this.adminService.getEnterpriseById(
        parseInt(enterpriseId)
      );

      res.render('pages/admin/enterprise-details', {
        title: `Enterprise Details - ${enterprise.name} - Admin Panel`,
        layout: 'admin',
        enterprise,
        activeEnterprises: true,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading enterprise details page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'admin',
        message: 'An error occurred while loading enterprise details.',
        user: req.user,
      });
    }
  }

  /**
   * Create a new enterprise
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createEnterprise(req, res) {
    try {
      const enterpriseData = req.body;
      const enterprise = await this.adminService.createEnterprise(
        req.user.id,
        enterpriseData
      );

      res.json({
        success: true,
        enterprise,
        message: 'Enterprise created successfully',
      });
    } catch (error) {
      console.error('Error creating enterprise:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while creating enterprise',
      });
    }
  }

  /**
   * Update an enterprise
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateEnterprise(req, res) {
    try {
      const { enterpriseId } = req.params;
      const enterpriseData = req.body;

      const enterprise = await this.adminService.updateEnterprise(
        parseInt(enterpriseId),
        enterpriseData
      );

      if (!enterprise) {
        return res.status(404).json({
          success: false,
          error: 'Enterprise not found',
        });
      }

      res.json({
        success: true,
        enterprise,
        message: 'Enterprise updated successfully',
      });
    } catch (error) {
      console.error('Error updating enterprise:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while updating enterprise',
      });
    }
  }

  /**
   * Delete an enterprise
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteEnterprise(req, res) {
    try {
      const { enterpriseId } = req.params;
      const success = await this.adminService.deleteEnterprise(
        parseInt(enterpriseId)
      );

      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Enterprise not found',
        });
      }

      res.json({
        success: true,
        message: 'Enterprise deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting enterprise:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while deleting enterprise',
      });
    }
  }

  /**
   * Get enterprise by ID (API endpoint)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getEnterprise(req, res) {
    try {
      const { enterpriseId } = req.params;
      const enterprise = await this.adminService.getEnterpriseById(
        parseInt(enterpriseId)
      );

      res.json({
        success: true,
        enterprise,
      });
    } catch (error) {
      console.error('Error getting enterprise:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while fetching enterprise details',
      });
    }
  }

  /**
   * Bulk update enterprise status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async bulkUpdateEnterpriseStatus(req, res) {
    try {
      const { enterpriseIds, status } = req.body;

      if (!Array.isArray(enterpriseIds) || enterpriseIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'enterpriseIds must be a non-empty array',
        });
      }

      if (!['active', 'inactive', 'acquired', 'failed'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid status',
        });
      }

      const updatedCount = await this.adminService.bulkUpdateEnterpriseStatus(
        enterpriseIds,
        status
      );

      res.json({
        success: true,
        message: `${updatedCount} enterprise(s) updated successfully`,
        updatedCount,
      });
    } catch (error) {
      console.error('Error bulk updating enterprises:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while updating enterprises',
      });
    }
  }

  /**
   * Bulk delete enterprises
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async bulkDeleteEnterprises(req, res) {
    try {
      const { enterpriseIds } = req.body;

      if (!Array.isArray(enterpriseIds) || enterpriseIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'enterpriseIds must be a non-empty array',
        });
      }

      const deletedCount =
        await this.adminService.bulkDeleteEnterprises(enterpriseIds);

      res.json({
        success: true,
        message: `${deletedCount} enterprise(s) deleted successfully`,
        deletedCount,
      });
    } catch (error) {
      console.error('Error bulk deleting enterprises:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while deleting enterprises',
      });
    }
  }

  /**
   * Export enterprises to CSV
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async exportEnterprisesToCSV(req, res) {
    try {
      const filters = req.query;
      const csvContent =
        await this.adminService.exportEnterprisesToCSV(filters);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="enterprises.csv"'
      );
      res.send(csvContent);
    } catch (error) {
      console.error('Error exporting enterprises:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while exporting enterprises',
      });
    }
  }

  /**
   * Show corporates management page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showCorporates(req, res) {
    try {
      // Check if this is an AJAX request
      const isAjax =
        req.headers['x-requested-with'] === 'XMLHttpRequest' ||
        req.query.ajax === 'true';

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const industry = req.query.industry;
      const status = req.query.status;
      const sector = req.query.sector;
      const search = req.query.search;
      const companySize = req.query.companySize;
      const sortBy = req.query.sortBy || 'created_at';
      const sortOrder = req.query.sortOrder || 'desc';

      const result = await this.adminService.getCorporates({
        page,
        limit,
        industry,
        status,
        sector,
        search,
        companySize,
        sortBy,
        sortOrder,
        offset: (page - 1) * limit,
      });

      if (isAjax) {
        // Return JSON for AJAX requests
        res.json({
          success: true,
          corporates: result.corporates,
          pagination: result.pagination,
          filters: {
            industry,
            status,
            sector,
            search,
            companySize,
            sortBy,
            sortOrder,
          },
        });
      } else {
        // Render full page for regular requests
        res.render('pages/admin/corporates', {
          title: 'Corporate Management - Admin Panel',
          layout: 'admin',
          corporates: result.corporates,
          pagination: result.pagination,
          filters: {
            industry,
            status,
            sector,
            search,
            companySize,
            sortBy,
            sortOrder,
          },
          activeCorporates: true,
          user: req.user,
        });
      }
    } catch (error) {
      console.error('Error loading corporates page:', error);
      if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        res.status(500).json({
          success: false,
          error: 'An error occurred while loading corporates.',
        });
      } else {
        res.status(500).render('pages/error/page-not-found', {
          title: 'Error - Admin Panel',
          layout: 'admin',
          message: 'An error occurred while loading corporates.',
          user: req.user,
        });
      }
    }
  }

  /**
   * Show corporate details page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showCorporateDetails(req, res) {
    try {
      const { corporateId } = req.params;
      const corporate = await this.adminService.getCorporateById(
        parseInt(corporateId)
      );

      res.render('pages/admin/corporate-details', {
        title: `Corporate Details - ${corporate.name} - Admin Panel`,
        layout: 'admin',
        corporate,
        activeCorporates: true,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading corporate details page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'admin',
        message: 'An error occurred while loading corporate details.',
        user: req.user,
      });
    }
  }

  /**
   * Create a new corporate
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createCorporate(req, res) {
    try {
      const corporateData = req.body;
      const corporate = await this.adminService.createCorporate(
        req.user.id,
        corporateData
      );

      res.json({
        success: true,
        corporate,
        message: 'Corporate created successfully',
      });
    } catch (error) {
      console.error('Error creating corporate:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while creating corporate',
      });
    }
  }

  /**
   * Update a corporate
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateCorporate(req, res) {
    try {
      const { corporateId } = req.params;
      const corporateData = req.body;

      const corporate = await this.adminService.updateCorporate(
        parseInt(corporateId),
        corporateData
      );

      if (!corporate) {
        return res.status(404).json({
          success: false,
          error: 'Corporate not found',
        });
      }

      res.json({
        success: true,
        corporate,
        message: 'Corporate updated successfully',
      });
    } catch (error) {
      console.error('Error updating corporate:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while updating corporate',
      });
    }
  }

  /**
   * Delete a corporate
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteCorporate(req, res) {
    try {
      const { corporateId } = req.params;
      const success = await this.adminService.deleteCorporate(
        parseInt(corporateId)
      );

      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Corporate not found',
        });
      }

      res.json({
        success: true,
        message: 'Corporate deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting corporate:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while deleting corporate',
      });
    }
  }

  /**
   * Get corporate by ID (API endpoint)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getCorporate(req, res) {
    try {
      const { corporateId } = req.params;
      const corporate = await this.adminService.getCorporateById(
        parseInt(corporateId)
      );

      res.json({
        success: true,
        corporate,
      });
    } catch (error) {
      console.error('Error getting corporate:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while fetching corporate details',
      });
    }
  }

  /**
   * Bulk update corporate status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async bulkUpdateCorporateStatus(req, res) {
    try {
      const { corporateIds, status } = req.body;

      if (!Array.isArray(corporateIds) || corporateIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'corporateIds must be a non-empty array',
        });
      }

      if (!['active', 'inactive', 'acquired', 'failed'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid status',
        });
      }

      const updatedCount = await this.adminService.bulkUpdateCorporateStatus(
        corporateIds,
        status
      );

      res.json({
        success: true,
        message: `${updatedCount} corporate(s) updated successfully`,
        updatedCount,
      });
    } catch (error) {
      console.error('Error bulk updating corporates:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while updating corporates',
      });
    }
  }

  /**
   * Bulk delete corporates
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async bulkDeleteCorporates(req, res) {
    try {
      const { corporateIds } = req.body;

      if (!Array.isArray(corporateIds) || corporateIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'corporateIds must be a non-empty array',
        });
      }

      const deletedCount =
        await this.adminService.bulkDeleteCorporates(corporateIds);

      res.json({
        success: true,
        message: `${deletedCount} corporate(s) deleted successfully`,
        deletedCount,
      });
    } catch (error) {
      console.error('Error bulk deleting corporates:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while deleting corporates',
      });
    }
  }

  /**
   * Export corporates to CSV
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async exportCorporatesToCSV(req, res) {
    try {
      const filters = req.query;
      const csvContent = await this.adminService.exportCorporatesToCSV(filters);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="corporates.csv"'
      );
      res.send(csvContent);
    } catch (error) {
      console.error('Error exporting corporates:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while exporting corporates',
      });
    }
  }
}

module.exports = AdminController;
