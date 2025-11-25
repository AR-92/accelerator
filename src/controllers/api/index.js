// Import API route setup functions from organized folders

import todoApiRoutes from './tables/api.js';
import accountsRoutes from './tables/accounts.js';

// Admin API routes
import profileRoutes from './admin/get-profile.js';
import profileSettingsRoutes from './admin/get-profile-settings.js';
import settingsRoutes from './admin/get-settings.js';
import systemHealthRoutes from './admin/get-system-health.js';

import activityRoutes from './admin/get-activity.js';
import notificationsRoutes from './admin/get-notifications.js';

// Overview API routes
import mainRoutes from './overview/get-main.js';
import contentManagementRoutes from './overview/content-management.js';
import systemRoutes from './overview/system.js';
import helpRoutes from './overview/help.js';
import financialRoutes from './overview/financial.js';
import businessRoutes from './overview/business.js';
import learningRoutes from './overview/learning.js';
import projectsRoutes from './overview/projects.js';

// Table API routes
import usersRoutes from './tables/users.js';
import ideasRoutes from './tables/ideas.js';
import votesRoutes from './tables/votes.js';
import collaborationsRoutes from './tables/collaborations.js';
import contentRoutes from './tables/content.js';
import landingPageRoutes from './tables/landing-page.js';
import learningContentRoutes from './tables/learning-content.js';
import learningCategoriesRoutes from './tables/learning-categories.js';
import learningAssessmentsRoutes from './tables/learning-assessments.js';
import learningAnalyticsRoutes from './tables/learning-analytics.js';
import packagesRoutes from './tables/packages.js';
import billingRoutes from './tables/billing.js';
import rewardsRoutes from './tables/rewards.js';
import businessModelRoutes from './tables/business-model.js';
import businessPlanRoutes from './tables/business-plan.js';
import financialModelRoutes from './tables/financial-model.js';
import pitchdeckRoutes from './tables/pitchdeck.js';
import valuationRoutes from './tables/valuation.js';
import fundingRoutes from './tables/funding.js';
import teamRoutes from './tables/team.js';
import legalRoutes from './tables/legal.js';
import marketingRoutes from './tables/marketing.js';
import corporateRoutes from './tables/corporate.js';
import enterprisesRoutes from './tables/enterprises.js';
import messagesRoutes from './tables/messages.js';
import projectCollaboratorsRoutes from './tables/project-collaborators.js';
import calendarRoutes from './tables/calendar.js';
import helpCenterRoutes from './tables/help-center.js';

// Other API routes
import portfoliosRoutes from './tables/portfolios.js';

// API routes setup
export default function apiRoutes(app) {
  // Admin API routes
  profileRoutes(app);
  profileSettingsRoutes(app);
  settingsRoutes(app);
  systemHealthRoutes(app);
  notificationsRoutes(app);

  activityRoutes(app);

  // Overview API routes
  mainRoutes(app);
  contentManagementRoutes(app);
  systemRoutes(app);
  businessRoutes(app);
  learningRoutes(app);
  projectsRoutes(app);
  helpRoutes(app);
  financialRoutes(app);

  // Table API routes
  usersRoutes(app);
  ideasRoutes(app);
  votesRoutes(app);
  collaborationsRoutes(app);
  contentRoutes(app);
  landingPageRoutes(app);
  learningContentRoutes(app);
  learningCategoriesRoutes(app);
  learningAssessmentsRoutes(app);
  learningAnalyticsRoutes(app);
  packagesRoutes(app);
  billingRoutes(app);
  rewardsRoutes(app);
  businessModelRoutes(app);
  businessPlanRoutes(app);
  financialModelRoutes(app);
  pitchdeckRoutes(app);
  valuationRoutes(app);
  fundingRoutes(app);
  teamRoutes(app);
  legalRoutes(app);
  marketingRoutes(app);
  corporateRoutes(app);
  enterprisesRoutes(app);
  messagesRoutes(app);
  projectCollaboratorsRoutes(app);
  calendarRoutes(app);
  helpCenterRoutes(app);

  // Other API routes
  accountsRoutes(app);
  todoApiRoutes(app);
  portfoliosRoutes(app);
}
