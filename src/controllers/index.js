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

import { requireWebAuth } from '../middleware/auth/index.js';

// Admin routes setup
export default function adminRoutes(app) {
  // Root route - redirect to dashboard overview
  app.get('/', requireWebAuth, (req, res) => {
    res.redirect('/dashboard');
  });

  // Main pages (server-side auth protection)
  app.get('/admin/profile-settings', requireWebAuth, getProfileSettings);
  app.get('/admin/settings', requireWebAuth, getSettings);
  app.get('/admin/system-health', requireWebAuth, getSystemHealth);
  app.get('/admin/system-config', requireWebAuth, getSystemConfig);
  app.get('/admin/system-logs', requireWebAuth, getSystemLogs);
  app.get('/admin/notifications', requireWebAuth, getNotifications);

  app.get('/admin/activity', requireWebAuth, getActivity);
  app.post('/admin/logout', postLogout);

  // Overview pages (server-side auth protection)
  app.get('/admin/dashboard', requireWebAuth, getDashboard);
  app.get('/admin/portfolio', requireWebAuth, getPortfolio);
  app.get('/admin/collaborate', requireWebAuth, getCollaborate);
  app.get('/admin/new-project', requireWebAuth, getNewProject);
  app.get('/admin/explore-ideas', requireWebAuth, getExploreIdeas);

  // Other pages (server-side auth protection)
  app.get(
    '/admin/other-pages/profile-settings',
    requireWebAuth,
    getProfileSettings
  );
  app.post(
    '/admin/other-pages/profile-settings',
    requireWebAuth,
    postProfileSettings
  );
  app.get('/admin/other-pages/settings', requireWebAuth, getSettings);
  app.post('/admin/other-pages/settings', requireWebAuth, postSettings);
  app.get('/admin/other-pages/system-health', requireWebAuth, getSystemHealth);
  app.get('/admin/other-pages/system-config', requireWebAuth, getSystemConfig);
  app.get('/admin/other-pages/system-logs', requireWebAuth, getSystemLogs);
  app.get('/admin/other-pages/notifications', requireWebAuth, getNotifications);
  app.get('/admin/other-pages/activity', requireWebAuth, getActivity);
  app.get(
    '/admin/other-pages/activity/export/csv',
    requireWebAuth,
    exportActivityCSV
  );
  app.get(
    '/admin/other-pages/activity/export/json',
    requireWebAuth,
    exportActivityJSON
  );
  app.get('/admin/other-pages/dashboard', requireWebAuth, getDashboard);
  app.get('/admin/other-pages/portfolio', requireWebAuth, getPortfolio);
  app.get('/pages/portfolio', requireWebAuth, getPortfolioPage);
  app.get('/admin/other-pages/collaborate', requireWebAuth, getCollaborate);
  app.get('/admin/other-pages/new-project', requireWebAuth, getNewProject);
  app.get('/admin/other-pages/explore-ideas', requireWebAuth, getExploreIdeas);

  // Collaboration pages
  app.get('/pages/collaborate/chat', requireWebAuth, getChat);
  app.get('/pages/collaborate/tasks', requireWebAuth, getTasks);
  app.get('/pages/collaborate/files', requireWebAuth, getFiles);
  app.get('/pages/collaborate/team', requireWebAuth, getTeam);
  app.get('/pages/collaborate/calendar', requireWebAuth, getCalendar);
  app.get(
    '/pages/collaborate/activity',
    requireWebAuth,
    getActivityCollaborate
  );
  app.get(
    '/pages/collaborate/settings',
    requireWebAuth,
    getSettingsCollaborate
  );

  // Help pages
  app.get('/pages/help', requireWebAuth, getHelp);

  // Learn pages
  app.get('/pages/learn', requireWebAuth, getLearn);

  // Settings pages
  app.get('/pages/settings', requireWebAuth, getSettingsPage);

  // Billing pages
  app.get('/pages/billing', requireWebAuth, getBilling);

  // Dashboard pages
  app.get('/dashboard', requireWebAuth, getDashboardMain);
  app.get('/dashboard/overview', requireWebAuth, getDashboardOverview);
  app.get('/dashboard/idea', requireWebAuth, getDashboardIdea);
  app.get('/dashboard/business', requireWebAuth, getDashboardBusiness);
  app.get('/dashboard/financial', requireWebAuth, getDashboardFinancial);
  app.get('/dashboard/marketing', requireWebAuth, getDashboardMarketing);
  app.get('/dashboard/fund', requireWebAuth, getDashboardFund);
  app.get('/dashboard/team', requireWebAuth, getDashboardTeam);
  app.get('/dashboard/promote', requireWebAuth, getDashboardPromote);
  app.get('/dashboard/activity-log', requireWebAuth, getDashboardActivityLog);
}
