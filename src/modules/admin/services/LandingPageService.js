/**
 * Landing Page Service
 * Handles landing page management operations
 */
class LandingPageService {
  constructor(landingPageRepository) {
    this.landingPageRepository = landingPageRepository;
  }

  // Landing page sections methods
  async getAllSections(options = {}) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const offset = (page - 1) * limit;

    const sections = await this.landingPageRepository.findAllActive();
    const totalCount = sections.length;

    // Apply pagination
    const paginatedSections = sections.slice(offset, offset + limit);

    return {
      sections: paginatedSections,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
        hasPrev: page > 1,
        hasNext: page < Math.ceil(totalCount / limit),
      },
    };
  }

  async getSectionById(id) {
    return this.landingPageRepository.findById(id);
  }

  async createSection(sectionData) {
    return this.landingPageRepository.create(sectionData);
  }

  async updateSection(id, sectionData) {
    return this.landingPageRepository.update(id, sectionData);
  }

  async deleteSection(id) {
    return this.landingPageRepository.delete(id);
  }

  async updateSectionOrder(id, order) {
    return this.landingPageRepository.updateOrder(id, order);
  }

  async toggleSectionStatus(id) {
    return this.landingPageRepository.toggleActive(id);
  }

  getSectionTypes() {
    return [
      'hero',
      'features',
      'testimonials',
      'pricing',
      'cta',
      'footer',
      'custom',
    ];
  }

  // Legacy methods for backward compatibility
  async getAllLandingPages() {
    return this.landingPageRepository.findAll();
  }

  async getLandingPageById(id) {
    return this.landingPageRepository.findById(id);
  }

  async createLandingPage(data) {
    return this.landingPageRepository.create(data);
  }

  async updateLandingPage(id, data) {
    return this.landingPageRepository.update(id, data);
  }

  async deleteLandingPage(id) {
    return this.landingPageRepository.delete(id);
  }
}

module.exports = LandingPageService;
