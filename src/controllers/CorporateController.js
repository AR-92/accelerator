/**
 * Corporate controller handling HTTP requests for corporate operations
 */
class CorporateController {
  constructor(corporateService) {
    this.corporateService = corporateService;
  }

  /**
   * Get all corporates
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllCorporates(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const industry = req.query.industry;
      const status = req.query.status;
      const sector = req.query.sector;
      const companySize = req.query.companySize;
      const search = req.query.search;

      const result = await this.corporateService.getCorporatesFiltered({
        page,
        limit,
        industry,
        status,
        sector,
        companySize,
        search,
        offset: (page - 1) * limit,
      });

      res.json({
        success: true,
        corporates: result.corporates,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit),
        },
        filters: { industry, status, sector, companySize, search },
      });
    } catch (error) {
      console.error('Error getting corporates:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while fetching corporates',
      });
    }
  }

  /**
   * Search corporates
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async searchCorporates(req, res) {
    try {
      const { q: query } = req.query;
      const limit = parseInt(req.query.limit) || 10;

      const corporates = await this.corporateService.searchCorporates(query, {
        limit,
      });

      res.json({
        success: true,
        corporates,
        query,
      });
    } catch (error) {
      console.error('Error searching corporates:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while searching corporates',
      });
    }
  }

  /**
   * Get corporates with advanced filtering
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getCorporatesFiltered(req, res) {
    try {
      const filters = req.query;
      const result = await this.corporateService.getCorporatesFiltered(filters);

      res.json({
        success: true,
        corporates: result.corporates,
        total: result.total,
        filters,
      });
    } catch (error) {
      console.error('Error getting filtered corporates:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while fetching filtered corporates',
      });
    }
  }

  /**
   * Get corporate by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getCorporateById(req, res) {
    try {
      const { id } = req.params;
      const corporate = await this.corporateService.getCorporateById(
        parseInt(id)
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
      });
    } catch (error) {
      console.error('Error getting corporate:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while fetching corporate',
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
      const userId = req.user.id;
      const corporateData = req.body;

      const corporate = await this.corporateService.createCorporate(
        userId,
        corporateData
      );

      res.status(201).json({
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
      const { id } = req.params;
      const corporateData = req.body;

      const corporate = await this.corporateService.updateCorporate(
        parseInt(id),
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
      const { id } = req.params;
      const success = await this.corporateService.deleteCorporate(parseInt(id));

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
   * Get corporate statistics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getStatistics(req, res) {
    try {
      const stats = await this.corporateService.getStatistics();

      res.json({
        success: true,
        statistics: stats,
      });
    } catch (error) {
      console.error('Error getting corporate statistics:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while fetching statistics',
      });
    }
  }

  /**
   * Bulk update corporate status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async bulkUpdateStatus(req, res) {
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

      const updatedCount = await this.corporateService.bulkUpdateStatus(
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
  async bulkDelete(req, res) {
    try {
      const { corporateIds } = req.body;

      if (!Array.isArray(corporateIds) || corporateIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'corporateIds must be a non-empty array',
        });
      }

      const deletedCount = await this.corporateService.bulkDelete(corporateIds);

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
  async exportToCSV(req, res) {
    try {
      const filters = req.query;
      const csvContent = await this.corporateService.exportToCSV(filters);

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

module.exports = CorporateController;
