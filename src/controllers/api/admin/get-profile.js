import logger from '../../../utils/logger.js';
import { databaseService } from '../../../services/index.js';


// Profile API
export const getProfile = async (req, res) => {
  try {
    // Assuming user ID from session or auth
    const userId = req.user?.id || 1; // Placeholder, adjust based on auth

    const { data: profile, error } = await databaseService.supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is not found

    logger.info(`Fetched profile for user ${userId}`);

    if (isHtmxRequest(req)) {
      const profileHtml = profile ? `
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Profile Information</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">${profile.first_name || 'N/A'}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">${profile.last_name || 'N/A'}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">${profile.email || 'N/A'}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">${profile.bio || 'N/A'}</p>
            </div>
          </div>
        </div>
      ` : '<p class="text-gray-500">Profile not found</p>';
      res.send(profileHtml);
    } else {
      res.json({ success: true, data: profile });
    }
  } catch (error) {
    logger.error('Error fetching profile:', error);
    if (isHtmxRequest(req)) {
      res.status(500).send('<p class="text-red-500">Error loading profile</p>');
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// Route setup function
export default function profileRoutes(app) {
  app.get('/api/profile', getProfile);
}