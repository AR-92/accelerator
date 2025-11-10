/**
 * LandingPage service handling landing page business logic
 */
class LandingPageService {
  constructor(landingPageRepository) {
    this.landingPageRepository = landingPageRepository;
  }

  /**
   * Get all active landing page sections
   * @returns {Promise<Object>} Landing page data
   */
  async getLandingPageData() {
    try {
      const sections = await this.landingPageRepository.findAllActive();

      // Group sections by type for easier template rendering
      const groupedSections = sections.reduce((acc, section) => {
        if (!acc[section.sectionType]) {
          acc[section.sectionType] = [];
        }
        acc[section.sectionType].push(section);
        return acc;
      }, {});

      return {
        sections: sections,
        groupedSections: groupedSections,
        hero: groupedSections.hero || [],
        features: groupedSections.features || [],
        testimonials: groupedSections.testimonials || [],
        cta: groupedSections.cta || [],
        about: groupedSections.about || [],
        pricing: groupedSections.pricing || [],
        contact: groupedSections.contact || [],
      };
    } catch (error) {
      console.error('Error fetching landing page data:', error);
      throw error;
    }
  }

  /**
   * Get all landing page sections for admin management
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Sections with pagination
   */
  async getAllSections(options = {}) {
    try {
      const { page = 1, limit = 20, sectionType, isActive } = options;

      let sql = 'SELECT * FROM landing_pages WHERE 1=1';
      const params = [];

      if (sectionType) {
        sql += ' AND section_type = ?';
        params.push(sectionType);
      }

      if (isActive !== undefined) {
        sql += ' AND is_active = ?';
        params.push(isActive ? 1 : 0);
      }

      sql += ' ORDER BY "order" ASC, created_at DESC';

      // Get total count
      const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as count');
      const countResult = await this.landingPageRepository.queryOne(
        countSql,
        params
      );
      const total = countResult.count;

      // Add pagination
      const offset = (page - 1) * limit;
      sql += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const rows = await this.landingPageRepository.query(sql, params);
      const sections = rows.map(
        (row) => new (require('../models/LandingPage'))(row)
      );

      return {
        sections,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(total),
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Error fetching landing page sections:', error);
      throw error;
    }
  }

  /**
   * Get landing page section by ID
   * @param {number} id - Section ID
   * @returns {Promise<Object|null>} Section data
   */
  async getSectionById(id) {
    try {
      const section = await this.landingPageRepository.findById(id);
      return section ? section.toJSON() : null;
    } catch (error) {
      console.error('Error fetching landing page section:', error);
      throw error;
    }
  }

  /**
   * Create a new landing page section
   * @param {Object} sectionData - Section data
   * @returns {Promise<number>} Created section ID
   */
  async createSection(sectionData) {
    try {
      return await this.landingPageRepository.create(sectionData);
    } catch (error) {
      console.error('Error creating landing page section:', error);
      throw error;
    }
  }

  /**
   * Update a landing page section
   * @param {number} id - Section ID
   * @param {Object} sectionData - Updated section data
   * @returns {Promise<boolean>} Success status
   */
  async updateSection(id, sectionData) {
    try {
      return await this.landingPageRepository.update(id, sectionData);
    } catch (error) {
      console.error('Error updating landing page section:', error);
      throw error;
    }
  }

  /**
   * Delete a landing page section
   * @param {number} id - Section ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteSection(id) {
    try {
      return await this.landingPageRepository.delete(id);
    } catch (error) {
      console.error('Error deleting landing page section:', error);
      throw error;
    }
  }

  /**
   * Toggle section active status
   * @param {number} id - Section ID
   * @returns {Promise<boolean>} Success status
   */
  async toggleSectionStatus(id) {
    try {
      return await this.landingPageRepository.toggleActive(id);
    } catch (error) {
      console.error('Error toggling section status:', error);
      throw error;
    }
  }

  /**
   * Update section order
   * @param {number} id - Section ID
   * @param {number} order - New order
   * @returns {Promise<boolean>} Success status
   */
  async updateSectionOrder(id, order) {
    try {
      return await this.landingPageRepository.updateOrder(id, order);
    } catch (error) {
      console.error('Error updating section order:', error);
      throw error;
    }
  }

  /**
   * Get section types for dropdowns
   * @returns {Array} Section type options
   */
  getSectionTypes() {
    return [
      { value: 'hero', label: 'Hero Section' },
      { value: 'features', label: 'Features' },
      { value: 'testimonials', label: 'Testimonials' },
      { value: 'cta', label: 'Call to Action' },
      { value: 'about', label: 'About' },
      { value: 'pricing', label: 'Pricing' },
      { value: 'contact', label: 'Contact' },
    ];
  }
}

module.exports = LandingPageService;
