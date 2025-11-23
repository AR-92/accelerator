// Domain Services
export { default as UserService, AccountService, IdeaService, MessageService, HelpCenterService } from './domains/UserService.js';
export { default as ContentService } from './domains/ContentService.js';
export { default as BusinessService, CorporateService, EnterpriseService, StartupService } from './domains/BusinessService.js';
export { default as LearningService, LearningContentService, LearningCategoryService, LearningAssessmentService, LearningAnalyticsService } from './domains/LearningService.js';
export { default as ProjectManagementService, ProjectCoreService, TaskService, CollaborationService, ProjectCollaboratorService } from './domains/ProjectService.js';
export { default as FinancialService, BillingService, PackageService, RewardService } from './domains/FinancialService.js';
export { default as NotificationService } from './domains/NotificationService.js';
export { default as ActivityService } from './domains/ActivityService.js';
export { default as SystemHealthService } from './domains/SystemHealthService.js';
export { default as TodoService } from './domains/TodoService.js';
export { default as DatabaseTableService } from './domains/DatabaseTableService.js';
export { default as BusinessOverviewService, FinancialOverviewService, LearningOverviewService, SystemOverviewService, MainOverviewService, ProjectsOverviewService, ContentManagementOverviewService, HelpOverviewService } from './domains/OverviewService.js';

// Database Service
export { DatabaseService, default as databaseService } from './supabase.js';

// Service Factory for easy instantiation
import { DatabaseService } from './supabase.js';
import UserService, { AccountService, IdeaService, MessageService, HelpCenterService } from './domains/UserService.js';
import ContentService from './domains/ContentService.js';
import BusinessService from './domains/BusinessService.js';
import LearningService from './domains/LearningService.js';
import ProjectManagementService from './domains/ProjectService.js';
import FinancialService from './domains/FinancialService.js';
import NotificationService from './domains/NotificationService.js';
import ActivityService from './domains/ActivityService.js';
import SystemHealthService from './domains/SystemHealthService.js';
import TodoService from './domains/TodoService.js';
import DatabaseTableService from './domains/DatabaseTableService.js';
import { BusinessOverviewService, FinancialOverviewService, LearningOverviewService, SystemOverviewService, MainOverviewService, ProjectsOverviewService, ContentManagementOverviewService, HelpOverviewService } from './domains/OverviewService.js';

class ServiceFactory {
  constructor() {
    this.db = new DatabaseService();
    this.services = {};
  }

  getUserService() {
    if (!this.services.user) {
      this.services.user = new UserService(this.db);
    }
    return this.services.user;
  }

  getAccountService() {
    if (!this.services.account) {
      this.services.account = new AccountService(this.db);
    }
    return this.services.account;
  }

  getIdeaService() {
    if (!this.services.idea) {
      this.services.idea = new IdeaService(this.db);
    }
    return this.services.idea;
  }

  getMessageService() {
    if (!this.services.message) {
      this.services.message = new MessageService(this.db);
    }
    return this.services.message;
  }

  getHelpCenterService() {
    if (!this.services.helpCenter) {
      this.services.helpCenter = new HelpCenterService(this.db);
    }
    return this.services.helpCenter;
  }

  getBusinessOverviewService() {
    if (!this.services.businessOverview) {
      this.services.businessOverview = new BusinessOverviewService(this.db);
    }
    return this.services.businessOverview;
  }

  getFinancialOverviewService() {
    if (!this.services.financialOverview) {
      this.services.financialOverview = new FinancialOverviewService(this.db);
    }
    return this.services.financialOverview;
  }

  getLearningOverviewService() {
    if (!this.services.learningOverview) {
      this.services.learningOverview = new LearningOverviewService(this.db);
    }
    return this.services.learningOverview;
  }

  getSystemOverviewService() {
    if (!this.services.systemOverview) {
      this.services.systemOverview = new SystemOverviewService(this.db);
    }
    return this.services.systemOverview;
  }

  getMainOverviewService() {
    if (!this.services.mainOverview) {
      this.services.mainOverview = new MainOverviewService(this.db);
    }
    return this.services.mainOverview;
  }

  getProjectsOverviewService() {
    if (!this.services.projectsOverview) {
      this.services.projectsOverview = new ProjectsOverviewService(this.db);
    }
    return this.services.projectsOverview;
  }

  getContentManagementOverviewService() {
    if (!this.services.contentManagementOverview) {
      this.services.contentManagementOverview = new ContentManagementOverviewService(this.db);
    }
    return this.services.contentManagementOverview;
  }

  getHelpOverviewService() {
    if (!this.services.helpOverview) {
      this.services.helpOverview = new HelpOverviewService(this.db);
    }
    return this.services.helpOverview;
  }

  getContentService() {
    if (!this.services.content) {
      this.services.content = new ContentService(this.db);
    }
    return this.services.content;
  }

  getBusinessService() {
    if (!this.services.business) {
      this.services.business = new BusinessService(this.db);
    }
    return this.services.business;
  }

  getLearningService() {
    if (!this.services.learning) {
      this.services.learning = new LearningService(this.db);
    }
    return this.services.learning;
  }

  getProjectService() {
    if (!this.services.project) {
      this.services.project = new ProjectManagementService(this.db);
    }
    return this.services.project;
  }

  getFinancialService() {
    if (!this.services.financial) {
      this.services.financial = new FinancialService(this.db);
    }
    return this.services.financial;
  }

  getNotificationService() {
    if (!this.services.notification) {
      this.services.notification = new NotificationService(this.db);
    }
    return this.services.notification;
  }

  getActivityService() {
    if (!this.services.activity) {
      this.services.activity = new ActivityService(this.db);
    }
    return this.services.activity;
  }

  getSystemHealthService() {
    if (!this.services.systemHealth) {
      this.services.systemHealth = new SystemHealthService(this.db);
    }
    return this.services.systemHealth;
  }

  getTodoService() {
    if (!this.services.todo) {
      this.services.todo = new TodoService(this.db);
    }
    return this.services.todo;
  }

  getDatabaseTableService() {
    if (!this.services.databaseTable) {
      this.services.databaseTable = new DatabaseTableService(this.db);
    }
    return this.services.databaseTable;
  }

  // Get all services at once
  getAllServices() {
    return {
      user: this.getUserService(),
      account: this.getAccountService(),
      idea: this.getIdeaService(),
      message: this.getMessageService(),
      helpCenter: this.getHelpCenterService(),
      businessOverview: this.getBusinessOverviewService(),
      financialOverview: this.getFinancialOverviewService(),
      learningOverview: this.getLearningOverviewService(),
      systemOverview: this.getSystemOverviewService(),
      mainOverview: this.getMainOverviewService(),
      projectsOverview: this.getProjectsOverviewService(),
      contentManagementOverview: this.getContentManagementOverviewService(),
      helpOverview: this.getHelpOverviewService(),
      content: this.getContentService(),
      business: this.getBusinessService(),
      learning: this.getLearningService(),
      project: this.getProjectService(),
      financial: this.getFinancialService(),
      notification: this.getNotificationService(),
      activity: this.getActivityService(),
      systemHealth: this.getSystemHealthService(),
      todo: this.getTodoService(),
      databaseTable: this.getDatabaseTableService()
    };
  }
}

export { ServiceFactory };
export default new ServiceFactory();