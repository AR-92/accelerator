import logger from '../../../utils/logger.js';
import { databaseService } from '../../../services/index.js';
import { serviceFactory } from '../../../services/serviceFactory.js';
import {
  validateCollaborationCreation,
  validateCollaborationUpdate,
  validateCollaborationDeletion,
} from '../../../middleware/validation/index.js';
import { formatDate } from '../../../helpers/format/index.js';
import { isHtmxRequest } from '../../../helpers/http/index.js';

// Collaborations API
export const getCollaborations = async (req, res) => {
  try {
    const {
      search,
      user_id,
      project_id,
      status,
      page = 1,
      limit = 10,
    } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    let query = databaseService.supabase
      .from('collaborations')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`message.ilike.%${search}%`);
    }

    if (user_id) {
      query = query.eq('user_id', user_id);
    }

    if (project_id) {
      query = query.eq('project_id', project_id);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const {
      data: collaborations,
      error,
      count,
    } = await query.range((pageNum - 1) * limitNum, pageNum * limitNum - 1);

    if (error) throw error;

    const total = count || 0;
    logger.info(`Fetched ${collaborations.length} of ${total} collaborations`);

    if (isHtmxRequest(req)) {
      const collaborationHtml = collaborations
        .map(
          (collaboration) => `
        <tr class="border-b border-gray-100/40 hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors duration-150">
          <td class="px-6 py-4">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10">
                <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span class="text-lg">🤝</span>
                </div>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">Collaboration #${collaboration.id}</div>
                <div class="text-sm text-gray-500">${collaboration.role}</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4 text-sm text-gray-900">${collaboration.user_id}</td>
          <td class="px-6 py-4 text-sm text-gray-900">${collaboration.project_id}</td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              collaboration.status === 'active'
                ? 'bg-green-100 text-green-800'
                : collaboration.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
            }">${collaboration.status}</span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-900">${formatDate(collaboration.created_at)}</td>
          <td class="px-6 py-4">
            <div class="relative">
              <button onclick="toggleActionMenu('collaboration', ${collaboration.id})" class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black dark:text-white transition-colors">
                <svg class="w-4 h-4 lucide lucide-ellipsis-vertical" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
              </button>
              <div id="actionMenu-collaboration-${collaboration.id}" class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div class="py-1">
                  <a href="/admin/table-pages/collaborations/${collaboration.id}" class="flex items-center px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    View Details
                  </a>
                  <button onclick="editCollaboration(${collaboration.id})" class="flex items-center w-full px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                    </svg>
                    Edit Collaboration
                  </button>
                  <button onclick="deleteCollaboration(${collaboration.id})" class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
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

      const paginationHtml = generatePaginationHtml(
        pageNum,
        limitNum,
        total,
        req.query,
        'collaborations'
      );
      res.send(collaborationHtml + paginationHtml);
    } else {
      res.json({
        success: true,
        data: collaborations,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    }
  } catch (error) {
    logger.error('Error fetching collaborations:', error);
    if (isHtmxRequest(req)) {
      res
        .status(500)
        .send('<p class="text-red-500">Error loading collaborations</p>');
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

export const createCollaboration = [
  validateCollaborationCreation,
  async (req, res) => {
    try {
      const { user_id, project_id, role, permissions, status } = req.body;

      const { data: collaboration, error } = await databaseService.supabase
        .from('collaborations')
        .insert([
          {
            user_id,
            project_id,
            role,
            permissions,
            status: status || 'pending',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      logger.info(`Created collaboration with ID: ${collaboration.id}`);

      if (isHtmxRequest(req)) {
        const collaborationHtml = `
          <tr class="border-b border-gray-100/40 hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors duration-150">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span class="text-lg">🤝</span>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">Collaboration #${collaboration.id}</div>
                  <div class="text-sm text-gray-500">${collaboration.role}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">${collaboration.user_id}</td>
            <td class="px-6 py-4 text-sm text-gray-900">${collaboration.project_id}</td>
            <td class="px-6 py-4">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                collaboration.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : collaboration.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
              }">${collaboration.status}</span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">${formatDate(collaboration.created_at)}</td>
            <td class="px-6 py-4">
              <div class="relative">
                <button onclick="toggleActionMenu('collaboration', ${collaboration.id})" class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black dark:text-white transition-colors">
                  <svg class="w-4 h-4 lucide lucide-ellipsis-vertical" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                  </svg>
                </button>
                <div id="actionMenu-collaboration-${collaboration.id}" class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div class="py-1">
                    <a href="/admin/table-pages/collaborations/${collaboration.id}" class="flex items-center px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                      <svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      View Details
                    </a>
                    <button onclick="editCollaboration(${collaboration.id})" class="flex items-center w-full px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                      <svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                      </svg>
                      Edit Collaboration
                    </button>
                    <button onclick="deleteCollaboration(${collaboration.id})" class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
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
                <div class="flex-1">Collaboration created successfully!</div>
              </div>
            </div>
          </div>
          <script>
            setTimeout(() => document.querySelector('.fixed').remove(), 3000);
            htmx.trigger('#collaborationsTableContainer', 'collaborationCreated');
          </script>
        `;

        res.send(alertHtml + collaborationHtml);
      } else {
        res.status(201).json({ success: true, data: collaboration });
      }
    } catch (error) {
      logger.error('Error creating collaboration:', error);
      if (isHtmxRequest(req)) {
        res.status(500).send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="flex-1">Failed to create collaboration: ${error.message}</div>
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

export const updateCollaboration = [
  validateCollaborationUpdate,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { user_id, project_id, role, permissions, status } = req.body;

      const { data: collaboration, error } = await databaseService.supabase
        .from('collaborations')
        .update({
          user_id,
          project_id,
          role,
          permissions,
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      logger.info(`Updated collaboration with ID: ${id}`);

      if (isHtmxRequest(req)) {
        const collaborationHtml = `
          <tr class="border-b border-gray-100/40 hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors duration-150">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span class="text-lg">🤝</span>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">Collaboration #${collaboration.id}</div>
                  <div class="text-sm text-gray-500">${collaboration.role}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">${collaboration.user_id}</td>
            <td class="px-6 py-4 text-sm text-gray-900">${collaboration.project_id}</td>
            <td class="px-6 py-4">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                collaboration.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : collaboration.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
              }">${collaboration.status}</span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">${formatDate(collaboration.created_at)}</td>
            <td class="px-6 py-4">
              <div class="relative">
                <button onclick="toggleActionMenu('collaboration', ${collaboration.id})" class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black dark:text-white transition-colors">
                  <svg class="w-4 h-4 lucide lucide-ellipsis-vertical" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                  </svg>
                </button>
                <div id="actionMenu-collaboration-${collaboration.id}" class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div class="py-1">
                    <a href="/admin/table-pages/collaborations/${collaboration.id}" class="flex items-center px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                      <svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      View Details
                    </a>
                    <button onclick="editCollaboration(${collaboration.id})" class="flex items-center w-full px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                      <svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                      </svg>
                      Edit Collaboration
                    </button>
                    <button onclick="deleteCollaboration(${collaboration.id})" class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
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
                <div class="flex-1">Collaboration updated successfully!</div>
              </div>
            </div>
          </div>
          <script>
            setTimeout(() => document.querySelector('.fixed').remove(), 3000);
          </script>
        `;

        res.send(alertHtml + collaborationHtml);
      } else {
        res.json({ success: true, data: collaboration });
      }
    } catch (error) {
      logger.error('Error updating collaboration:', error);
      if (isHtmxRequest(req)) {
        res.status(500).send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="flex-1">Failed to update collaboration: ${error.message}</div>
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

export const deleteCollaboration = [
  validateCollaborationDeletion,
  async (req, res) => {
    try {
      const { id } = req.params;

      // First check if collaboration exists
      const { data: existingCollaboration, error: fetchError } =
        await databaseService.supabase
          .from('collaborations')
          .select('*')
          .eq('id', id)
          .single();

      if (fetchError) throw fetchError;
      if (!existingCollaboration) {
        return res
          .status(404)
          .json({ success: false, error: 'Collaboration not found' });
      }

      const { error } = await databaseService.supabase
        .from('collaborations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      logger.info(`Deleted collaboration with ID: ${id}`);

      if (isHtmxRequest(req)) {
        res.send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                <div class="flex-1">Collaboration has been deleted!</div>
              </div>
            </div>
          </div>
          <script>
            setTimeout(() => document.querySelector('.fixed').remove(), 3000);
          </script>
        `);
      } else {
        res.json({
          success: true,
          message: 'Collaboration deleted successfully',
        });
      }
    } catch (error) {
      logger.error('Error deleting collaboration:', error);
      if (isHtmxRequest(req)) {
        res.status(500).send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="flex-1">Failed to delete collaboration: ${error.message}</div>
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

// Helper function to generate pagination HTML
const generatePaginationHtml = (page, limit, total, query, entity) => {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return '';

  const search = query.search || '';
  const user_id = query.user_id || '';
  const project_id = query.project_id || '';
  const status = query.status || '';
  const params = `limit=${limit}&search=${encodeURIComponent(search)}&user_id=${user_id}&project_id=${project_id}&status=${status}`;

  let html = `<div class="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border">`;
  if (page > 1) {
    html += `<button hx-get="/api/${entity}?page=${page - 1}&${params}" hx-target="#${entity}TableContainer" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"></button>`;
  } else {
  }

  // Page number buttons
  html += `<div class="flex items-center space-x-2">
    <div class="flex items-center space-x-1">`;
  const maxVisiblePages = 5;
  let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    if (i === page) {
      html += `<span class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground h-9 w-9">${i}</span>`;
    } else {
      html += `<button hx-get="/api/${entity}?page=${i}&${params}" hx-target="#${entity}TableContainer" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9">${i}</button>`;
    }
  }
  html += `</div>
    <form hx-get="/api/${entity}" hx-target="#${entity}TableContainer" class="flex items-center space-x-1">
      <input type="hidden" name="limit" value="${limit}">
      <input type="hidden" name="search" value="${search}">
      <input type="hidden" name="user_id" value="${user_id}">
      <input type="hidden" name="project_id" value="${project_id}">
      <input type="hidden" name="status" value="${status}">
      <input type="number" name="page" min="1" max="${totalPages}" value="${page}" placeholder="Page" class="w-16 h-8 text-xs text-center rounded border border-input bg-background focus:outline-none">
      <button type="submit" class="inline-flex items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-2">Go</button>
    </form>
  </div>`;

  if (page < totalPages) {
    html += `<button hx-get="/api/${entity}?page=${page + 1}&${params}" hx-target="#${entity}TableContainer" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>/button>`;
  } else {
  }
  html += `</div>`;
  return html;
};

// Bulk action handler
export const bulkAction = async (req, res) => {
  try {
    const { action, ids } = req.body;

    if (!action || !ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Action and ids array are required',
      });
    }

    const collaborationService = serviceFactory.getCollaborationService();
    const results = [];
    const errors = [];

    for (const id of ids) {
      try {
        let result;
        switch (action) {
          case 'archive':
            result = await collaborationService.archiveCollaboration(id);
            break;
          case 'delete':
            await collaborationService.deleteCollaboration(id);
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
      `Bulk ${action} completed for ${results.length} collaborations, ${errors.length} errors`
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
          htmx.ajax('GET', window.location.pathname + window.location.search, {target: '#collaborationsTableContainer'});
          htmx.ajax('GET', window.location.pathname + '/filter-nav' + window.location.search, {target: '#filter-links'});
        </script>
      `);
    } else {
      res.json({
        success: true,
        data: { results, errors },
        message: `Bulk ${action} completed for ${results.length} collaborations`,
      });
    }
  } catch (error) {
    logger.error('Error in bulk action:', error);
    if (isHtmxRequest(req)) {
      res.status(500).send(`
        <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
          <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
            <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div class="flex-1">Bulk action failed: ${error.message}</div>
          </div>
        </div>
      `);
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// Route setup function
export default function collaborationsRoutes(app) {
  app.get('/api/collaborations', getCollaborations);
  app.post('/api/collaborations', ...createCollaboration);
  app.put('/api/collaborations/:id', ...updateCollaboration);
  app.post('/api/collaborations/bulk-action', bulkAction);
  app.delete('/api/collaborations/:id', ...deleteCollaboration);
}
