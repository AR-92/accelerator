// Import controllers from organized folders
import { getProfile } from './admin/get-profile.js';
import { getProfileSettings } from './admin/get-profile-settings.js';
import { getSettings } from './admin/get-settings.js';
import { getSystemHealth } from './admin/get-system-health.js';
import { getNotifications } from './admin/get-notifications.js';

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

import {
  getGenericTable,
  getRowDetail,
  getRowEdit,
  getRowCreate,
} from './table-controller.js';

import { requireAuth } from '../middleware/auth/index.js';

// Re-export for backward compatibility
export { getProfile };
export { getProfileSettings };
export { getSettings };
export { getSystemHealth };
export { getNotifications };

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
export { getGenericTable };
export { getRowDetail };
export { getRowEdit };
export { getRowCreate };

// Admin routes setup
export default function adminRoutes(app) {
  // Root route - redirect to main overview (no auth required for redirect)
  app.get('/', (req, res) => {
    res.redirect('/admin/main');
  });

  // Main pages (client-side auth protection via main layout)
  app.get('/admin/profile', getProfile);
  app.get('/admin/profile-settings', getProfileSettings);
  app.get('/admin/settings', getSettings);
  app.get('/admin/system-health', getSystemHealth);
  app.get('/admin/notifications', getNotifications);

  app.get('/admin/activity', getActivity);
  app.post('/admin/logout', postLogout);

  // Overview pages (client-side auth protection via main layout)
  app.get('/admin/main', getMain);
  app.get('/admin/content-management', getContentManagement);
  app.get('/admin/system', getSystem);
  app.get('/admin/business', getBusiness);
  app.get('/admin/learning', getLearning);
  app.get('/admin/projects', getProjects);
  app.get('/admin/help', getHelp);
  app.get('/admin/financial', getFinancial);

  // Generic table pages - handles all table operations (client-side auth protection)
  // Specific routes must come before generic ones
  app.get('/admin/table-pages/:tableName/view/:id', getRowDetail);
  app.get('/admin/table-pages/:tableName/edit/:id', getRowEdit);
  app.get('/admin/table-pages/:tableName/create', getRowCreate);
  app.get('/admin/table-pages/:tableName', getGenericTable);

  // Other pages (client-side auth protection)
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
