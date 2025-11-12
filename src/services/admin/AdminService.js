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
    projectCollaboratorRepository
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

  async getRewardById(rewardId) {
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
}

module.exports = AdminService;
