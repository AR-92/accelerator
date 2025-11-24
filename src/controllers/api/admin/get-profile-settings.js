import logger from '../../../utils/logger.js';
import { databaseService } from '../../../services/index.js';

// Profile Settings API
export const getProfileSettings = async (req, res) => {
  try {
    // Assuming user ID from session or auth
    const userId = req.user?.id || 1; // Placeholder, adjust based on auth

    const { data: settings, error } = await databaseService.supabase
      .from('profile_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is not found

    logger.info(`Fetched profile settings for user ${userId}`);

    if (isHtmxRequest(req)) {
      const settingsHtml = settings
        ? `
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Profile Settings</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Notifications</label>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">${settings.notifications_enabled ? 'Enabled' : 'Disabled'}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">${settings.theme || 'Default'}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Language</label>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">${settings.language || 'English'}</p>
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
    logger.error('Error fetching profile settings:', error);
    if (isHtmxRequest(req)) {
      res
        .status(500)
        .send('<p class="text-red-500">Error loading profile settings</p>');
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// Route setup function
export default function profileSettingsRoutes(app) {
  app.get('/api/profile-settings', getProfileSettings);
}
