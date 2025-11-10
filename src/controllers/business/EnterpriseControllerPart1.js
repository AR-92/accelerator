/**
 * Enterprise controller part 1 handling listing, search, get, create, update operations
 */
class EnterpriseControllerPart1 {
  constructor(enterpriseService) {
    this.enterpriseService = enterpriseService;
  }

  /**
   * Get all enterprises
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllEnterprises(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const industry = req.query.industry;
      const status = req.query.status;
      const search = req.query.search;
      const companySize = req.query.companySize;

      const result = await this.enterpriseService.getEnterprisesFiltered({
        page,
        limit,
        industry,
        status,
        search,
        companySize,
        offset: (page - 1) * limit,
      });

      res.json({
        success: true,
        enterprises: result.enterprises,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit),
        },
        filters: { industry, status, search, companySize },
      });
    } catch (error) {
      console.error('Error getting enterprises:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while fetching enterprises',
      });
    }
  }

  /**
   * Search enterprises
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async searchEnterprises(req, res) {
    try {
      const { q: query } = req.query;
      const limit = parseInt(req.query.limit) || 10;

      const enterprises = await this.enterpriseService.searchEnterprises(
        query,
        { limit }
      );

      res.json({
        success: true,
        enterprises,
        query,
      });
    } catch (error) {
      console.error('Error searching enterprises:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while searching enterprises',
      });
    }
  }

  /**
   * Get enterprises with advanced filtering
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getEnterprisesFiltered(req, res) {
    try {
      const filters = req.query;
      const result =
        await this.enterpriseService.getEnterprisesFiltered(filters);

      res.json({
        success: true,
        enterprises: result.enterprises,
        total: result.total,
        filters,
      });
    } catch (error) {
      console.error('Error getting filtered enterprises:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while fetching filtered enterprises',
      });
    }
  }

  /**
   * Get enterprise by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getEnterpriseById(req, res) {
    try {
      const { id } = req.params;
      const enterprise = await this.enterpriseService.getEnterpriseById(
        parseInt(id)
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
      });
    } catch (error) {
      console.error('Error getting enterprise:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while fetching enterprise',
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
      const userId = req.user.id;
      const enterpriseData = req.body;

      const enterprise = await this.enterpriseService.createEnterprise(
        userId,
        enterpriseData
      );

      res.status(201).json({
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
      const { id } = req.params;
      const enterpriseData = req.body;

      const enterprise = await this.enterpriseService.updateEnterprise(
        parseInt(id),
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
}

module.exports = EnterpriseControllerPart1;
