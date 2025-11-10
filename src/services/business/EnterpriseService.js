/**
 * Enterprise service handling enterprise-specific business logic
 */
const EnterpriseRepository = require('../../repositories/business/EnterpriseRepository');

class EnterpriseService {
  constructor(enterpriseRepository) {
    this.enterpriseRepository = enterpriseRepository;
  }

  /**
   * Get all enterprises with filtering and pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Enterprises with pagination info
   */
  async getAllEnterprises(options = {}) {
    const enterprises =
      await this.enterpriseRepository.findAllFiltered(options);
    const total = await this.enterpriseRepository.countFiltered(options);

    return {
      enterprises: enterprises.map((enterprise) => enterprise.toJSON()),
      total,
      limit: options.limit || 20,
      offset: options.offset || 0,
    };
  }

  /**
   * Get enterprise by ID
   * @param {number} id - Enterprise ID
   * @returns {Promise<Object|null>} Enterprise data or null
   */
  async getEnterpriseById(id) {
    const enterprise = await this.enterpriseRepository.getById(id);
    return enterprise ? enterprise.toJSON() : null;
  }

  /**
   * Create a new enterprise
   * @param {number} userId - User ID
   * @param {Object} enterpriseData - Enterprise data
   * @returns {Promise<Object>} Created enterprise data
   */
  async createEnterprise(userId, enterpriseData) {
    const enterpriseId = await this.enterpriseRepository.create({
      ...enterpriseData,
      user_id: userId,
    });
    return await this.getEnterpriseById(enterpriseId);
  }

  /**
   * Update an enterprise
   * @param {number} id - Enterprise ID
   * @param {Object} enterpriseData - Updated enterprise data
   * @returns {Promise<Object>} Updated enterprise data
   */
  async updateEnterprise(id, enterpriseData) {
    await this.enterpriseRepository.update(id, enterpriseData);
    return await this.getEnterpriseById(id);
  }

  /**
   * Delete an enterprise
   * @param {number} id - Enterprise ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteEnterprise(id) {
    return await this.enterpriseRepository.delete(id);
  }

  /**
   * Get enterprises by user ID
   * @param {number} userId - User ID
   * @returns {Promise<Array>} Array of enterprise data
   */
  async getEnterprisesByUserId(userId) {
    const enterprises = await this.enterpriseRepository.getByUserId(userId);
    return enterprises.map((enterprise) => enterprise.toJSON());
  }

  /**
   * Get enterprise statistics
   * @returns {Promise<Object>} Statistics data
   */
  async getStatistics() {
    return await this.enterpriseRepository.getStatistics();
  }

  /**
   * Search enterprises
   * @param {string} query - Search query
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} Array of enterprise data
   */
  async searchEnterprises(query, options = {}) {
    const searchOptions = {
      ...options,
      search: query,
    };
    const result = await this.getAllEnterprises(searchOptions);
    return result.enterprises;
  }

  /**
   * Get enterprises filtered by criteria
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Filtered enterprises with pagination
   */
  async getEnterprisesFiltered(filters = {}) {
    return await this.getAllEnterprises(filters);
  }

  /**
   * Bulk update enterprise status
   * @param {Array<number>} enterpriseIds - Enterprise IDs
   * @param {string} status - New status
   * @returns {Promise<number>} Number of updated enterprises
   */
  async bulkUpdateStatus(enterpriseIds, status) {
    let updatedCount = 0;
    for (const id of enterpriseIds) {
      try {
        await this.enterpriseRepository.update(id, { status });
        updatedCount++;
      } catch (error) {
        console.error(`Failed to update enterprise ${id}:`, error);
      }
    }
    return updatedCount;
  }

  /**
   * Bulk delete enterprises
   * @param {Array<number>} enterpriseIds - Enterprise IDs
   * @returns {Promise<number>} Number of deleted enterprises
   */
  async bulkDelete(enterpriseIds) {
    let deletedCount = 0;
    for (const id of enterpriseIds) {
      try {
        await this.enterpriseRepository.delete(id);
        deletedCount++;
      } catch (error) {
        console.error(`Failed to delete enterprise ${id}:`, error);
      }
    }
    return deletedCount;
  }

  /**
   * Export enterprises to CSV
   * @param {Object} filters - Filter options
   * @returns {Promise<string>} CSV content
   */
  async exportToCSV(filters = {}) {
    const result = await this.getAllEnterprises({ ...filters, limit: null });
    const enterprises = result.enterprises;

    const csvRows = [
      [
        'ID',
        'Name',
        'Industry',
        'Status',
        'Company Size',
        'Revenue',
        'Location',
        'Website',
        'Founded Date',
        'Created At',
      ].join(','),
      ...enterprises.map((enterprise) =>
        [
          enterprise.id,
          `"${enterprise.name}"`,
          `"${enterprise.industry}"`,
          enterprise.status,
          enterprise.companySize || '',
          enterprise.revenue || '',
          `"${enterprise.location || ''}"`,
          enterprise.website || '',
          enterprise.foundedDate || '',
          enterprise.createdAt,
        ].join(',')
      ),
    ];

    return csvRows.join('\n');
  }

  /**
   * Count enterprises by status
   * @returns {Promise<Object>} Status counts
   */
  async countByStatus() {
    return await this.enterpriseRepository.countByStatus();
  }
}

module.exports = EnterpriseService;
