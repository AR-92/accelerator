const BaseRepository = require('./BaseRepository');
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
   * Find votes for a specific idea
   * @param {string} ideaSlug - Idea slug
   * @param {Object} options - Query options
   * @returns {Promise<Vote[]>}
   */
  async findByIdeaSlug(ideaSlug, options = {}) {
    let sql = 'SELECT * FROM votes WHERE idea_slug = ?';
    const params = [ideaSlug];

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
      idea_slug: vote.ideaSlug,
      market_viability: vote.marketViability,
      real_world_problem: vote.realWorldProblem,
      innovation: vote.innovation,
      technical_feasibility: vote.technicalFeasibility,
      scalability: vote.scalability,
      market_survival: vote.marketSurvival,
    };

    return await super.create(data);
  }

  /**
   * Check if user has already voted for an idea
   * @param {number} userId - User ID
   * @param {string} ideaSlug - Idea slug
   * @returns {Promise<boolean>}
   */
  async hasUserVoted(userId, ideaSlug) {
    const sql =
      'SELECT COUNT(*) as count FROM votes WHERE user_id = ? AND idea_slug = ?';
    const result = await this.queryOne(sql, [userId, ideaSlug]);
    return result.count > 0;
  }

  /**
   * Get vote statistics for an idea
   * @param {string} ideaSlug - Idea slug
   * @returns {Promise<Object>} Vote statistics
   */
  async getVoteStats(ideaSlug) {
    const sql = `
      SELECT
        COUNT(*) as total_votes,
        AVG(market_viability) as avg_market_viability,
        AVG(real_world_problem) as avg_real_world_problem,
        AVG(innovation) as avg_innovation,
        AVG(technical_feasibility) as avg_technical_feasibility,
        AVG(scalability) as avg_scalability,
        AVG(market_survival) as avg_market_survival,
        MIN(timestamp) as first_vote,
        MAX(timestamp) as last_vote
      FROM votes
      WHERE idea_slug = ?
    `;

    const result = await this.queryOne(sql, [ideaSlug]);

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
   * Delete votes for an idea (useful for cleanup)
   * @param {string} ideaSlug - Idea slug
   * @returns {Promise<number>} Number of deleted votes
   */
  async deleteByIdeaSlug(ideaSlug) {
    const sql = 'DELETE FROM votes WHERE idea_slug = ?';
    const result = await this.run(sql, [ideaSlug]);
    return result.changes;
  }
}

module.exports = VoteRepository;
