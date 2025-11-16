/**
 * Idea controller handling all idea operations including CRUD, favorites, and search
 */
class IdeaController {
  constructor(ideaService) {
    this.ideaService = ideaService;
  }

  /**
   * Get all ideas
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllIdeas(req, res) {
    try {
      const userId = req.user ? req.user.id : null;
      const { limit, offset, type, tags } = req.query;

      const options = {};
      if (limit) options.limit = parseInt(limit);
      if (offset) options.offset = parseInt(offset);

      let ideas;
      if (tags) {
        const tagsArray = tags.split(',').map((tag) => tag.trim());
        ideas = await this.ideaService.getIdeasByTags(tagsArray, userId);
      } else if (type) {
        ideas = await this.ideaService.getIdeasByType(type, userId);
      } else {
        ideas = await this.ideaService.getAllIdeas(userId, options);
      }

      res.json({
        success: true,
        ideas,
        count: ideas.length,
      });
    } catch (error) {
      console.error('Get all ideas error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while fetching ideas',
      });
    }
  }

  /**
   * Get idea by href
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getIdeaByHref(req, res) {
    try {
      const { href } = req.params;
      const idea = await this.ideaService.getIdeaByHref(href);

      res.json({
        success: true,
        idea,
      });
    } catch (error) {
      console.error('Get idea by href error:', error);

      if (error.name === 'NotFoundError') {
        return res.status(error.statusCode).json({
          error: error.name,
          message: error.message,
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while fetching idea',
      });
    }
  }

  /**
   * Create a new idea
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createIdea(req, res) {
    try {
      const { href, title, type, typeIcon, rating, description, tags } =
        req.body;

      if (!href || !title || !type || !typeIcon) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Required fields: href, title, type, typeIcon',
        });
      }

      const idea = await this.ideaService.createIdea(req.user.id, {
        href,
        title,
        type,
        typeIcon,
        rating: rating || 0,
        description,
        tags,
      });

      res.status(201).json({
        success: true,
        idea,
        message: 'Idea created successfully',
      });
    } catch (error) {
      console.error('Create idea error:', error);

      if (error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          error: error.name,
          message: error.firstError,
          details: error.errors,
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while creating idea',
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
      const { id } = req.params;
      const { href, title, type, typeIcon, rating, description, tags } =
        req.body;

      const idea = await this.ideaService.updateIdea(
        parseInt(id),
        req.user.id,
        {
          href,
          title,
          type,
          typeIcon,
          rating,
          description,
          tags,
        }
      );

      res.json({
        success: true,
        idea,
        message: 'Idea updated successfully',
      });
    } catch (error) {
      console.error('Update idea error:', error);

      if (error.name === 'NotFoundError' || error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          error: error.name,
          message: error.firstError,
          details: error.errors,
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while updating idea',
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
      const { id } = req.params;
      const deleted = await this.ideaService.deleteIdea(
        parseInt(id),
        req.user.id
      );

      if (deleted) {
        res.json({
          success: true,
          message: 'Idea deleted successfully',
        });
      } else {
        res.status(404).json({
          error: 'Not Found',
          message: 'Idea not found',
        });
      }
    } catch (error) {
      console.error('Delete idea error:', error);

      if (error.name === 'NotFoundError' || error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          error: error.name,
          message: error.firstError,
          details: error.errors,
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while deleting idea',
      });
    }
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

module.exports = IdeaController;
