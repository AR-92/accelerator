/**
 * Admin dashboard controller handling dashboard, settings, and system health operations
 */
class AdminDashboardController {
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
      // Return default stats instead of 404
      const defaultStats = {
        users: {
          total: 0,
          byRole: [
            { role: 'admin', count: 0 },
            { role: 'corporate', count: 0 },
            { role: 'enterprise', count: 0 },
            { role: 'startup', count: 0 },
          ],
          recent: 0,
          recentUsers: [],
        },
        content: {
          help: { total: 0, published: 0, draft: 0 },
          learning: { total: 0, published: 0, draft: 0 },
        },
        credits: { total: 0 },
        packages: { total: 0, active: 0, avgPrice: 0, avgCredits: 0 },
        billing: {
          totalTransactions: 0,
          totalRevenue: 0,
          totalRefunds: 0,
          avgTransaction: 0,
          uniqueCustomers: 0,
          pendingTransactions: 0,
        },
        rewards: {
          totalRewards: 0,
          activeRewards: 0,
          totalCreditsGranted: 0,
          uniqueUsersRewarded: 0,
        },
        collaborations: {
          totalProjects: 0,
          activeProjects: 0,
          totalTeams: 0,
          totalTeamMembers: 0,
        },
        activity: [],
        system: { uptime: 0, memory: { used: 0, total: 0 } },
      };

      res.render('pages/admin/dashboard', {
        title: 'Admin Dashboard - Accelerator Platform',
        layout: 'admin',
        stats: defaultStats,
        activeDashboard: true,
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
        layout: 'error-admin',
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
        layout: 'error-admin',
        message: 'An error occurred while loading system health.',
        user: req.user,
      });
    }
  }

  /**
   * Show content management page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showContent(req, res) {
    try {
      res.render('pages/admin/content', {
        title: 'Content Management - Admin Panel',
        layout: 'admin',
        activeContent: true,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading content page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'error-admin',
        message: 'An error occurred while loading content management.',
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
      res.render('pages/admin/help-content', {
        title: 'Help Content Management - Admin Panel',
        layout: 'admin',
        activeHelpContent: true,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading help content page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'error-admin',
        message: 'An error occurred while loading help content management.',
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
      res.render('pages/admin/learning-content', {
        title: 'Learning Content Management - Admin Panel',
        layout: 'admin',
        activeLearningContent: true,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading learning content page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'error-admin',
        message: 'An error occurred while loading learning content management.',
        user: req.user,
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
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const search = req.query.search || '';
      const sortBy = req.query.sortBy || 'created_at';
      const sortOrder = req.query.sortOrder || 'desc';

      const result = await this.adminService.getIdeas({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      });

      res.render('pages/admin/ideas', {
        title: 'Ideas Management - Admin Panel',
        layout: 'admin',
        activeIdeas: true,
        ideas: result.ideas,
        pagination: result.pagination,
        filters: { search, sortBy, sortOrder },
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading ideas page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'error-admin',
        message: 'An error occurred while loading ideas management.',
        user: req.user,
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
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      const result = await this.adminService.getVotes({ page, limit });

      res.render('pages/admin/votes', {
        title: 'Votes Management - Admin Panel',
        layout: 'admin',
        activeVotes: true,
        votes: result.votes,
        pagination: result.pagination,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading votes page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'error-admin',
        message: 'An error occurred while loading votes management.',
        user: req.user,
      });
    }
  }

  /**
   * Show packages management page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showPackages(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const status = req.query.status;
      const search = req.query.search;

      const result = await this.adminService.getPackages({ page, limit });

      res.render('pages/admin/packages', {
        title: 'Package Management - Admin Panel',
        layout: 'admin',
        activePackages: true,
        packages: result.packages,
        pagination: result.pagination,
        filters: { status, search },
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading packages page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'error-admin',
        message: 'An error occurred while loading package management.',
        user: req.user,
      });
    }
  }

  /**
   * Show billing management page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showBilling(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      const result = await this.adminService.getBillingTransactions({
        page,
        limit,
      });

      res.render('pages/admin/billing', {
        title: 'Billing Management - Admin Panel',
        layout: 'admin',
        activeBilling: true,
        transactions: result.transactions,
        pagination: result.pagination,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading billing page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'error-admin',
        message: 'An error occurred while loading billing management.',
        user: req.user,
      });
    }
  }

  /**
   * Show rewards management page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showRewards(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      const result = await this.adminService.getRewards({ page, limit });

      res.render('pages/admin/rewards', {
        title: 'Rewards Management - Admin Panel',
        layout: 'admin',
        activeRewards: true,
        rewards: result.rewards,
        stats: result.stats,
        pagination: result.pagination,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading rewards page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'main',
        message: 'An error occurred while loading the rewards page.',
      });
    }
  }

  /**
   * Show collaborations management page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showCollaborations(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const search = req.query.search || '';
      const sortBy = req.query.sortBy || 'timestamp';
      const sortOrder = req.query.sortOrder || 'desc';

      const result = await this.adminService.getCollaborations({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      });

      res.render('pages/admin/collaborations', {
        title: 'Collaborations Management - Admin Panel',
        layout: 'error-admin',
        activeCollaborations: true,
        collaborations: result.collaborations,
        pagination: result.pagination,
        filters: { search, sortBy, sortOrder },
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading collaborations page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'error-admin',
        message: 'An error occurred while loading collaborations management.',
        user: req.user,
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
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      const result = await this.adminService.getLandingPageSections({
        page,
        limit,
      });

      res.render('pages/admin/landing-page', {
        title: 'Landing Page Management - Admin Panel',
        layout: 'admin',
        activeLandingPage: true,
        sections: result.sections,
        pagination: result.pagination,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading landing page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'error-admin',
        message: 'An error occurred while loading landing page management.',
        user: req.user,
      });
    }
  }
}

module.exports = AdminDashboardController;
