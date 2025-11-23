// Database Service Mocks
const mockDatabaseService = {
  // Generic CRUD operations
  create: jest.fn(),
  read: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),

  // Todo-specific methods
  getAllTodos: jest.fn(),
  createTodo: jest.fn(),
  updateTodo: jest.fn(),
  deleteTodo: jest.fn(),
  getTodosWithFilters: jest.fn(),

  // Table management
  getAllTables: jest.fn(),
  testConnection: jest.fn(),

  // Supabase client mock
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: {}, error: null }),
      rpc: jest.fn().mockResolvedValue({ data: [], error: null })
    })),
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null })
    }
  }
};

// Domain Service Mocks
const mockUserService = {
  createUser: jest.fn(),
  getUserById: jest.fn(),
  getUserByEmail: jest.fn(),
  getAllUsers: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  authenticateUser: jest.fn(),
  changePassword: jest.fn(),
  getUserProfile: jest.fn(),
  updateUserProfile: jest.fn(),
  createUserAccount: jest.fn(),
  getUserAccounts: jest.fn()
};

const mockContentService = {
  createContent: jest.fn(),
  getContentById: jest.fn(),
  getAllContent: jest.fn(),
  updateContent: jest.fn(),
  deleteContent: jest.fn(),
  publishContent: jest.fn(),
  archiveContent: jest.fn(),
  searchContent: jest.fn(),
  getContentByCategory: jest.fn(),
  getContentByAuthor: jest.fn(),
  getContentStats: jest.fn()
};

const mockBusinessService = {
  corporate: {
    createCorporate: jest.fn(),
    getCorporateById: jest.fn(),
    getAllCorporates: jest.fn(),
    updateCorporate: jest.fn(),
    deleteCorporate: jest.fn()
  },
  enterprise: {
    createEnterprise: jest.fn(),
    getEnterpriseById: jest.fn(),
    getAllEnterprises: jest.fn(),
    updateEnterprise: jest.fn(),
    deleteEnterprise: jest.fn()
  },
  startup: {
    createStartup: jest.fn(),
    getStartupById: jest.fn(),
    getAllStartups: jest.fn(),
    updateStartup: jest.fn(),
    deleteStartup: jest.fn()
  },
  searchBusinesses: jest.fn(),
  getBusinessStats: jest.fn()
};

const mockLearningService = {
  content: {
    createLearningContent: jest.fn(),
    getLearningContentById: jest.fn(),
    getAllLearningContent: jest.fn(),
    updateLearningContent: jest.fn(),
    deleteLearningContent: jest.fn(),
    publishLearningContent: jest.fn()
  },
  category: {
    createLearningCategory: jest.fn(),
    getLearningCategoryById: jest.fn(),
    getAllLearningCategories: jest.fn(),
    updateLearningCategory: jest.fn(),
    deleteLearningCategory: jest.fn(),
    getCategoryHierarchy: jest.fn()
  },
  assessment: {
    createLearningAssessment: jest.fn(),
    getLearningAssessmentById: jest.fn(),
    getAssessmentsByUser: jest.fn(),
    getAssessmentsByContent: jest.fn(),
    updateLearningAssessment: jest.fn(),
    deleteLearningAssessment: jest.fn(),
    getAssessmentStats: jest.fn()
  },
  analytics: {
    createLearningAnalytics: jest.fn(),
    getAnalyticsByUser: jest.fn(),
    getAnalyticsByContent: jest.fn(),
    getUserProgress: jest.fn(),
    getContentAnalytics: jest.fn()
  },
  searchLearningContent: jest.fn(),
  getLearningStats: jest.fn()
};

const mockProjectService = {
  project: {
    createProject: jest.fn(),
    getProjectById: jest.fn(),
    getAllProjects: jest.fn(),
    updateProject: jest.fn(),
    deleteProject: jest.fn(),
    getProjectWithCollaborators: jest.fn()
  },
  task: {
    createTask: jest.fn(),
    getTaskById: jest.fn(),
    getTasksByProject: jest.fn(),
    getTasksByAssignee: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    updateTaskStatus: jest.fn(),
    assignTask: jest.fn()
  },
  collaboration: {
    createCollaboration: jest.fn(),
    getCollaborationById: jest.fn(),
    getCollaborationsByUser: jest.fn(),
    getCollaborationsByProject: jest.fn(),
    updateCollaboration: jest.fn(),
    deleteCollaboration: jest.fn(),
    acceptCollaboration: jest.fn(),
    rejectCollaboration: jest.fn()
  },
  collaborator: {
    addCollaborator: jest.fn(),
    getCollaboratorById: jest.fn(),
    getProjectCollaborators: jest.fn(),
    getUserCollaborations: jest.fn(),
    updateCollaborator: jest.fn(),
    removeCollaborator: jest.fn(),
    updateCollaboratorRole: jest.fn()
  },
  searchProjects: jest.fn(),
  getProjectStats: jest.fn(),
  getUserProjectsWithDetails: jest.fn()
};

const mockFinancialService = {
  billing: {
    createBilling: jest.fn(),
    getBillingById: jest.fn(),
    getBillingByUser: jest.fn(),
    updateBilling: jest.fn(),
    deleteBilling: jest.fn(),
    markAsPaid: jest.fn(),
    getBillingStats: jest.fn()
  },
  package: {
    createPackage: jest.fn(),
    getPackageById: jest.fn(),
    getAllPackages: jest.fn(),
    updatePackage: jest.fn(),
    deletePackage: jest.fn(),
    activatePackage: jest.fn(),
    deactivatePackage: jest.fn(),
    getActivePackages: jest.fn()
  },
  reward: {
    createReward: jest.fn(),
    getRewardById: jest.fn(),
    getAllRewards: jest.fn(),
    updateReward: jest.fn(),
    deleteReward: jest.fn(),
    getAvailableRewards: jest.fn(),
    redeemReward: jest.fn(),
    getRewardStats: jest.fn()
  },
  getFinancialStats: jest.fn(),
  getRevenueStats: jest.fn()
};

const mockNotificationService = {
  createNotification: jest.fn(),
  getNotificationById: jest.fn(),
  getNotificationsByUser: jest.fn(),
  updateNotification: jest.fn(),
  deleteNotification: jest.fn(),
  markAsRead: jest.fn(),
  markAllAsRead: jest.fn(),
  createBulkNotifications: jest.fn(),
  createWelcomeNotification: jest.fn(),
  createProjectInvitationNotification: jest.fn(),
  createTaskAssignedNotification: jest.fn(),
  getNotificationStats: jest.fn(),
  cleanupOldNotifications: jest.fn()
};

const mockActivityService = {
  logActivity: jest.fn(),
  getActivityById: jest.fn(),
  getActivitiesByUser: jest.fn(),
  getAllActivities: jest.fn(),
  logUserLogin: jest.fn(),
  logUserLogout: jest.fn(),
  logProjectCreated: jest.fn(),
  logTaskCompleted: jest.fn(),
  logContentPublished: jest.fn(),
  logUserRegistered: jest.fn(),
  getActivityStats: jest.fn(),
  getUserActivitySummary: jest.fn(),
  cleanupOldActivities: jest.fn()
};

// Mock Service Factory
const mockServiceFactory = {
  getUserService: jest.fn(() => mockUserService),
  getContentService: jest.fn(() => mockContentService),
  getBusinessService: jest.fn(() => mockBusinessService),
  getLearningService: jest.fn(() => mockLearningService),
  getProjectService: jest.fn(() => mockProjectService),
  getFinancialService: jest.fn(() => mockFinancialService),
  getNotificationService: jest.fn(() => mockNotificationService),
  getActivityService: jest.fn(() => mockActivityService),
  getAllServices: jest.fn(() => ({
    user: mockUserService,
    content: mockContentService,
    business: mockBusinessService,
    learning: mockLearningService,
    project: mockProjectService,
    financial: mockFinancialService,
    notification: mockNotificationService,
    activity: mockActivityService
  }))
};

export default mockServiceFactory;

// Export individual mocks for direct access
export {
  mockDatabaseService,
  mockUserService,
  mockContentService,
  mockBusinessService,
  mockLearningService,
  mockProjectService,
  mockFinancialService,
  mockNotificationService,
  mockActivityService,
  mockServiceFactory
};