import logger from '../../../utils/logger.js';
import { databaseService } from '../../../services/index.js';

// Settings API
export const getSettings = async (req, res) => {
  try {
    const { data: settings, error } = await databaseService.supabase
      .from('settings')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is not found

    logger.info('Fetched system settings');

    if (isHtmxRequest(req)) {
      const settingsHtml = settings
        ? `
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">System Settings</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Site Name</label>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">${settings.site_name || 'N/A'}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Maintenance Mode</label>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">${settings.maintenance_mode ? 'Enabled' : 'Disabled'}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Default Language</label>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">${settings.default_language || 'English'}</p>
            </div>
          </div>
        </div>
      `
        : '<p class="text-gray-500">Settings not found</p>';
      res.send(settingsHtml);
    } else {
      res.json({ success: true, data: settings });
    }
  } catch (error) {
    logger.error('Error fetching settings:', error);
    if (isHtmxRequest(req)) {
      res
        .status(500)
        .send('<p class="text-red-500">Error loading settings</p>');
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// Route setup function
export default function settingsRoutes(app) {
  app.get('/api/settings', getSettings);
}
