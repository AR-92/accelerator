/**
 * Startup service handling business logic for startups
 */
class StartupService {
  constructor(startupRepository) {
    this.startupRepository = startupRepository;
  }

  /**
   * Get all startups with optional user filter
   * @param {number} userId - Optional user ID filter
   * @param {Object} options - Query options
   * @returns {Promise<Object[]>} Array of startup data
   */
  async getAllStartups(userId = null, options = {}) {
    const startups = await this.startupRepository.findAll(userId, options);
    return startups.map((startup) => startup.toJSON());
  }

  /**
   * Get startup by ID
   * @param {number} id - Startup ID
   * @returns {Promise<Object>} Startup data
   */
  async getStartupById(id) {
    const startup = await this.startupRepository.findById(id);
    if (!startup) {
      const NotFoundError = require('../../../../utils/errors/NotFoundError');
      throw new NotFoundError('Startup not found');
    }
    return startup.toJSON();
  }

  /**
   * Create a new startup
   * @param {number} userId - User ID
   * @param {Object} startupData - Startup data
   * @returns {Promise<Object>} Created startup data
   */
  async createStartup(userId, startupData) {
    const startupId = await this.startupRepository.create({
      ...startupData,
      user_id: userId,
    });
    return await this.getStartupById(startupId);
  }

  /**
   * Update a startup
   * @param {number} id - Startup ID
   * @param {number} userId - User ID (for authorization)
   * @param {Object} startupData - Updated startup data
   * @returns {Promise<Object>} Updated startup data
   */
  async updateStartup(id, userId, startupData) {
    const startup = await this.startupRepository.findById(id);
    if (!startup) {
      const NotFoundError = require('../../../../utils/errors/NotFoundError');
      throw new NotFoundError('Startup not found');
    }

    // Check ownership
    if (startup.userId !== userId) {
      const ValidationError = require('../../../../utils/errors/ValidationError');
      throw new ValidationError('Update failed', [
        'You can only update your own startups',
      ]);
    }

    const updated = await this.startupRepository.update(id, startupData);
    if (!updated) {
      throw new Error('Failed to update startup');
    }

    return await this.getStartupById(id);
  }

  /**
   * Delete a startup
   * @param {number} id - Startup ID
   * @param {number} userId - User ID (for authorization)
   * @returns {Promise<boolean>} Success status
   */
  async deleteStartup(id, userId) {
    const startup = await this.startupRepository.findById(id);
    if (!startup) {
      const NotFoundError = require('../../../../utils/errors/NotFoundError');
      throw new NotFoundError('Startup not found');
    }

    // Check ownership
    if (startup.userId !== userId) {
      const ValidationError = require('../../../../utils/errors/ValidationError');
      throw new ValidationError('Delete failed', [
        'You can only delete your own startups',
      ]);
    }

    return await this.startupRepository.delete(id);
  }

  /**
   * Search startups
   * @param {string} query - Search query
   * @param {number} userId - Optional user ID filter
   * @returns {Promise<Object[]>} Array of startup data
   */
  async searchStartups(query, userId = null) {
    const startups = await this.startupRepository.search(query, userId);
    return startups.map((startup) => startup.toJSON());
  }

  /**
   * Get startups by industry
   * @param {string} industry - Industry
   * @param {number} userId - Optional user ID filter
   * @returns {Promise<Object[]>} Array of startup data
   */
  async getStartupsByIndustry(industry, userId = null) {
    const startups = await this.startupRepository.findByIndustry(
      industry,
      userId
    );
    return startups.map((startup) => startup.toJSON());
  }

  /**
   * Get startups by status
   * @param {string} status - Status
   * @param {number} userId - Optional user ID filter
   * @returns {Promise<Object[]>} Array of startup data
   */
  async getStartupsByStatus(status, userId = null) {
    const startups = await this.startupRepository.findByStatus(status, userId);
    return startups.map((startup) => startup.toJSON());
  }

  /**
   * Get startups with advanced filtering
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Filtered startups with pagination
   */
  async getStartupsFiltered(filters = {}) {
    const startups = await this.startupRepository.findAllFiltered(filters);
    const total = await this.startupRepository.countFiltered(filters);

    return {
      startups: startups.map((startup) => startup.toJSON()),
      total,
      limit: filters.limit || 20,
      offset: filters.offset || 0,
    };
  }

  /**
   * Count startups by status
   * @returns {Promise<Object>} Status counts
   */
  async countByStatus() {
    return await this.startupRepository.countByStatus();
  }
}

module.exports = StartupService;
