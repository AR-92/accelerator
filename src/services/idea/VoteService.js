/**
 * Vote service handling business logic for voting
 */
class VoteService {
  constructor(voteRepository, projectRepository) {
    this.voteRepository = voteRepository;
    this.projectRepository = projectRepository;
  }

  /**
   * Get votes for a project
   * @param {number} projectId - Project ID
   * @param {Object} options - Query options
   * @returns {Promise<Object[]>} Array of vote data
   */
  async getVotesForProject(projectId, options = {}) {
    const votes = await this.voteRepository.findByProjectId(projectId, options);
    return votes.map((vote) => ({
      id: vote.id,
      userId: vote.userId,
      projectId: vote.projectId,
      marketViability: vote.marketViability,
      realWorldProblem: vote.realWorldProblem,
      innovation: vote.innovation,
      technicalFeasibility: vote.technicalFeasibility,
      scalability: vote.scalability,
      marketSurvival: vote.marketSurvival,
      score: vote.score,
      averageScore: vote.averageScore,
      totalScore: vote.totalScore,
      isComplete: vote.isComplete,
      timestamp: vote.createdAt,
    }));
  }

  /**
   * Add a vote for a project
   * @param {number} projectId - Project ID
   * @param {number} userId - User ID
   * @param {Object} voteData - Vote data
   * @returns {Promise<Object>} Created vote data
   */
  async addVote(projectId, userId, voteData) {
    // Check if project exists
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      const NotFoundError = require('../utils/errors/NotFoundError');
      throw new NotFoundError('Project not found');
    }

    // Check if user has already voted
    const hasVoted = await this.voteRepository.hasUserVoted(userId, projectId);
    if (hasVoted) {
      const ValidationError = require('../utils/errors/ValidationError');
      throw new ValidationError('Vote failed', [
        'You have already voted for this project',
      ]);
    }

    const voteId = await this.voteRepository.create({
      ...voteData,
      userId,
      projectId,
    });

    const vote = await this.voteRepository.findById(voteId);
    return {
      id: vote.id,
      userId: vote.userId,
      projectId: vote.projectId,
      marketViability: vote.marketViability,
      realWorldProblem: vote.realWorldProblem,
      innovation: vote.innovation,
      technicalFeasibility: vote.technicalFeasibility,
      scalability: vote.scalability,
      marketSurvival: vote.marketSurvival,
      score: vote.score,
      averageScore: vote.averageScore,
      totalScore: vote.totalScore,
      isComplete: vote.isComplete,
      timestamp: vote.createdAt,
    };
  }

  /**
   * Get vote statistics for a project
   * @param {number} projectId - Project ID
   * @returns {Promise<Object>} Vote statistics
   */
  async getVoteStats(projectId) {
    // Check if project exists
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      const NotFoundError = require('../utils/errors/NotFoundError');
      throw new NotFoundError('Project not found');
    }

    return await this.voteRepository.getVoteStats(projectId);
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
      projectId: vote.projectId,
      marketViability: vote.marketViability,
      realWorldProblem: vote.realWorldProblem,
      innovation: vote.innovation,
      technicalFeasibility: vote.technicalFeasibility,
      scalability: vote.scalability,
      marketSurvival: vote.marketSurvival,
      score: vote.score,
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
