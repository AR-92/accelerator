/**
 * Learning controller part 4 handling user progress and interaction APIs
 */
class LearningControllerPart4 {
  constructor(learningService) {
    this.learningService = learningService;
  }

  /**
   * Update user progress for an article (API)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateUserArticleProgressAPI(req, res) {
    try {
      const { articleId } = req.params;
      const userId = req.user?.id;
      const { progressPercentage, timeSpentSeconds, isCompleted } = req.body;

      if (!userId) {
        return res.status(401).json({
          error: 'Authentication Required',
          message: 'User must be logged in',
        });
      }

      const success = await this.learningService.updateUserArticleProgress(
        userId,
        parseInt(articleId),
        {
          progressPercentage: parseInt(progressPercentage) || 0,
          timeSpentSeconds: parseInt(timeSpentSeconds) || 0,
          isCompleted: Boolean(isCompleted),
        }
      );

      res.json({
        success,
        message: success
          ? 'Progress updated successfully'
          : 'Failed to update progress',
      });
    } catch (error) {
      console.error('Update user article progress API error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to update progress',
      });
    }
  }

  /**
   * Mark article as completed (API)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async markArticleCompletedAPI(req, res) {
    try {
      const { articleId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          error: 'Authentication Required',
          message: 'User must be logged in',
        });
      }

      const success = await this.learningService.markArticleCompleted(
        userId,
        parseInt(articleId)
      );
      res.json({
        success,
        message: success
          ? 'Article marked as completed'
          : 'Failed to mark article as completed',
      });
    } catch (error) {
      console.error('Mark article completed API error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to mark article as completed',
      });
    }
  }

  /**
   * Get user learning progress (API)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUserLearningProgressAPI(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          error: 'Authentication Required',
          message: 'User must be logged in',
        });
      }

      const progress =
        await this.learningService.getUserLearningProgress(userId);
      res.json({
        success: true,
        progress,
      });
    } catch (error) {
      console.error('Get user learning progress API error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch learning progress',
      });
    }
  }

  /**
   * Like an article (API)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async likeArticleAPI(req, res) {
    try {
      const { articleId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          error: 'Authentication Required',
          message: 'User must be logged in',
        });
      }

      const article = await this.learningService.likeArticle(
        userId,
        parseInt(articleId)
      );
      res.json({
        success: true,
        likeCount: article.likeCount,
        message: 'Article liked successfully',
      });
    } catch (error) {
      console.error('Like article API error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to like article',
      });
    }
  }

  /**
   * Unlike an article (API)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async unlikeArticleAPI(req, res) {
    try {
      const { articleId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          error: 'Authentication Required',
          message: 'User must be logged in',
        });
      }

      const article = await this.learningService.unlikeArticle(
        userId,
        parseInt(articleId)
      );
      res.json({
        success: true,
        likeCount: article.likeCount,
        message: 'Article unliked successfully',
      });
    } catch (error) {
      console.error('Unlike article API error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to unlike article',
      });
    }
  }

  /**
   * Get learning statistics (API)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getLearningStatsAPI(req, res) {
    try {
      const stats = await this.learningService.getLearningStats();
      res.json({
        success: true,
        stats,
      });
    } catch (error) {
      console.error('Get learning stats API error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch statistics',
      });
    }
  }
}

module.exports = LearningControllerPart4;
