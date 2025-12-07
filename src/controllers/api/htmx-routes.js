import { authenticateUser, checkAuth } from '../../middleware/auth/index.js';
import { htmxCacheMiddleware } from '../../middleware/cache.js';
import {
  getCreditBalance,
  getBillingInfo,
  getRecentProjects,
  getRecentIdeas,
  getDashboardMetrics,
  updateTheme,
  clearCache,
} from './htmx-endpoints.js';

// HTMX API routes setup
export default function htmxRoutes(app) {
  // User data endpoints (cached for 2 minutes)
  app.get(
    '/htmx/user/credits',
    checkAuth,
    htmxCacheMiddleware(120000),
    getCreditBalance
  );
  app.get(
    '/htmx/user/billing',
    checkAuth,
    htmxCacheMiddleware(120000),
    getBillingInfo
  );

  // Dashboard data endpoints (cached for 30 seconds)
  app.get(
    '/htmx/dashboard/metrics',
    checkAuth,
    htmxCacheMiddleware(30000),
    getDashboardMetrics
  );

  // Content endpoints (cached for 1 minute)
  app.get(
    '/htmx/projects/recent',
    checkAuth,
    htmxCacheMiddleware(60000),
    getRecentProjects
  );
  app.get(
    '/htmx/ideas/recent',
    checkAuth,
    htmxCacheMiddleware(60000),
    getRecentIdeas
  );

  // Utility endpoints
  app.post('/htmx/cache/clear', authenticateUser, clearCache);
  app.post('/htmx/user/theme', checkAuth, updateTheme);
}
