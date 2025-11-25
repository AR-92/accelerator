import logger from '../../../utils/logger.js';
import { databaseService } from '../../../services/index.js';
import { serviceFactory } from '../../../services/serviceFactory.js';
import {
  validateIdeaCreation,
  validateIdeaUpdate,
  validateIdeaDeletion,
} from '../../../middleware/validation/index.js';
import { formatDate } from '../../../helpers/format/index.js';
import { isHtmxRequest } from '../../../helpers/http/index.js';

// Get all ideas with pagination and filtering
export const getIdeas = async (req, res) => {
  try {
    const { search, status, type, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const filters = {};
    if (search) filters.search = search;
    if (status) filters.status = status;
    if (type) filters.type = type;

    const offset = (pageNum - 1) * limitNum;
    let query = databaseService.supabase
      .from('ideas')
      .select('*', { count: 'exact' });

    if (status) query = query.eq('status', status);
    if (type) query = query.eq('type', type);
    if (search)
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);

    const {
      data: ideas,
      error,
      count,
    } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    if (error) throw error;

    const total = count || 0;
    const filterStrings = [];
    if (search) filterStrings.push(`search: "${search}"`);
    if (status) filterStrings.push(`status: ${status}`);
    if (type) filterStrings.push(`type: ${type}`);
    if (pageNum > 1) filterStrings.push(`page: ${pageNum}`);
    logger.info(
      `Fetched ${ideas.length} of ${total} ideas${filterStrings.length ? ` (filtered by ${filterStrings.join(', ')})` : ''}`
    );

    if (isHtmxRequest(req)) {
      const ideaHtml = ideas
        .map(
          (idea) => `
        <tr class="border-b border-gray-100/40 hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors duration-150">
          <td class="px-6 py-4">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10">
                <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span class="text-sm font-medium text-primary">${idea.type_icon || '💡'}</span>
                </div>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">${idea.title}</div>
                <div class="text-sm text-gray-500">${idea.description?.substring(0, 50)}${idea.description?.length > 50 ? '...' : ''}</div>
              </div>
            </div>
          </td>
           <td class="px-6 py-4">
             <div class="text-sm text-gray-900">${idea.user_id || 'Anonymous'}</div>
           </td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              idea.status === 'active'
                ? 'bg-green-100 text-green-800'
                : idea.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
            }">${idea.status}</span>
          </td>
          <td class="px-6 py-4">
            <div class="flex items-center space-x-2">
              <button onclick="voteIdea(${idea.id}, 'up')" class="flex items-center space-x-1 text-green-600 hover:text-green-800">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                </svg>
                <span>${idea.upvotes || 0}</span>
              </button>
              <button onclick="voteIdea(${idea.id}, 'down')" class="flex items-center space-x-1 text-red-600 hover:text-red-800">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
                <span>${idea.downvotes || 0}</span>
              </button>
            </div>
          </td>
          <td class="px-6 py-4 text-sm text-gray-900">${formatDate(idea.created_at)}</td>
          <td class="px-6 py-4">
            <div class="relative">
              <button onclick="toggleActionMenu('idea', ${idea.id})" class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black dark:text-white transition-colors">
                <svg class="w-4 h-4 lucide lucide-ellipsis-vertical" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
              </button>
              <div id="actionMenu-idea-${idea.id}" class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div class="py-1">
                  <a href="/admin/table-pages/ideas/${idea.id}" class="flex items-center px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    View Details
                  </a>
                  <button onclick="editIdea(${idea.id})" class="flex items-center w-full px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                    </svg>
                    Edit Idea
                  </button>
                  <button onclick="approveIdea(${idea.id})" class="flex items-center w-full px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4 mr-3 lucide lucide-check" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                    Approve
                  </button>
                  <button onclick="rejectIdea(${idea.id})" class="flex items-center w-full px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4 mr-3 lucide lucide-x" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Reject
                  </button>
                  <button onclick="deleteIdea(${idea.id}, '${idea.title}')" class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
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
        req.query
      );
      res.send(ideaHtml + paginationHtml);
    } else {
      res.json({
        success: true,
        data: ideas,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    }
  } catch (error) {
    logger.error('Error fetching ideas:', error);
    if (isHtmxRequest(req)) {
      res.status(500).send('<p class="text-red-500">Error loading ideas</p>');
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// Get single idea by ID
export const getIdea = async (req, res) => {
  try {
    const { id } = req.params;
    const ideaService = serviceFactory.getIdeaService();
    const idea = await ideaService.getIdeaById(id);

    if (!idea) {
      return res.status(404).json({ success: false, error: 'Idea not found' });
    }

    res.json({ success: true, data: idea });
  } catch (error) {
    logger.error('Error fetching idea:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get create form
export const getCreateForm = async (req, res) => {
  const modalHtml = `
    <div data-modal-backdrop class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden" role="dialog" aria-hidden="true">
      <div class="bg-card p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4 text-card-foreground">Create New Idea</h3>
        <form hx-post="/api/ideas" hx-target="#ideasTableContainer" hx-swap="beforebegin" hx-on:htmx:after-request="this.closest('[data-modal-backdrop]').classList.add('hidden'); htmx.trigger('#ideasTableContainer', 'ideaCreated')">
          <div class="mb-4">
            <label for="ideaTitle" class="block text-sm font-medium text-card-foreground mb-2">Title</label>
            <input type="text" id="ideaTitle" name="title" placeholder="Enter idea title" required class="w-full px-3 py-2 border border-input rounded-md bg-background text-card-foreground focus:ring-2 focus:ring-primary focus:border-transparent">
          </div>
          <div class="mb-4">
            <label for="ideaDescription" class="block text-sm font-medium text-card-foreground mb-2">Description</label>
            <textarea id="ideaDescription" name="description" rows="3" placeholder="Describe your idea" class="w-full px-3 py-2 border border-input rounded-md bg-background text-card-foreground focus:ring-2 focus:ring-primary focus:border-transparent"></textarea>
          </div>
          <div class="mb-4">
            <label for="ideaUserId" class="block text-sm font-medium text-card-foreground mb-2">User ID</label>
            <input type="number" id="ideaUserId" name="user_id" placeholder="Enter user ID" required class="w-full px-3 py-2 border border-input rounded-md bg-background text-card-foreground focus:ring-2 focus:ring-primary focus:border-transparent">
          </div>
          <div class="mb-4">
            <label for="ideaType" class="block text-sm font-medium text-card-foreground mb-2">Type</label>
            <select id="ideaType" name="type" class="w-full px-3 py-2 border border-input rounded-md bg-background text-card-foreground focus:ring-2 focus:ring-primary focus:border-transparent">
              <option value="">Select type</option>
              <option value="product">Product</option>
              <option value="service">Service</option>
              <option value="app">App</option>
              <option value="platform">Platform</option>
              <option value="tool">Tool</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" data-modal-close class="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent rounded-md">Cancel</button>
            <button type="submit" class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md">Create Idea</button>
          </div>
        </form>
      </div>
    </div>
  `;

  res.send(modalHtml);
};

// Get edit form for idea
export const getEditForm = async (req, res) => {
  try {
    const { id } = req.params;
    const ideaService = serviceFactory.getIdeaService();
    const idea = await ideaService.getIdeaById(id);

    if (!idea) {
      return res.status(404).send('<p class="text-red-500">Idea not found</p>');
    }

    const modalHtml = `
      <div data-modal-backdrop class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-hidden="false">
        <div class="bg-card p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
          <h3 class="text-lg font-semibold mb-4 text-card-foreground">Edit Idea</h3>
          <form hx-post="/api/ideas/update" hx-target="#ideasTableContainer" hx-swap="beforebegin" hx-on:htmx:after-request="this.closest('[data-modal-backdrop]').classList.add('hidden'); htmx.trigger('#ideasTableContainer', 'ideaUpdated')">
            <input type="hidden" name="id" value="${idea.id}">
            <div class="mb-4">
              <label for="editIdeaTitle" class="block text-sm font-medium text-card-foreground mb-2">Title</label>
              <input type="text" id="editIdeaTitle" name="title" value="${idea.title || ''}" required class="w-full px-3 py-2 border border-input rounded-md bg-background text-card-foreground focus:ring-2 focus:ring-primary focus:border-transparent">
            </div>
            <div class="mb-4">
              <label for="editIdeaDescription" class="block text-sm font-medium text-card-foreground mb-2">Description</label>
              <textarea id="editIdeaDescription" name="description" rows="3" class="w-full px-3 py-2 border border-input rounded-md bg-background text-card-foreground focus:ring-2 focus:ring-primary focus:border-transparent">${idea.description || ''}</textarea>
            </div>
            <div class="mb-4">
              <label for="editIdeaUserId" class="block text-sm font-medium text-card-foreground mb-2">User ID</label>
              <input type="number" id="editIdeaUserId" name="user_id" value="${idea.user_id || ''}" class="w-full px-3 py-2 border border-input rounded-md bg-background text-card-foreground focus:ring-2 focus:ring-primary focus:border-transparent">
            </div>
            <div class="mb-4">
              <label for="editIdeaType" class="block text-sm font-medium text-card-foreground mb-2">Type</label>
              <select id="editIdeaType" name="type" class="w-full px-3 py-2 border border-input rounded-md bg-background text-card-foreground focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="">Select type</option>
                <option value="product" ${idea.type === 'product' ? 'selected' : ''}>Product</option>
                <option value="service" ${idea.type === 'service' ? 'selected' : ''}>Service</option>
                <option value="app" ${idea.type === 'app' ? 'selected' : ''}>App</option>
                <option value="platform" ${idea.type === 'platform' ? 'selected' : ''}>Platform</option>
                <option value="tool" ${idea.type === 'tool' ? 'selected' : ''}>Tool</option>
                <option value="other" ${idea.type === 'other' ? 'selected' : ''}>Other</option>
              </select>
            </div>
            <div class="mb-4">
              <label for="editIdeaStatus" class="block text-sm font-medium text-card-foreground mb-2">Status</label>
              <select id="editIdeaStatus" name="status" class="w-full px-3 py-2 border border-input rounded-md bg-background text-card-foreground focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="draft" ${idea.status === 'draft' ? 'selected' : ''}>Draft</option>
                <option value="pending" ${idea.status === 'pending' ? 'selected' : ''}>Pending</option>
                <option value="active" ${idea.status === 'active' ? 'selected' : ''}>Active</option>
                <option value="approved" ${idea.status === 'approved' ? 'selected' : ''}>Approved</option>
                <option value="rejected" ${idea.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                <option value="archived" ${idea.status === 'archived' ? 'selected' : ''}>Archived</option>
              </select>
            </div>
            <div class="flex justify-end gap-2">
              <button type="button" data-modal-close class="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent rounded-md">Cancel</button>
              <button type="submit" class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md">Update Idea</button>
            </div>
          </form>
        </div>
      </div>
    `;

    res.send(modalHtml);
  } catch (error) {
    logger.error('Error fetching edit form:', error);
    res.status(500).send('<p class="text-red-500">Error loading edit form</p>');
  }
};

// Create new idea
export const createIdea = [
  validateIdeaCreation,
  async (req, res) => {
    try {
      const ideaData = req.body;

      // Auto-generate href from title if not provided
      if (!ideaData.href && ideaData.title) {
        ideaData.href = ideaData.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
      }

      // Set defaults
      ideaData.status = ideaData.status || 'draft';
      ideaData.upvotes = ideaData.upvotes || 0;

      // Set type_icon based on type
      const typeIcons = {
        product: '📦',
        service: '🛠️',
        app: '📱',
        platform: '🌐',
        tool: '🔧',
        other: '💡',
      };
      ideaData.type_icon = typeIcons[ideaData.type] || '💡';

      const ideaService = serviceFactory.getIdeaService();
      const idea = await ideaService.createIdea(ideaData);

      logger.info(`Created idea with ID: ${idea.id}`);

      if (isHtmxRequest(req)) {
        res.send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-green-50 text-green-800 border-green-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="flex-1">
                  <div>Idea "${idea.title}" created successfully!</div>
                  <button onclick="editIdea(${idea.id})" class="mt-2 px-3 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-800 rounded">Edit Idea</button>
                </div>
              </div>
            </div>
          </div>
          <script>
            setTimeout(() => document.querySelector('.fixed').remove(), 2000);
            htmx.trigger('#ideasTableContainer', 'ideaCreated');
          </script>
        `);
      } else {
        res.status(201).json({ success: true, data: idea });
      }
    } catch (error) {
      logger.error('Error creating idea:', error);
      if (isHtmxRequest(req)) {
        res.status(500).send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="flex-1">Failed to create idea: ${error.message}</div>
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

// Update idea
export const updateIdea = [
  validateIdeaUpdate,
  async (req, res) => {
    try {
      const { id, ...updates } = req.body;

      // Regenerate href if title changed
      if (updates.title) {
        updates.href = updates.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
      }

      // Update type_icon if type changed
      if (updates.type) {
        const typeIcons = {
          product: '📦',
          service: '🛠️',
          app: '📱',
          platform: '🌐',
          tool: '🔧',
          other: '💡',
        };
        updates.type_icon = typeIcons[updates.type] || '💡';
      }

      const ideaService = serviceFactory.getIdeaService();
      const idea = await ideaService.updateIdea(id, updates);

      if (!idea) {
        return res
          .status(404)
          .json({ success: false, error: 'Idea not found' });
      }

      logger.info(`Updated idea with ID: ${id}`);

      if (isHtmxRequest(req)) {
        res.send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full bg-green-50 text-green-800 border border-green-200 rounded-lg px-4 py-3 text-sm">
            <div class="flex items-start gap-3">
              <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            <div class="flex-1">Idea "${idea.title}" updated successfully!</div>
          </div>
        </div>
        <script>
          htmx.ajax('GET', window.location.pathname + window.location.search, {target: '#ideasTableContainer'});
          htmx.ajax('GET', window.location.pathname + '/filter-nav' + window.location.search, {target: '#filter-links'});
        </script>
        `);
      } else {
        res.json({ success: true, data: idea });
      }
    } catch (error) {
      logger.error('Error updating idea:', error);
      if (isHtmxRequest(req)) {
        res.status(500).send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="flex-1">Failed to update idea: ${error.message}</div>
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

// Delete idea
export const deleteIdea = [
  validateIdeaDeletion,
  async (req, res) => {
    try {
      const { id } = req.params;

      const ideaService = serviceFactory.getIdeaService();

      // Check if idea exists
      const existingIdea = await ideaService.getIdeaById(id);
      if (!existingIdea) {
        return res
          .status(404)
          .json({ success: false, error: 'Idea not found' });
      }

      await ideaService.deleteIdea(id);

      logger.info(`Deleted idea with ID: ${id}`);

      if (isHtmxRequest(req)) {
        res.send(
          `<div class="success">Idea "${existingIdea.title}" has been deleted!</div>`
        );
      } else {
        res.json({ success: true, message: 'Idea deleted successfully' });
      }
    } catch (error) {
      logger.error('Error deleting idea:', error);
      if (isHtmxRequest(req)) {
        res.status(500).send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="flex-1">Failed to delete idea: ${error.message}</div>
            </div>
          </div>
        `);
      } else {
        res.status(500).json({ success: false, error: error.message });
      }
    }
  },
];

// Vote on idea (upvote/downvote)
export const voteIdea = async (req, res) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body; // 'up' or 'down'

    if (!['up', 'down'].includes(voteType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid vote type. Must be "up" or "down"',
      });
    }

    const ideaService = serviceFactory.getIdeaService();
    const updatedIdea = await ideaService.voteIdea(id, voteType);

    logger.info(`Vote recorded for idea ID: ${id}, type: ${voteType}`);

    if (isHtmxRequest(req)) {
      res.send(`
        <div class="fixed top-4 right-4 z-50 max-w-sm w-full bg-green-50 text-green-800 border border-green-200 rounded-lg px-4 py-3 text-sm">
          <div class="flex items-start gap-3">
            <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
            </svg>
            <div class="flex-1">${voteType === 'up' ? 'Upvote' : 'Downvote'} recorded successfully!</div>
          </div>
        </div>
        <script>
          htmx.ajax('GET', window.location.pathname + window.location.search, {target: '#ideasTableContainer'});
          htmx.ajax('GET', window.location.pathname + '/filter-nav' + window.location.search, {target: '#filter-links'});
        </script>
      `);
    } else {
      res.json({ success: true, data: updatedIdea });
    }
  } catch (error) {
    logger.error('Error voting on idea:', error);
    if (isHtmxRequest(req)) {
      res.status(500).send(`
        <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
          <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
            <div class="flex items-start gap-3">
              <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="flex-1">Failed to record vote: ${error.message}</div>
            </div>
          </div>
        </div>
      `);
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// Approve idea
export const approveIdea = async (req, res) => {
  try {
    const { id } = req.params;

    const ideaService = serviceFactory.getIdeaService();
    const idea = await ideaService.approveIdea(id);

    if (!idea) {
      return res.status(404).json({ success: false, error: 'Idea not found' });
    }

    logger.info(`Approved idea with ID: ${id}`);

    if (isHtmxRequest(req)) {
      res.send(`
        <div class="fixed top-4 right-4 z-50 max-w-sm w-full bg-green-50 text-green-800 border border-green-200 rounded-lg px-4 py-3 text-sm">
          <div class="flex items-start gap-3">
            <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div class="flex-1">Idea "${idea.title}" approved successfully!</div>
          </div>
        </div>
        <script>
          htmx.ajax('GET', window.location.pathname + window.location.search, {target: '#ideasTableContainer'});
          htmx.ajax('GET', window.location.pathname + '/filter-nav' + window.location.search, {target: '#filter-links'});
        </script>
      `);
    } else {
      res.json({ success: true, data: idea });
    }
  } catch (error) {
    logger.error('Error approving idea:', error);
    if (isHtmxRequest(req)) {
      res.status(500).send(`
        <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
          <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
            <div class="flex items-start gap-3">
              <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="flex-1">Failed to approve idea: ${error.message}</div>
            </div>
          </div>
        </div>
      `);
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// Reject idea
export const rejectIdea = async (req, res) => {
  try {
    const { id } = req.params;

    const ideaService = serviceFactory.getIdeaService();
    const idea = await ideaService.rejectIdea(id);

    if (!idea) {
      return res.status(404).json({ success: false, error: 'Idea not found' });
    }

    logger.info(`Rejected idea with ID: ${id}`);

    if (isHtmxRequest(req)) {
      res.send(`
        <div class="fixed top-4 right-4 z-50 max-w-sm w-full bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-lg px-4 py-3 text-sm">
          <div class="flex items-start gap-3">
            <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <div class="flex-1">Idea "${idea.title}" rejected!</div>
          </div>
        </div>
        <script>
          htmx.ajax('GET', window.location.pathname + window.location.search, {target: '#ideasTableContainer'});
          htmx.ajax('GET', window.location.pathname + '/filter-nav' + window.location.search, {target: '#filter-links'});
        </script>
      `);
    } else {
      res.json({ success: true, data: idea });
    }
  } catch (error) {
    logger.error('Error rejecting idea:', error);
    if (isHtmxRequest(req)) {
      res.status(500).send(`
        <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
          <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
            <div class="flex items-start gap-3">
              <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="flex-1">Failed to reject idea: ${error.message}</div>
            </div>
          </div>
        </div>
      `);
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// Helper function to generate pagination HTML
const generatePaginationHtml = (page, limit, total, query) => {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return '';

  const search = query.search || '';
  const status = query.status || '';
  const type = query.type || '';
  const params = `limit=${limit}&search=${encodeURIComponent(search)}&status=${status}&type=${type}`;

  let html = `<div class="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border">`;

  // Previous button
  if (page > 1) {
    html += `<button hx-get="/api/ideas?page=${page - 1}&${params}" hx-target="#ideasTableContainer" class="inline-flex items-center justify-center w-10 h-10 rounded-md border border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" title="Previous page">`;
    html += `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>`;
    html += `</button>`;
  }

  // Page number buttons
  const maxVisiblePages = 5;
  let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    if (i === page) {
      html += `<span class="inline-flex items-center justify-center w-10 h-10 rounded-md bg-primary text-primary-foreground shadow-sm font-medium">${i}</span>`;
    } else {
      html += `<button hx-get="/api/ideas?page=${i}&${params}" hx-target="#ideasTableContainer" class="inline-flex items-center justify-center w-10 h-10 rounded-md border border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">${i}</button>`;
    }
  }

  // Next button
  if (page < totalPages) {
    html += `<button hx-get="/api/ideas?page=${page + 1}&${params}" hx-target="#ideasTableContainer" class="inline-flex items-center justify-center w-10 h-10 rounded-md border border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" title="Next page">`;
    html += `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>`;
    html += `</button>`;
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

    const ideaService = serviceFactory.getIdeaService();
    const results = [];
    const errors = [];

    for (const id of ids) {
      try {
        let result;
        switch (action) {
          case 'approve':
            result = await ideaService.approveIdea(id);
            break;
          case 'reject':
            result = await ideaService.rejectIdea(id);
            break;
          case 'delete':
            await ideaService.deleteIdea(id);
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
      `Bulk ${action} completed for ${results.length} ideas, ${errors.length} errors`
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
          htmx.ajax('GET', window.location.pathname + window.location.search, {target: '#ideasTableContainer'});
          htmx.ajax('GET', window.location.pathname + '/filter-nav' + window.location.search, {target: '#filter-links'});
        </script>
      `);
    } else {
      res.json({
        success: true,
        data: { results, errors },
        message: `Bulk ${action} completed for ${results.length} ideas`,
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
export default function ideasRoutes(app) {
  app.get('/api/ideas', getIdeas);
  app.get('/api/ideas/:id', getIdea);
  app.get('/api/ideas/new', getCreateForm);
  app.get('/api/ideas/edit-form/:id', getEditForm);
  app.post('/api/ideas', ...createIdea);
  app.post('/api/ideas/update', ...updateIdea);
  app.post('/api/ideas/bulk-action', bulkAction);
  app.put('/api/ideas/:id/approve', approveIdea);
  app.put('/api/ideas/:id/reject', rejectIdea);
  app.put('/api/ideas/:id/vote', voteIdea);
  app.delete('/api/ideas/:id', ...deleteIdea);
}
