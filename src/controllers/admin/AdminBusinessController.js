/**
 * Admin business controller handling startups, enterprises, and corporates operations
 */
class AdminBusinessController {
  constructor(adminService) {
    this.adminService = adminService;
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
        offset: (page - 1) * limit,
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
          message: 'An error occurred while loading ideas management.',
          user: req.user,
        });
      }
    }
  }

  /**
   * Show idea details
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showIdeaDetails(req, res) {
    try {
      const { ideaId } = req.params;
      res.render('pages/admin/idea-details', {
        title: 'Idea Details - Admin Panel',
        layout: 'admin',
        activeIdeas: true,
        user: req.user,
        ideaId,
      });
    } catch (error) {
      console.error('Error loading idea details:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'admin',
        message: 'An error occurred while loading idea details.',
        user: req.user,
      });
    }
  }

  /**
   * Get idea
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getIdea(req, res) {
    try {
      const { ideaId } = req.params;
      const idea = await this.adminService.getIdea(parseInt(ideaId));
      res.json({ success: true, idea });
    } catch (error) {
      console.error('Error getting idea:', error);
      res.status(500).json({ success: false, error: 'Failed to get idea' });
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
      const section = await this.adminService.updateLandingPageSectionOrder(
        parseInt(sectionId),
        order
      );
      res.json({
        success: true,
        section,
        message: 'Order updated successfully',
      });
    } catch (error) {
      console.error('Error updating landing page section order:', error);
      res.status(500).json({ success: false, error: 'Failed to update order' });
    }
  }

  /**
   * Show collaborations management page
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
      const search = req.query.search;
      const sortBy = req.query.sortBy || 'timestamp';
      const sortOrder = req.query.sortOrder || 'desc';

      const result = await this.adminService.getCollaborations({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        offset: (page - 1) * limit,
      });

      if (isAjax) {
        // Return JSON for AJAX requests
        res.json({
          success: true,
          collaborations: result.collaborations,
          pagination: result.pagination,
          filters: result.filters,
        });
      } else {
        // Render full page for regular requests
        res.render('pages/admin/collaborations', {
          title: 'Collaborations Management - Admin Panel',
          layout: 'admin',
          collaborations: result.collaborations,
          pagination: result.pagination,
          filters: result.filters,
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
          message: 'An error occurred while loading collaborations management.',
          user: req.user,
        });
      }
    }
  }

  /**
   * Show collaboration details
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showCollaborationDetails(req, res) {
    try {
      const { projectId } = req.params;
      res.render('pages/admin/collaboration-details', {
        title: 'Collaboration Details - Admin Panel',
        layout: 'admin',
        activeCollaborations: true,
        user: req.user,
        projectId,
      });
    } catch (error) {
      console.error('Error loading collaboration details:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'admin',
        message: 'An error occurred while loading collaboration details.',
        user: req.user,
      });
    }
  }

  /**
   * Get project
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getProject(req, res) {
    try {
      const { projectId } = req.params;
      const project = await this.adminService.getProject(parseInt(projectId));
      res.json({ success: true, project });
    } catch (error) {
      console.error('Error getting project:', error);
      res.status(500).json({ success: false, error: 'Failed to get project' });
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
      const project = await this.adminService.updateProjectStatus(
        parseInt(projectId),
        status
      );
      res.json({
        success: true,
        project,
        message: 'Status updated successfully',
      });
    } catch (error) {
      console.error('Error updating project status:', error);
      res
        .status(500)
        .json({ success: false, error: 'Failed to update status' });
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
      const success = await this.adminService.removeUserFromProject(
        parseInt(projectId),
        parseInt(userId)
      );
      res.json({
        success,
        message: success ? 'User removed successfully' : 'User not found',
      });
    } catch (error) {
      console.error('Error removing user from project:', error);
      res.status(500).json({ success: false, error: 'Failed to remove user' });
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
      const success = await this.adminService.deleteProject(
        parseInt(projectId)
      );
      res.json({
        success,
        message: success ? 'Project deleted successfully' : 'Project not found',
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      res
        .status(500)
        .json({ success: false, error: 'Failed to delete project' });
    }
  }

  /**
   * Get a specific package by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getPackage(req, res) {
    try {
      const { packageId } = req.params;
      const packageDetails = await this.adminService.getPackageById(packageId);

      res.json({
        success: true,
        package: packageDetails,
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
   * Show packages management page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showPackages(req, res) {
    try {
      const packagesResult = await this.adminService.getPackages({
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
      });

      res.render('pages/admin/packages', {
        title: 'Package Management - Admin Panel',
        layout: 'admin',
        packages: packagesResult.packages,
        pagination: packagesResult.pagination,
        activePackages: true,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading packages page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'admin',
        message: 'An error occurred while loading packages.',
        user: req.user,
      });
    }
  }

  /**
   * Show package details page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showPackageDetails(req, res) {
    try {
      // Package details implementation would go here
      const { packageId } = req.params;
      const packageDetails = await this.adminService.getPackageById(packageId);

      res.render('pages/admin/package-details', { // Note: This template may not exist yet
        title: `Package Details - ${packageDetails.name} - Admin Panel`,
        layout: 'admin',
        package: packageDetails,
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

      const packageResult = await this.adminService.createPackage(
        packageData,
        adminInfo
      );

      res.json({
        success: true,
        package: packageResult,
        message: 'Package created successfully',
      });
    } catch (error) {
      console.error('Error creating package:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors,
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

      const packageResult = await this.adminService.updatePackage(
        parseInt(packageId),
        packageData,
        adminInfo
      );

      if (!packageResult) {
        return res.status(404).json({
          success: false,
          error: 'Package not found',
        });
      }

      res.json({
        success: true,
        package: packageResult,
        message: 'Package updated successfully',
      });
    } catch (error) {
      console.error('Error updating package:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors,
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

      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Package not found',
        });
      }

      res.json({
        success: true,
        message: 'Package deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting package:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while deleting package',
      });
    }
  }

  /**
   * Get a specific billing transaction by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getBillingTransaction(req, res) {
    try {
      const { billingId } = req.params;
      const transaction = await this.adminService.getBillingTransactionById(billingId);

      res.json({
        success: true,
        transaction: transaction,
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
   * Show billing management page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showBilling(req, res) {
    try {
      const billingResult = await this.adminService.getBillingTransactions({
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
      });

      res.render('pages/admin/billing', {
        title: 'Billing Management - Admin Panel',
        layout: 'admin',
        transactions: billingResult.transactions,
        pagination: billingResult.pagination,
        activeBilling: true,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading billing page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'admin',
        message: 'An error occurred while loading billing.',
        user: req.user,
      });
    }
  }

  /**
   * Show billing details page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async showBillingDetails(req, res) {
    try {
      const { billingId } = req.params;
      const transaction = await this.adminService.getBillingTransactionById(billingId);

      res.render('pages/admin/billing-details', { // Note: This template may not exist yet
        title: `Billing Details - Transaction ${transaction.id} - Admin Panel`,
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

      res.json({
        success: true,
        transaction,
        message: 'Billing transaction created successfully',
      });
    } catch (error) {
      console.error('Error creating billing transaction:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while creating billing transaction',
      });
    }
  }

  /**
   * Update a billing transaction status
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

      const transaction = await this.adminService.updateBillingTransactionStatus(
        parseInt(billingId),
        status,
        adminInfo
      );

      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: 'Billing transaction not found',
        });
      }

      res.json({
        success: true,
        transaction,
        message: 'Billing transaction status updated successfully',
      });
    } catch (error) {
      console.error('Error updating billing transaction:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while updating billing transaction',
      });
    }
  }

  /**
   * Process a refund
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

      const result = await this.adminService.processRefund(
        parseInt(billingId),
        refundAmount,
        refundReason,
        adminInfo
      );

      res.json({
        success: true,
        result,
        message: 'Refund processed successfully',
      });
    } catch (error) {
      console.error('Error processing refund:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while processing refund',
      });
    }
  }

  /**
   * Get a specific reward by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getReward(req, res) {
    try {
      const { rewardId } = req.params;
      const reward = await this.adminService.getRewardById(rewardId);

      res.json({
        success: true,
        reward: reward,
      });
    } catch (error) {
      console.error('Error getting reward:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while fetching reward details',
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
      const rewardsResult = await this.adminService.getRewards({
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
      });

      res.render('pages/admin/rewards', {
        title: 'Rewards Management - Admin Panel',
        layout: 'admin',
        rewards: rewardsResult.rewards,
        stats: rewardsResult.stats,
        pagination: rewardsResult.pagination,
        activeRewards: true,
        user: req.user,
      });
    } catch (error) {
      console.error('Error loading rewards page:', error);
      res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'admin',
        message: 'An error occurred while loading rewards.',
        user: req.user,
      });
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
      const reward = await this.adminService.getRewardById(rewardId);

      res.render('pages/admin/reward-details', { // Note: This template may not exist yet
        title: `Reward Details - ${reward.id} - Admin Panel`,
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
   * Create a new reward
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

      res.json({
        success: true,
        reward,
        message: 'Reward created successfully',
      });
    } catch (error) {
      console.error('Error creating reward:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while creating reward',
      });
    }
  }

  /**
   * Grant a reward to a user
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

      const result = await this.adminService.grantRewardToUser(
        parseInt(userId),
        type,
        title,
        parseInt(credits),
        adminInfo
      );

      res.json({
        success: true,
        result,
        message: 'Reward granted successfully',
      });
    } catch (error) {
      console.error('Error granting reward:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors,
        });
      }

      res.status(500).json({
        success: false,
        error: 'An error occurred while granting reward',
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

      if (!reward) {
        return res.status(404).json({
          success: false,
          error: 'Reward not found',
        });
      }

      res.json({
        success: true,
        reward,
        message: 'Reward updated successfully',
      });
    } catch (error) {
      console.error('Error updating reward:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors,
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

      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Reward not found',
        });
      }

      res.json({
        success: true,
        message: 'Reward deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting reward:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while deleting reward',
      });
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
}

module.exports = AdminBusinessController;
