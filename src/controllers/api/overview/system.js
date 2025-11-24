import logger from '../../../utils/logger.js';
import { databaseService } from '../../../services/index.js';

// System API
export const getSystem = async (req, res) => {
  try {
    const { data: systemData, error } = await databaseService.supabase
      .from('system')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    logger.info('Fetched system data');

    if (isHtmxRequest(req)) {
      const systemHtml = systemData
        ? `
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">System Information</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Version</label>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">${systemData.version || 'N/A'}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">${systemData.status || 'N/A'}</p>
            </div>
          </div>
        </div>
      `
        : '<p class="text-gray-500">System data not found</p>';
      res.send(systemHtml);
    } else {
      res.json({ success: true, data: systemData });
    }
  } catch (error) {
    logger.error('Error fetching system data:', error);
    if (isHtmxRequest(req)) {
      res
        .status(500)
        .send('<p class="text-red-500">Error loading system data</p>');
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// Route setup function
export default function systemRoutes(app) {
  app.get('/api/system', getSystem);
}
