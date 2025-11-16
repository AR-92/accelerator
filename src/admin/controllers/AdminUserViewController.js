/**
 * Admin user view controller handling user listing, details, and export operations
 */
class AdminUserViewController {
  constructor(adminService) {
    this.adminService = adminService;
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
      const tab = req.query.tab || 'all';

      // Handle tab filters
      let tabFilters = {};
      if (tab === 'active') {
        tabFilters.status = 'active';
      } else if (tab === 'banned') {
        tabFilters.banned = true;
      } else if (tab === 'admins') {
        tabFilters.role = 'admin';
      }

      const result = await this.adminService.getUsers({
        page,
        limit,
        role,
        search,
        status: tabFilters.status,
        banned: tabFilters.banned,
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
          activeTab: tab,
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
          layout: 'error-admin',
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
        title: `User Details - ${user.firstName} ${user.lastName} - Admin Panel`,
        layout: 'admin',
        user: req.user,
        selectedUser: user,
        activeUsers: true,
      });
    } catch (error) {
      console.error('Error loading user details page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'error-admin',
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
   * Export users to CSV
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async exportUsersToCSV(req, res) {
    try {
      const role = req.query.role;
      const search = req.query.search;
      const tab = req.query.tab || 'all';

      // Handle tab filters
      let tabFilters = {};
      if (tab === 'active') {
        tabFilters.status = 'active';
      } else if (tab === 'banned') {
        tabFilters.banned = true;
      } else if (tab === 'admins') {
        tabFilters.role = 'admin';
      }

      // Get all users (no pagination for export)
      const result = await this.adminService.getUsers({
        page: 1,
        limit: 10000, // Large limit for export
        role,
        search,
        status: tabFilters.status,
        banned: tabFilters.banned,
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
}

module.exports = AdminUserViewController;
