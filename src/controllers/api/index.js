// Import API route setup functions from organized folders
import { authenticateUser } from '../../middleware/auth/index.js';

// Admin API routes
import profileSettingsRoutes from './admin/get-profile-settings.js';
import settingsRoutes from './admin/get-settings.js';
import systemHealthRoutes from './admin/get-system-health.js';
import activityRoutes from './admin/get-activity.js';
import notificationsRoutes from './admin/get-notifications.js';

// Overview API routes
import mainRoutes from './overview/get-main.js';

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
}
