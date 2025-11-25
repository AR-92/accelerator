import logger from '../../../utils/logger.js';
import { databaseService } from '../../../services/index.js';
import { serviceFactory } from '../../../services/serviceFactory.js';
import {
  validateUserCreation,
  validateUserUpdate,
  validateUserDeletion,
} from '../../../middleware/validation/index.js';
import { formatDate } from '../../../helpers/format/index.js';
import { isHtmxRequest } from '../../../helpers/http/index.js';

// Users API
export const getUsers = async (req, res) => {
  try {
    const { search, role, status, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const offset = (pageNum - 1) * limitNum;
    let query = databaseService.supabase
      .from('accounts')
      .select('*', { count: 'exact' });

    if (status) query = query.eq('status', status);
    if (role) query = query.eq('role', role);
    if (search)
      query = query.or(
        `display_name.ilike.%${search}%,username.ilike.%${search}%`
      );

    const {
      data: users,
      error,
      count,
    } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    if (error) throw error;

    const total = count || 0;
    logger.info(`Fetched ${users.length} of ${total} users`);

    if (isHtmxRequest(req)) {
      // Add computed display name to each user
      const usersWithDisplayName = users.map((user) => ({
        ...user,
        displayName: user.display_name || user.username || 'User ' + user.id,
      }));

      const userHtml = usersWithDisplayName
        .map(
          (user) => `
        <tr class="border-b border-gray-100/40 hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors duration-150">
          <td class="px-6 py-4">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10">
                <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span class="text-lg">${(
                    user.displayName ||
                    user.username ||
                    'U'
                  )
                    .split(' ')
                    .map((n) => n.charAt(0))
                    .join('')
                    .toUpperCase()}</span>
                </div>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">${user.displayName || user.username || 'User ' + user.id}</div>
                <div class="text-sm text-gray-500">${user.username ? user.username + '@example.com' : 'user' + user.id + '@example.com'}</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4 text-sm text-gray-900">${user.username || 'N/A'}</td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              user.account_type === 'admin'
                ? 'bg-red-100 text-red-800'
                : user.account_type === 'moderator'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-blue-100 text-blue-800'
            }">${user.account_type || 'user'}</span>
          </td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              user.is_verified
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }">${user.is_verified ? 'active' : 'inactive'}</span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-900">${formatDate(user.created_at)}</td>
          <td class="px-6 py-4">
            <div class="relative">
              <button onclick="${'toggleActionMenu(\"user\", ' + user.id + ')'}" class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black dark:text-white transition-colors">
                <svg class="w-4 h-4 lucide lucide-ellipsis-vertical" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
              </button>
              <div id="actionMenu-user-${user.id}" class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div class="py-1">
                  <a href="/admin/table-pages/users/${user.id}" class="flex items-center px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    View Details
                  </a>
                  <button onclick='editUser(${user.id})' class="flex items-center w-full px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                    </svg>
                    Edit User
                  </button>
                  <button onclick="deleteUser(${user.id}, ${JSON.stringify(user.displayName || user.username || 'User ' + user.id)})" class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M10 11v6"></path>
                      <path d="M14 11v6"></path>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                      <path d="M3 6h18"></path>
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
        `
        )
        .join('');

      res.send(userHtml);
    } else {
      res.json({
        success: true,
        data: users,
        total,
        page: pageNum,
        limit: limitNum,
      });
    }
  } catch (error) {
    logger.error('Error creating user:', error);
    if (isHtmxRequest(req)) {
      res.status(500).send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="flex-1">Failed to create user: ${error.message}</div>
              </div>
            </div>
          </div>
        `);
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

export const createUser = [
  validateUserCreation,
  async (req, res) => {
    try {
      const { display_name, username, role, status } = req.body;

      const { data: user, error } = await databaseService.supabase
        .from('accounts')
        .insert({
          display_name,
          username,
          account_type: role,
          is_verified: status === 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;

      logger.info(`Created user with ID: ${user.id}`);

      if (isHtmxRequest(req)) {
        const userHtml = `
          <tr class="border-b border-gray-100/40 hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors duration-150">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span class="text-lg">${(
                      user.display_name ||
                      user.username ||
                      'U'
                    )
                      .split(' ')
                      .map((n) => n.charAt(0))
                      .join('')
                      .toUpperCase()}</span>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">${user.display_name || user.username || 'User ' + user.id}</div>
                  <div class="text-sm text-gray-500">${user.username ? user.username + '@example.com' : 'user' + user.id + '@example.com'}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">${user.username || 'N/A'}</td>
            <td class="px-6 py-4">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                user.account_type === 'admin'
                  ? 'bg-red-100 text-red-800'
                  : user.account_type === 'moderator'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
              }">${user.account_type}</span>
            </td>
            <td class="px-6 py-4">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                user.is_verified
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }">${user.is_verified ? 'active' : 'inactive'}</span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">${formatDate(user.created_at)}</td>
            <td class="px-6 py-4">
              <div class="relative">
                <button onclick="${'toggleActionMenu(\"user\", ' + user.id + ')'}" class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black dark:text-white transition-colors">
                  <svg class="w-4 h-4 lucide lucide-ellipsis-vertical" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                  </svg>
                </button>
                <div id="actionMenu-user-${user.id}" class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div class="py-1">
                    <a href="/admin/table-pages/users/${user.id}" class="flex items-center px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                      <svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      View Details
                    </a>
                    <button onclick='editUser(${user.id})' class="flex items-center w-full px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                      <svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                      </svg>
                      Edit User
                    </button>
                    <button onclick="deleteUser(${user.id}, ${JSON.stringify(user.display_name || user.username || 'User ' + user.id)})" class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M10 11v6"></path>
                        <path d="M14 11v6"></path>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                        <path d="M3 6h18"></path>
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        `;

        const alertHtml = `
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-green-50 text-green-800 border-green-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="flex-1">User "${user.display_name || user.username || 'User ' + user.id}" created successfully!</div>
              </div>
            </div>
          </div>
          <script>
            setTimeout(() => document.querySelector('.fixed').remove(), 3000);
          </script>
        `;

        res.send(alertHtml + userHtml);
      } else {
        res.status(201).json({ success: true, data: user });
      }
    } catch (error) {
      logger.error('Error creating user:', error);
      if (isHtmxRequest(req)) {
        res.status(500).send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="flex-1">Failed to create user: ${error.message}</div>
              </div>
            </div>
          </div>
        `);
      } else {
        res.status(500).json({ success: false, error: error.message });
      }
    }
  },
];

export const updateUser = [
  validateUserUpdate,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { display_name, username, role, status } = req.body;

      const { data: user, error } = await databaseService.supabase
        .from('accounts')
        .update({
          display_name,
          username,
          account_type: role,
          is_verified: status === 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;

      logger.info(`Updated user with ID: ${id}`);

      if (isHtmxRequest(req)) {
        const userHtml = `
          <tr class="border-b border-gray-100/40 hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors duration-150">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span class="text-lg">${(
                      user.display_name ||
                      user.username ||
                      'U'
                    )
                      .split(' ')
                      .map((n) => n.charAt(0))
                      .join('')
                      .toUpperCase()}</span>
                  </div>
                </div>
                <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">${user.display_name || user.username || 'User ' + user.id}</div>
                  <div class="text-sm text-gray-500">${user.username ? user.username + '@example.com' : 'user' + user.id + '@example.com'}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">${user.username || 'N/A'}</td>
            <td class="px-6 py-4">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                user.role === 'admin'
                  ? 'bg-red-100 text-red-800'
                  : user.role === 'moderator'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
              }">${user.role}</span>
            </td>
            <td class="px-6 py-4">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                user.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }">${user.status}</span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">${formatDate(user.created_at)}</td>
            <td class="px-6 py-4">
            <div class="relative">
              <button onclick="${'toggleActionMenu(\"user\", ' + user.id + ')'}" class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black dark:text-white transition-colors">
                  <svg class="w-4 h-4 lucide lucide-ellipsis-vertical" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                  </svg>
                </button>
                <div id="actionMenu-user-${user.id}" class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div class="py-1">
                    <a href="/admin/table-pages/users/${user.id}" class="flex items-center px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                      <svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      View Details
                    </a>
                  <button onclick='editUser(${user.id})' class="flex items-center w-full px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                      <svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                      </svg>
                      Edit User
                    </button>
                    <button onclick="deleteUser(${user.id}, ${JSON.stringify(user.display_name || user.username || 'User ' + user.id)})" class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M10 11v6"></path>
                        <path d="M14 11v6"></path>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                        <path d="M3 6h18"></path>
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        `;

        const alertHtml = `
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-green-50 text-green-800 border-green-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="flex-1">User "${user.display_name || user.username || 'User ' + user.id}" updated successfully!</div>
              </div>
            </div>
          </div>
          <script>
            setTimeout(() => document.querySelector('.fixed').remove(), 3000);
          </script>
        `;

        res.send(alertHtml + userHtml);
      } else {
        res.json({ success: true, data: user });
      }
    } catch (error) {
      logger.error('Error creating user:', error);
      if (isHtmxRequest(req)) {
        res.status(500).send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="flex-1">Failed to create user: ${error.message}</div>
              </div>
            </div>
          </div>
        `);
      } else {
        res.status(500).json({ success: false, error: error.message });
      }
    }
  },
];

export const deleteUser = [
  validateUserDeletion,
  async (req, res) => {
    try {
      const { id } = req.params;

      // First check if user exists
      const { data: existingUser, error: findError } =
        await databaseService.supabase
          .from('accounts')
          .select('*')
          .eq('id', id)
          .single();
      if (findError || !existingUser) {
        return res
          .status(404)
          .json({ success: false, error: 'User not found' });
      }

      const { error: deleteError } = await databaseService.supabase
        .from('accounts')
        .delete()
        .eq('id', id);
      if (deleteError) throw deleteError;

      const fullName =
        existingUser.display_name ||
        existingUser.username ||
        'User ' + existingUser.id;
      logger.info(`Deleted user with ID: ${id}`);

      if (isHtmxRequest(req)) {
        res.send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                <div class="flex-1">User "${fullName}" has been deleted!</div>
              </div>
            </div>
          </div>
          <script>
            setTimeout(() => document.querySelector('.fixed').remove(), 3000);
          </script>
        `);
      } else {
        res.json({ success: true, message: 'User deleted successfully' });
      }
    } catch (error) {
      logger.error('Error fetching users:', error);
      if (isHtmxRequest(req)) {
        res.status(500).send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="flex-1">Failed to fetch users: ${error.message}</div>
              </div>
            </div>
          </div>
        `);
      } else {
        res.status(500).json({ success: false, error: error.message });
      }
    }
  },
];

export const bulkAction = async (req, res) => {
  try {
    const { action, ids } = req.body;

    if (!action || !ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Action and ids array are required',
      });
    }

    const accountService = serviceFactory.getAccountService();
    const results = [];
    const errors = [];

    for (const id of ids) {
      try {
        let result;
        switch (action) {
          case 'activate':
            result = await accountService.activateAccount(id);
            break;
          case 'deactivate':
            result = await accountService.deactivateAccount(id);
            break;
          case 'delete':
            await accountService.deleteAccount(id);
            result = { id, deleted: true };
            break;
          default:
            throw new Error(`Unknown action: ${action}`);
        }
        results.push(result);
      } catch (error) {
        errors.push({ id, error: error.message });
      }
    }

    logger.info(
      `Bulk ${action} completed for ${results.length} accounts, ${errors.length} errors`
    );

    if (isHtmxRequest(req)) {
      const successCount = results.length;
      const errorCount = errors.length;
      res.send(`
        <div class="fixed top-4 right-4 z-50 max-w-sm w-full bg-green-50 text-green-800 border border-green-200 rounded-lg px-4 py-3 text-sm">
          <div class="flex items-start gap-3">
            <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div class="flex-1">
              Bulk ${action} completed: ${successCount} successful${errorCount > 0 ? `, ${errorCount} errors` : ''}!
            </div>
          </div>
        </div>
        <script>
          htmx.ajax('GET', window.location.pathname + window.location.search, {target: '#usersTableContainer'});
          htmx.ajax('GET', window.location.pathname + '/filter-nav' + window.location.search, {target: '#filter-links'});
        </script>
      `);
    } else {
      res.json({
        success: true,
        data: { results, errors },
        message: `Bulk ${action} completed for ${results.length} accounts`,
      });
    }
  } catch (error) {
    logger.error('Error in bulk action:', error);
    if (isHtmxRequest(req)) {
      res.status(500).send(`
        <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
          <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
            <div class="flex items-start gap-3">
              <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="flex-1">Bulk action failed: ${error.message}</div>
            </div>
          </div>
        </div>
      `);
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// Route setup function
export default function usersRoutes(app) {
  app.get('/api/users', getUsers);
  app.post('/api/users', ...createUser);
  app.put('/api/users/:id', ...updateUser);
  app.post('/api/users/bulk-action', bulkAction);
  app.delete('/api/users/:id', ...deleteUser);
}
