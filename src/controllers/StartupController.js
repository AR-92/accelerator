/**
 * Startup controller handling HTTP requests for startup operations
 */
class StartupController {
  constructor(startupService) {
    this.startupService = startupService;
  }

  /**
   * Get all startups
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllStartups(req, res) {
    try {
      const userId = req.user ? req.user.id : null;
      const { limit, offset, industry, status } = req.query;

      const options = {};
      if (limit) options.limit = parseInt(limit);
      if (offset) options.offset = parseInt(offset);

      let startups;
      if (industry) {
        startups = await this.startupService.getStartupsByIndustry(
          industry,
          userId
        );
      } else if (status) {
        startups = await this.startupService.getStartupsByStatus(
          status,
          userId
        );
      } else {
        startups = await this.startupService.getAllStartups(userId, options);
      }

      res.json({
        success: true,
        startups,
        count: startups.length,
      });
    } catch (error) {
      console.error('Get all startups error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while fetching startups',
      });
    }
  }

  /**
   * Get startup by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getStartupById(req, res) {
    try {
      const { id } = req.params;
      const startup = await this.startupService.getStartupById(parseInt(id));

      res.json({
        success: true,
        startup,
      });
    } catch (error) {
      console.error('Get startup by ID error:', error);

      if (error.name === 'NotFoundError') {
        return res.status(error.statusCode).json({
          error: error.name,
          message: error.message,
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while fetching startup',
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
      const { name, description, industry, foundedDate, website, status } =
        req.body;

      if (!name || !industry) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Required fields: name, industry',
        });
      }

      const startup = await this.startupService.createStartup(req.user.id, {
        name,
        description,
        industry,
        foundedDate,
        website,
        status: status || 'active',
      });

      res.status(201).json({
        success: true,
        startup,
        message: 'Startup created successfully',
      });
    } catch (error) {
      console.error('Create startup error:', error);

      if (error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          error: error.name,
          message: error.firstError,
          details: error.errors,
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while creating startup',
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
      const { id } = req.params;
      const { name, description, industry, foundedDate, website, status } =
        req.body;

      const startup = await this.startupService.updateStartup(
        parseInt(id),
        req.user.id,
        {
          name,
          description,
          industry,
          foundedDate,
          website,
          status,
        }
      );

      res.json({
        success: true,
        startup,
        message: 'Startup updated successfully',
      });
    } catch (error) {
      console.error('Update startup error:', error);

      if (error.name === 'NotFoundError' || error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          error: error.name,
          message: error.firstError,
          details: error.errors,
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while updating startup',
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
      const { id } = req.params;
      const deleted = await this.startupService.deleteStartup(
        parseInt(id),
        req.user.id
      );

      if (deleted) {
        res.json({
          success: true,
          message: 'Startup deleted successfully',
        });
      } else {
        res.status(404).json({
          error: 'Not Found',
          message: 'Startup not found',
        });
      }
    } catch (error) {
      console.error('Delete startup error:', error);

      if (error.name === 'NotFoundError' || error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          error: error.name,
          message: error.firstError,
          details: error.errors,
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while deleting startup',
      });
    }
  }

  /**
   * Search startups
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async searchStartups(req, res) {
    try {
      const { q: query } = req.query;
      const userId = req.user ? req.user.id : null;

      if (!query || query.trim().length < 2) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Search query must be at least 2 characters',
        });
      }

      const startups = await this.startupService.searchStartups(query, userId);
      res.json({
        success: true,
        startups,
        count: startups.length,
      });
    } catch (error) {
      console.error('Search startups error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while searching startups',
      });
    }
  }

  /**
   * Get startups with advanced filtering
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getStartupsFiltered(req, res) {
    try {
      const { limit, offset, industry, status, search, sortBy, sortOrder } =
        req.query;
      const userId = req.user ? req.user.id : null;

      const filters = {
        limit: limit ? parseInt(limit) : 20,
        offset: offset ? parseInt(offset) : 0,
        industry,
        status,
        search,
        sortBy,
        sortOrder,
        userId,
      };

      const result = await this.startupService.getStartupsFiltered(filters);

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error('Get startups filtered error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while fetching startups',
      });
    }
  }
}

module.exports = StartupController;
