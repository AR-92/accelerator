/**
 * Admin service handling admin-specific business logic
 */
class AdminService {
  constructor(
    systemMonitoringService,
    userManagementService,
    contentManagementService,
    projectManagementService,
    ideaService,
    voteService,
    landingPageService,
    organizationService,
    packageRepository,
    billingRepository,
    rewardRepository,
    transactionRepository,
    paymentMethodRepository,
    aiModelRepository,
    aiWorkflowRepository,
    workflowStepRepository,
    voteRepository,
    collaborationRepository,
    projectCollaboratorRepository,
    db
  ) {
    this.systemMonitoringService = systemMonitoringService;
    this.userManagementService = userManagementService;
    this.contentManagementService = contentManagementService;
    this.projectManagementService = projectManagementService;
    this.ideaService = ideaService;
    this.voteService = voteService;
    this.landingPageService = landingPageService;
    this.organizationService = organizationService;
    this.packageRepository = packageRepository;
    this.billingRepository = billingRepository;
    this.rewardRepository = rewardRepository;
    this.transactionRepository = transactionRepository;
    this.paymentMethodRepository = paymentMethodRepository;
    this.aiModelRepository = aiModelRepository;
    this.aiWorkflowRepository = aiWorkflowRepository;
    this.workflowStepRepository = workflowStepRepository;
    this.voteRepository = voteRepository;
    this.collaborationRepository = collaborationRepository;
    this.projectCollaboratorRepository = projectCollaboratorRepository;
    this.db = db;
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
          orderBy: 'awarded_at DESC',
        }),
        this.rewardRepository.count(),
        this.rewardRepository.getStats(),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        rewards: rewards.map((reward) => ({
          id: reward.id,
          giverUserId: reward.giver_user_id,
          recipientUserId: reward.recipient_user_id,
          projectId: reward.project_id,
          credits: reward.credits,
          reason: reward.reason,
          transactionId: reward.transaction_id,
          awardedAt: reward.awarded_at,
        })),
        stats: {
          totalRewards: stats.total_rewards,
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

  async getRewardById(rewardId) {}

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

  // Organization Management Methods
  async getAllOrganizations() {
    return this.organizationService.getAllOrganizations();
  }

  async getOrganizationById(id) {
    return this.organizationService.getOrganizationById(id);
  }

  async getOrganizationStats() {
    return this.organizationService.getOrganizationStats();
  }

  async createOrganization(organizationData, adminInfo) {
    return this.organizationService.createOrganization(
      organizationData,
      adminInfo
    );
  }

  async updateOrganization(id, organizationData, adminInfo) {
    return this.organizationService.updateOrganization(
      id,
      organizationData,
      adminInfo
    );
  }

  async deleteOrganization(id, adminInfo) {
    return this.organizationService.deleteOrganization(id, adminInfo);
  }

  async getOrganizations(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = (page - 1) * limit;
      const search = options.search || '';
      const type = options.type || null;

      const [organizations, totalCount] = await Promise.all([
        this.organizationService.getOrganizations({
          limit,
          offset,
          search,
          type,
          orderBy: 'created_at DESC',
        }),
        this.organizationService.getOrganizationCount({ search, type }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        organizations,
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
          type,
        },
      };
    } catch (error) {
      console.error('Error getting organizations:', error);
      throw error;
    }
  }

  async bulkUpdateOrganizationStatus(organizationIds, status, adminInfo) {
    return this.organizationService.bulkUpdateStatus(
      organizationIds,
      status,
      adminInfo
    );
  }

  async bulkDeleteOrganizations(organizationIds, adminInfo) {
    return this.organizationService.bulkDelete(organizationIds, adminInfo);
  }

  async exportOrganizationsToCSV(filters = {}) {
    return this.organizationService.exportToCSV(filters);
  }

  // AI Model Management Methods
  async getAllAIModels() {
    return this.aiModelRepository.getAll();
  }

  async getAIModelStats() {
    return this.aiModelRepository.getUsageStats();
  }

  // AI Workflow Management Methods
  async getAllAIWorkflows() {
    return this.aiWorkflowRepository.getAll();
  }

  async getAIWorkflowById(id) {
    return this.aiWorkflowRepository.getById(id);
  }

  async getWorkflowExecutions(workflowId) {
    return this.workflowStepRepository.getByModelId(
      (await this.aiWorkflowRepository.getById(workflowId)).model_id
    );
  }

  async getWorkflowOutputs(workflowId) {
    // This would need implementation in the repository
    return [];
  }

  async getWorkflowFeedback(workflowId) {
    // This would need implementation in the repository
    return [];
  }

  async getAIWorkflowStats() {
    return this.aiWorkflowRepository.getStats();
  }

  async createAIWorkflow(workflowData, adminInfo) {
    return this.aiWorkflowRepository.create(workflowData, adminInfo);
  }

  async updateAIWorkflow(id, workflowData, adminInfo) {
    return this.aiWorkflowRepository.update(id, workflowData, adminInfo);
  }

  async deleteAIWorkflow(id, adminInfo) {
    return this.aiWorkflowRepository.delete(id, adminInfo);
  }

  async getAIWorkflows(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = (page - 1) * limit;
      const search = options.search || '';
      const modelId = options.modelId || null;

      const [workflows, totalCount] = await Promise.all([
        this.aiWorkflowRepository.findAll({
          limit,
          offset,
          search,
          modelId,
          orderBy: 'created_at DESC',
        }),
        this.aiWorkflowRepository.count({ search, modelId }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        workflows,
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
          modelId,
        },
      };
    } catch (error) {
      console.error('Error getting AI workflows:', error);
      throw error;
    }
  }

  async getWorkflowExecutionById(executionId) {
    return this.workflowStepRepository.getExecutionById(executionId);
  }

  async getWorkflowExecutionsByWorkflow(workflowId, options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = (page - 1) * limit;

      const [executions, totalCount] = await Promise.all([
        this.workflowStepRepository.getExecutionsByWorkflow(workflowId, {
          limit,
          offset,
          orderBy: 'created_at DESC',
        }),
        this.workflowStepRepository.countExecutionsByWorkflow(workflowId),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        executions,
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
      console.error('Error getting workflow executions:', error);
      throw error;
    }
  }

  async createWorkflowExecution(executionData, adminInfo) {
    return this.workflowStepRepository.createExecution(
      executionData,
      adminInfo
    );
  }

  async updateWorkflowExecutionStatus(executionId, status, adminInfo) {
    return this.workflowStepRepository.updateExecutionStatus(
      executionId,
      status,
      adminInfo
    );
  }

  async getWorkflowOutputsByExecution(executionId) {
    return this.workflowStepRepository.getOutputsByExecution(executionId);
  }

  async getWorkflowFeedbackByExecution(executionId) {
    return this.workflowStepRepository.getFeedbackByExecution(executionId);
  }

  async createAIModel(modelData, adminInfo) {
    return this.aiModelRepository.create(modelData, adminInfo);
  }

  async updateAIModel(id, modelData, adminInfo) {
    return this.aiModelRepository.update(id, modelData, adminInfo);
  }

  async deleteAIModel(id, adminInfo) {
    return this.aiModelRepository.delete(id, adminInfo);
  }

  async getAIModelById(id) {
    return this.aiModelRepository.getById(id);
  }

  async getAIModels(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = (page - 1) * limit;
      const search = options.search || '';

      const [models, totalCount] = await Promise.all([
        this.aiModelRepository.findAll({
          limit,
          offset,
          search,
          orderBy: 'created_at DESC',
        }),
        this.aiModelRepository.count({ search }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        models,
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
        },
      };
    } catch (error) {
      console.error('Error getting AI models:', error);
      throw error;
    }
  }

  // Workflow Steps Management
  async getAllWorkflowSteps() {
    return this.workflowStepRepository.getAllWithModels();
  }

  // Credit and Transaction Management Methods
  async getAllTransactions() {
    return this.transactionRepository.getAll();
  }

  async getTransactionStats() {
    return this.transactionRepository.getStats();
  }

  async getAllPaymentMethods() {
    return this.paymentMethodRepository.getAll();
  }

  async getPaymentMethodStats() {
    return this.paymentMethodRepository.getStats();
  }

  async getCreditStats() {
    const [transactionStats, paymentMethodStats] = await Promise.all([
      this.transactionRepository.getStats(),
      this.paymentMethodRepository.getStats(),
    ]);

    return {
      ...transactionStats,
      ...paymentMethodStats,
    };
  }

  async getTransactions(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = (page - 1) * limit;
      const search = options.search || '';
      const type = options.type || null;
      const status = options.status || null;
      const userId = options.userId || null;

      const [transactions, totalCount] = await Promise.all([
        this.transactionRepository.findAll({
          limit,
          offset,
          search,
          type,
          status,
          userId,
          orderBy: 'created_at DESC',
        }),
        this.transactionRepository.count({ search, type, status, userId }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        transactions,
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
          type,
          status,
          userId,
        },
      };
    } catch (error) {
      console.error('Error getting transactions:', error);
      throw error;
    }
  }

  async getTransactionById(id) {
    return this.transactionRepository.getById(id);
  }

  async createTransaction(transactionData, adminInfo) {
    return this.transactionRepository.create(transactionData, adminInfo);
  }

  async updateTransaction(id, transactionData, adminInfo) {
    return this.transactionRepository.update(id, transactionData, adminInfo);
  }

  async deleteTransaction(id, adminInfo) {
    return this.transactionRepository.delete(id, adminInfo);
  }

  async getPaymentMethods(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = (page - 1) * limit;
      const search = options.search || '';
      const type = options.type || null;
      const status = options.status || null;

      const [paymentMethods, totalCount] = await Promise.all([
        this.paymentMethodRepository.findAll({
          limit,
          offset,
          search,
          type,
          status,
          orderBy: 'created_at DESC',
        }),
        this.paymentMethodRepository.count({ search, type, status }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        paymentMethods,
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
          type,
          status,
        },
      };
    } catch (error) {
      console.error('Error getting payment methods:', error);
      throw error;
    }
  }

  async getPaymentMethodById(id) {
    return this.paymentMethodRepository.getById(id);
  }

  async createPaymentMethod(paymentMethodData, adminInfo) {
    return this.paymentMethodRepository.create(paymentMethodData, adminInfo);
  }

  async updatePaymentMethod(id, paymentMethodData, adminInfo) {
    return this.paymentMethodRepository.update(
      id,
      paymentMethodData,
      adminInfo
    );
  }

  async deletePaymentMethod(id, adminInfo) {
    return this.paymentMethodRepository.delete(id, adminInfo);
  }

  async allocateCreditsToUser(userId, amount, reason, adminInfo) {
    return this.transactionRepository.allocateCredits(
      userId,
      amount,
      reason,
      adminInfo
    );
  }

  async deductCreditsFromUser(userId, amount, reason, adminInfo) {
    return this.transactionRepository.deductCredits(
      userId,
      amount,
      reason,
      adminInfo
    );
  }

  async getUserCreditHistory(userId, options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = (page - 1) * limit;

      const [transactions, totalCount] = await Promise.all([
        this.transactionRepository.getUserCreditHistory(userId, {
          limit,
          offset,
          orderBy: 'created_at DESC',
        }),
        this.transactionRepository.countUserTransactions(userId),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        transactions,
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
      console.error('Error getting user credit history:', error);
      throw error;
    }
  }

  async getCreditBalance(userId) {
    return this.transactionRepository.getUserCreditBalance(userId);
  }

  async processBulkCreditAllocation(allocations, adminInfo) {
    return this.transactionRepository.bulkAllocateCredits(
      allocations,
      adminInfo
    );
  }

  // Projects SCRUD methods
  async getProjects(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = options.offset || 0;
      const search = options.search;
      const sortBy = options.sortBy || 'created_at';
      const sortOrder = options.sortOrder || 'desc';

      let whereClause = 'WHERE p.deleted_at IS NULL';
      let params = [];
      let paramIndex = 1;

      if (search) {
        whereClause += ` AND (p.title ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
      }

      const orderClause = `ORDER BY p.${sortBy} ${sortOrder.toUpperCase()}`;

      const countQuery = `
        SELECT COUNT(*) as total
        FROM projects p
        ${whereClause}
      `;

      const dataQuery = `
        SELECT
          p.*,
          u.name as owner_name,
          u.email as owner_email,
          o.name as organization_name
        FROM projects p
        LEFT JOIN users u ON p.owner_user_id = u.id
        LEFT JOIN organizations o ON p.organization_id = o.id
        ${whereClause}
        ${orderClause}
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      params.push(limit, offset);

      const [countResult, dataResult] = await Promise.all([
        this.db.query(countQuery, params.slice(0, paramIndex - 2)),
        this.db.query(dataQuery, params),
      ]);

      const total = parseInt(countResult.rows[0].total);
      const totalPages = Math.ceil(total / limit);

      return {
        projects: dataResult.rows,
        pagination: {
          page,
          limit,
          total,
          pages: totalPages,
          hasPrev: page > 1,
          hasNext: page < totalPages,
        },
      };
    } catch (error) {
      console.error('Error getting projects:', error);
      throw error;
    }
  }

  async getProject(id) {
    try {
      const query = `
        SELECT
          p.*,
          u.name as owner_name,
          u.email as owner_email,
          o.name as organization_name
        FROM projects p
        LEFT JOIN users u ON p.owner_user_id = u.id
        LEFT JOIN organizations o ON p.organization_id = o.id
        WHERE p.id = $1 AND p.deleted_at IS NULL
      `;
      const result = await this.db.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting project:', error);
      throw error;
    }
  }

  async createProject(projectData, adminInfo) {
    try {
      const query = `
        INSERT INTO projects (
          owner_user_id, organization_id, title, description, visibility, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `;
      const values = [
        projectData.ownerUserId || projectData.owner_user_id,
        projectData.organizationId || projectData.organization_id,
        projectData.title,
        projectData.description,
        projectData.visibility || 'private',
      ];
      const result = await this.db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  async updateProject(id, projectData, adminInfo) {
    try {
      const query = `
        UPDATE projects
        SET
          owner_user_id = $1,
          organization_id = $2,
          title = $3,
          description = $4,
          visibility = $5,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $6 AND deleted_at IS NULL
        RETURNING *
      `;
      const values = [
        projectData.ownerUserId || projectData.owner_user_id,
        projectData.organizationId || projectData.organization_id,
        projectData.title,
        projectData.description,
        projectData.visibility,
        id,
      ];
      const result = await this.db.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  async deleteProject(id, adminInfo) {
    try {
      const query = `
        UPDATE projects
        SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND deleted_at IS NULL
      `;
      const result = await this.db.query(query, [id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  // Project Collaborators SCRUD methods
  async getProjectCollaborators(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = options.offset || 0;
      const search = options.search;
      const sortBy = options.sortBy || 'joined_at';
      const sortOrder = options.sortOrder || 'desc';

      let whereClause = '';
      let params = [];
      let paramIndex = 1;

      if (search) {
        whereClause += ` AND (u.name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex} OR p.title ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
      }

      const orderClause = `ORDER BY pc.${sortBy} ${sortOrder.toUpperCase()}`;

      const countQuery = `
        SELECT COUNT(*) as total
        FROM project_collaborators pc
        JOIN users u ON pc.user_id = u.id
        JOIN projects p ON pc.project_id = p.id
        WHERE p.deleted_at IS NULL AND u.deleted_at IS NULL ${whereClause}
      `;

      const dataQuery = `
        SELECT
          pc.*,
          u.name as user_name,
          u.email as user_email,
          p.title as project_title
        FROM project_collaborators pc
        JOIN users u ON pc.user_id = u.id
        JOIN projects p ON pc.project_id = p.id
        WHERE p.deleted_at IS NULL AND u.deleted_at IS NULL ${whereClause}
        ${orderClause}
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      params.push(limit, offset);

      const [countResult, dataResult] = await Promise.all([
        this.db.query(countQuery, params.slice(0, paramIndex - 2)),
        this.db.query(dataQuery, params),
      ]);

      const total = parseInt(countResult.rows[0].total);
      const totalPages = Math.ceil(total / limit);

      return {
        collaborators: dataResult.rows,
        pagination: {
          page,
          limit,
          total,
          pages: totalPages,
          hasPrev: page > 1,
          hasNext: page < totalPages,
        },
      };
    } catch (error) {
      console.error('Error getting project collaborators:', error);
      throw error;
    }
  }

  async createProjectCollaborator(collaboratorData, adminInfo) {
    try {
      const query = `
        INSERT INTO project_collaborators (
          project_id, user_id, role, joined_at
        ) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
        RETURNING *
      `;
      const values = [
        collaboratorData.projectId || collaboratorData.project_id,
        collaboratorData.userId || collaboratorData.user_id,
        collaboratorData.role || 'member',
      ];
      const result = await this.db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating project collaborator:', error);
      throw error;
    }
  }

  async updateProjectCollaborator(id, collaboratorData, adminInfo) {
    try {
      const query = `
        UPDATE project_collaborators
        SET
          project_id = $1,
          user_id = $2,
          role = $3
        WHERE id = $4
        RETURNING *
      `;
      const values = [
        collaboratorData.projectId || collaboratorData.project_id,
        collaboratorData.userId || collaboratorData.user_id,
        collaboratorData.role,
        id,
      ];
      const result = await this.db.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error updating project collaborator:', error);
      throw error;
    }
  }

  async deleteProjectCollaborator(id, adminInfo) {
    try {
      const query = 'DELETE FROM project_collaborators WHERE id = $1';
      const result = await this.db.query(query, [id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error deleting project collaborator:', error);
      throw error;
    }
  }

  // Tasks SCRUD methods
  async getTasks(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = options.offset || 0;
      const search = options.search;
      const sortBy = options.sortBy || 'created_at';
      const sortOrder = options.sortOrder || 'desc';

      let whereClause = '';
      let params = [];
      let paramIndex = 1;

      if (search) {
        whereClause += ` AND (t.title ILIKE $${paramIndex} OR t.description ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
      }

      const orderClause = `ORDER BY t.${sortBy} ${sortOrder.toUpperCase()}`;

      const countQuery = `
        SELECT COUNT(*) as total
        FROM tasks t
        JOIN projects p ON t.project_id = p.id
        WHERE p.deleted_at IS NULL ${whereClause}
      `;

      const dataQuery = `
        SELECT
          t.*,
          p.title as project_title,
          u.name as assignee_name
        FROM tasks t
        JOIN projects p ON t.project_id = p.id
        LEFT JOIN users u ON t.assignee_user_id = u.id
        WHERE p.deleted_at IS NULL ${whereClause}
        ${orderClause}
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      params.push(limit, offset);

      const [countResult, dataResult] = await Promise.all([
        this.db.query(countQuery, params.slice(0, paramIndex - 2)),
        this.db.query(dataQuery, params),
      ]);

      const total = parseInt(countResult.rows[0].total);
      const totalPages = Math.ceil(total / limit);

      return {
        tasks: dataResult.rows,
        pagination: {
          page,
          limit,
          total,
          pages: totalPages,
          hasPrev: page > 1,
          hasNext: page < totalPages,
        },
      };
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw error;
    }
  }

  async createTask(taskData, adminInfo) {
    try {
      const query = `
        INSERT INTO tasks (
          project_id, title, description, assignee_user_id, status, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `;
      const values = [
        taskData.projectId || taskData.project_id,
        taskData.title,
        taskData.description,
        taskData.assigneeUserId || taskData.assignee_user_id,
        taskData.status || 'todo',
      ];
      const result = await this.db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async updateTask(id, taskData, adminInfo) {
    try {
      const query = `
        UPDATE tasks
        SET
          project_id = $1,
          title = $2,
          description = $3,
          assignee_user_id = $4,
          status = $5,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $6
        RETURNING *
      `;
      const values = [
        taskData.projectId || taskData.project_id,
        taskData.title,
        taskData.description,
        taskData.assigneeUserId || taskData.assignee_user_id,
        taskData.status,
        id,
      ];
      const result = await this.db.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async deleteTask(id, adminInfo) {
    try {
      const query = 'DELETE FROM tasks WHERE id = $1';
      const result = await this.db.query(query, [id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  // Messages SCRUD methods
  async getMessages(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = options.offset || 0;
      const search = options.search;
      const sortBy = options.sortBy || 'created_at';
      const sortOrder = options.sortOrder || 'desc';

      let whereClause = '';
      let params = [];
      let paramIndex = 1;

      if (search) {
        whereClause += ` AND (m.body ILIKE $${paramIndex} OR u.name ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
      }

      const orderClause = `ORDER BY m.${sortBy} ${sortOrder.toUpperCase()}`;

      const countQuery = `
        SELECT COUNT(*) as total
        FROM messages m
        JOIN projects p ON m.project_id = p.id
        JOIN users u ON m.user_id = u.id
        WHERE p.deleted_at IS NULL AND u.deleted_at IS NULL ${whereClause}
      `;

      const dataQuery = `
        SELECT
          m.*,
          p.title as project_title,
          u.name as user_name,
          u.email as user_email
        FROM messages m
        JOIN projects p ON m.project_id = p.id
        JOIN users u ON m.user_id = u.id
        WHERE p.deleted_at IS NULL AND u.deleted_at IS NULL ${whereClause}
        ${orderClause}
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      params.push(limit, offset);

      const [countResult, dataResult] = await Promise.all([
        this.db.query(countQuery, params.slice(0, paramIndex - 2)),
        this.db.query(dataQuery, params),
      ]);

      const total = parseInt(countResult.rows[0].total);
      const totalPages = Math.ceil(total / limit);

      return {
        messages: dataResult.rows,
        pagination: {
          page,
          limit,
          total,
          pages: totalPages,
          hasPrev: page > 1,
          hasNext: page < totalPages,
        },
      };
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  }

  async createMessage(messageData, adminInfo) {
    try {
      const query = `
        INSERT INTO messages (
          project_id, user_id, body, created_at
        ) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
        RETURNING *
      `;
      const values = [
        messageData.projectId || messageData.project_id,
        messageData.userId || messageData.user_id,
        messageData.body,
      ];
      const result = await this.db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }

  async updateMessage(id, messageData, adminInfo) {
    try {
      const query = `
        UPDATE messages
        SET
          project_id = $1,
          user_id = $2,
          body = $3
        WHERE id = $4
        RETURNING *
      `;
      const values = [
        messageData.projectId || messageData.project_id,
        messageData.userId || messageData.user_id,
        messageData.body,
        id,
      ];
      const result = await this.db.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error updating message:', error);
      throw error;
    }
  }

  async deleteMessage(id, adminInfo) {
    try {
      const query = 'DELETE FROM messages WHERE id = $1';
      const result = await this.db.query(query, [id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  // Startups SCRUD methods
  async getStartups(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = options.offset || 0;
      const search = options.search;
      const sortBy = options.sortBy || 'created_at';
      const sortOrder = options.sortOrder || 'desc';

      let whereClause = '';
      let params = [];
      let paramIndex = 1;

      if (search) {
        whereClause += ` AND (s.name ILIKE $${paramIndex} OR s.description ILIKE $${paramIndex} OR s.industry ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
      }

      const orderClause = `ORDER BY s.${sortBy} ${sortOrder.toUpperCase()}`;

      const countQuery = `SELECT COUNT(*) as total FROM startups s ${whereClause}`;

      const dataQuery = `
        SELECT
          s.*,
          u.name as owner_name,
          u.email as owner_email
        FROM startups s
        JOIN users u ON s.owner_user_id = u.id
        WHERE u.deleted_at IS NULL ${whereClause}
        ${orderClause}
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      params.push(limit, offset);

      const [countResult, dataResult] = await Promise.all([
        this.db.query(countQuery, params.slice(0, paramIndex - 2)),
        this.db.query(dataQuery, params),
      ]);

      const total = parseInt(countResult.rows[0].total);
      const totalPages = Math.ceil(total / limit);

      return {
        startups: dataResult.rows,
        pagination: {
          page,
          limit,
          total,
          pages: totalPages,
          hasPrev: page > 1,
          hasNext: page < totalPages,
        },
      };
    } catch (error) {
      console.error('Error getting startups:', error);
      throw error;
    }
  }

  async createStartup(startupData, adminInfo) {
    try {
      const query = `
        INSERT INTO startups (
          owner_user_id, name, description, industry, stage, funding_status,
          website_url, linkedin_url, twitter_url, logo_url, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `;
      const values = [
        startupData.ownerUserId || startupData.owner_user_id,
        startupData.name,
        startupData.description,
        startupData.industry,
        startupData.stage,
        startupData.fundingStatus || startupData.funding_status,
        startupData.websiteUrl || startupData.website_url,
        startupData.linkedinUrl || startupData.linkedin_url,
        startupData.twitterUrl || startupData.twitter_url,
        startupData.logoUrl || startupData.logo_url,
      ];
      const result = await this.db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating startup:', error);
      throw error;
    }
  }

  async updateStartup(id, startupData, adminInfo) {
    try {
      const query = `
        UPDATE startups
        SET
          owner_user_id = $1,
          name = $2,
          description = $3,
          industry = $4,
          stage = $5,
          funding_status = $6,
          website_url = $7,
          linkedin_url = $8,
          twitter_url = $9,
          logo_url = $10,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $11
        RETURNING *
      `;
      const values = [
        startupData.ownerUserId || startupData.owner_user_id,
        startupData.name,
        startupData.description,
        startupData.industry,
        startupData.stage,
        startupData.fundingStatus || startupData.funding_status,
        startupData.websiteUrl || startupData.website_url,
        startupData.linkedinUrl || startupData.linkedin_url,
        startupData.twitterUrl || startupData.twitter_url,
        startupData.logoUrl || startupData.logo_url,
        id,
      ];
      const result = await this.db.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error updating startup:', error);
      throw error;
    }
  }

  async deleteStartup(id, adminInfo) {
    try {
      const query = 'DELETE FROM startups WHERE id = $1';
      const result = await this.db.query(query, [id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error deleting startup:', error);
      throw error;
    }
  }

  // Enterprises SCRUD methods
  async getEnterprises(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = options.offset || 0;
      const search = options.search;
      const sortBy = options.sortBy || 'created_at';
      const sortOrder = options.sortOrder || 'desc';

      let whereClause = '';
      let params = [];
      let paramIndex = 1;

      if (search) {
        whereClause += ` AND (e.name ILIKE $${paramIndex} OR e.description ILIKE $${paramIndex} OR e.industry ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
      }

      const orderClause = `ORDER BY e.${sortBy} ${sortOrder.toUpperCase()}`;

      const countQuery = `SELECT COUNT(*) as total FROM enterprises e ${whereClause}`;

      const dataQuery = `
        SELECT
          e.*,
          u.name as owner_name,
          u.email as owner_email
        FROM enterprises e
        JOIN users u ON e.owner_user_id = u.id
        WHERE u.deleted_at IS NULL ${whereClause}
        ${orderClause}
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      params.push(limit, offset);

      const [countResult, dataResult] = await Promise.all([
        this.db.query(countQuery, params.slice(0, paramIndex - 2)),
        this.db.query(dataQuery, params),
      ]);

      const total = parseInt(countResult.rows[0].total);
      const totalPages = Math.ceil(total / limit);

      return {
        enterprises: dataResult.rows,
        pagination: {
          page,
          limit,
          total,
          pages: totalPages,
          hasPrev: page > 1,
          hasNext: page < totalPages,
        },
      };
    } catch (error) {
      console.error('Error getting enterprises:', error);
      throw error;
    }
  }

  async createEnterprise(enterpriseData, adminInfo) {
    try {
      const query = `
        INSERT INTO enterprises (
          owner_user_id, name, description, industry, size,
          website_url, linkedin_url, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `;
      const values = [
        enterpriseData.ownerUserId || enterpriseData.owner_user_id,
        enterpriseData.name,
        enterpriseData.description,
        enterpriseData.industry,
        enterpriseData.size,
        enterpriseData.websiteUrl || enterpriseData.website_url,
        enterpriseData.linkedinUrl || enterpriseData.linkedin_url,
      ];
      const result = await this.db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating enterprise:', error);
      throw error;
    }
  }

  async updateEnterprise(id, enterpriseData, adminInfo) {
    try {
      const query = `
        UPDATE enterprises
        SET
          owner_user_id = $1,
          name = $2,
          description = $3,
          industry = $4,
          size = $5,
          website_url = $6,
          linkedin_url = $7,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $8
        RETURNING *
      `;
      const values = [
        enterpriseData.ownerUserId || enterpriseData.owner_user_id,
        enterpriseData.name,
        enterpriseData.description,
        enterpriseData.industry,
        enterpriseData.size,
        enterpriseData.websiteUrl || enterpriseData.website_url,
        enterpriseData.linkedinUrl || enterpriseData.linkedin_url,
        id,
      ];
      const result = await this.db.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error updating enterprise:', error);
      throw error;
    }
  }

  async deleteEnterprise(id, adminInfo) {
    try {
      const query = 'DELETE FROM enterprises WHERE id = $1';
      const result = await this.db.query(query, [id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error deleting enterprise:', error);
      throw error;
    }
  }

  // Corporates SCRUD methods
  async getCorporates(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = options.offset || 0;
      const search = options.search;
      const sortBy = options.sortBy || 'created_at';
      const sortOrder = options.sortOrder || 'desc';

      let whereClause = '';
      let params = [];
      let paramIndex = 1;

      if (search) {
        whereClause += ` AND (c.name ILIKE $${paramIndex} OR c.description ILIKE $${paramIndex} OR c.industry ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
      }

      const orderClause = `ORDER BY c.${sortBy} ${sortOrder.toUpperCase()}`;

      const countQuery = `SELECT COUNT(*) as total FROM corporates c ${whereClause}`;

      const dataQuery = `
        SELECT
          c.*,
          u.name as owner_name,
          u.email as owner_email
        FROM corporates c
        JOIN users u ON c.owner_user_id = u.id
        WHERE u.deleted_at IS NULL ${whereClause}
        ${orderClause}
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      params.push(limit, offset);

      const [countResult, dataResult] = await Promise.all([
        this.db.query(countQuery, params.slice(0, paramIndex - 2)),
        this.db.query(dataQuery, params),
      ]);

      const total = parseInt(countResult.rows[0].total);
      const totalPages = Math.ceil(total / limit);

      return {
        corporates: dataResult.rows,
        pagination: {
          page,
          limit,
          total,
          pages: totalPages,
          hasPrev: page > 1,
          hasNext: page < totalPages,
        },
      };
    } catch (error) {
      console.error('Error getting corporates:', error);
      throw error;
    }
  }

  async createCorporate(corporateData, adminInfo) {
    try {
      const query = `
        INSERT INTO corporates (
          owner_user_id, name, description, industry, size,
          website_url, linkedin_url, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `;
      const values = [
        corporateData.ownerUserId || corporateData.owner_user_id,
        corporateData.name,
        corporateData.description,
        corporateData.industry,
        corporateData.size,
        corporateData.websiteUrl || corporateData.website_url,
        corporateData.linkedinUrl || corporateData.linkedin_url,
      ];
      const result = await this.db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating corporate:', error);
      throw error;
    }
  }

  async updateCorporate(id, corporateData, adminInfo) {
    try {
      const query = `
        UPDATE corporates
        SET
          owner_user_id = $1,
          name = $2,
          description = $3,
          industry = $4,
          size = $5,
          website_url = $6,
          linkedin_url = $7,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $8
        RETURNING *
      `;
      const values = [
        corporateData.ownerUserId || corporateData.owner_user_id,
        corporateData.name,
        corporateData.description,
        corporateData.industry,
        corporateData.size,
        corporateData.websiteUrl || corporateData.website_url,
        corporateData.linkedinUrl || corporateData.linkedin_url,
        id,
      ];
      const result = await this.db.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error updating corporate:', error);
      throw error;
    }
  }

  async deleteCorporate(id, adminInfo) {
    try {
      const query = 'DELETE FROM corporates WHERE id = $1';
      const result = await this.db.query(query, [id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error deleting corporate:', error);
      throw error;
    }
  }

  // Help Categories SCRUD methods
  async getHelpCategories(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = options.offset || 0;
      const search = options.search;
      const sortBy = options.sortBy || 'created_at';
      const sortOrder = options.sortOrder || 'desc';

      let whereClause = 'WHERE hc.is_active = true';
      let params = [];
      let paramIndex = 1;

      if (search) {
        whereClause += ` AND (hc.name ILIKE $${paramIndex} OR hc.description ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
      }

      const orderClause = `ORDER BY hc.${sortBy} ${sortOrder.toUpperCase()}`;

      const countQuery = `SELECT COUNT(*) as total FROM help_categories hc ${whereClause}`;

      const dataQuery = `
        SELECT
          hc.*,
          parent.name as parent_category_name
        FROM help_categories hc
        LEFT JOIN help_categories parent ON hc.parent_category_id = parent.id
        ${whereClause}
        ${orderClause}
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      params.push(limit, offset);

      const [countResult, dataResult] = await Promise.all([
        this.db.query(countQuery, params.slice(0, paramIndex - 2)),
        this.db.query(dataQuery, params),
      ]);

      const total = parseInt(countResult.rows[0].total);
      const totalPages = Math.ceil(total / limit);

      return {
        categories: dataResult.rows,
        pagination: {
          page,
          limit,
          total,
          pages: totalPages,
          hasPrev: page > 1,
          hasNext: page < totalPages,
        },
      };
    } catch (error) {
      console.error('Error getting help categories:', error);
      throw error;
    }
  }

  async createHelpCategory(categoryData, adminInfo) {
    try {
      const query = `
        INSERT INTO help_categories (
          name, description, slug, is_active, sort_order, parent_category_id, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `;
      const values = [
        categoryData.name,
        categoryData.description,
        categoryData.slug,
        categoryData.isActive !== undefined ? categoryData.isActive : true,
        categoryData.sortOrder || 0,
        categoryData.parentCategoryId || categoryData.parent_category_id,
      ];
      const result = await this.db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating help category:', error);
      throw error;
    }
  }

  async updateHelpCategory(id, categoryData, adminInfo) {
    try {
      const query = `
        UPDATE help_categories
        SET
          name = $1,
          description = $2,
          slug = $3,
          is_active = $4,
          sort_order = $5,
          parent_category_id = $6,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        RETURNING *
      `;
      const values = [
        categoryData.name,
        categoryData.description,
        categoryData.slug,
        categoryData.isActive,
        categoryData.sortOrder,
        categoryData.parentCategoryId || categoryData.parent_category_id,
        id,
      ];
      const result = await this.db.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error updating help category:', error);
      throw error;
    }
  }

  async deleteHelpCategory(id, adminInfo) {
    try {
      const query = 'DELETE FROM help_categories WHERE id = $1';
      const result = await this.db.query(query, [id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error deleting help category:', error);
      throw error;
    }
  }

  // Help Articles SCRUD methods
  async getHelpArticles(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = options.offset || 0;
      const search = options.search;
      const sortBy = options.sortBy || 'created_at';
      const sortOrder = options.sortOrder || 'desc';

      let whereClause = '';
      let params = [];
      let paramIndex = 1;

      if (search) {
        whereClause += ` AND (ha.title ILIKE $${paramIndex} OR ha.content ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
      }

      const orderClause = `ORDER BY ha.${sortBy} ${sortOrder.toUpperCase()}`;

      const countQuery = `
        SELECT COUNT(*) as total
        FROM help_articles ha
        LEFT JOIN help_categories hc ON ha.category_id = hc.id
        WHERE hc.is_active = true ${whereClause}
      `;

      const dataQuery = `
        SELECT
          ha.*,
          hc.name as category_name,
          u.name as author_name
        FROM help_articles ha
        LEFT JOIN help_categories hc ON ha.category_id = hc.id
        LEFT JOIN users u ON ha.author_user_id = u.id
        WHERE hc.is_active = true ${whereClause}
        ${orderClause}
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      params.push(limit, offset);

      const [countResult, dataResult] = await Promise.all([
        this.db.query(countQuery, params.slice(0, paramIndex - 2)),
        this.db.query(dataQuery, params),
      ]);

      const total = parseInt(countResult.rows[0].total);
      const totalPages = Math.ceil(total / limit);

      return {
        articles: dataResult.rows,
        pagination: {
          page,
          limit,
          total,
          pages: totalPages,
          hasPrev: page > 1,
          hasNext: page < totalPages,
        },
      };
    } catch (error) {
      console.error('Error getting help articles:', error);
      throw error;
    }
  }

  async createHelpArticle(articleData, adminInfo) {
    try {
      const query = `
        INSERT INTO help_articles (
          title, content, category_id, author_user_id, slug, is_published,
          is_featured, view_count, helpful_count, unhelpful_count, read_time_minutes,
          meta_description, created_at, updated_at, published_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $13)
        RETURNING *
      `;
      const values = [
        articleData.title,
        articleData.content,
        articleData.categoryId || articleData.category_id,
        articleData.authorUserId || articleData.author_user_id,
        articleData.slug,
        articleData.isPublished !== undefined ? articleData.isPublished : false,
        articleData.isFeatured !== undefined ? articleData.isFeatured : false,
        articleData.viewCount || 0,
        articleData.helpfulCount || 0,
        articleData.unhelpfulCount || 0,
        articleData.readTimeMinutes || 0,
        articleData.metaDescription,
        articleData.isPublished ? new Date() : null,
      ];
      const result = await this.db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating help article:', error);
      throw error;
    }
  }

  async updateHelpArticle(id, articleData, adminInfo) {
    try {
      const query = `
        UPDATE help_articles
        SET
          title = $1,
          content = $2,
          category_id = $3,
          author_user_id = $4,
          slug = $5,
          is_published = $6,
          is_featured = $7,
          view_count = $8,
          helpful_count = $9,
          unhelpful_count = $10,
          read_time_minutes = $11,
          meta_description = $12,
          updated_at = CURRENT_TIMESTAMP,
          published_at = $13
        WHERE id = $14
        RETURNING *
      `;
      const values = [
        articleData.title,
        articleData.content,
        articleData.categoryId || articleData.category_id,
        articleData.authorUserId || articleData.author_user_id,
        articleData.slug,
        articleData.isPublished,
        articleData.isFeatured,
        articleData.viewCount,
        articleData.helpfulCount,
        articleData.unhelpfulCount,
        articleData.readTimeMinutes,
        articleData.metaDescription,
        articleData.isPublished && !articleData.published_at
          ? new Date()
          : articleData.published_at,
        id,
      ];
      const result = await this.db.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error updating help article:', error);
      throw error;
    }
  }

  async deleteHelpArticle(id, adminInfo) {
    try {
      const query = 'DELETE FROM help_articles WHERE id = $1';
      const result = await this.db.query(query, [id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error deleting help article:', error);
      throw error;
    }
  }
}

module.exports = AdminService;
