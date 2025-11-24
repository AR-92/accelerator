// Import controllers from organized folders
import { getDashboard } from './admin/get-dashboard.js';
import { getProfile } from './admin/get-profile.js';
import { getProfileSettings } from './admin/get-profile-settings.js';
import { getSettings } from './admin/get-settings.js';
import { getSystemHealth } from './admin/get-system-health.js';
import { getNotifications } from './admin/get-notifications.js';
import { getTables } from './admin/get-tables.js';
import { getTodos } from './admin/get-todos.js';
import { getActivity } from './admin/get-activity.js';
import { postLogout } from './admin/post-logout.js';

import { getMain } from './overview/get-main.js';
import { getContentManagement } from './overview/get-content-management.js';
import { getSystem } from './overview/get-system.js';
import { getBusiness } from './overview/get-business.js';
import { getLearning } from './overview/get-learning.js';
import { getProjects } from './overview/get-projects.js';
import { getHelp } from './overview/get-help.js';
import { getFinancial } from './overview/get-financial.js';

import { getUsers } from './tables/get-users.js';
import { getIdeas } from './tables/get-ideas.js';
import { getVotes } from './tables/get-votes.js';
import { getCollaborations } from './tables/get-collaborations.js';
import { getContent } from './tables/get-content.js';
import { getLandingPage } from './tables/get-landing-page.js';
import { getLearningContent } from './tables/get-learning-content.js';
import { getLearningCategories } from './tables/get-learning-categories.js';
import { getLearningAssessments } from './tables/get-learning-assessments.js';
import { getLearningAnalytics } from './tables/get-learning-analytics.js';
import { getPackages } from './tables/get-packages.js';
import { getBilling } from './tables/get-billing.js';
import { getRewards } from './tables/get-rewards.js';
import { getBusinessModel } from './tables/get-business-model.js';
import { getBusinessPlan } from './tables/get-business-plan.js';
import { getFinancialModel } from './tables/get-financial-model.js';
import { getPitchDeck } from './tables/get-pitch-deck.js';
import { getValuation } from './tables/get-valuation.js';
import { getFunding } from './tables/get-funding.js';
import { getTeam } from './tables/get-team.js';
import { getLegal } from './tables/get-legal.js';
import { getMarketing } from './tables/get-marketing.js';
import { getCorporate } from './tables/get-corporate.js';
import { getEnterprises } from './tables/get-enterprises.js';
import { getMessages } from './tables/messages.js';
import { getProjectCollaborators } from './tables/project-collaborators.js';
import { getCalendar } from './tables/calendar.js';
import { getHelpCenter } from './tables/help-center.js';

// Re-export for backward compatibility
export { getDashboard };
export { getProfile };
export { getProfileSettings };
export { getSettings };
export { getSystemHealth };
export { getNotifications };
export { getTables };
export { getTodos };
export { getActivity };
export { postLogout };
export { getMain };
export { getContentManagement };
export { getSystem };
export { getBusiness };
export { getLearning };
export { getProjects };
export { getHelp };
export { getFinancial };
export { getUsers };
export { getIdeas };
export { getVotes };
export { getCollaborations };
export { getContent };
export { getLandingPage };
export { getLearningContent };
export { getLearningCategories };
export { getLearningAssessments };
export { getLearningAnalytics };
export { getPackages };
export { getBilling };
export { getRewards };
export { getBusinessModel };
export { getBusinessPlan };
export { getFinancialModel };
export { getPitchDeck };
export { getValuation };
export { getFunding };
export { getTeam };
export { getLegal };
export { getMarketing };
export { getCorporate };
export { getEnterprises };
export { getMessages };
export { getProjectCollaborators };
export { getCalendar };
export { getHelpCenter };

// Admin routes setup
export default function adminRoutes(app) {
  // Dashboard and main pages
  app.get('/admin', getDashboard);
  app.get('/admin/profile', getProfile);
  app.get('/admin/profile-settings', getProfileSettings);
  app.get('/admin/settings', getSettings);
  app.get('/admin/system-health', getSystemHealth);
  app.get('/admin/notifications', getNotifications);
  app.get('/admin/tables', getTables);
  app.get('/admin/table-pages/todos', getTodos);
  app.get('/admin/activity', getActivity);
  app.post('/admin/logout', postLogout);

  // Overview pages
  app.get('/admin/main', getMain);
  app.get('/admin/content-management', getContentManagement);
  app.get('/admin/system', getSystem);
  app.get('/admin/business', getBusiness);
  app.get('/admin/learning', getLearning);
  app.get('/admin/projects', getProjects);
  app.get('/admin/help', getHelp);
   app.get('/admin/financial', getFinancial);

   // Table pages
  app.get('/admin/table-pages/users', getUsers);
  app.get('/admin/table-pages/ideas', getIdeas);
  app.get('/admin/table-pages/votes', getVotes);
  app.get('/admin/table-pages/collaborations', getCollaborations);
  app.get('/admin/table-pages/content', getContent);
  app.get('/admin/table-pages/landing-page', getLandingPage);
  app.get('/admin/table-pages/learning-content', getLearningContent);
  app.get('/admin/table-pages/learning-categories', getLearningCategories);
  app.get('/admin/table-pages/learning-assessments', getLearningAssessments);
  app.get('/admin/table-pages/learning-analytics', getLearningAnalytics);
  app.get('/admin/table-pages/packages', getPackages);
  app.get('/admin/table-pages/billing', getBilling);
  app.get('/admin/table-pages/rewards', getRewards);
  app.get('/admin/table-pages/business-model', getBusinessModel);
  app.get('/admin/table-pages/business-plan', getBusinessPlan);
  app.get('/admin/table-pages/financial-model', getFinancialModel);
  app.get('/admin/table-pages/pitchdeck', getPitchDeck);
  app.get('/admin/table-pages/valuation', getValuation);
  app.get('/admin/table-pages/funding', getFunding);
  app.get('/admin/table-pages/team', getTeam);
  app.get('/admin/table-pages/legal', getLegal);
  app.get('/admin/table-pages/marketing', getMarketing);
  app.get('/admin/table-pages/corporate', getCorporate);
  app.get('/admin/table-pages/enterprises', getEnterprises);
  app.get('/admin/table-pages/messages', getMessages);
  app.get('/admin/table-pages/project-collaborators', getProjectCollaborators);
  app.get('/admin/table-pages/calendar', getCalendar);
  app.get('/admin/table-pages/help-center', getHelpCenter);

  // Other pages
  app.get('/admin/other-pages/dashboard', getDashboard);
  app.get('/admin/other-pages/profile', getProfile);
  app.get('/admin/other-pages/profile-settings', getProfileSettings);
  app.get('/admin/other-pages/settings', getSettings);
  app.get('/admin/other-pages/system-health', getSystemHealth);
  app.get('/admin/other-pages/notifications', getNotifications);
  app.get('/admin/other-pages/activity', getActivity);
  app.get('/admin/other-pages/main', getMain);
  app.get('/admin/other-pages/content-management', getContentManagement);
  app.get('/admin/other-pages/system', getSystem);
  app.get('/admin/other-pages/business', getBusiness);
  app.get('/admin/other-pages/learning', getLearning);
  app.get('/admin/other-pages/projects', getProjects);
  app.get('/admin/other-pages/help', getHelp);
  app.get('/admin/other-pages/financial', getFinancial);
}
