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
      const { id } = req.params;
      const user = await this.adminService.getUserById(parseInt(id));

      res.render('pages/admin/user-details', {
        title: `User Details - ${user.firstName} ${user.lastName} - Admin Panel`,
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
   * Show system health page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showSystemHealth(req, res) {
    try {
      const systemStats = await this.adminService.getSystemStats();

      res.render('pages/admin/system-health', {
        title: 'System Health - Admin Panel',
        layout: 'admin',
        systemStats,
        activeSystemHealth: true,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading system health page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'admin',
        message: 'An error occurred while loading system health.',
        user: req.user,
      });
    }
  }

  /**
   * Show collaboration management page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showCollaborations(req, res) {
    try {
      // Check if this is an AJAX request
      const isAjax =
        req.headers['x-requested-with'] === 'XMLHttpRequest' ||
        req.query.ajax === 'true';

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const status = req.query.status;
      const search = req.query.search;
      const sortBy = req.query.sortBy || 'created_at';
      const sortOrder = req.query.sortOrder || 'desc';

      const result = await this.adminService.getProjects({
        page,
        limit,
        status,
        search,
        sortBy,
        sortOrder,
      });

      if (isAjax) {
        // Return JSON for AJAX requests
        res.json({
          success: true,
          projects: result.projects,
          pagination: result.pagination,
          filters: { status, search, sortBy, sortOrder },
        });
      } else {
        // Render full page for regular requests
        res.render('pages/admin/collaborations', {
          title: 'Collaboration Management - Admin Panel',
          layout: 'admin',
          projects: result.projects,
          pagination: result.pagination,
          filters: { status, search, sortBy, sortOrder },
          activeCollaborations: true,
          user: req.user,
        });
      }
    } catch (error) {
      console.error('Error loading collaborations page:', error);
      if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        res.status(500).json({
          success: false,
          error: 'An error occurred while loading collaborations.',
        });
      } else {
        res.status(500).render('pages/error/page-not-found', {
          title: 'Error - Admin Panel',
          layout: 'admin',
          message: 'An error occurred while loading collaborations.',
          user: req.user,
        });
      }
    }
  }

  /**
   * Show collaboration details page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showCollaborationDetails(req, res) {
    try {
      const { projectId } = req.params;
      const project = await this.adminService.getProjectById(
        parseInt(projectId)
      );

      res.render('pages/admin/collaboration-details', {
        title: `Collaboration Details - ${project.title} - Admin Panel`,
        layout: 'admin',
        project,
        activeCollaborations: true,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading collaboration details page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'admin',
        message: 'An error occurred while loading collaboration details.',
        user: req.user,
      });
    }
  }

  // ===== PACKAGE MANAGEMENT =====

  /**
   * Show packages management page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showPackages(req, res) {
    try {
      // Check if this is an AJAX request
      const isAjax =
        req.headers['x-requested-with'] === 'XMLHttpRequest' ||
        req.query.ajax === 'true';

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const status = req.query.status;
      const search = req.query.search;

      const result = await this.adminService.getPackages({
        page,
        limit,
        status,
        search,
      });

      if (isAjax) {
        // Return JSON for AJAX requests
        res.json({
          success: true,
          packages: result.packages,
          pagination: result.pagination,
          filters: { status, search },
        });
      } else {
        // Render full page for regular requests
        res.render('pages/admin/packages', {
          title: 'Package Management - Admin Panel',
          layout: 'admin',
          packages: result.packages,
          pagination: result.pagination,
          filters: { status, search },
          activePackages: true,
          user: req.user,
        });
      }
    } catch (error) {
      console.error('Error loading packages page:', error);
      if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        res.status(500).json({
          success: false,
          error: 'An error occurred while loading packages.',
        });
      } else {
        res.status(500).render('pages/error/page-not-found', {
          title: 'Error - Admin Panel',
          layout: 'admin',
          message: 'An error occurred while loading packages.',
          user: req.user,
        });
      }
    }
  }

  /**
   * Show package details page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showPackageDetails(req, res) {
    try {
      const { packageId } = req.params;
      const pkg = await this.adminService.getPackageById(parseInt(packageId));

      res.render('pages/admin/package-details', {
        title: `Package Details - ${pkg.name} - Admin Panel`,
        layout: 'admin',
        package: pkg,
        activePackages: true,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading package details page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'admin',
        message: 'An error occurred while loading package details.',
        user: req.user,
      });
    }
  }

  /**
   * Create a new package
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createPackage(req, res) {
    try {
      const packageData = req.body;
      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const pkg = await this.adminService.createPackage(packageData, adminInfo);

      res.status(201).json({
        success: true,
        package: pkg,
        message: 'Package created successfully',
      });
    } catch (error) {
      console.error('Error creating package:', error);

      if (error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          success: false,
          error: error.firstError,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while creating package',
      });
    }
  }

  /**
   * Update a package
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updatePackage(req, res) {
    try {
      const { packageId } = req.params;
      const packageData = req.body;
      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const pkg = await this.adminService.updatePackage(
        parseInt(packageId),
        packageData,
        adminInfo
      );

      res.json({
        success: true,
        package: pkg,
        message: 'Package updated successfully',
      });
    } catch (error) {
      console.error('Error updating package:', error);

      if (error.name === 'NotFoundError' || error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          success: false,
          error: error.firstError,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while updating package',
      });
    }
  }

  /**
   * Delete a package
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deletePackage(req, res) {
    try {
      const { packageId } = req.params;
      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const success = await this.adminService.deletePackage(
        parseInt(packageId),
        adminInfo
      );

      if (success) {
        res.json({
          success: true,
          message: 'Package deleted successfully',
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Package not found',
        });
      }
    } catch (error) {
      console.error('Error deleting package:', error);

      if (error.name === 'NotFoundError') {
        return res.status(error.statusCode).json({
          success: false,
          error: error.firstError,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while deleting package',
      });
    }
  }

  // ===== BILLING MANAGEMENT =====

  /**
   * Show billing management page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showBilling(req, res) {
    try {
      // Check if this is an AJAX request
      const isAjax =
        req.headers['x-requested-with'] === 'XMLHttpRequest' ||
        req.query.ajax === 'true';

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const status = req.query.status;
      const userId = req.query.userId;

      const result = await this.adminService.getBillingTransactions({
        page,
        limit,
        status,
        userId,
      });

      if (isAjax) {
        // Return JSON for AJAX requests
        res.json({
          success: true,
          transactions: result.transactions,
          pagination: result.pagination,
          filters: { status, userId },
        });
      } else {
        // Render full page for regular requests
        res.render('pages/admin/billing', {
          title: 'Billing Management - Admin Panel',
          layout: 'admin',
          transactions: result.transactions,
          pagination: result.pagination,
          filters: { status, userId },
          activeBilling: true,
          user: req.user,
        });
      }
    } catch (error) {
      console.error('Error loading billing page:', error);
      if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        res.status(500).json({
          success: false,
          error: 'An error occurred while loading billing transactions.',
        });
      } else {
        res.status(500).render('pages/error/page-not-found', {
          title: 'Error - Admin Panel',
          layout: 'admin',
          message: 'An error occurred while loading billing transactions.',
          user: req.user,
        });
      }
    }
  }

  /**
   * Show billing transaction details page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showBillingDetails(req, res) {
    try {
      const { billingId } = req.params;
      const transaction = await this.adminService.getBillingTransactionById(
        parseInt(billingId)
      );

      res.render('pages/admin/billing-details', {
        title: `Billing Details - Transaction ${billingId} - Admin Panel`,
        layout: 'admin',
        transaction,
        activeBilling: true,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading billing details page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'admin',
        message: 'An error occurred while loading billing details.',
        user: req.user,
      });
    }
  }

  /**
   * Create a billing transaction
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createBillingTransaction(req, res) {
    try {
      const billingData = req.body;
      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const transaction = await this.adminService.createBillingTransaction(
        billingData,
        adminInfo
      );

      res.status(201).json({
        success: true,
        transaction,
        message: 'Billing transaction created successfully',
      });
    } catch (error) {
      console.error('Error creating billing transaction:', error);

      if (error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          success: false,
          error: error.firstError,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while creating billing transaction',
      });
    }
  }

  /**
   * Update billing transaction status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateBillingStatus(req, res) {
    try {
      const { billingId } = req.params;
      const { status } = req.body;
      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const transaction =
        await this.adminService.updateBillingTransactionStatus(
          parseInt(billingId),
          status,
          adminInfo
        );

      res.json({
        success: true,
        transaction,
        message: 'Billing transaction status updated successfully',
      });
    } catch (error) {
      console.error('Error updating billing status:', error);

      if (error.name === 'NotFoundError' || error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          success: false,
          error: error.firstError,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while updating billing status',
      });
    }
  }

  /**
   * Process refund
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async processRefund(req, res) {
    try {
      const { billingId } = req.params;
      const { refundAmount, refundReason } = req.body;
      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const transaction = await this.adminService.processRefund(
        parseInt(billingId),
        refundAmount,
        refundReason,
        adminInfo
      );

      res.json({
        success: true,
        transaction,
        message: 'Refund processed successfully',
      });
    } catch (error) {
      console.error('Error processing refund:', error);

      if (error.name === 'NotFoundError' || error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          success: false,
          error: error.firstError,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while processing refund',
      });
    }
  }

  // ===== REWARD MANAGEMENT =====

  /**
   * Show rewards management page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showRewards(req, res) {
    try {
      // Check if this is an AJAX request
      const isAjax =
        req.headers['x-requested-with'] === 'XMLHttpRequest' ||
        req.query.ajax === 'true';

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const status = req.query.status;
      const type = req.query.type;
      const userId = req.query.userId;

      const result = await this.adminService.getRewards({
        page,
        limit,
        status,
        type,
        userId,
      });

      if (isAjax) {
        // Return JSON for AJAX requests
        res.json({
          success: true,
          rewards: result.rewards,
          pagination: result.pagination,
          filters: { status, type, userId },
        });
      } else {
        // Render full page for regular requests
        res.render('pages/admin/rewards', {
          title: 'Reward Management - Admin Panel',
          layout: 'admin',
          rewards: result.rewards,
          pagination: result.pagination,
          filters: { status, type, userId },
          activeRewards: true,
          user: req.user,
        });
      }
    } catch (error) {
      console.error('Error loading rewards page:', error);
      if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        res.status(500).json({
          success: false,
          error: 'An error occurred while loading rewards.',
        });
      } else {
        res.status(500).render('pages/error/page-not-found', {
          title: 'Error - Admin Panel',
          layout: 'admin',
          message: 'An error occurred while loading rewards.',
          user: req.user,
        });
      }
    }
  }

  /**
   * Show reward details page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showRewardDetails(req, res) {
    try {
      const { rewardId } = req.params;
      const reward = await this.adminService.getRewardById(parseInt(rewardId));

      res.render('pages/admin/reward-details', {
        title: `Reward Details - ${reward.title} - Admin Panel`,
        layout: 'admin',
        reward,
        activeRewards: true,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading reward details page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'admin',
        message: 'An error occurred while loading reward details.',
        user: req.user,
      });
    }
  }

  /**
   * Create a reward
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createReward(req, res) {
    try {
      const rewardData = req.body;
      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const reward = await this.adminService.createReward(
        rewardData,
        adminInfo
      );

      res.status(201).json({
        success: true,
        reward,
        message: 'Reward created successfully',
      });
    } catch (error) {
      console.error('Error creating reward:', error);

      if (error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          success: false,
          error: error.firstError,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while creating reward',
      });
    }
  }

  /**
   * Update a reward
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateReward(req, res) {
    try {
      const { rewardId } = req.params;
      const rewardData = req.body;
      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const reward = await this.adminService.updateReward(
        parseInt(rewardId),
        rewardData,
        adminInfo
      );

      res.json({
        success: true,
        reward,
        message: 'Reward updated successfully',
      });
    } catch (error) {
      console.error('Error updating reward:', error);

      if (error.name === 'NotFoundError' || error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          success: false,
          error: error.firstError,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while updating reward',
      });
    }
  }

  /**
   * Delete a reward
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteReward(req, res) {
    try {
      const { rewardId } = req.params;
      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const success = await this.adminService.deleteReward(
        parseInt(rewardId),
        adminInfo
      );

      if (success) {
        res.json({
          success: true,
          message: 'Reward deleted successfully',
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Reward not found',
        });
      }
    } catch (error) {
      console.error('Error deleting reward:', error);

      if (error.name === 'NotFoundError') {
        return res.status(error.statusCode).json({
          success: false,
          error: error.firstError,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while deleting reward',
      });
    }
  }

  /**
   * Grant reward to user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async grantReward(req, res) {
    try {
      const { userId, type, title, credits } = req.body;
      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const reward = await this.adminService.grantRewardToUser(
        parseInt(userId),
        type,
        title,
        parseInt(credits),
        adminInfo
      );

      res.status(201).json({
        success: true,
        reward,
        message: 'Reward granted successfully',
      });
    } catch (error) {
      console.error('Error granting reward:', error);

      if (error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          success: false,
          error: error.firstError,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while granting reward',
      });
    }
  }

  /**
   * Get system stats for HTMX polling (API endpoint)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getSystemStatsAPI(req, res) {
    try {
      const systemStats = await this.adminService.getSystemStats();

      // Check if this is an HTMX request
      const isHtmx = req.headers['hx-request'] === 'true';

      if (isHtmx) {
        // Return only the dynamic content (main monitoring area) for HTMX
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        res.set('Content-Type', 'text/html');

        // Render just the main content part
        const content = `
       <!-- Dynamic Header Info -->
       <div class='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6'>
         <div class='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
           <div class='text-sm text-gray-600 dark:text-gray-400'>
             <div>System Info: <span class='font-medium text-gray-900 dark:text-white'>${systemStats.system.platform} ${systemStats.system.arch}</span></div>
           </div>
           <div class='text-sm text-gray-600 dark:text-gray-400'>
             <div>Uptime: <span class='font-medium text-gray-900 dark:text-white'>${systemStats.uptime}</span></div>
             <div>Last Updated: <span class='font-medium text-gray-900 dark:text-white'>${systemStats.timestamp}</span></div>
           </div>
         </div>
       </div>

       <!-- Metrics Row -->
       <div class='grid grid-cols-1 lg:grid-cols-3 gap-6'>
         <!-- CPU Card -->
         <div class='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
           <div class='flex items-center justify-between mb-4'>
             <h2 class='text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2'>
               <svg class='w-5 h-5 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                 <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z'></path>
               </svg>
               CPU
             </h2>
             <div class='text-sm text-gray-600 dark:text-gray-400'>
               ${systemStats.cpu.usage}% | ${systemStats.cpu.cores.length} cores
             </div>
           </div>
           <div class='space-y-3'>
             ${systemStats.cpu.cores
               .map(
                 (core, index) => `
             <div class='flex items-center gap-3'>
               <span class='text-sm font-medium text-gray-700 dark:text-gray-300 w-8'>Core ${index}</span>
               <div class='flex-1'>
                 <div class='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                   <div class='h-2 rounded-full transition-all duration-300 ${core.usage > 80 ? 'bg-red-500' : core.usage > 60 ? 'bg-yellow-500' : 'bg-green-500'}' style='width: ${core.usage}%'></div>
                 </div>
               </div>
               <span class='text-sm font-medium ${core.usage > 80 ? 'text-red-600' : core.usage > 60 ? 'text-yellow-600' : 'text-green-600'} w-10 text-right'>${core.usage}%</span>
             </div>
             `
               )
               .join('')}
             <div class='pt-3 border-t border-gray-200 dark:border-gray-700'>
               <div class='grid grid-cols-2 gap-4 text-sm'>
                 <div>
                   <span class='text-gray-600 dark:text-gray-400'>Model:</span>
                   <span class='font-medium text-gray-900 dark:text-white ml-1'>${systemStats.cpu.model}</span>
                 </div>
                 <div>
                   <span class='text-gray-600 dark:text-gray-400'>Speed:</span>
                   <span class='font-medium text-gray-900 dark:text-white ml-1'>${systemStats.cpu.frequency} GHz</span>
                 </div>
                 <div class='col-span-2'>
                   <span class='text-gray-600 dark:text-gray-400'>Temperature:</span>
                   <span class='font-medium text-gray-900 dark:text-white ml-1'>${systemStats.cpu.temperature ? systemStats.cpu.temperature + '°C' : 'N/A'}</span>
                 </div>
               </div>
             </div>
             <div class='pt-3'>
               <h3 class='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>CPU Usage History</h3>
               <div class='bg-gray-100 dark:bg-gray-700 rounded p-2'>
                 <pre class='text-xs text-gray-800 dark:text-gray-200 font-mono leading-none' style='font-size: 10px; line-height: 10px;'>${systemStats.graphs.cpu}</pre>
               </div>
             </div>
           </div>
         </div>

         <!-- Memory Card -->
         <div class='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
           <h2 class='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
             <svg class='w-5 h-5 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
               <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01'></path>
             </svg>
             Memory
           </h2>
           <div class='space-y-4'>
             <div>
               <div class='flex justify-between text-sm mb-2'>
                 <span class='text-gray-700 dark:text-gray-300'>RAM Usage</span>
                 <span class='font-medium'>${systemStats.memory.systemUsed} / ${systemStats.memory.systemTotal} MB</span>
               </div>
               <div class='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3'>
                 <div class='h-3 rounded-full ${systemStats.memory.systemUsed / systemStats.memory.systemTotal > 0.8 ? 'bg-red-500' : systemStats.memory.systemUsed / systemStats.memory.systemTotal > 0.6 ? 'bg-yellow-500' : 'bg-green-500'}' style='width: ${Math.round((systemStats.memory.systemUsed / systemStats.memory.systemTotal) * 100)}%'></div>
               </div>
             </div>
             ${
               systemStats.memory.swapTotal
                 ? `
             <div>
               <div class='flex justify-between text-sm mb-2'>
                 <span class='text-gray-700 dark:text-gray-300'>Swap Usage</span>
                 <span class='font-medium'>${systemStats.memory.swapUsed} / ${systemStats.memory.swapTotal} MB</span>
               </div>
               <div class='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3'>
                 <div class='h-3 rounded-full ${systemStats.memory.swapUsed / systemStats.memory.swapTotal > 0.8 ? 'bg-red-500' : 'bg-blue-500'}' style='width: ${Math.round((systemStats.memory.swapUsed / systemStats.memory.swapTotal) * 100)}%'></div>
               </div>
             </div>
             `
                 : ''
             }
             <div class='grid grid-cols-2 gap-4 pt-3 border-t border-gray-200 dark:border-gray-700'>
               <div class='text-sm'>
                 <span class='text-gray-600 dark:text-gray-400'>Used:</span>
                 <span class='font-medium text-blue-600 ml-1'>${systemStats.memory.systemUsed}M</span>
               </div>
               <div class='text-sm'>
                 <span class='text-gray-600 dark:text-gray-400'>Free:</span>
                 <span class='font-medium text-green-600 ml-1'>${systemStats.memory.systemFree}M</span>
               </div>
               <div class='text-sm'>
                 <span class='text-gray-600 dark:text-gray-400'>Shared:</span>
                 <span class='font-medium text-yellow-600 ml-1'>${systemStats.memory.shared}M</span>
               </div>
               <div class='text-sm'>
                 <span class='text-gray-600 dark:text-gray-400'>Buffers:</span>
                 <span class='font-medium text-purple-600 ml-1'>${systemStats.memory.buffers}M</span>
               </div>
             </div>
           </div>
         </div>

         <!-- Network Card -->
         <div class='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
           <h2 class='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
             <svg class='w-5 h-5 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
               <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'></path>
             </svg>
             Network
           </h2>
           <div class='space-y-3'>
             ${systemStats.network.stats
               .map(
                 (stat) => `
             <div class='border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0 last:pb-0'>
               <h3 class='font-medium text-gray-900 dark:text-white mb-2'>${stat.iface}</h3>
               <div class='grid grid-cols-2 gap-4 text-sm'>
                 <div>
                   <span class='text-gray-600 dark:text-gray-400'>↓ Download:</span>
                   <span class='font-medium text-blue-600 ml-1'>${stat.download.speed}</span>
                 </div>
                 <div>
                   <span class='text-gray-600 dark:text-gray-400'>↑ Upload:</span>
                   <span class='font-medium text-red-600 ml-1'>${stat.upload.speed}</span>
                 </div>
               </div>
               <div class='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                 Total: ↓ ${stat.download.total} | ↑ ${stat.upload.total}
               </div>
             </div>
             `
               )
               .join('')}
             ${systemStats.network.stats.length === 0 ? "<div class='text-center text-gray-500 dark:text-gray-400 py-4'>No network data available</div>" : ''}
           </div>
         </div>
       </div>

       <!-- Processes Section -->
       <div class='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
         <h2 class='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
           <svg class='w-5 h-5 text-orange-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
             <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'></path>
           </svg>
           Top Processes
         </h2>
         <div class='overflow-x-auto'>
           <table class='w-full text-sm'>
             <thead>
               <tr class='border-b border-gray-200 dark:border-gray-700'>
                 <th class='text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300'>PID</th>
                 <th class='text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300'>Process</th>
                 <th class='text-right py-3 px-2 font-medium text-gray-700 dark:text-gray-300'>CPU %</th>
                 <th class='text-right py-3 px-2 font-medium text-gray-700 dark:text-gray-300'>Memory %</th>
                 <th class='text-right py-3 px-2 font-medium text-gray-700 dark:text-gray-300'>Memory</th>
                 <th class='text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300'>User</th>
               </tr>
             </thead>
             <tbody>
               ${systemStats.processes
                 .map(
                   (proc) => `
               <tr class='border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'>
                 <td class='py-3 px-2 text-blue-600 font-medium'>${proc.pid}</td>
                 <td class='py-3 px-2 text-gray-900 dark:text-white truncate max-w-xs' title='${proc.command}'>${proc.name}</td>
                 <td class='py-3 px-2 text-right ${proc.cpu > 50 ? 'text-red-600' : proc.cpu > 20 ? 'text-yellow-600' : 'text-green-600'} font-medium'>${proc.cpu}%</td>
                 <td class='py-3 px-2 text-right ${proc.memory > 10 ? 'text-red-600' : proc.memory > 5 ? 'text-yellow-600' : 'text-green-600'} font-medium'>${proc.memory}%</td>
                 <td class='py-3 px-2 text-right text-purple-600 font-medium'>${proc.memoryMB}M</td>
                 <td class='py-3 px-2 text-cyan-600 font-medium'>${proc.user}</td>
               </tr>
               `
                 )
                 .join('')}
             </tbody>
           </table>
         </div>
       </div>

       <!-- Bottom Row -->
       <div class='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6'>
         <!-- Disk I/O Card -->
         <div class='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
           <h2 class='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
             <svg class='w-5 h-5 text-indigo-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
               <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z'></path>
             </svg>
             Disk I/O
           </h2>
           <div class='space-y-3'>
             ${systemStats.disk.io
               .map(
                 (disk) => `
             <div class='border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0 last:pb-0'>
               <h3 class='font-medium text-gray-900 dark:text-white mb-2'>${disk.name}</h3>
               <div class='grid grid-cols-2 gap-2 text-sm'>
                 <div>
                   <span class='text-gray-600 dark:text-gray-400'>Read:</span>
                   <span class='font-medium text-blue-600 ml-1'>${disk.read}</span>
                 </div>
                 <div>
                   <span class='text-gray-600 dark:text-gray-400'>Write:</span>
                   <span class='font-medium text-red-600 ml-1'>${disk.write}</span>
                 </div>
               </div>
               <div class='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                 I/O: ${disk.io}/s | Util: ${disk.utilization}%
               </div>
             </div>
             `
               )
               .join('')}
             ${systemStats.disk.io.length === 0 ? "<div class='text-center text-gray-500 dark:text-gray-400 py-4'>No disk I/O data</div>" : ''}
           </div>
         </div>

         <!-- Temperatures Card -->
         ${
           systemStats.temperatures && systemStats.temperatures.length > 0
             ? `
         <div class='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
           <h2 class='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
             <svg class='w-5 h-5 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
               <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M13 10V3L4 14h7v7l9-11h-7z'></path>
             </svg>
             Temperatures
           </h2>
           <div class='space-y-3'>
             ${systemStats.temperatures
               .map(
                 (temp) => `
             <div class='flex justify-between items-center'>
               <span class='text-gray-700 dark:text-gray-300'>${temp.name}</span>
               <span class='font-medium ${temp.value > 80 ? 'text-red-600' : temp.value > 60 ? 'text-yellow-600' : 'text-green-600'}'>${temp.value}°C</span>
             </div>
             `
               )
               .join('')}
           </div>
         </div>
         `
             : ''
         }

         <!-- Battery Card -->
         ${
           systemStats.battery
             ? `
         <div class='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
           <h2 class='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
             <svg class='w-5 h-5 text-yellow-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
               <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3.75 18h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v10.5a1.5 1.5 0 001.5 1.5z'></path>
               <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M21.75 9h1.5a1.5 1.5 0 010 3h-1.5'></path>
             </svg>
             Battery
           </h2>
           <div class='space-y-4'>
             <div>
               <div class='flex justify-between text-sm mb-2'>
                 <span class='text-gray-700 dark:text-gray-300'>Level</span>
                 <span class='font-medium'>${systemStats.battery.level}%</span>
               </div>
               <div class='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3'>
                 <div class='h-3 rounded-full ${systemStats.battery.level < 20 ? 'bg-red-500' : systemStats.battery.level < 50 ? 'bg-yellow-500' : 'bg-green-500'}' style='width: ${systemStats.battery.level}%'></div>
               </div>
             </div>
             <div class='space-y-2 text-sm'>
               <div class='flex justify-between'>
                 <span class='text-gray-600 dark:text-gray-400'>Status:</span>
                 <span class='font-medium'>${systemStats.battery.status}</span>
               </div>
               ${
                 systemStats.battery.timeRemaining
                   ? `
               <div class='flex justify-between'>
                 <span class='text-gray-600 dark:text-gray-400'>Time remaining:</span>
                 <span class='font-medium'>${systemStats.battery.timeRemaining}</span>
               </div>
               `
                   : ''
               }
             </div>
           </div>
         </div>
         `
             : ''
         }

         <!-- System Info Card -->
         <div class='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6${systemStats.temperatures && systemStats.temperatures.length > 0 && systemStats.battery ? '' : ' xl:col-span-2'}'>
           <h2 class='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
             <svg class='w-5 h-5 text-cyan-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
               <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'></path>
             </svg>
             System Information
           </h2>
           <div class='grid grid-cols-1 gap-3 text-sm'>
             <div class='flex justify-between'>
               <span class='text-gray-600 dark:text-gray-400'>Platform:</span>
               <span class='font-medium text-gray-900 dark:text-white'>${systemStats.system.platform}</span>
             </div>
             <div class='flex justify-between'>
               <span class='text-gray-600 dark:text-gray-400'>Architecture:</span>
               <span class='font-medium text-gray-900 dark:text-white'>${systemStats.system.arch}</span>
             </div>
             <div class='flex justify-between'>
               <span class='text-gray-600 dark:text-gray-400'>Kernel:</span>
               <span class='font-medium text-gray-900 dark:text-white'>${systemStats.system.kernel}</span>
             </div>
             <div class='flex justify-between'>
               <span class='text-gray-600 dark:text-gray-400'>Distribution:</span>
               <span class='font-medium text-gray-900 dark:text-white'>${systemStats.system.distro}</span>
             </div>
             <div class='flex justify-between'>
               <span class='text-gray-600 dark:text-gray-400'>Model:</span>
               <span class='font-medium text-gray-900 dark:text-white'>${systemStats.system.model}</span>
             </div>
             <div class='flex justify-between'>
               <span class='text-gray-600 dark:text-gray-400'>Node.js:</span>
               <span class='font-medium text-gray-900 dark:text-white'>${systemStats.system.nodeVersion}</span>
             </div>
             <div class='flex justify-between'>
               <span class='text-gray-600 dark:text-gray-400'>Process ID:</span>
               <span class='font-medium text-gray-900 dark:text-white'>${systemStats.system.pid}</span>
             </div>
             <div class='flex justify-between'>
               <span class='text-gray-600 dark:text-gray-400'>Load Average:</span>
               <span class='font-medium text-gray-900 dark:text-white'>${systemStats.loadAverage[0]}, ${systemStats.loadAverage[1]}, ${systemStats.loadAverage[2]}</span>
             </div>
           </div>
         </div>
       </div>`;

        res.send(content);
      } else {
        // Return JSON for API calls
        res.json({
          success: true,
          systemStats,
        });
      }
    } catch (error) {
      console.error('Error getting system stats for API:', error);

      if (req.headers['hx-request'] === 'true') {
        // Return error HTML for HTMX
        res.status(500).send(`
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <div class="flex items-center">
              <p class="font-bold">Error:</p>
              <p class="ml-2">Failed to retrieve system statistics. Please try again.</p>
            </div>
          </div>
        `);
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to retrieve system statistics',
        });
      }
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
   * Show ideas management page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showIdeas(req, res) {
    try {
      // Check if this is an AJAX request
      const isAjax =
        req.headers['x-requested-with'] === 'XMLHttpRequest' ||
        req.query.ajax === 'true';

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const search = req.query.search;
      const sortBy = req.query.sortBy || 'created_at';
      const sortOrder = req.query.sortOrder || 'desc';

      const result = await this.adminService.getIdeas({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      });

      if (isAjax) {
        // Return JSON for AJAX requests
        res.json({
          success: true,
          ideas: result.ideas,
          pagination: result.pagination,
          filters: { search, sortBy, sortOrder },
        });
      } else {
        // Render full page for regular requests
        res.render('pages/admin/ideas', {
          title: 'Ideas Management - Admin Panel',
          layout: 'admin',
          ideas: result.ideas,
          pagination: result.pagination,
          filters: { search, sortBy, sortOrder },
          activeIdeas: true,
          user: req.user,
        });
      }
    } catch (error) {
      console.error('Error loading ideas page:', error);
      if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        res.status(500).json({
          success: false,
          error: 'An error occurred while loading ideas.',
        });
      } else {
        res.status(500).render('pages/error/page-not-found', {
          title: 'Error - Admin Panel',
          layout: 'admin',
          message: 'An error occurred while loading ideas.',
          user: req.user,
        });
      }
    }
  }

  /**
   * Show idea details page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showIdeaDetails(req, res) {
    try {
      const { ideaId } = req.params;
      const idea = await this.adminService.getIdeaById(parseInt(ideaId));

      res.render('pages/admin/idea-details', {
        title: `Idea Details - ${idea.title} - Admin Panel`,
        layout: 'admin',
        idea,
        activeIdeas: true,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading idea details page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'admin',
        message: 'An error occurred while loading idea details.',
        user: req.user,
      });
    }
  }

  /**
   * Get idea by ID (API endpoint)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getIdea(req, res) {
    try {
      const { ideaId } = req.params;
      const idea = await this.adminService.getIdeaById(parseInt(ideaId));

      res.json({
        success: true,
        idea,
      });
    } catch (error) {
      console.error('Error getting idea:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while fetching idea details',
      });
    }
  }

  /**
   * Show votes management page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showVotes(req, res) {
    try {
      // Check if this is an AJAX request
      const isAjax =
        req.headers['x-requested-with'] === 'XMLHttpRequest' ||
        req.query.ajax === 'true';

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      const result = await this.adminService.getVotes({
        page,
        limit,
      });

      if (isAjax) {
        // Return JSON for AJAX requests
        res.json({
          success: true,
          votes: result.votes,
          pagination: result.pagination,
        });
      } else {
        // Render full page for regular requests
        res.render('pages/admin/votes', {
          title: 'Votes Management - Admin Panel',
          layout: 'admin',
          votes: result.votes,
          pagination: result.pagination,
          activeVotes: true,
          user: req.user,
        });
      }
    } catch (error) {
      console.error('Error loading votes page:', error);
      if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        res.status(500).json({
          success: false,
          error: 'An error occurred while loading votes.',
        });
      } else {
        res.status(500).render('pages/error/page-not-found', {
          title: 'Error - Admin Panel',
          layout: 'admin',
          message: 'An error occurred while loading votes.',
          user: req.user,
        });
      }
    }
  }

  /**
   * Update an idea
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateIdea(req, res) {
    try {
      const { ideaId } = req.params;
      const ideaData = req.body;

      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const idea = await this.adminService.updateIdea(
        parseInt(ideaId),
        ideaData,
        adminInfo
      );

      res.json({
        success: true,
        idea,
        message: 'Idea updated successfully',
      });
    } catch (error) {
      console.error('Error updating idea:', error);

      if (error.name === 'NotFoundError' || error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          success: false,
          error: error.firstError,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while updating idea',
      });
    }
  }

  /**
   * Delete an idea
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteIdea(req, res) {
    try {
      const { ideaId } = req.params;

      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const success = await this.adminService.deleteIdea(
        parseInt(ideaId),
        adminInfo
      );

      if (success) {
        res.json({
          success: true,
          message: 'Idea deleted successfully',
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Idea not found',
        });
      }
    } catch (error) {
      console.error('Error deleting idea:', error);

      if (error.name === 'NotFoundError') {
        return res.status(error.statusCode).json({
          success: false,
          error: error.firstError,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while deleting idea',
      });
    }
  }

  /**
   * Get project by ID (API endpoint)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getProject(req, res) {
    try {
      const { projectId } = req.params;
      const project = await this.adminService.getProjectById(
        parseInt(projectId)
      );

      res.json({
        success: true,
        project,
      });
    } catch (error) {
      console.error('Error getting project:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while fetching project details',
      });
    }
  }

  /**
   * Update project status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateProjectStatus(req, res) {
    try {
      const { projectId } = req.params;
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

      const project = await this.adminService.updateProjectStatus(
        parseInt(projectId),
        status,
        adminInfo
      );

      res.json({
        success: true,
        project,
        message: 'Project status updated successfully',
      });
    } catch (error) {
      console.error('Error updating project status:', error);

      if (error.name === 'NotFoundError' || error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          success: false,
          error: error.firstError,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while updating project status',
      });
    }
  }

  /**
   * Remove user from project
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async removeUserFromProject(req, res) {
    try {
      const { projectId, userId } = req.params;

      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const success = await this.adminService.removeUserFromProject(
        parseInt(projectId),
        parseInt(userId),
        adminInfo
      );

      if (success) {
        res.json({
          success: true,
          message: 'User removed from project successfully',
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'User not found in project',
        });
      }
    } catch (error) {
      console.error('Error removing user from project:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while removing user from project',
      });
    }
  }

  /**
   * Delete project
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteProject(req, res) {
    try {
      const { projectId } = req.params;

      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const success = await this.adminService.deleteProject(
        parseInt(projectId),
        adminInfo
      );

      if (success) {
        res.json({
          success: true,
          message: 'Project deleted successfully',
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Project not found',
        });
      }
    } catch (error) {
      console.error('Error deleting project:', error);

      if (error.name === 'NotFoundError') {
        return res.status(error.statusCode).json({
          success: false,
          error: error.firstError,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while deleting project',
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

  /**
   * Show landing page management page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showLandingPage(req, res) {
    try {
      // Check if this is an AJAX request
      const isAjax =
        req.headers['x-requested-with'] === 'XMLHttpRequest' ||
        req.query.ajax === 'true';

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const sectionType = req.query.sectionType;
      const search = req.query.search;

      const result = await this.adminService.getLandingPageSections({
        page,
        limit,
        sectionType,
        search,
      });

      const sectionTypes = this.adminService.getLandingPageSectionTypes();

      if (isAjax) {
        return res.json({
          success: true,
          sections: result.sections.map((section) => section.toJSON()),
          pagination: result.pagination,
          filters: { sectionType, search },
        });
      }

      res.render('pages/admin/landing-page', {
        title: 'Landing Page Management - Admin Panel',
        layout: 'admin',
        sections: result.sections,
        pagination: result.pagination,
        sectionTypes,
        filters: { sectionType, search },
        activeLandingPage: true,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading landing page management:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'admin',
        message: 'An error occurred while loading landing page management.',
        user: req.user,
      });
    }
  }

  /**
   * Show landing page section details
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showLandingPageSection(req, res) {
    try {
      const { sectionId } = req.params;
      const section =
        await this.adminService.getLandingPageSectionById(sectionId);

      if (!section) {
        return res.status(404).render('pages/error/page-not-found', {
          title: 'Section Not Found - Admin Panel',
          layout: 'admin',
          message: 'The requested landing page section was not found.',
          user: req.user,
        });
      }

      const sectionTypes = this.adminService.getLandingPageSectionTypes();

      res.render('pages/admin/landing-page-section', {
        title: `Landing Page Section - ${section.title} - Admin Panel`,
        layout: 'admin',
        section,
        sectionTypes,
        activeLandingPage: true,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading landing page section:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'admin',
        message: 'An error occurred while loading the landing page section.',
        user: req.user,
      });
    }
  }

  /**
   * Get landing page section data (API)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getLandingPageSection(req, res) {
    try {
      const { sectionId } = req.params;
      const section =
        await this.adminService.getLandingPageSectionById(sectionId);

      if (!section) {
        return res.status(404).json({
          success: false,
          error: 'Landing page section not found',
        });
      }

      res.json({
        success: true,
        section,
      });
    } catch (error) {
      console.error('Error fetching landing page section:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while fetching the landing page section',
      });
    }
  }

  /**
   * Create landing page section
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createLandingPageSection(req, res) {
    try {
      const sectionData = {
        sectionType: req.body.sectionType,
        title: req.body.title,
        subtitle: req.body.subtitle,
        content: req.body.content,
        imageUrl: req.body.imageUrl,
        buttonText: req.body.buttonText,
        buttonUrl: req.body.buttonUrl,
        order: parseInt(req.body.order) || 0,
        isActive: req.body.isActive === 'on' || req.body.isActive === true,
        metadata: req.body.metadata || {},
      };

      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const sectionId = await this.adminService.createLandingPageSection(
        sectionData,
        adminInfo
      );

      res.json({
        success: true,
        sectionId,
        message: 'Landing page section created successfully',
      });
    } catch (error) {
      console.error('Error creating landing page section:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while creating the landing page section',
      });
    }
  }

  /**
   * Update landing page section
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateLandingPageSection(req, res) {
    try {
      const { sectionId } = req.params;
      const sectionData = {
        sectionType: req.body.sectionType,
        title: req.body.title,
        subtitle: req.body.subtitle,
        content: req.body.content,
        imageUrl: req.body.imageUrl,
        buttonText: req.body.buttonText,
        buttonUrl: req.body.buttonUrl,
        order: parseInt(req.body.order) || 0,
        isActive: req.body.isActive === 'on' || req.body.isActive === true,
        metadata: req.body.metadata || {},
      };

      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const success = await this.adminService.updateLandingPageSection(
        sectionId,
        sectionData,
        adminInfo
      );

      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Landing page section not found or could not be updated',
        });
      }

      res.json({
        success: true,
        message: 'Landing page section updated successfully',
      });
    } catch (error) {
      console.error('Error updating landing page section:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while updating the landing page section',
      });
    }
  }

  /**
   * Delete landing page section
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteLandingPageSection(req, res) {
    try {
      const { sectionId } = req.params;

      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const success = await this.adminService.deleteLandingPageSection(
        sectionId,
        adminInfo
      );

      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Landing page section not found or could not be deleted',
        });
      }

      res.json({
        success: true,
        message: 'Landing page section deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting landing page section:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while deleting the landing page section',
      });
    }
  }

  /**
   * Toggle landing page section status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async toggleLandingPageSectionStatus(req, res) {
    try {
      const { sectionId } = req.params;

      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const success = await this.adminService.toggleLandingPageSectionStatus(
        sectionId,
        adminInfo
      );

      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Landing page section not found or could not be toggled',
        });
      }

      res.json({
        success: true,
        message: 'Landing page section status updated successfully',
      });
    } catch (error) {
      console.error('Error toggling landing page section status:', error);
      res.status(500).json({
        success: false,
        error:
          'An error occurred while updating the landing page section status',
      });
    }
  }

  /**
   * Update landing page section order
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateLandingPageSectionOrder(req, res) {
    try {
      const { sectionId } = req.params;
      const { order } = req.body;

      const adminInfo = {
        id: req.user.id,
        email: req.user.email,
        ip: req.ip || req.connection.remoteAddress,
      };

      const success = await this.adminService.updateLandingPageSectionOrder(
        sectionId,
        parseInt(order),
        adminInfo
      );

      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Landing page section not found or could not be reordered',
        });
      }

      res.json({
        success: true,
        message: 'Landing page section order updated successfully',
      });
    } catch (error) {
      console.error('Error updating landing page section order:', error);
      res.status(500).json({
        success: false,
        error:
          'An error occurred while updating the landing page section order',
      });
    }
  }

  /**
   * Get package details (API endpoint)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getPackage(req, res) {
    try {
      const { packageId } = req.params;
      const pkg = await this.adminService.getPackageById(parseInt(packageId));

      res.json({
        success: true,
        package: pkg,
      });
    } catch (error) {
      console.error('Error getting package:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while fetching package details',
      });
    }
  }

  /**
   * Get billing transaction details (API endpoint)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getBillingTransaction(req, res) {
    try {
      const { billingId } = req.params;
      const transaction = await this.adminService.getBillingTransactionById(
        parseInt(billingId)
      );

      res.json({
        success: true,
        transaction,
      });
    } catch (error) {
      console.error('Error getting billing transaction:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while fetching billing transaction details',
      });
    }
  }

  /**
   * Get reward details (API endpoint)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getReward(req, res) {
    try {
      const { rewardId } = req.params;
      const reward = await this.adminService.getRewardById(parseInt(rewardId));

      res.json({
        success: true,
        reward,
      });
    } catch (error) {
      console.error('Error getting reward:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while fetching reward details',
      });
    }
  }
}

module.exports = AdminController;
