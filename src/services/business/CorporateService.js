/**
 * Corporate service handling corporate-specific business logic
 */
const CorporateRepository = require('../../repositories/CorporateRepository');

class CorporateService {
  constructor(corporateRepository) {
    this.corporateRepository = corporateRepository;
  }

  /**
   * Get all corporates with filtering and pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Corporates with pagination info
   */
  async getAllCorporates(options = {}) {
    const corporates = await this.corporateRepository.findAllFiltered(options);
    const total = await this.corporateRepository.countFiltered(options);

    return {
      corporates: corporates.map((corporate) => corporate.toJSON()),
      total,
      limit: options.limit || 20,
      offset: options.offset || 0,
    };
  }

  /**
   * Get corporate by ID
   * @param {number} id - Corporate ID
   * @returns {Promise<Object|null>} Corporate data or null
   */
  async getCorporateById(id) {
    const corporate = await this.corporateRepository.getById(id);
    return corporate ? corporate.toJSON() : null;
  }

  /**
   * Create a new corporate
   * @param {number} userId - User ID
   * @param {Object} corporateData - Corporate data
   * @returns {Promise<Object>} Created corporate data
   */
  async createCorporate(userId, corporateData) {
    const corporateId = await this.corporateRepository.create({
      ...corporateData,
      user_id: userId,
    });
    return await this.getCorporateById(corporateId);
  }

  /**
   * Update a corporate
   * @param {number} id - Corporate ID
   * @param {Object} corporateData - Updated corporate data
   * @returns {Promise<Object>} Updated corporate data
   */
  async updateCorporate(id, corporateData) {
    await this.corporateRepository.update(id, corporateData);
    return await this.getCorporateById(id);
  }

  /**
   * Delete a corporate
   * @param {number} id - Corporate ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteCorporate(id) {
    return await this.corporateRepository.delete(id);
  }

  /**
   * Get corporates by user ID
   * @param {number} userId - User ID
   * @returns {Promise<Array>} Array of corporate data
   */
  async getCorporatesByUserId(userId) {
    const corporates = await this.corporateRepository.getByUserId(userId);
    return corporates.map((corporate) => corporate.toJSON());
  }

  /**
   * Get corporate statistics
   * @returns {Promise<Object>} Statistics data
   */
  async getStatistics() {
    return await this.corporateRepository.getStatistics();
  }

  /**
   * Search corporates
   * @param {string} query - Search query
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} Array of corporate data
   */
  async searchCorporates(query, options = {}) {
    const searchOptions = {
      ...options,
      search: query,
    };
    const result = await this.getAllCorporates(searchOptions);
    return result.corporates;
  }

  /**
   * Get corporates filtered by criteria
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Filtered corporates with pagination
   */
  async getCorporatesFiltered(filters = {}) {
    return await this.getAllCorporates(filters);
  }

  /**
   * Bulk update corporate status
   * @param {Array<number>} corporateIds - Corporate IDs
   * @param {string} status - New status
   * @returns {Promise<number>} Number of updated corporates
   */
  async bulkUpdateStatus(corporateIds, status) {
    let updatedCount = 0;
    for (const id of corporateIds) {
      try {
        await this.corporateRepository.update(id, { status });
        updatedCount++;
      } catch (error) {
        console.error(`Failed to update corporate ${id}:`, error);
      }
    }
    return updatedCount;
  }

  /**
   * Bulk delete corporates
   * @param {Array<number>} corporateIds - Corporate IDs
   * @returns {Promise<number>} Number of deleted corporates
   */
  async bulkDelete(corporateIds) {
    let deletedCount = 0;
    for (const id of corporateIds) {
      try {
        await this.corporateRepository.delete(id);
        deletedCount++;
      } catch (error) {
        console.error(`Failed to delete corporate ${id}:`, error);
      }
    }
    return deletedCount;
  }

  /**
   * Export corporates to CSV
   * @param {Object} filters - Filter options
   * @returns {Promise<string>} CSV content
   */
  async exportToCSV(filters = {}) {
    const result = await this.getAllCorporates({ ...filters, limit: null });
    const corporates = result.corporates;

    const csvRows = [
      [
        'ID',
        'Name',
        'Industry',
        'Sector',
        'Company Size',
        'Status',
        'Employee Count',
        'Revenue',
        'Location',
        'Headquarters',
        'Website',
        'Founded Date',
        'Created At',
      ].join(','),
      ...corporates.map((corporate) =>
        [
          corporate.id,
          `"${corporate.name}"`,
          `"${corporate.industry}"`,
          `"${corporate.sector || ''}"`,
          corporate.companySize || '',
          corporate.status,
          corporate.employeeCount || '',
          corporate.revenue || '',
          `"${corporate.location || ''}"`,
          `"${corporate.headquarters || ''}"`,
          corporate.website || '',
          corporate.foundedDate || '',
          corporate.createdAt,
        ].join(',')
      ),
    ];

    return csvRows.join('\n');
  }

  /**
   * Count corporates by status
   * @returns {Promise<Object>} Status counts
   */
  async countByStatus() {
    return await this.corporateRepository.countByStatus();
  }
}

module.exports = CorporateService;
