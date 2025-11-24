 import logger from '../../../utils/logger.js';
 import { databaseService } from '../../../services/index.js';
 import { validateProjectCollaboratorCreation, validateProjectCollaboratorUpdate, validateProjectCollaboratorDeletion } from '../../../middleware/validation/index.js';
 import { formatDate } from '../../../helpers/format/index.js';
 import { isHtmxRequest } from '../../../helpers/http/index.js';


// Get all project collaborators with pagination and filtering
export const getProjectCollaborators = async (req, res) => {
  try {
    const { search, project_id, role, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    let query = databaseService.supabase.from('project_collaborators').select('*', { count: 'exact' });

    if (project_id) {
      query = query.eq('project_id', project_id);
    }

    if (role) {
      query = query.eq('role', role);
    }

    const { data: collaborators, error, count } = await query.range((pageNum - 1) * limitNum, pageNum * limitNum - 1);

    if (error) throw error;

    const total = count || 0;
    const filters = [];
    if (project_id) filters.push(`project_id: ${project_id}`);
    if (role) filters.push(`role: ${role}`);
    if (pageNum > 1) filters.push(`page: ${pageNum}`);
    logger.info(`Fetched ${collaborators.length} of ${total} project collaborators${filters.length ? ` (filtered by ${filters.join(', ')})` : ''}`);

    if (isHtmxRequest(req)) {
      const collaboratorHtml = collaborators.map(collaborator => `
        <tr class="border-b border-gray-100/40 hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors duration-150">
          <td class="px-6 py-4">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10">
                <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span class="text-lg">👥</span>
                </div>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">Project ${collaborator.project_id}</div>
                <div class="text-sm text-gray-500">User ${collaborator.user_id}</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              collaborator.role === 'owner' ? 'bg-red-100 text-red-800' :
              collaborator.role === 'admin' ? 'bg-yellow-100 text-yellow-800' :
              collaborator.role === 'editor' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
            }">${collaborator.role}</span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-900">${formatDate(collaborator.joined_at)}</td>
          <td class="px-6 py-4">
            <div class="relative">
              <button onclick="toggleActionMenu('project-collaborator', ${collaborator.id})" class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black dark:text-white transition-colors">
                <svg class="w-4 h-4 lucide lucide-ellipsis-vertical" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
              </button>
              <div id="actionMenu-project-collaborator-${collaborator.id}" class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div class="py-1">
                  <a href="/admin/table-pages/project-collaborators/${collaborator.id}" class="flex items-center px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    View Details
                  </a>
                  <button onclick="editProjectCollaborator(${collaborator.id})" class="flex items-center w-full px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                    </svg>
                    Edit Collaborator
                  </button>
                  <button onclick="removeProjectCollaborator(${collaborator.id})" class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <svg class="w-4 h-4 mr-3 lucide lucide-user-minus" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <line x1="17" y1="11" x2="22" y2="11"></line>
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      `).join('');

      const paginationHtml = generatePaginationHtml(pageNum, limitNum, total, req.query);
      res.send(collaboratorHtml + paginationHtml);
    } else {
      res.json({ success: true, data: collaborators, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
    }
  } catch (error) {
    logger.error('Error fetching project collaborators:', error);
    if (isHtmxRequest(req)) {
      res.status(500).send('<p class="text-red-500">Error loading project collaborators</p>');
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// Get single project collaborator by ID
export const getProjectCollaborator = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: collaborator, error } = await databaseService.supabase
      .from('project_collaborators')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!collaborator) {
      return res.status(404).json({ success: false, error: 'Project collaborator not found' });
    }

    res.json({ success: true, data: collaborator });
  } catch (error) {
    logger.error('Error fetching project collaborator:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create new project collaborator
export const createProjectCollaborator = [
  validateProjectCollaboratorCreation,
  async (req, res) => {
    try {
      const collaboratorData = req.body;

      const { data: collaborator, error } = await databaseService.supabase
        .from('project_collaborators')
        .insert([collaboratorData])
        .select()
        .single();

      if (error) throw error;

      logger.info(`Created project collaborator with ID: ${collaborator.id}`);

      if (isHtmxRequest(req)) {
        res.send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-green-50 text-green-800 border-green-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="flex-1">Project collaborator added successfully!</div>
              </div>
            </div>
          </div>
          <script>
            setTimeout(() => document.querySelector('.fixed').remove(), 5000);
            htmx.trigger('#projectCollaboratorsTableContainer', 'projectCollaboratorCreated');
          </script>
        `);
      } else {
        res.status(201).json({ success: true, data: collaborator });
      }
    } catch (error) {
      logger.error('Error creating project collaborator:', error);
      if (isHtmxRequest(req)) {
        res.status(500).send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="flex-1">Failed to add project collaborator: ${error.message}</div>
              </div>
            </div>
          </div>
        `);
      } else {
        res.status(500).json({ success: false, error: error.message });
      }
    }
  }
];

// Update project collaborator
export const updateProjectCollaborator = [
  validateProjectCollaboratorUpdate,
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const { data: collaborator, error } = await databaseService.supabase
        .from('project_collaborators')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!collaborator) {
        return res.status(404).json({ success: false, error: 'Project collaborator not found' });
      }

      logger.info(`Updated project collaborator with ID: ${id}`);

      if (isHtmxRequest(req)) {
        res.send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-green-50 text-green-800 border-green-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                <div class="flex-1">Project collaborator updated successfully!</div>
              </div>
            </div>
          </div>
          <script>
            setTimeout(() => document.querySelector('.fixed').remove(), 5000);
            htmx.trigger('#projectCollaboratorsTableContainer', 'projectCollaboratorUpdated');
          </script>
        `);
      } else {
        res.json({ success: true, data: collaborator });
      }
    } catch (error) {
      logger.error('Error updating project collaborator:', error);
      if (isHtmxRequest(req)) {
        res.status(500).send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="flex-1">Failed to update project collaborator: ${error.message}</div>
              </div>
            </div>
          </div>
        `);
      } else {
        res.status(500).json({ success: false, error: error.message });
      }
    }
  }
];

// Delete project collaborator
export const deleteProjectCollaborator = [
  validateProjectCollaboratorDeletion,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Check if collaborator exists
      const { data: existingCollaborator, error: fetchError } = await databaseService.supabase
        .from('project_collaborators')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      if (!existingCollaborator) {
        return res.status(404).json({ success: false, error: 'Project collaborator not found' });
      }

      const { error } = await databaseService.supabase
        .from('project_collaborators')
        .delete()
        .eq('id', id);

      if (error) throw error;

      logger.info(`Deleted project collaborator with ID: ${id}`);

      if (isHtmxRequest(req)) {
        res.send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                <div class="flex-1">Project collaborator has been removed!</div>
              </div>
            </div>
          </div>
          <script>
            setTimeout(() => document.querySelector('.fixed').remove(), 5000);
            htmx.trigger('#projectCollaboratorsTableContainer', 'projectCollaboratorDeleted');
          </script>
        `);
      } else {
        res.json({ success: true, message: 'Project collaborator removed successfully' });
      }
    } catch (error) {
      logger.error('Error deleting project collaborator:', error);
      if (isHtmxRequest(req)) {
        res.status(500).send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="flex-1">Failed to remove project collaborator: ${error.message}</div>
            </div>
          </div>
        `);
      } else {
        res.status(500).json({ success: false, error: error.message });
      }
    }
  }
];

// Helper function to generate pagination HTML
const generatePaginationHtml = (page, limit, total, query) => {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return '';

  const project_id = query.project_id || '';
  const role = query.role || '';
  const params = `limit=${limit}&project_id=${project_id}&role=${role}`;

  let html = `<div class="flex items-center justify-between mt-4 pt-4 border-t">`;
  if (page > 1) {
    html += `<button hx-get="/api/project-collaborators?page=${page-1}&${params}" hx-target="#projectCollaboratorsTableContainer" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">Previous</button>`;
  } else {
    html += `<span></span>`;
  }

  // Page number buttons
  html += `<div class="flex items-center space-x-2">`;
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
      html += `<button hx-get="/api/project-collaborators?page=${i}&${params}" hx-target="#projectCollaboratorsTableContainer" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9">${i}</button>`;
    }
  }
  html += `</div>`;

  if (page < totalPages) {
    html += `<button hx-get="/api/project-collaborators?page=${page+1}&${params}" hx-target="#projectCollaboratorsTableContainer" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">Next</button>`;
  } else {
    html += `<span></span>`;
  }
  html += `</div>`;
  return html;
};

// Route setup function
export default function projectCollaboratorsRoutes(app) {
  app.get('/api/project-collaborators', getProjectCollaborators);
  app.get('/api/project-collaborators/:id', getProjectCollaborator);
  app.post('/api/project-collaborators', ...createProjectCollaborator);
  app.put('/api/project-collaborators/:id', ...updateProjectCollaborator);
  app.delete('/api/project-collaborators/:id', ...deleteProjectCollaborator);
}