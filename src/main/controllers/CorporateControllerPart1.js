/**
 * Corporate controller part 1 handling listing, search, get, create, update operations
 */
class CorporateControllerPart1 {
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
}

module.exports = CorporateControllerPart1;
