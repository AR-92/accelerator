/**
 * Vote service handling business logic for voting
 */
class VoteService {
  constructor(voteRepository, ideaRepository) {
    this.voteRepository = voteRepository;
    this.ideaRepository = ideaRepository;
  }

  /**
   * Get votes for an idea
   * @param {string} ideaSlug - Idea slug
   * @param {Object} options - Query options
   * @returns {Promise<Object[]>} Array of vote data
   */
  async getVotesForIdea(ideaSlug, options = {}) {
    const votes = await this.voteRepository.findByIdeaSlug(ideaSlug, options);
    return votes.map((vote) => ({
      id: vote.id,
      userId: vote.userId,
      marketViability: vote.marketViability,
      realWorldProblem: vote.realWorldProblem,
      innovation: vote.innovation,
      technicalFeasibility: vote.technicalFeasibility,
      scalability: vote.scalability,
      marketSurvival: vote.marketSurvival,
      averageScore: vote.averageScore,
      totalScore: vote.totalScore,
      isComplete: vote.isComplete,
      timestamp: vote.createdAt,
    }));
  }

  /**
   * Add a vote for an idea
   * @param {string} ideaSlug - Idea slug
   * @param {number} userId - User ID
   * @param {Object} voteData - Vote data
   * @returns {Promise<Object>} Created vote data
   */
  async addVote(ideaSlug, userId, voteData) {
    // Check if idea exists
    const idea = await this.ideaRepository.findByHref(ideaSlug);
    if (!idea) {
      const NotFoundError = require('../utils/errors/NotFoundError');
      throw new NotFoundError('Idea not found');
    }

    // Check if user has already voted
    const hasVoted = await this.voteRepository.hasUserVoted(userId, ideaSlug);
    if (hasVoted) {
      const ValidationError = require('../utils/errors/ValidationError');
      throw new ValidationError('Vote failed', [
        'You have already voted for this idea',
      ]);
    }

    const voteId = await this.voteRepository.create({
      ...voteData,
      userId,
      ideaSlug,
    });

    const vote = await this.voteRepository.findById(voteId);
    return {
      id: vote.id,
      userId: vote.userId,
      ideaSlug: vote.ideaSlug,
      marketViability: vote.marketViability,
      realWorldProblem: vote.realWorldProblem,
      innovation: vote.innovation,
      technicalFeasibility: vote.technicalFeasibility,
      scalability: vote.scalability,
      marketSurvival: vote.marketSurvival,
      averageScore: vote.averageScore,
      totalScore: vote.totalScore,
      isComplete: vote.isComplete,
      timestamp: vote.createdAt,
    };
  }

  /**
   * Get vote statistics for an idea
   * @param {string} ideaSlug - Idea slug
   * @returns {Promise<Object>} Vote statistics
   */
  async getVoteStats(ideaSlug) {
    // Check if idea exists
    const idea = await this.ideaRepository.findByHref(ideaSlug);
    if (!idea) {
      const NotFoundError = require('../utils/errors/NotFoundError');
      throw new NotFoundError('Idea not found');
    }

    return await this.voteRepository.getVoteStats(ideaSlug);
  }

  /**
   * Get user's votes
   * @param {number} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Object[]>} Array of user's votes
   */
  async getUserVotes(userId, options = {}) {
    const votes = await this.voteRepository.findByUserId(userId, options);
    return votes.map((vote) => ({
      id: vote.id,
      ideaSlug: vote.ideaSlug,
      marketViability: vote.marketViability,
      realWorldProblem: vote.realWorldProblem,
      innovation: vote.innovation,
      technicalFeasibility: vote.technicalFeasibility,
      scalability: vote.scalability,
      marketSurvival: vote.marketSurvival,
      averageScore: vote.averageScore,
      totalScore: vote.totalScore,
      isComplete: vote.isComplete,
      timestamp: vote.createdAt,
    }));
  }

  /**
   * Update a vote
   * @param {number} voteId - Vote ID
   * @param {number} userId - User ID (for authorization)
   * @param {Object} voteData - Updated vote data
   * @returns {Promise<Object>} Updated vote data
   */
  async updateVote(voteId, userId, voteData) {
    const vote = await this.voteRepository.findById(voteId);
    if (!vote) {
      const NotFoundError = require('../utils/errors/NotFoundError');
      throw new NotFoundError('Vote not found');
    }

    // Check ownership
    if (vote.userId !== userId) {
      const ValidationError = require('../utils/errors/ValidationError');
      throw new ValidationError('Update failed', [
        'You can only update your own votes',
      ]);
    }

    const updated = await this.voteRepository.update(voteId, voteData);
    if (!updated) {
      throw new Error('Failed to update vote');
    }

    return await this.getUserVotes(userId, { limit: 1 }).then((votes) =>
      votes.find((v) => v.id === voteId)
    );
  }

  /**
   * Delete a vote
   * @param {number} voteId - Vote ID
   * @param {number} userId - User ID (for authorization)
   * @returns {Promise<boolean>} Success status
   */
  async deleteVote(voteId, userId) {
    const vote = await this.voteRepository.findById(voteId);
    if (!vote) {
      const NotFoundError = require('../utils/errors/NotFoundError');
      throw new NotFoundError('Vote not found');
    }

    // Check ownership
    if (vote.userId !== userId) {
      const ValidationError = require('../utils/errors/ValidationError');
      throw new ValidationError('Delete failed', [
        'You can only delete your own votes',
      ]);
    }

    return await this.voteRepository.delete(voteId);
  }
}

module.exports = VoteService;
