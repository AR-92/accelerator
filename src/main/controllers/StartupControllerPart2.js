/**
 * Startup controller part 2 handling search and filtering operations
 */
class StartupControllerPart2 {
  constructor(startupService) {
    this.startupService = startupService;
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

module.exports = StartupControllerPart2;
