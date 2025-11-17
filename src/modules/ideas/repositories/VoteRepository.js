const BaseRepository = require('../../../../src/shared/repositories/BaseRepository');
const Vote = require('../models/Vote');

/**
 * Vote repository for data access operations
 */
class VoteRepository extends BaseRepository {
  constructor(db) {
    super(db, 'votes');
  }

  /**
   * Find vote by ID
   * @param {number} id - Vote ID
   * @returns {Promise<Vote|null>}
   */
  async findById(id) {
    const row = await super.findById(id);
    return row ? new Vote(row) : null;
  }

  /**
   * Find votes for a specific project
   * @param {number} projectId - Project ID
   * @param {Object} options - Query options
   * @returns {Promise<Vote[]>}
   */
  async findByProjectId(projectId, options = {}) {
    let sql = 'SELECT * FROM votes WHERE project_id = ?';
    const params = [projectId];

    if (options.orderBy) {
      sql += ` ORDER BY ${options.orderBy}`;
    } else {
      sql += ' ORDER BY created_at DESC';
    }

    if (options.limit) {
      sql += ' LIMIT ?';
      params.push(options.limit);
    }

    const rows = await this.query(sql, params);
    return rows.map((row) => new Vote(row));
  }

  /**
   * Find votes by user
   * @param {number} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Vote[]>}
   */
  async findByUserId(userId, options = {}) {
    let sql = 'SELECT * FROM votes WHERE user_id = ?';
    const params = [userId];

    if (options.orderBy) {
      sql += ` ORDER BY ${options.orderBy}`;
    } else {
      sql += ' ORDER BY timestamp DESC';
    }

    if (options.limit) {
      sql += ' LIMIT ?';
      params.push(options.limit);
    }

    const rows = await this.query(sql, params);
    return rows.map((row) => new Vote(row));
  }

  /**
   * Create a new vote
   * @param {Object} voteData - Vote data
   * @returns {Promise<number>} Created vote ID
   */
  async create(voteData) {
    const vote = new Vote(voteData);
    vote.validate();

    const data = {
      user_id: vote.userId,
      project_id: vote.projectId,
      market_viability: vote.marketViability,
      real_world_problem: vote.realWorldProblem,
      innovation: vote.innovation,
      technical_feasibility: vote.technicalFeasibility,
      scalability: vote.scalability,
      market_survival: vote.marketSurvival,
      score: vote.score,
    };

    return await super.create(data);
  }

  /**
   * Check if user has already voted for a project
   * @param {number} userId - User ID
   * @param {number} projectId - Project ID
   * @returns {Promise<boolean>}
   */
  async hasUserVoted(userId, projectId) {
    const sql =
      'SELECT COUNT(*) as count FROM votes WHERE user_id = ? AND project_id = ?';
    const result = await this.queryOne(sql, [userId, projectId]);
    return result.count > 0;
  }

  /**
   * Get vote statistics for a project
   * @param {number} projectId - Project ID
   * @returns {Promise<Object>} Vote statistics
   */
  async getVoteStats(projectId) {
    const sql = `
      SELECT
        COUNT(*) as total_votes,
        AVG(market_viability) as avg_market_viability,
        AVG(real_world_problem) as avg_real_world_problem,
        AVG(innovation) as avg_innovation,
        AVG(technical_feasibility) as avg_technical_feasibility,
        AVG(scalability) as avg_scalability,
        AVG(market_survival) as avg_market_survival,
        AVG(score) as avg_score,
        MIN(created_at) as first_vote,
        MAX(created_at) as last_vote
      FROM votes
      WHERE project_id = ?
    `;

    const result = await this.queryOne(sql, [projectId]);

    return {
      totalVotes: result.total_votes || 0,
      averageScores: {
        marketViability: result.avg_market_viability || 0,
        realWorldProblem: result.avg_real_world_problem || 0,
        innovation: result.avg_innovation || 0,
        technicalFeasibility: result.avg_technical_feasibility || 0,
        scalability: result.avg_scalability || 0,
        marketSurvival: result.avg_market_survival || 0,
      },
      averageScore: result.avg_score || 0,
      overallAverage:
        ((result.avg_market_viability || 0) +
          (result.avg_real_world_problem || 0) +
          (result.avg_innovation || 0) +
          (result.avg_technical_feasibility || 0) +
          (result.avg_scalability || 0) +
          (result.avg_market_survival || 0)) /
        6,
      firstVote: result.first_vote,
      lastVote: result.last_vote,
    };
  }

  /**
   * Update a vote
   * @param {number} id - Vote ID
   * @param {Object} voteData - Updated vote data
   * @returns {Promise<boolean>}
   */
  async update(id, voteData) {
    const vote = new Vote(voteData);
    vote.validate();

    const data = {};
    if (vote.marketViability !== undefined)
      data.market_viability = vote.marketViability;
    if (vote.realWorldProblem !== undefined)
      data.real_world_problem = vote.realWorldProblem;
    if (vote.innovation !== undefined) data.innovation = vote.innovation;
    if (vote.technicalFeasibility !== undefined)
      data.technical_feasibility = vote.technicalFeasibility;
    if (vote.scalability !== undefined) data.scalability = vote.scalability;
    if (vote.marketSurvival !== undefined)
      data.market_survival = vote.marketSurvival;

    return await super.update(id, data);
  }

  /**
   * Delete votes for a project (useful for cleanup)
   * @param {number} projectId - Project ID
   * @returns {Promise<number>} Number of deleted votes
   */
  async deleteByProjectId(projectId) {
    const sql = 'DELETE FROM votes WHERE project_id = ?';
    const result = await this.run(sql, [projectId]);
    return result.changes;
  }
}

module.exports = VoteRepository;
