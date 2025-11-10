/**
 * Admin service handling admin-specific business logic
 */
class AdminService {
  constructor(
    systemMonitoringService,
    userManagementService,
    contentManagementService,
    businessManagementService,
    projectManagementService,
    ideaService,
    voteService,
    landingPageService,
    packageRepository,
    billingRepository,
    rewardRepository,
    voteRepository,
    collaborationRepository
  ) {
    this.systemMonitoringService = systemMonitoringService;
    this.userManagementService = userManagementService;
    this.contentManagementService = contentManagementService;
    this.businessManagementService = businessManagementService;
    this.projectManagementService = projectManagementService;
    this.ideaService = ideaService;
    this.voteService = voteService;
    this.landingPageService = landingPageService;
    this.packageRepository = packageRepository;
    this.billingRepository = billingRepository;
    this.rewardRepository = rewardRepository;
    this.voteRepository = voteRepository;
    this.collaborationRepository = collaborationRepository;
  }

  // System Monitoring Methods
  async getDashboardStats() {
    return this.systemMonitoringService.getDashboardStats();
  }

  async getSystemStats() {
    return this.systemMonitoringService.getSystemStats();
  }

  async getRecentActivity(limit = 10) {
    return this.systemMonitoringService.getRecentActivity(limit);
  }

  // User Management Methods
  async getUsers(options = {}) {
    return this.userManagementService.getUsers(options);
  }

  async createUser(userData, adminInfo) {
    return this.userManagementService.createUser(userData, adminInfo);
  }

  async getUserById(userId) {
    return this.userManagementService.getUserById(userId);
  }

  async getUserByRowid(rowid) {
    return this.userManagementService.getUserByRowid(rowid);
  }

  async updateUserCredits(userId, credits, adminInfo) {
    return this.userManagementService.updateUserCredits(
      userId,
      credits,
      adminInfo
    );
  }

  async updateUserRole(userId, role, adminInfo) {
    return this.userManagementService.updateUserRole(userId, role, adminInfo);
  }

  async updateUserStatus(userId, status, adminInfo) {
    return this.userManagementService.updateUserStatus(
      userId,
      status,
      adminInfo
    );
  }

  async updateUserBanned(userId, banned, reason, adminInfo) {
    return this.userManagementService.updateUserBanned(
      userId,
      banned,
      reason,
      adminInfo
    );
  }

  async deleteUser(userId, adminInfo) {
    return this.userManagementService.deleteUser(userId, adminInfo);
  }

  async bulkUpdateCredits(updates) {
    return this.userManagementService.bulkUpdateCredits(updates);
  }

  async bulkUpdateRoles(userIds, role, adminInfo) {
    return this.userManagementService.bulkUpdateRoles(userIds, role, adminInfo);
  }

  async resetUserPassword(userId, adminInfo) {
    return this.userManagementService.resetUserPassword(userId, adminInfo);
  }

  // Content Management Methods
  async getHelpContent(options = {}) {
    return this.contentManagementService.getHelpContent(options);
  }

  async getLearningContent(options = {}) {
    return this.contentManagementService.getLearningContent(options);
  }

  // Business Management Methods
  async getStartups(options = {}) {
    return this.businessManagementService.getStartups(options);
  }

  async getStartupById(startupId) {
    return this.businessManagementService.getStartupById(startupId);
  }

  async createStartup(startupData, adminInfo) {
    return this.businessManagementService.createStartup(startupData, adminInfo);
  }

  async updateStartup(startupId, startupData, adminInfo) {
    return this.businessManagementService.updateStartup(
      startupId,
      startupData,
      adminInfo
    );
  }

  async deleteStartup(startupId, adminInfo) {
    return this.businessManagementService.deleteStartup(startupId, adminInfo);
  }

  async getEnterprises(options = {}) {
    return this.businessManagementService.getEnterprises(options);
  }

  async getEnterpriseById(enterpriseId) {
    return this.businessManagementService.getEnterpriseById(enterpriseId);
  }

  async createEnterprise(userId, enterpriseData) {
    return this.businessManagementService.createEnterprise(
      userId,
      enterpriseData
    );
  }

  async updateEnterprise(enterpriseId, enterpriseData) {
    return this.businessManagementService.updateEnterprise(
      enterpriseId,
      enterpriseData
    );
  }

  async deleteEnterprise(enterpriseId) {
    return this.businessManagementService.deleteEnterprise(enterpriseId);
  }

  async bulkUpdateEnterpriseStatus(enterpriseIds, status) {
    return this.businessManagementService.bulkUpdateEnterpriseStatus(
      enterpriseIds,
      status
    );
  }

  async bulkDeleteEnterprises(enterpriseIds) {
    return this.businessManagementService.bulkDeleteEnterprises(enterpriseIds);
  }

  async exportEnterprisesToCSV(filters = {}) {
    return this.businessManagementService.exportEnterprisesToCSV(filters);
  }

  async getCorporates(options = {}) {
    return this.businessManagementService.getCorporates(options);
  }

  async getCorporateById(corporateId) {
    return this.businessManagementService.getCorporateById(corporateId);
  }

  async createCorporate(userId, corporateData) {
    return this.businessManagementService.createCorporate(
      userId,
      corporateData
    );
  }

  async updateCorporate(corporateId, corporateData) {
    return this.businessManagementService.updateCorporate(
      corporateId,
      corporateData
    );
  }

  async deleteCorporate(corporateId) {
    return this.businessManagementService.deleteCorporate(corporateId);
  }

  async bulkUpdateCorporateStatus(corporateIds, status) {
    return this.businessManagementService.bulkUpdateCorporateStatus(
      corporateIds,
      status
    );
  }

  async bulkDeleteCorporates(corporateIds) {
    return this.businessManagementService.bulkDeleteCorporates(corporateIds);
  }

  async exportCorporatesToCSV(filters = {}) {
    return this.businessManagementService.exportCorporatesToCSV(filters);
  }

  // Project Management Methods
  async getProjects(options = {}) {
    return this.projectManagementService.getProjects(options);
  }

  async getProjectById(projectId) {
    return this.projectManagementService.getProjectById(projectId);
  }

  async updateProjectStatus(projectId, status, adminInfo) {
    return this.projectManagementService.updateProjectStatus(
      projectId,
      status,
      adminInfo
    );
  }

  async deleteProject(projectId, adminInfo) {
    return this.projectManagementService.deleteProject(projectId, adminInfo);
  }

  async removeUserFromProject(projectId, userId, adminInfo) {
    return this.projectManagementService.removeUserFromProject(
      projectId,
      userId,
      adminInfo
    );
  }

  async getCollaborationStats() {
    return this.projectManagementService.getCollaborationStats();
  }

  // Package Management Methods
  async getPackages(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = (page - 1) * limit;

      const [packages, totalCount] = await Promise.all([
        this.packageRepository.findAll({
          limit,
          offset,
          orderBy: 'created_at DESC',
        }),
        this.packageRepository.count(),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        packages: packages.map((pkg) => ({
          id: pkg.id,
          name: pkg.name,
          description: pkg.description,
          price: pkg.price,
          credits: pkg.credits,
          status: pkg.status,
          sortOrder: pkg.sort_order,
          isPopular: pkg.is_popular,
          isRecommended: pkg.is_recommended,
          createdAt: pkg.created_at,
          updatedAt: pkg.updated_at,
        })),
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: totalPages,
          hasPrev: page > 1,
          hasNext: page < totalPages,
        },
      };
    } catch (error) {
      console.error('Error getting packages:', error);
      throw error;
    }
  }

  async getPackageById(packageId) {
    return this.businessManagementService.getPackageById(packageId);
  }

  async createPackage(packageData, adminInfo) {
    return this.businessManagementService.createPackage(packageData, adminInfo);
  }

  async updatePackage(packageId, packageData, adminInfo) {
    return this.businessManagementService.updatePackage(
      packageId,
      packageData,
      adminInfo
    );
  }

  async deletePackage(packageId, adminInfo) {
    return this.businessManagementService.deletePackage(packageId, adminInfo);
  }

  // Billing Management Methods
  async getBillingTransactions(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = (page - 1) * limit;

      const [transactions, totalCount] = await Promise.all([
        this.billingRepository.findAll({
          limit,
          offset,
          orderBy: 'created_at DESC',
        }),
        this.billingRepository.count(),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        transactions: transactions.map((transaction) => ({
          id: transaction.id,
          userId: transaction.user_id,
          transactionId: transaction.transaction_id,
          amount: transaction.amount,
          currency: transaction.currency,
          status: transaction.status,
          paymentMethod: transaction.payment_method,
          description: transaction.description,
          refundAmount: transaction.refund_amount,
          refundReason: transaction.refund_reason,
          processedAt: transaction.processed_at,
          createdAt: transaction.created_at,
          updatedAt: transaction.updated_at,
        })),
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: totalPages,
          hasPrev: page > 1,
          hasNext: page < totalPages,
        },
      };
    } catch (error) {
      console.error('Error getting billing transactions:', error);
      throw error;
    }
  }

  async getBillingTransactionById(billingId) {
    return this.businessManagementService.getBillingTransactionById(billingId);
  }

  async createBillingTransaction(billingData, adminInfo) {
    return this.businessManagementService.createBillingTransaction(
      billingData,
      adminInfo
    );
  }

  async updateBillingTransactionStatus(billingId, status, adminInfo) {
    return this.businessManagementService.updateBillingTransactionStatus(
      billingId,
      status,
      adminInfo
    );
  }

  async processRefund(billingId, refundAmount, refundReason, adminInfo) {
    return this.businessManagementService.processRefund(
      billingId,
      refundAmount,
      refundReason,
      adminInfo
    );
  }

  // Reward Management Methods
  async getRewards(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = (page - 1) * limit;

      const [rewards, totalCount, stats] = await Promise.all([
        this.rewardRepository.findAll({
          limit,
          offset,
          orderBy: 'created_at DESC',
        }),
        this.rewardRepository.count(),
        this.rewardRepository.getStats(),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        rewards: rewards.map((reward) => ({
          id: reward.id,
          userId: reward.user_id,
          type: reward.type,
          title: reward.title,
          description: reward.description,
          credits: reward.credits,
          status: reward.status,
          expiresAt: reward.expires_at,
          createdAt: reward.created_at,
          updatedAt: reward.updated_at,
        })),
        stats: {
          totalRewards: stats.total_rewards,
          activeRewards: stats.active_rewards,
          usedRewards: stats.used_rewards,
          expiredRewards: stats.expired_rewards,
          totalCreditsGranted: stats.total_credits_granted,
          avgCreditsPerReward: Math.round(stats.avg_credits_per_reward || 0),
          uniqueUsersRewarded: stats.unique_users_rewarded,
        },
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: totalPages,
          hasPrev: page > 1,
          hasNext: page < totalPages,
        },
      };
    } catch (error) {
      console.error('Error getting rewards:', error);
      throw error;
    }
  }

  async getRewardById(rewardId) {
    return this.businessManagementService.getRewardById(rewardId);
  }

  async createReward(rewardData, adminInfo) {
    return this.businessManagementService.createReward(rewardData, adminInfo);
  }

  async updateReward(rewardId, rewardData, adminInfo) {
    return this.businessManagementService.updateReward(
      rewardId,
      rewardData,
      adminInfo
    );
  }

  async deleteReward(rewardId, adminInfo) {
    return this.businessManagementService.deleteReward(rewardId, adminInfo);
  }

  async grantRewardToUser(userId, type, title, credits, adminInfo) {
    return this.businessManagementService.grantRewardToUser(
      userId,
      type,
      title,
      credits,
      adminInfo
    );
  }

  // Idea Management Methods
  async getIdeas(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = (page - 1) * limit;
      const search = options.search;
      const sortBy = options.sortBy || 'created_at';
      const sortOrder = options.sortOrder || 'desc';

      // Construct orderBy clause
      const orderBy = `${sortBy} ${sortOrder.toUpperCase()}`;

      const queryOptions = {
        limit,
        offset,
        search,
        orderBy,
      };

      const [ideas, totalCount] = await Promise.all([
        this.ideaService.getAllIdeas(null, queryOptions),
        this.ideaService.getIdeasCount({ search }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        ideas: ideas.map((idea) => ({
          id: idea.id,
          title: idea.title,
          href: idea.href,
          description: idea.description,
          type: idea.type,
          rating: idea.rating,
          isFavorite: idea.isFavorite,
          userId: idea.userId,
          createdAt: idea.createdAt,
          updatedAt: idea.updatedAt,
        })),
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: totalPages,
          hasPrev: page > 1,
          hasNext: page < totalPages,
        },
      };
    } catch (error) {
      console.error('Error getting ideas:', error);
      throw error;
    }
  }

  async getVotes(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = (page - 1) * limit;

      const [votes, totalCount] = await Promise.all([
        this.voteRepository.findAll({
          limit,
          offset,
          orderBy: 'timestamp DESC',
        }),
        this.voteRepository.count(),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        votes: votes.map((vote) => ({
          id: vote.id,
          userId: vote.user_id,
          ideaSlug: vote.idea_slug,
          marketViability: vote.market_viability,
          realWorldProblem: vote.real_world_problem,
          innovation: vote.innovation,
          technicalFeasibility: vote.technical_feasibility,
          scalability: vote.scalability,
          marketSurvival: vote.market_survival,
          createdAt: vote.timestamp,
        })),
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: totalPages,
          hasPrev: page > 1,
          hasNext: page < totalPages,
        },
      };
    } catch (error) {
      console.error('Error getting votes:', error);
      throw error;
    }
  }

  async getCollaborations(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = (page - 1) * limit;
      const search = options.search || '';
      const sortBy = options.sortBy || 'timestamp';
      const sortOrder = options.sortOrder || 'desc';

      // Build where clause for search (search in message or project title)
      let whereClause = '';
      const params = [];

      if (search) {
        whereClause = `WHERE (c.message LIKE ? OR p.title LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
      }

      // Get total count with join
      const countSql = `
        SELECT COUNT(*) as count
        FROM collaborations c
        LEFT JOIN projects p ON c.project_id = p.id
        ${whereClause}
      `;
      const countResult = await this.collaborationRepository.queryOne(
        countSql,
        params
      );
      const totalCount = countResult.count;

      // Get collaborations with sorting and pagination
      let orderBy = 'c.timestamp DESC';
      if (sortBy === 'message') {
        orderBy = `c.message ${sortOrder.toUpperCase()}`;
      } else if (sortBy === 'timestamp') {
        orderBy = `c.timestamp ${sortOrder.toUpperCase()}`;
      } else if (sortBy === 'project') {
        orderBy = `p.title ${sortOrder.toUpperCase()}`;
      }

      const sql = `
        SELECT c.*, p.title as project_title
        FROM collaborations c
        LEFT JOIN projects p ON c.project_id = p.id
        ${whereClause}
        ORDER BY ${orderBy}
        LIMIT ? OFFSET ?
      `;
      params.push(limit, offset);

      const rows = await this.collaborationRepository.query(sql, params);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        collaborations: rows.map((row) => ({
          id: row.id,
          projectId: row.project_id,
          projectTitle: row.project_title,
          userId: row.user_id,
          message: row.message,
          timestamp: row.timestamp,
        })),
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: totalPages,
          hasPrev: page > 1,
          hasNext: page < totalPages,
        },
        filters: {
          search,
          sortBy,
          sortOrder,
        },
      };
    } catch (error) {
      console.error('Error getting collaborations:', error);
      throw error;
    }
  }

  async getIdeaById(ideaId) {
    return this.businessManagementService.getIdeaById(ideaId);
  }

  async updateIdea(ideaId, ideaData, adminInfo) {
    return this.businessManagementService.updateIdea(
      ideaId,
      ideaData,
      adminInfo
    );
  }

  async deleteIdea(ideaId, adminInfo) {
    return this.businessManagementService.deleteIdea(ideaId, adminInfo);
  }

  // Landing Page Management Methods
  async getLandingPageSections(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;

      const result = await this.landingPageService.getAllSections({
        page,
        limit,
      });

      return {
        sections: result.sections,
        pagination: {
          ...result.pagination,
          hasPrev: result.pagination.page > 1,
          hasNext: result.pagination.page < result.pagination.pages,
        },
      };
    } catch (error) {
      console.error('Error getting landing page sections:', error);
      throw error;
    }
  }

  async getLandingPageSectionById(id) {
    return this.contentManagementService.getLandingPageSectionById(id);
  }

  async createLandingPageSection(sectionData, adminInfo) {
    return this.contentManagementService.createLandingPageSection(
      sectionData,
      adminInfo
    );
  }

  async updateLandingPageSection(id, sectionData, adminInfo) {
    return this.contentManagementService.updateLandingPageSection(
      id,
      sectionData,
      adminInfo
    );
  }

  async deleteLandingPageSection(id, adminInfo) {
    return this.contentManagementService.deleteLandingPageSection(
      id,
      adminInfo
    );
  }

  async toggleLandingPageSectionStatus(id, adminInfo) {
    return this.contentManagementService.toggleLandingPageSectionStatus(
      id,
      adminInfo
    );
  }

  async updateLandingPageSectionOrder(id, order, adminInfo) {
    return this.contentManagementService.updateLandingPageSectionOrder(
      id,
      order,
      adminInfo
    );
  }

  getLandingPageSectionTypes() {
    return this.landingPageService.getSectionTypes();
  }
}

module.exports = AdminService;
