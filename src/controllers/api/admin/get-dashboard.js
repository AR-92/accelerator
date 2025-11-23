import logger from '../../../utils/logger.js';
import databaseService from '../../../services/supabase.js';


// Dashboard API
export const getDashboard = async (req, res) => {
  try {
    // Fetch dashboard stats - counts from various tables
    const [
      { count: usersCount, error: usersError },
      { count: ideasCount, error: ideasError },
      { count: projectsCount, error: projectsError },
      { count: todosCount, error: todosError }
    ] = await Promise.all([
      databaseService.supabase.from('users').select('*', { count: 'exact', head: true }),
      databaseService.supabase.from('ideas').select('*', { count: 'exact', head: true }),
      databaseService.supabase.from('projects').select('*', { count: 'exact', head: true }),
      databaseService.supabase.from('todos').select('*', { count: 'exact', head: true })
    ]);

    if (usersError) throw usersError;
    if (ideasError) throw ideasError;
    if (projectsError) throw projectsError;
    if (todosError) throw todosError;

    const stats = {
      users: usersCount || 0,
      ideas: ideasCount || 0,
      projects: projectsCount || 0,
      todos: todosCount || 0
    };

    logger.info('Fetched dashboard stats');

    if (isHtmxRequest(req)) {
      // Return HTML for HTMX requests
      const statsHtml = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-blue-100 rounded-lg">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">${stats.users}</p>
              </div>
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-green-100 rounded-lg">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Ideas</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">${stats.ideas}</p>
              </div>
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-purple-100 rounded-lg">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">${stats.projects}</p>
              </div>
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-yellow-100 rounded-lg">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Todos</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">${stats.todos}</p>
              </div>
            </div>
          </div>
        </div>
      `;
      res.send(statsHtml);
    } else {
      res.json({ success: true, data: stats });
    }
  } catch (error) {
    logger.error('Error fetching dashboard:', error);
    if (isHtmxRequest(req)) {
      res.status(500).send('<p class="text-red-500">Error loading dashboard</p>');
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// Route setup function
export default function dashboardRoutes(app) {
  app.get('/api/dashboard', getDashboard);
}