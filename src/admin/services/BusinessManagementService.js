/**
 * Business management service handling startups, enterprises, and corporates for admin
 */
class BusinessManagementService {
  constructor(
    startupService,
    enterpriseService,
    corporateService,
    adminActivityRepository
  ) {
    this.startupService = startupService;
    this.enterpriseService = enterpriseService;
    this.corporateService = corporateService;
    this.adminActivityRepository = adminActivityRepository;
  }

  /**
   * Log admin action for audit purposes
   * @param {Object} action - Action details
   */
  async logAdminAction(action) {
    try {
      await this.adminActivityRepository.create(action);
    } catch (error) {
      console.error('Error logging admin action:', error);
      // Don't throw - logging failure shouldn't break the main operation
    }
  }

  /**
   * Get startups with pagination and filtering for admin
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Startups data with pagination
   */
  async getStartups(options = {}) {
    try {
      const result = await this.startupService.getStartupsFiltered(options);

      return {
        startups: result.startups.map((startup) => ({
          id: startup.id,
          name: startup.name,
          industry: startup.industry,
          status: startup.status,
          website: startup.website,
          foundedDate: startup.foundedDate,
          description: startup.description,
          userId: startup.userId,
          createdAt: startup.createdAt,
          updatedAt: startup.updatedAt,
        })),
        pagination: {
          page: Math.floor(options.offset / options.limit) + 1 || 1,
          limit: options.limit || 20,
          total: result.total,
          pages: Math.ceil(result.total / (options.limit || 20)),
        },
      };
    } catch (error) {
      console.error('Error getting startups:', error);
      throw error;
    }
  }

  /**
   * Get startup by ID for admin
   * @param {number} startupId - Startup ID
   * @returns {Promise<Object>} Startup data
   */
  async getStartupById(startupId) {
    try {
      const startup = await this.startupService.getStartupById(startupId);
      return startup;
    } catch (error) {
      console.error('Error getting startup by ID:', error);
      throw error;
    }
  }

  /**
   * Create a new startup
   * @param {Object} startupData - Startup data
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<Object>} Created startup data
   */
  async createStartup(startupData, adminInfo) {
    try {
      const startup = await this.startupService.createStartup(
        startupData.userId,
        startupData
      );

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo.id,
        adminEmail: adminInfo.email,
        action: 'CREATE_STARTUP',
        targetType: 'startup',
        targetId: startup.id,
        details: { name: startup.name, industry: startup.industry },
        ip: adminInfo.ip,
      });

      return startup;
    } catch (error) {
      console.error('Error creating startup:', error);
      throw error;
    }
  }

  /**
   * Update a startup
   * @param {number} startupId - Startup ID
   * @param {Object} startupData - Updated startup data
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<Object>} Updated startup data
   */
  async updateStartup(startupId, startupData, adminInfo) {
    try {
      const startup = await this.startupService.updateStartup(
        startupId,
        startupData.userId || 0, // Admin can update any startup
        startupData
      );

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo.id,
        adminEmail: adminInfo.email,
        action: 'UPDATE_STARTUP',
        targetType: 'startup',
        targetId: startupId,
        details: { name: startup.name, industry: startup.industry },
        ip: adminInfo.ip,
      });

      return startup;
    } catch (error) {
      console.error('Error updating startup:', error);
      throw error;
    }
  }

  /**
   * Delete a startup
   * @param {number} startupId - Startup ID
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<boolean>} Success status
   */
  async deleteStartup(startupId, adminInfo) {
    try {
      // Check if startup exists first
      const startup = await this.startupService.getStartupById(startupId);

      const success = await this.startupService.deleteStartup(
        startupId,
        startup.userId // Use the actual owner ID
      );

      if (success) {
        // Log admin action
        this.logAdminAction({
          adminId: adminInfo.id,
          adminEmail: adminInfo.email,
          action: 'DELETE_STARTUP',
          targetType: 'startup',
          targetId: startupId,
          details: {
            deletedStartupName: startup.name,
            deletedStartupIndustry: startup.industry,
          },
          ip: adminInfo.ip,
        });
      }

      return success;
    } catch (error) {
      console.error('Error deleting startup:', error);
      throw error;
    }
  }

  /**
   * Get enterprises for admin with filtering and pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Enterprises with pagination info
   */
  async getEnterprises(options = {}) {
    try {
      const result =
        await this.enterpriseService.getEnterprisesFiltered(options);

      return {
        enterprises: result.enterprises,
        pagination: {
          page: Math.floor(options.offset / options.limit) + 1 || 1,
          limit: options.limit || 20,
          total: result.total,
          pages: Math.ceil(result.total / (options.limit || 20)),
        },
      };
    } catch (error) {
      console.error('Error getting enterprises:', error);
      throw error;
    }
  }

  /**
   * Get enterprise by ID for admin
   * @param {number} enterpriseId - Enterprise ID
   * @returns {Promise<Object>} Enterprise data
   */
  async getEnterpriseById(enterpriseId) {
    try {
      const enterprise =
        await this.enterpriseService.getEnterpriseById(enterpriseId);
      return enterprise;
    } catch (error) {
      console.error('Error getting enterprise by ID:', error);
      throw error;
    }
  }

  /**
   * Create a new enterprise
   * @param {number} userId - User ID
   * @param {Object} enterpriseData - Enterprise data
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<Object>} Created enterprise data
   */
  async createEnterprise(userId, enterpriseData, adminInfo) {
    try {
      const enterprise = await this.enterpriseService.createEnterprise(
        userId,
        enterpriseData
      );

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo?.id,
        adminEmail: adminInfo?.email,
        action: 'CREATE_ENTERPRISE',
        targetType: 'enterprise',
        targetId: enterprise.id,
        details: { name: enterprise.name, industry: enterprise.industry },
        ip: adminInfo?.ip,
      });

      return enterprise;
    } catch (error) {
      console.error('Error creating enterprise:', error);
      throw error;
    }
  }

  /**
   * Update an enterprise
   * @param {number} enterpriseId - Enterprise ID
   * @param {Object} enterpriseData - Updated enterprise data
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<Object>} Updated enterprise data
   */
  async updateEnterprise(enterpriseId, enterpriseData, adminInfo) {
    try {
      const enterprise = await this.enterpriseService.updateEnterprise(
        enterpriseId,
        enterpriseData
      );

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo?.id,
        adminEmail: adminInfo?.email,
        action: 'UPDATE_ENTERPRISE',
        targetType: 'enterprise',
        targetId: enterprise.id,
        details: {
          name: enterprise.name,
          changes: Object.keys(enterpriseData),
        },
        ip: adminInfo?.ip,
      });

      return enterprise;
    } catch (error) {
      console.error('Error updating enterprise:', error);
      throw error;
    }
  }

  /**
   * Delete an enterprise
   * @param {number} enterpriseId - Enterprise ID
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<boolean>} Success status
   */
  async deleteEnterprise(enterpriseId, adminInfo) {
    try {
      const success =
        await this.enterpriseService.deleteEnterprise(enterpriseId);

      if (success) {
        // Log admin action
        this.logAdminAction({
          adminId: adminInfo?.id,
          adminEmail: adminInfo?.email,
          action: 'DELETE_ENTERPRISE',
          targetType: 'enterprise',
          targetId: enterpriseId,
          ip: adminInfo?.ip,
        });
      }

      return success;
    } catch (error) {
      console.error('Error deleting enterprise:', error);
      throw error;
    }
  }

  /**
   * Bulk update enterprise status
   * @param {Array<number>} enterpriseIds - Enterprise IDs
   * @param {string} status - New status
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<number>} Number of updated enterprises
   */
  async bulkUpdateEnterpriseStatus(enterpriseIds, status, adminInfo) {
    try {
      const updatedCount = await this.enterpriseService.bulkUpdateStatus(
        enterpriseIds,
        status
      );

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo?.id,
        adminEmail: adminInfo?.email,
        action: 'BULK_UPDATE_ENTERPRISE_STATUS',
        targetType: 'enterprise',
        details: { enterpriseIds, status, updatedCount },
        ip: adminInfo?.ip,
      });

      return updatedCount;
    } catch (error) {
      console.error('Error bulk updating enterprise status:', error);
      throw error;
    }
  }

  /**
   * Bulk delete enterprises
   * @param {Array<number>} enterpriseIds - Enterprise IDs
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<number>} Number of deleted enterprises
   */
  async bulkDeleteEnterprises(enterpriseIds, adminInfo) {
    try {
      const deletedCount =
        await this.enterpriseService.bulkDelete(enterpriseIds);

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo?.id,
        adminEmail: adminInfo?.email,
        action: 'BULK_DELETE_ENTERPRISES',
        targetType: 'enterprise',
        details: { enterpriseIds, deletedCount },
        ip: adminInfo?.ip,
      });

      return deletedCount;
    } catch (error) {
      console.error('Error bulk deleting enterprises:', error);
      throw error;
    }
  }

  /**
   * Export enterprises to CSV
   * @param {Object} filters - Filter options
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<string>} CSV content
   */
  async exportEnterprisesToCSV(filters = {}, adminInfo) {
    try {
      const csvContent = await this.enterpriseService.exportToCSV(filters);

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo?.id,
        adminEmail: adminInfo?.email,
        action: 'EXPORT_ENTERPRISES_CSV',
        targetType: 'enterprise',
        details: { filters },
        ip: adminInfo?.ip,
      });

      return csvContent;
    } catch (error) {
      console.error('Error exporting enterprises to CSV:', error);
      throw error;
    }
  }

  /**
   * Get corporates for admin with filtering and pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Corporates with pagination info
   */
  async getCorporates(options = {}) {
    try {
      const result = await this.corporateService.getCorporatesFiltered(options);

      return {
        corporates: result.corporates,
        pagination: {
          page: Math.floor(options.offset / options.limit) + 1 || 1,
          limit: options.limit || 20,
          total: result.total,
          pages: Math.ceil(result.total / (options.limit || 20)),
        },
      };
    } catch (error) {
      console.error('Error getting corporates:', error);
      throw error;
    }
  }

  /**
   * Get corporate by ID for admin
   * @param {number} corporateId - Corporate ID
   * @returns {Promise<Object>} Corporate data
   */
  async getCorporateById(corporateId) {
    try {
      const corporate =
        await this.corporateService.getCorporateById(corporateId);
      return corporate;
    } catch (error) {
      console.error('Error getting corporate by ID:', error);
      throw error;
    }
  }

  /**
   * Create a new corporate
   * @param {number} userId - User ID creating the corporate
   * @param {Object} corporateData - Corporate data
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<Object>} Created corporate data
   */
  async createCorporate(userId, corporateData, adminInfo) {
    try {
      const corporate = await this.corporateService.createCorporate(
        userId,
        corporateData
      );

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo?.id,
        adminEmail: adminInfo?.email,
        action: 'CREATE_CORPORATE',
        targetType: 'corporate',
        targetId: corporate.id,
        details: { name: corporate.name, industry: corporate.industry },
        ip: adminInfo?.ip,
      });

      return corporate;
    } catch (error) {
      console.error('Error creating corporate:', error);
      throw error;
    }
  }

  /**
   * Update a corporate
   * @param {number} corporateId - Corporate ID
   * @param {Object} corporateData - Updated corporate data
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<Object>} Updated corporate data
   */
  async updateCorporate(corporateId, corporateData, adminInfo) {
    try {
      const corporate = await this.corporateService.updateCorporate(
        corporateId,
        corporateData
      );

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo?.id,
        adminEmail: adminInfo?.email,
        action: 'UPDATE_CORPORATE',
        targetType: 'corporate',
        targetId: corporate.id,
        details: {
          name: corporate.name,
          changes: Object.keys(corporateData),
        },
        ip: adminInfo?.ip,
      });

      return corporate;
    } catch (error) {
      console.error('Error updating corporate:', error);
      throw error;
    }
  }

  /**
   * Delete a corporate
   * @param {number} corporateId - Corporate ID
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<boolean>} Success status
   */
  async deleteCorporate(corporateId, adminInfo) {
    try {
      const success = await this.corporateService.deleteCorporate(corporateId);

      if (success) {
        // Log admin action
        this.logAdminAction({
          adminId: adminInfo?.id,
          adminEmail: adminInfo?.email,
          action: 'DELETE_CORPORATE',
          targetType: 'corporate',
          targetId: corporateId,
          ip: adminInfo?.ip,
        });
      }

      return success;
    } catch (error) {
      console.error('Error deleting corporate:', error);
      throw error;
    }
  }

  /**
   * Bulk update corporate status
   * @param {Array<number>} corporateIds - Corporate IDs
   * @param {string} status - New status
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<number>} Number of updated corporates
   */
  async bulkUpdateCorporateStatus(corporateIds, status, adminInfo) {
    try {
      const updatedCount = await this.corporateService.bulkUpdateStatus(
        corporateIds,
        status
      );

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo?.id,
        adminEmail: adminInfo?.email,
        action: 'BULK_UPDATE_CORPORATE_STATUS',
        targetType: 'corporate',
        details: { corporateIds, status, updatedCount },
        ip: adminInfo?.ip,
      });

      return updatedCount;
    } catch (error) {
      console.error('Error bulk updating corporate status:', error);
      throw error;
    }
  }

  /**
   * Bulk delete corporates
   * @param {Array<number>} corporateIds - Corporate IDs
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<number>} Number of deleted corporates
   */
  async bulkDeleteCorporates(corporateIds, adminInfo) {
    try {
      const deletedCount = await this.corporateService.bulkDelete(corporateIds);

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo?.id,
        adminEmail: adminInfo?.email,
        action: 'BULK_DELETE_CORPORATES',
        targetType: 'corporate',
        details: { corporateIds, deletedCount },
        ip: adminInfo?.ip,
      });

      return deletedCount;
    } catch (error) {
      console.error('Error bulk deleting corporates:', error);
      throw error;
    }
  }

  /**
   * Export corporates to CSV
   * @param {Object} filters - Filter options
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<string>} CSV content
   */
  async exportCorporatesToCSV(filters = {}, adminInfo) {
    try {
      const csvContent = await this.corporateService.exportToCSV(filters);

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo?.id,
        adminEmail: adminInfo?.email,
        action: 'EXPORT_CORPORATES_CSV',
        targetType: 'corporate',
        details: { filters },
        ip: adminInfo?.ip,
      });

      return csvContent;
    } catch (error) {
      console.error('Error exporting corporates to CSV:', error);
      throw error;
    }
  }
}

module.exports = BusinessManagementService;
