/**
 * Idea controller part 2 handling favorite and search operations
 */
class IdeaControllerPart2 {
  constructor(ideaService) {
    this.ideaService = ideaService;
  }

  /**
   * Toggle favorite status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async toggleFavorite(req, res) {
    try {
      const { id } = req.params;
      const idea = await this.ideaService.toggleFavorite(
        parseInt(id),
        req.user.id
      );

      res.json({
        success: true,
        idea,
        message: 'Favorite status updated successfully',
      });
    } catch (error) {
      console.error('Toggle favorite error:', error);

      if (error.name === 'NotFoundError' || error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          error: error.name,
          message: error.firstError,
          details: error.errors,
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while updating favorite status',
      });
    }
  }

  /**
   * Search ideas
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async searchIdeas(req, res) {
    try {
      const { q: query } = req.query;
      const userId = req.user ? req.user.id : null;

      if (!query || query.trim().length < 2) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Search query must be at least 2 characters',
        });
      }

      const ideas = await this.ideaService.searchIdeas(query, userId);
      res.json({
        success: true,
        ideas,
        count: ideas.length,
      });
    } catch (error) {
      console.error('Search ideas error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while searching ideas',
      });
    }
  }
}

module.exports = IdeaControllerPart2;
