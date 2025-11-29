import logger from '../../../utils/logger.js';
import { databaseService } from '../../../services/index.js';
import { authenticateUser, requireAuth } from '../../../middleware/auth/index.js';
import { isHtmxRequest } from '../../../helpers/http/index.js';

// Main API
export const getMain = async (req, res) => {
  try {
    // Fetch main overview data
    const [
      { count: totalUsers },
      { count: totalProjects },
      { count: totalIdeas },
      { count: activeCollaborations },
    ] = await Promise.all([
      databaseService.supabase
        .from('accounts')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('projects')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('ideas')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('collaborations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active'),
    ]);

    const data = {
      totalUsers: totalUsers || 0,
      totalProjects: totalProjects || 0,
      totalIdeas: totalIdeas || 0,
      activeCollaborations: activeCollaborations || 0,
    };

    logger.info('Fetched main overview data');

    if (isHtmxRequest(req)) {
      const mainHtml = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-card rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-blue-100 rounded-lg">
                {{{icon 'users' class='w-6 h-6 text-blue-600'}}}
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">${data.totalUsers}</p>
              </div>
            </div>
          </div>
          <div class="bg-card rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-green-100 rounded-lg">
                {{{icon 'folder' class='w-6 h-6 text-green-600'}}}
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">${data.totalProjects}</p>
              </div>
            </div>
          </div>
          <div class="bg-card rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-purple-100 rounded-lg">
                {{{icon 'lightbulb' class='w-6 h-6 text-purple-600'}}}
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Ideas</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">${data.totalIdeas}</p>
              </div>
            </div>
          </div>
          <div class="bg-card rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-yellow-100 rounded-lg">
                {{{icon 'users' class='w-6 h-6 text-yellow-600'}}}
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Collaborations</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">${data.activeCollaborations}</p>
              </div>
            </div>
          </div>
        </div>
      `;
      res.send(mainHtml);
    } else {
      res.json({ success: true, data });
    }
  } catch (error) {
    logger.error('Error fetching main data:', error);
    if (isHtmxRequest(req)) {
      res
        .status(500)
        .send('<p class="text-red-500">Error loading main data</p>');
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// Route setup function
export default function mainRoutes(app) {
  app.get('/api/main', authenticateUser, getMain);
}
