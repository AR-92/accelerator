/**
 * Vote controller part 2 handling updating and deleting votes
 */
class VoteControllerPart2 {
  constructor(voteService) {
    this.voteService = voteService;
  }

  /**
   * Update a vote
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateVote(req, res) {
    try {
      const { voteId } = req.params;
      const voteData = req.body;

      const vote = await this.voteService.updateVote(
        parseInt(voteId),
        req.user.id,
        voteData
      );
      res.json({
        success: true,
        vote,
        message: 'Vote updated successfully',
      });
    } catch (error) {
      console.error('Update vote error:', error);

      if (error.name === 'NotFoundError' || error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          error: error.name,
          message: error.firstError,
          details: error.errors,
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while updating vote',
      });
    }
  }

  /**
   * Delete a vote
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteVote(req, res) {
    try {
      const { voteId } = req.params;
      const deleted = await this.voteService.deleteVote(
        parseInt(voteId),
        req.user.id
      );

      if (deleted) {
        res.json({
          success: true,
          message: 'Vote deleted successfully',
        });
      } else {
        res.status(404).json({
          error: 'Not Found',
          message: 'Vote not found',
        });
      }
    } catch (error) {
      console.error('Delete vote error:', error);

      if (error.name === 'NotFoundError' || error.name === 'ValidationError') {
        return res.status(error.statusCode).json({
          error: error.name,
          message: error.firstError,
          details: error.errors,
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while deleting vote',
      });
    }
  }
}

module.exports = VoteControllerPart2;
