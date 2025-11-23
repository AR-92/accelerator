import logger from '../../../utils/logger.js';
import databaseService from '../../../services/supabase.js';
import { formatDate } from '../../../helpers/format/index.js';


// System Health API
export const getSystemHealth = async (req, res) => {
  try {
    // Get system health metrics
    const health = {
      database: 'healthy',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString()
    };

    // Check database connection
    try {
      const { error } = await databaseService.supabase.from('users').select('count', { count: 'exact', head: true });
      if (error) health.database = 'unhealthy';
    } catch (dbError) {
      health.database = 'unhealthy';
    }

    logger.info('Fetched system health');

    if (isHtmxRequest(req)) {
      const healthHtml = `
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">System Health</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Database Status</label>
              <p class="mt-1 text-sm ${health.database === 'healthy' ? 'text-green-600' : 'text-red-600'}">${health.database}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Uptime</label>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">${Math.floor(health.uptime / 3600)}h ${Math.floor((health.uptime % 3600) / 60)}m</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Memory Usage</label>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">${Math.round(health.memory.heapUsed / 1024 / 1024)} MB</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Check</label>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">${formatDate(health.timestamp)}</p>
            </div>
          </div>
        </div>
      `;
      res.send(healthHtml);
    } else {
      res.json({ success: true, data: health });
    }
  } catch (error) {
    logger.error('Error fetching system health:', error);
    if (isHtmxRequest(req)) {
      res.status(500).send('<p class="text-red-500">Error loading system health</p>');
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// Route setup function
export default function systemHealthRoutes(app) {
  app.get('/api/system-health', getSystemHealth);
}