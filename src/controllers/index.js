// Import controllers from organized folders

import {
  getProfileSettings,
  postProfileSettings,
} from './admin/get-profile-settings.js';
import { getSettings, postSettings } from './admin/get-settings.js';
import { getSystemHealth } from './admin/get-system-health.js';
import { getSystemConfig } from './admin/get-system-config.js';
import { getSystemLogs } from './admin/get-system-logs.js';
import { getNotifications } from './admin/get-notifications.js';

import {
  getActivity,
  exportActivityCSV,
  exportActivityJSON,
} from './admin/get-activity.js';
import { postLogout } from './admin/post-logout.js';

import { getDashboard } from './overview/get-dashboard.js';
import { getPortfolio } from './overview/get-portfolio.js';
import { getPortfolioPage } from './overview/get-portfolio-page.js';
import { getCollaborate } from './overview/get-collaborate.js';
import { getNewProject } from './overview/get-new-project.js';
import { getExploreIdeas } from './overview/get-explore-ideas.js';

import { getChat } from './collaborate/chat.js';
import { getTasks } from './collaborate/tasks.js';
import { getFiles } from './collaborate/files.js';
import { getTeam } from './collaborate/team.js';
import { getCalendar } from './collaborate/calendar.js';
import { getActivity as getActivityCollaborate } from './collaborate/activity.js';
import { getSettings as getSettingsCollaborate } from './collaborate/settings.js';

import { getHelp } from './help/index.js';
import { getLearn } from './learn/index.js';
import { getSettings as getSettingsPage } from './settings/index.js';
import { getBilling } from './billing/index.js';

import {
  getDashboardMain,
  getDashboardOverview,
  getDashboardIdea,
  getDashboardBusiness,
  getDashboardFinancial,
  getDashboardMarketing,
  getDashboardFund,
  getDashboardTeam,
  getDashboardPromote,
  getDashboardActivityLog,
} from './dashboard/index.js';

import { requireAuth, checkAuth } from '../middleware/auth/index.js';

// Re-export for backward compatibility

export { getProfileSettings, postProfileSettings };
export { getSettings, postSettings };
export { getSystemHealth };
export { getSystemConfig };
export { getSystemLogs };
export { getNotifications };

export { getActivity, exportActivityCSV, exportActivityJSON };
export { postLogout };
export { getDashboard };
export { getPortfolio };
export { getPortfolioPage };
export { getCollaborate };
export { getNewProject };
export { getExploreIdeas };

export { getChat };
export { getTasks };
export { getFiles };
export { getTeam };
export { getCalendar };
export { getActivityCollaborate };
export { getSettingsCollaborate };

export { getDashboardActivityLog };

// Admin routes setup
export default function adminRoutes(app) {
  // Root route - redirect to dashboard overview (no auth required for redirect)
  app.get('/', (req, res) => {
    res.redirect('/admin/dashboard');
  });

  // Main pages (client-side auth protection via main layout)

  app.get('/admin/profile-settings', checkAuth, getProfileSettings);
  app.get('/admin/settings', checkAuth, getSettings);
  app.get('/admin/system-health', getSystemHealth);
  app.get('/admin/system-config', getSystemConfig);
  app.get('/admin/system-logs', getSystemLogs);
  app.get('/admin/notifications', getNotifications);

  app.get('/admin/activity', getActivity);
  app.post('/admin/logout', postLogout);

  // Overview pages (client-side auth protection via main layout)
  app.get('/admin/dashboard', getDashboard);
  app.get('/admin/portfolio', getPortfolio);
  app.get('/admin/collaborate', getCollaborate);
  app.get('/admin/new-project', getNewProject);
  app.get('/admin/explore-ideas', getExploreIdeas);

  // Other pages (client-side auth protection)

  app.get('/admin/other-pages/profile-settings', checkAuth, getProfileSettings);
  app.post(
    '/admin/other-pages/profile-settings',
    checkAuth,
    postProfileSettings
  );
  app.get('/admin/other-pages/settings', getSettings);
  app.post('/admin/other-pages/settings', postSettings);
  app.get('/admin/other-pages/system-health', getSystemHealth);
  app.get('/admin/other-pages/system-config', getSystemConfig);
  app.get('/admin/other-pages/system-logs', getSystemLogs);
  app.get('/admin/other-pages/notifications', getNotifications);
  app.get('/admin/other-pages/activity', getActivity);
  app.get('/admin/other-pages/activity/export/csv', exportActivityCSV);
  app.get('/admin/other-pages/activity/export/json', exportActivityJSON);
  app.get('/admin/other-pages/dashboard', getDashboard);
  app.get('/admin/other-pages/portfolio', getPortfolio);
  app.get('/pages/portfolio', getPortfolioPage);
  app.get('/admin/other-pages/collaborate', getCollaborate);
  app.get('/admin/other-pages/new-project', getNewProject);
  app.get('/admin/other-pages/explore-ideas', getExploreIdeas);

  // Collaboration pages
  app.get('/pages/collaborate/chat', getChat);
  app.get('/pages/collaborate/tasks', getTasks);
  app.get('/pages/collaborate/files', getFiles);
  app.get('/pages/collaborate/team', getTeam);
  app.get('/pages/collaborate/calendar', getCalendar);
  app.get('/pages/collaborate/activity', getActivityCollaborate);
  app.get('/pages/collaborate/settings', getSettingsCollaborate);

  // Help pages
  app.get('/pages/help', getHelp);

  // Learn pages
  app.get('/pages/learn', getLearn);

  // Settings pages
  app.get('/pages/settings', getSettingsPage);

  // Billing pages
  app.get('/pages/billing', getBilling);

  // Dashboard pages
  app.get('/dashboard', getDashboardMain);
  app.get('/dashboard/overview', getDashboardOverview);
  app.get('/dashboard/idea', getDashboardIdea);
  app.get('/dashboard/business', getDashboardBusiness);
  app.get('/dashboard/financial', getDashboardFinancial);
  app.get('/dashboard/marketing', getDashboardMarketing);
  app.get('/dashboard/fund', getDashboardFund);
  app.get('/dashboard/team', getDashboardTeam);
  app.get('/dashboard/promote', getDashboardPromote);
  app.get('/dashboard/activity-log', getDashboardActivityLog);
}
