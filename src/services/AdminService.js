/**
 * Admin service handling admin-specific business logic
 */
class AdminService {
  constructor(
    userRepository,
    helpService,
    learningService,
    adminActivityRepository,
    startupService,
    enterpriseService,
    corporateService
  ) {
    this.userRepository = userRepository;
    this.helpService = helpService;
    this.learningService = learningService;
    this.adminActivityRepository = adminActivityRepository;
    this.startupService = startupService;
    this.enterpriseService = enterpriseService;
    this.corporateService = corporateService;
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
   * Get admin dashboard statistics
   * @returns {Promise<Object>} Dashboard stats
   */
  async getDashboardStats() {
    try {
      // Get user statistics
      const totalUsers = await this.userRepository.count();
      const usersByRoleRaw = await this.userRepository.countByRole();
      const recentUsers = await this.userRepository.findRecent(7); // Last 7 days

      // Define all possible roles and ensure they all appear in the data
      const allRoles = ['admin', 'corporate', 'enterprise', 'startup'];

      // Convert usersByRole object to array format for template, including roles with 0 users
      const usersByRole = allRoles.map((role) => ({
        role,
        count: parseInt(usersByRoleRaw[role] || 0),
      }));

      // Get content statistics
      const helpStats = await this.helpService.getHelpStats();
      const learningStats = await this.learningService.getLearningStats();

      // Get startup statistics
      const startupStats = await this.startupService.getStartupsFiltered({});
      const startupCountByStatus = await this.startupService.countByStatus();

      // Get enterprise statistics
      const enterpriseStats =
        await this.enterpriseService.getEnterprisesFiltered({});
      const enterpriseCountByStatus =
        await this.enterpriseService.countByStatus();

      // Get corporate statistics
      const corporateStats = await this.corporateService.getCorporatesFiltered(
        {}
      );
      const corporateCountByStatus =
        await this.corporateService.countByStatus();

      // Calculate credit statistics
      const totalCredits = await this.userRepository.getTotalCredits();

      // Get recent activity (last 10 actions)
      const recentActivity = await this.getRecentActivity(10);

      // Get system health metrics
      const systemStats = await this.getSystemStats();

      return {
        users: {
          total: totalUsers,
          byRole: usersByRole,
          recent: recentUsers.length,
          recentUsers: recentUsers.slice(0, 5), // Last 5 new users
        },
        content: {
          help: {
            total: helpStats.totalArticles || 0,
            published: helpStats.totalArticles || 0, // All returned stats are for published articles
            draft: 0, // We'll need to modify the query to get draft count
          },
          learning: {
            total: learningStats.totalArticles || 0,
            published: learningStats.totalArticles || 0,
            draft: 0,
          },
        },
        startups: {
          total: startupStats.total || 0,
          byStatus: Object.entries(startupCountByStatus).map(
            ([status, count]) => ({
              status,
              count: parseInt(count),
            })
          ),
        },
        enterprises: {
          total: enterpriseStats.total || 0,
          byStatus: Object.entries(enterpriseCountByStatus).map(
            ([status, count]) => ({
              status,
              count: parseInt(count),
            })
          ),
        },
        corporates: {
          total: corporateStats.total || 0,
          byStatus: Object.entries(corporateCountByStatus).map(
            ([status, count]) => ({
              status,
              count: parseInt(count),
            })
          ),
        },
        credits: {
          total: totalCredits,
        },
        activity: recentActivity,
        system: systemStats,
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      // Return default stats on error for better error handling
      return {
        users: {
          total: 0,
          byRole: [
            { role: 'admin', count: 0 },
            { role: 'corporate', count: 0 },
            { role: 'enterprise', count: 0 },
            { role: 'startup', count: 0 },
          ],
          recent: 0,
          recentUsers: [],
        },
        content: {
          help: { total: 0, published: 0, draft: 0 },
          learning: { total: 0, published: 0, draft: 0 },
        },
        startups: {
          total: 0,
          byStatus: [
            { status: 'active', count: 0 },
            { status: 'inactive', count: 0 },
            { status: 'acquired', count: 0 },
            { status: 'failed', count: 0 },
          ],
        },
        credits: { total: 0 },
        activity: [],
        system: { uptime: 0, memory: { used: 0, total: 0 } },
      };
    }
  }

  /**
   * Get system health statistics
   * @returns {Promise<Object>} System stats
   */
  async getSystemStats() {
    try {
      const uptime = process.uptime();
      const memoryUsage = process.memoryUsage();

      return {
        uptime: Math.floor(uptime),
        memory: {
          used: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
          total: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
        },
        nodeVersion: process.version,
        platform: process.platform,
      };
    } catch (error) {
      console.error('Error getting system stats:', error);
      return {
        uptime: 0,
        memory: { used: 0, total: 0 },
        nodeVersion: 'unknown',
        platform: 'unknown',
      };
    }
  }

  /**
   * Get users with pagination and filtering for admin
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Users data with pagination
   */
  async getUsers(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = (page - 1) * limit;

      const [users, totalCount] = await Promise.all([
        this.userRepository.findAll({
          limit,
          offset,
          role: options.role,
          search: options.search,
          sortBy: options.sortBy,
          sortOrder: options.sortOrder,
        }),
        this.userRepository.countFiltered({
          role: options.role,
          search: options.search,
        }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        users: users.map((user) => ({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: `${user.firstName} ${user.lastName}`,
          role: user.role,
          credits: user.credits,
          status: user.status,
          banned: user.banned,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })),
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: totalPages,
        },
      };
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<Object>} Created user data
   */
  async createUser(userData, adminInfo) {
    try {
      const user = new (require('../models/User'))(userData);
      await user.setPassword(userData.password);
      user.validate();

      const userId = await this.userRepository.create(user);

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo.id,
        adminEmail: adminInfo.email,
        action: 'CREATE_USER',
        targetType: 'user',
        targetId: userId,
        details: { email: user.email, role: user.role },
        ip: adminInfo.ip,
      });

      // Fetch the created user
      const createdUser = await this.userRepository.findById(userId);

      return {
        id: createdUser.id,
        email: createdUser.email,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        role: createdUser.role,
        credits: createdUser.credits,
        status: createdUser.status,
        banned: createdUser.banned,
        createdAt: createdUser.createdAt,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Get user by ID for admin
   * @param {number} userId - User ID
   * @returns {Promise<Object>} User data
   */
  async getUserById(userId) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        const NotFoundError = require('../utils/errors/NotFoundError');
        throw new NotFoundError('User not found');
      }

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        credits: user.credits,
        status: user.status,
        banned: user.banned,
        bannedReason: user.bannedReason,
        bannedAt: user.bannedAt,
        theme: user.theme,
        bio: user.bio,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  /**
   * Update user credits
   * @param {number} userId - User ID
   * @param {number} credits - New credits amount
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<Object>} Updated user data
   */
  async updateUserCredits(userId, credits, adminInfo) {
    try {
      const user = await this.userRepository.updateCredits(userId, credits);
      if (!user) {
        const NotFoundError = require('../utils/errors/NotFoundError');
        throw new NotFoundError('User not found');
      }

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo.id,
        adminEmail: adminInfo.email,
        action: 'UPDATE_USER_CREDITS',
        targetType: 'user',
        targetId: userId,
        details: { newCredits: credits },
        ip: adminInfo.ip,
      });

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        credits: user.credits,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('Error updating user credits:', error);
      throw error;
    }
  }

  /**
   * Update user role
   * @param {number} userId - User ID
   * @param {string} role - New role
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<Object>} Updated user data
   */
  async updateUserRole(userId, role, adminInfo) {
    try {
      const user = await this.userRepository.updateRole(userId, role);
      if (!user) {
        const NotFoundError = require('../utils/errors/NotFoundError');
        throw new NotFoundError('User not found');
      }

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo.id,
        adminEmail: adminInfo.email,
        action: 'UPDATE_USER_ROLE',
        targetType: 'user',
        targetId: userId,
        details: { newRole: role },
        ip: adminInfo.ip,
      });

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        credits: user.credits,
        status: user.status,
        banned: user.banned,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  /**
   * Update user status
   * @param {number} userId - User ID
   * @param {string} status - New status
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<Object>} Updated user data
   */
  async updateUserStatus(userId, status, adminInfo) {
    try {
      const user = await this.userRepository.updateStatus(userId, status);
      if (!user) {
        const NotFoundError = require('../utils/errors/NotFoundError');
        throw new NotFoundError('User not found');
      }

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo.id,
        adminEmail: adminInfo.email,
        action: 'UPDATE_USER_STATUS',
        targetType: 'user',
        targetId: userId,
        details: { newStatus: status },
        ip: adminInfo.ip,
      });

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        credits: user.credits,
        status: user.status,
        banned: user.banned,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  /**
   * Ban or unban user
   * @param {number} userId - User ID
   * @param {boolean} banned - Ban status
   * @param {string} reason - Ban reason
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<Object>} Updated user data
   */
  async updateUserBanned(userId, banned, reason, adminInfo) {
    try {
      const user = await this.userRepository.updateBanned(
        userId,
        banned,
        reason
      );
      if (!user) {
        const NotFoundError = require('../utils/errors/NotFoundError');
        throw new NotFoundError('User not found');
      }

      // Prevent banning admin users
      if (banned && user.role === 'admin') {
        const ValidationError = require('../utils/errors/ValidationError');
        throw new ValidationError('Cannot ban admin users');
      }

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo.id,
        adminEmail: adminInfo.email,
        action: banned ? 'BAN_USER' : 'UNBAN_USER',
        targetType: 'user',
        targetId: userId,
        details: { banned, reason },
        ip: adminInfo.ip,
      });

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        credits: user.credits,
        status: user.status,
        banned: user.banned,
        bannedReason: user.bannedReason,
        bannedAt: user.bannedAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('Error updating user banned status:', error);
      throw error;
    }
  }

  /**
   * Delete user
   * @param {number} userId - User ID
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<boolean>} Success status
   */
  async deleteUser(userId, adminInfo) {
    try {
      // Check if user exists first
      const user = await this.userRepository.findById(userId);
      if (!user) {
        const NotFoundError = require('../utils/errors/NotFoundError');
        throw new NotFoundError('User not found');
      }

      // Prevent deleting admin users
      if (user.role === 'admin') {
        const ValidationError = require('../utils/errors/ValidationError');
        throw new ValidationError('Cannot delete admin users');
      }

      const success = await this.userRepository.delete(userId);

      if (success) {
        // Log admin action
        this.logAdminAction({
          adminId: adminInfo.id,
          adminEmail: adminInfo.email,
          action: 'DELETE_USER',
          targetType: 'user',
          targetId: userId,
          details: { deletedUserEmail: user.email, deletedUserRole: user.role },
          ip: adminInfo.ip,
        });
      }

      return success;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  /**
   * Bulk update user credits
   * @param {Array} updates - Array of update objects {userId, credits}
   * @returns {Promise<Array>} Array of update results
   */
  async bulkUpdateCredits(updates) {
    try {
      const results = [];

      for (const update of updates) {
        try {
          const user = await this.userRepository.updateCredits(
            update.userId,
            update.credits
          );
          if (user) {
            results.push({
              userId: update.userId,
              success: true,
              credits: user.credits,
            });
          } else {
            results.push({
              userId: update.userId,
              success: false,
              error: 'User not found',
            });
          }
        } catch (error) {
          results.push({
            userId: update.userId,
            success: false,
            error: error.message,
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Error bulk updating credits:', error);
      throw error;
    }
  }

  /**
   * Bulk update user roles
   * @param {Array} userIds - Array of user IDs
   * @param {string} role - New role for all users
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<Array>} Array of update results
   */
  async bulkUpdateRoles(userIds, role, adminInfo) {
    try {
      const results = [];

      for (const userId of userIds) {
        try {
          const user = await this.userRepository.updateRole(userId, role);
          if (user) {
            // Log admin action
            this.logAdminAction({
              adminId: adminInfo.id,
              adminEmail: adminInfo.email,
              action: 'BULK_UPDATE_USER_ROLE',
              targetType: 'user',
              targetId: userId,
              details: { newRole: role },
              ip: adminInfo.ip,
            });

            results.push({
              userId,
              success: true,
              role: user.role,
            });
          } else {
            results.push({
              userId,
              success: false,
              error: 'User not found',
            });
          }
        } catch (error) {
          results.push({
            userId,
            success: false,
            error: error.message,
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Error bulk updating roles:', error);
      throw error;
    }
  }

  /**
   * Get help content for admin management
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Help content data with pagination
   */
  async getHelpContent(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = (page - 1) * limit;

      const [articles, totalCount, categories] = await Promise.all([
        this.helpService.getArticles({
          limit,
          offset,
          category: options.category,
          search: options.search,
        }),
        this.helpService.countArticles({
          category: options.category,
          search: options.search,
        }),
        this.helpService.getCategories(),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        articles,
        categories,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: totalPages,
        },
      };
    } catch (error) {
      console.error('Error getting help content:', error);
      throw error;
    }
  }

  /**
   * Get learning content for admin management
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Learning content data with pagination
   */
  async getLearningContent(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = (page - 1) * limit;

      const [articles, totalCount, categories] = await Promise.all([
        this.learningService.getArticles({
          limit,
          offset,
          category: options.category,
          search: options.search,
        }),
        this.learningService.countArticles({
          category: options.category,
          search: options.search,
        }),
        this.learningService.getCategories(),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        articles,
        categories,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: totalPages,
        },
      };
    } catch (error) {
      console.error('Error getting learning content:', error);
      throw error;
    }
  }

  /**
   * Reset user password (admin function)
   * @param {number} userId - User ID
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<Object>} Reset result with new password
   */
  async resetUserPassword(userId, adminInfo) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        const NotFoundError = require('../utils/errors/NotFoundError');
        throw new NotFoundError('User not found');
      }

      // Generate a temporary password
      const tempPassword =
        Math.random().toString(36).slice(-12) +
        Math.random().toString(36).slice(-12);
      await user.setPassword(tempPassword);
      await this.userRepository.updatePassword(userId, user.passwordHash);

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo.id,
        adminEmail: adminInfo.email,
        action: 'RESET_USER_PASSWORD',
        targetType: 'user',
        targetId: userId,
        details: { resetByAdmin: true },
        ip: adminInfo.ip,
      });

      return {
        userId,
        email: user.email,
        tempPassword,
        message:
          'Password has been reset. The new temporary password is shown below.',
      };
    } catch (error) {
      console.error('Error resetting user password:', error);
      throw error;
    }
  }

  /**
   * Get recent admin activity
   * @param {number} limit - Number of activities to return
   * @returns {Promise<Array>} Recent activities
   */
  async getRecentActivity(limit = 10) {
    try {
      return await this.adminActivityRepository.getRecent(limit);
    } catch (error) {
      console.error('Error getting recent activity:', error);
      return [];
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
   * @returns {Promise<Object>} Created enterprise data
   */
  async createEnterprise(userId, enterpriseData) {
    try {
      const enterprise = await this.enterpriseService.createEnterprise(
        userId,
        enterpriseData
      );

      // Log admin action
      this.logAdminAction({
        adminId: this.currentAdmin?.id,
        adminEmail: this.currentAdmin?.email,
        action: 'CREATE_ENTERPRISE',
        targetType: 'enterprise',
        targetId: enterprise.id,
        details: { name: enterprise.name, industry: enterprise.industry },
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
   * @returns {Promise<Object>} Updated enterprise data
   */
  async updateEnterprise(enterpriseId, enterpriseData) {
    try {
      const enterprise = await this.enterpriseService.updateEnterprise(
        enterpriseId,
        enterpriseData
      );

      // Log admin action
      this.logAdminAction({
        adminId: this.currentAdmin?.id,
        adminEmail: this.currentAdmin?.email,
        action: 'UPDATE_ENTERPRISE',
        targetType: 'enterprise',
        targetId: enterprise.id,
        details: {
          name: enterprise.name,
          changes: Object.keys(enterpriseData),
        },
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
   * @returns {Promise<boolean>} Success status
   */
  async deleteEnterprise(enterpriseId) {
    try {
      const success =
        await this.enterpriseService.deleteEnterprise(enterpriseId);

      if (success) {
        // Log admin action
        this.logAdminAction({
          adminId: this.currentAdmin?.id,
          adminEmail: this.currentAdmin?.email,
          action: 'DELETE_ENTERPRISE',
          targetType: 'enterprise',
          targetId: enterpriseId,
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
   * @returns {Promise<number>} Number of updated enterprises
   */
  async bulkUpdateEnterpriseStatus(enterpriseIds, status) {
    try {
      const updatedCount = await this.enterpriseService.bulkUpdateStatus(
        enterpriseIds,
        status
      );

      // Log admin action
      this.logAdminAction({
        adminId: this.currentAdmin?.id,
        adminEmail: this.currentAdmin?.email,
        action: 'BULK_UPDATE_ENTERPRISE_STATUS',
        targetType: 'enterprise',
        details: { enterpriseIds, status, updatedCount },
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
   * @returns {Promise<number>} Number of deleted enterprises
   */
  async bulkDeleteEnterprises(enterpriseIds) {
    try {
      const deletedCount =
        await this.enterpriseService.bulkDelete(enterpriseIds);

      // Log admin action
      this.logAdminAction({
        adminId: this.currentAdmin?.id,
        adminEmail: this.currentAdmin?.email,
        action: 'BULK_DELETE_ENTERPRISES',
        targetType: 'enterprise',
        details: { enterpriseIds, deletedCount },
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
   * @returns {Promise<string>} CSV content
   */
  async exportEnterprisesToCSV(filters = {}) {
    try {
      const csvContent = await this.enterpriseService.exportToCSV(filters);

      // Log admin action
      this.logAdminAction({
        adminId: this.currentAdmin?.id,
        adminEmail: this.currentAdmin?.email,
        action: 'EXPORT_ENTERPRISES_CSV',
        targetType: 'enterprise',
        details: { filters },
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
   * @returns {Promise<Object>} Created corporate data
   */
  async createCorporate(userId, corporateData) {
    try {
      const corporate = await this.corporateService.createCorporate(
        userId,
        corporateData
      );

      // Log admin action
      this.logAdminAction({
        adminId: this.currentAdmin?.id,
        adminEmail: this.currentAdmin?.email,
        action: 'CREATE_CORPORATE',
        targetType: 'corporate',
        targetId: corporate.id,
        details: { name: corporate.name, industry: corporate.industry },
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
   * @returns {Promise<Object>} Updated corporate data
   */
  async updateCorporate(corporateId, corporateData) {
    try {
      const corporate = await this.corporateService.updateCorporate(
        corporateId,
        corporateData
      );

      // Log admin action
      this.logAdminAction({
        adminId: this.currentAdmin?.id,
        adminEmail: this.currentAdmin?.email,
        action: 'UPDATE_CORPORATE',
        targetType: 'corporate',
        targetId: corporate.id,
        details: {
          name: corporate.name,
          changes: Object.keys(corporateData),
        },
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
   * @returns {Promise<boolean>} Success status
   */
  async deleteCorporate(corporateId) {
    try {
      const success = await this.corporateService.deleteCorporate(corporateId);

      if (success) {
        // Log admin action
        this.logAdminAction({
          adminId: this.currentAdmin?.id,
          adminEmail: this.currentAdmin?.email,
          action: 'DELETE_CORPORATE',
          targetType: 'corporate',
          targetId: corporateId,
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
   * @returns {Promise<number>} Number of updated corporates
   */
  async bulkUpdateCorporateStatus(corporateIds, status) {
    try {
      const updatedCount = await this.corporateService.bulkUpdateStatus(
        corporateIds,
        status
      );

      // Log admin action
      this.logAdminAction({
        adminId: this.currentAdmin?.id,
        adminEmail: this.currentAdmin?.email,
        action: 'BULK_UPDATE_CORPORATE_STATUS',
        targetType: 'corporate',
        details: { corporateIds, status, updatedCount },
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
   * @returns {Promise<number>} Number of deleted corporates
   */
  async bulkDeleteCorporates(corporateIds) {
    try {
      const deletedCount = await this.corporateService.bulkDelete(corporateIds);

      // Log admin action
      this.logAdminAction({
        adminId: this.currentAdmin?.id,
        adminEmail: this.currentAdmin?.email,
        action: 'BULK_DELETE_CORPORATES',
        targetType: 'corporate',
        details: { corporateIds, deletedCount },
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
   * @returns {Promise<string>} CSV content
   */
  async exportCorporatesToCSV(filters = {}) {
    try {
      const csvContent = await this.corporateService.exportToCSV(filters);

      // Log admin action
      this.logAdminAction({
        adminId: this.currentAdmin?.id,
        adminEmail: this.currentAdmin?.email,
        action: 'EXPORT_CORPORATES_CSV',
        targetType: 'corporate',
        details: { filters },
      });

      return csvContent;
    } catch (error) {
      console.error('Error exporting corporates to CSV:', error);
      throw error;
    }
  }
}

module.exports = AdminService;
