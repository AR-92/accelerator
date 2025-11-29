// Import API route setup functions from organized folders

// Admin API routes

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

// API routes setup
export default function apiRoutes(app) {
  // Admin API routes

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
}
