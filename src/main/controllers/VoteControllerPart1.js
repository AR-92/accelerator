/**
 * Vote controller part 1 handling getting and adding votes
 */
class VoteControllerPart1 {
  constructor(voteService) {
    this.voteService = voteService;
  }

  /**
   * Get votes for an idea
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getVotesForIdea(req, res) {
    try {
      const { ideaSlug } = req.params;
      const { limit } = req.query;

      const options = {};
      if (limit) options.limit = parseInt(limit);

      const votes = await this.voteService.getVotesForIdea(ideaSlug, options);
      res.json({
        success: true,
        votes,
        count: votes.length,
      });
    } catch (error) {
      console.error('Get votes for idea error:', error);

      if (error.name === 'NotFoundError') {
        return res.status(error.statusCode).json({
          error: error.name,
          message: error.message,
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while fetching votes',
      });
    }
  }

  /**
   * Add a vote for an idea
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async addVote(req, res) {
    try {
      const { ideaSlug } = req.params;
      const {
        marketViability,
        realWorldProblem,
        innovation,
        technicalFeasibility,
        scalability,
        marketSurvival,
      } = req.body;

      // Validate required fields
      const requiredFields = [
        'marketViability',
        'realWorldProblem',
        'innovation',
        'technicalFeasibility',
        'scalability',
        'marketSurvival',
      ];

      const missingFields = requiredFields.filter(
        (field) => req.body[field] === undefined
      );
      if (missingFields.length > 0) {
        return res.status(400).json({
          error: 'Validation Error',
          message: `Missing required fields: ${missingFields.join(', ')}`,
        });
      }

      const vote = await this.voteService.addVote(ideaSlug, req.user.id, {
        marketViability: parseInt(marketViability),
        realWorldProblem: parseInt(realWorldProblem),
        innovation: parseInt(innovation),
        technicalFeasibility: parseInt(technicalFeasibility),
        scalability: parseInt(scalability),
        marketSurvival: parseInt(marketSurvival),
      });

      res.status(201).json({
        success: true,
        vote,
        message: 'Vote added successfully',
      });
    } catch (error) {
      console.error('Add vote error:', error);

      if (error.name === 'NotFoundError' || error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          error: error.name,
          message: error.firstError,
          details: error.errors,
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while adding vote',
      });
    }
  }

  /**
   * Get vote statistics for an idea
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getVoteStats(req, res) {
    try {
      const { ideaSlug } = req.params;
      const stats = await this.voteService.getVoteStats(ideaSlug);

      res.json({
        success: true,
        stats,
      });
    } catch (error) {
      console.error('Get vote stats error:', error);

      if (error.name === 'NotFoundError') {
        return res.status(error.statusCode).json({
          error: error.name,
          message: error.message,
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while fetching vote statistics',
      });
    }
  }

  /**
   * Get user's votes
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUserVotes(req, res) {
    try {
      const { limit } = req.query;
      const options = {};
      if (limit) options.limit = parseInt(limit);

      const votes = await this.voteService.getUserVotes(req.user.id, options);
      res.json({
        success: true,
        votes,
        count: votes.length,
      });
    } catch (error) {
      console.error('Get user votes error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while fetching user votes',
      });
    }
  }
}

module.exports = VoteControllerPart1;
