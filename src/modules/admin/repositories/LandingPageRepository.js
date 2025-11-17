const LandingPage = require('../models/LandingPage');
const BaseRepository = require('../../../shared/repositories/BaseRepository');

/**
 * LandingPage repository for data access operations
 */
class LandingPageRepository extends BaseRepository {
  constructor(db, logger) {
    super(db, 'landing_pages', logger);
  }

  /**
   * Find landing page section by ID
   * @param {number} id - Section ID
   * @returns {Promise<LandingPage|null>}
   */
  async findById(id) {
    const row = await super.findById(id);
    return row ? new LandingPage(row) : null;
  }

  /**
   * Find all active landing page sections ordered by order field
   * @returns {Promise<LandingPage[]>}
   */
  async findAllActive() {
    const sql =
      'SELECT * FROM landing_pages WHERE is_active = true ORDER BY sort_order ASC';
    const rows = await this.query(sql);
    return rows.map((row) => new LandingPage(row));
  }

  /**
   * Find sections by type
   * @param {string} sectionType - Section type
   * @returns {Promise<LandingPage[]>}
   */
  async findByType(sectionType) {
    const sql =
      'SELECT * FROM landing_pages WHERE section_type = ? AND is_active = true ORDER BY sort_order ASC';
    const rows = await this.query(sql, [sectionType]);
    return rows.map((row) => new LandingPage(row));
  }

  /**
   * Create a new landing page section
   * @param {Object} sectionData - Section data
   * @returns {Promise<number>} Created section ID
   */
  async create(sectionData) {
    const section = new LandingPage(sectionData);
    section.validate();

    const data = {
      section_type: section.sectionType,
      title: section.title,
      subtitle: section.subtitle,
      content: section.content,
      image_url: section.imageUrl,
      button_text: section.buttonText,
      button_url: section.buttonUrl,
      sort_order: section.order,
      is_active: section.isActive ? 1 : 0,
      metadata: JSON.stringify(section.metadata),
    };

    return await super.create(data);
  }

  /**
   * Update a landing page section
   * @param {number} id - Section ID
   * @param {Object} sectionData - Updated section data
   * @returns {Promise<boolean>} Success status
   */
  async update(id, sectionData) {
    const section = new LandingPage(sectionData);
    section.validate();

    const data = {
      section_type: section.sectionType,
      title: section.title,
      subtitle: section.subtitle,
      content: section.content,
      image_url: section.imageUrl,
      button_text: section.buttonText,
      button_url: section.buttonUrl,
      sort_order: section.order,
      is_active: section.isActive ? 1 : 0,
      metadata: JSON.stringify(section.metadata),
      updated_at: new Date().toISOString(),
    };

    return await super.update(id, data);
  }

  /**
   * Update section order
   * @param {number} id - Section ID
   * @param {number} order - New order
   * @returns {Promise<boolean>} Success status
   */
  async updateOrder(id, order) {
    return await super.update(id, {
      sort_order: order,
      updated_at: new Date().toISOString(),
    });
  }

  /**
   * Toggle section active status
   * @param {number} id - Section ID
   * @returns {Promise<boolean>} Success status
   */
  async toggleActive(id) {
    const section = await this.findById(id);
    if (!section) return false;

    return await super.update(id, {
      is_active: section.isActive ? 0 : 1,
      updated_at: new Date().toISOString(),
    });
  }

  /**
   * Get landing page statistics
   * @returns {Promise<Object>} Landing page statistics
   */
  async getStats() {
    const sql = `
      SELECT
        COUNT(*) as total_pages,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_pages,
        COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_pages,
        COUNT(CASE WHEN is_published = true THEN 1 END) as published_pages
      FROM landing_pages
    `;
    return await this.queryOne(sql);
  }
}

module.exports = LandingPageRepository;
