/**
 * Idea service handling business logic for ideas
 */
class IdeaService {
  constructor(ideaRepository, voteRepository) {
    this.ideaRepository = ideaRepository;
    this.voteRepository = voteRepository;
  }

  /**
   * Get all ideas with optional user filter
   * @param {number} userId - Optional user ID filter
   * @param {Object} options - Query options
   * @returns {Promise<Object[]>} Array of idea data
   */
  async getAllIdeas(userId = null, options = {}) {
    const ideas = await this.ideaRepository.findAll(userId, options);
    return ideas.map((idea) => idea.toJSON());
  }

  /**
   * Get idea by href
   * @param {string} href - Idea href
   * @returns {Promise<Object>} Idea data
   */
  async getIdeaByHref(href) {
    const idea = await this.ideaRepository.findByHref(href);
    if (!idea) {
      const NotFoundError = require('../utils/errors/NotFoundError');
      throw new NotFoundError('Idea not found');
    }
    return idea.toJSON();
  }

  /**
   * Get idea by ID
   * @param {number} id - Idea ID
   * @returns {Promise<Object>} Idea data
   */
  async getIdeaById(id) {
    const idea = await this.ideaRepository.findById(id);
    if (!idea) {
      const NotFoundError = require('../utils/errors/NotFoundError');
      throw new NotFoundError('Idea not found');
    }
    return idea.toJSON();
  }

  /**
   * Get total count of ideas
   * @param {Object} options - Query options
   * @returns {Promise<number>} Total count
   */
  async getIdeasCount(options = {}) {
    return await this.ideaRepository.count(null, options);
  }

  /**
   * Create a new idea
   * @param {number} userId - User ID
   * @param {Object} ideaData - Idea data
   * @returns {Promise<Object>} Created idea data
   */
  async createIdea(userId, ideaData) {
    // Check if href already exists
    const existingIdea = await this.ideaRepository.findByHref(ideaData.href);
    if (existingIdea) {
      const ValidationError = require('../../utils/errors/ValidationError');
      throw new ValidationError('Idea creation failed', [
        'Idea with this href already exists',
      ]);
    }

    const ideaId = await this.ideaRepository.create({ ...ideaData, userId });
    return await this.getIdeaById(ideaId);
  }

  /**
   * Update an idea
   * @param {number} id - Idea ID
   * @param {number} userId - User ID (for authorization)
   * @param {Object} ideaData - Updated idea data
   * @returns {Promise<Object>} Updated idea data
   */
  async updateIdea(id, userId, ideaData) {
    const idea = await this.ideaRepository.findById(id);
    if (!idea) {
      const NotFoundError = require('../utils/errors/NotFoundError');
      throw new NotFoundError('Idea not found');
    }

    // Check ownership
    if (idea.userId !== userId) {
      const ValidationError = require('../../utils/errors/ValidationError');
      throw new ValidationError('Update failed', [
        'You can only update your own ideas',
      ]);
    }

    // Check href uniqueness if changed
    if (ideaData.href && ideaData.href !== idea.href) {
      const existingIdea = await this.ideaRepository.findByHref(ideaData.href);
      if (existingIdea) {
        const ValidationError = require('../../utils/errors/ValidationError');
        throw new ValidationError('Update failed', [
          'Idea with this href already exists',
        ]);
      }
    }

    const updated = await this.ideaRepository.update(id, ideaData);
    if (!updated) {
      throw new Error('Failed to update idea');
    }

    return await this.getIdeaById(id);
  }

  /**
   * Delete an idea
   * @param {number} id - Idea ID
   * @param {number} userId - User ID (for authorization)
   * @returns {Promise<boolean>} Success status
   */
  async deleteIdea(id, userId) {
    const idea = await this.ideaRepository.findById(id);
    if (!idea) {
      const NotFoundError = require('../utils/errors/NotFoundError');
      throw new NotFoundError('Idea not found');
    }

    // Check ownership
    if (idea.userId !== userId) {
      const ValidationError = require('../../utils/errors/ValidationError');
      throw new ValidationError('Delete failed', [
        'You can only delete your own ideas',
      ]);
    }

    // Delete associated votes first
    await this.voteRepository.deleteByIdeaSlug(idea.href);

    return await this.ideaRepository.delete(id);
  }

  /**
   * Toggle favorite status
   * @param {number} id - Idea ID
   * @param {number} userId - User ID (for authorization)
   * @returns {Promise<Object>} Updated idea data
   */
  async toggleFavorite(id, userId) {
    const idea = await this.ideaRepository.findById(id);
    if (!idea) {
      const NotFoundError = require('../utils/errors/NotFoundError');
      throw new NotFoundError('Idea not found');
    }

    // Check ownership
    if (idea.userId !== userId) {
      const ValidationError = require('../../utils/errors/ValidationError');
      throw new ValidationError('Update failed', [
        'You can only modify your own ideas',
      ]);
    }

    const updated = await this.ideaRepository.toggleFavorite(id);
    if (!updated) {
      throw new Error('Failed to update favorite status');
    }

    return await this.getIdeaById(id);
  }

  /**
   * Search ideas
   * @param {string} query - Search query
   * @param {number} userId - Optional user ID filter
   * @returns {Promise<Object[]>} Array of idea data
   */
  async searchIdeas(query, userId = null) {
    const ideas = await this.ideaRepository.search(query, userId);
    return ideas.map((idea) => idea.toJSON());
  }

  /**
   * Get ideas by tags
   * @param {string[]} tags - Tags to filter by
   * @param {number} userId - Optional user ID filter
   * @returns {Promise<Object[]>} Array of idea data
   */
  async getIdeasByTags(tags, userId = null) {
    const ideas = await this.ideaRepository.findByTags(tags, userId);
    return ideas.map((idea) => idea.toJSON());
  }

  /**
   * Get ideas by type
   * @param {string} type - Idea type
   * @param {number} userId - Optional user ID filter
   * @returns {Promise<Object[]>} Array of idea data
   */
  async getIdeasByType(type, userId = null) {
    const ideas = await this.ideaRepository.findByType(type, userId);
    return ideas.map((idea) => idea.toJSON());
  }
}

module.exports = IdeaService;
