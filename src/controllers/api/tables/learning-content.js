 import logger from '../../../utils/logger.js';
 import { databaseService } from '../../../services/index.js';
 import { validateLearningContentCreation, validateLearningContentUpdate, validateLearningContentDeletion } from '../../../middleware/validation/index.js';
 import { formatDate } from '../../../helpers/format/index.js';
 import { isHtmxRequest } from '../../../helpers/http/index.js';


// Get all learning content with pagination and filtering
export const getLearningContent = async (req, res) => {
  try {
    const { search, content_type, category_id, difficulty_level, status, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    let query = databaseService.supabase.from('learning_content').select('*', { count: 'exact' });

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (content_type) {
      query = query.eq('content_type', content_type);
    }

    if (category_id) {
      query = query.eq('category_id', category_id);
    }

    if (difficulty_level) {
      query = query.eq('difficulty_level', difficulty_level);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: content, error, count } = await query.range((pageNum - 1) * limitNum, pageNum * limitNum - 1);

    if (error) throw error;

    const total = count || 0;
    const filters = [];
    if (search) filters.push(`search: "${search}"`);
    if (content_type) filters.push(`content_type: ${content_type}`);
    if (category_id) filters.push(`category_id: ${category_id}`);
    if (difficulty_level) filters.push(`difficulty_level: ${difficulty_level}`);
    if (status) filters.push(`status: ${status}`);
    if (pageNum > 1) filters.push(`page: ${pageNum}`);
    logger.info(`Fetched ${content.length} of ${total} learning content items${filters.length ? ` (filtered by ${filters.join(', ')})` : ''}`);

    if (isHtmxRequest(req)) {
      const contentHtml = content.map(item => `
        <tr class="border-b border-gray-100/40 hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors duration-150">
          <td class="px-6 py-4">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10">
                <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span class="text-lg">📚</span>
                </div>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">${item.title}</div>
                <div class="text-sm text-gray-500">${item.excerpt?.substring(0, 50)}${item.excerpt?.length > 50 ? '...' : ''}</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              item.content_type === 'article' ? 'bg-blue-100 text-blue-800' :
              item.content_type === 'video' ? 'bg-red-100 text-red-800' :
              item.content_type === 'course' ? 'bg-green-100 text-green-800' :
              'bg-purple-100 text-purple-800'
            }">${item.content_type}</span>
          </td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              item.difficulty_level === 'beginner' ? 'bg-green-100 text-green-800' :
              item.difficulty_level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }">${item.difficulty_level}</span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-900">${item.view_count || 0} views</td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              item.status === 'published' ? 'bg-green-100 text-green-800' :
              item.status === 'draft' ? 'bg-gray-100 text-gray-800' :
              'bg-yellow-100 text-yellow-800'
            }">${item.status}</span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-900">${formatDate(item.created_at)}</td>
          <td class="px-6 py-4">
            <div class="relative">
              <button onclick="toggleActionMenu('learning-content', ${item.id})" class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black dark:text-white transition-colors">
                <svg class="w-4 h-4 lucide lucide-ellipsis-vertical" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
              </button>
              <div id="actionMenu-learning-content-${item.id}" class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div class="py-1">
                  <a href="/admin/table-pages/learning-content/${item.id}" class="flex items-center px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    View Details
                  </a>
                  <button onclick="editLearningContent(${item.id})" class="flex items-center w-full px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                    </svg>
                    Edit Content
                  </button>
                  <button onclick="deleteLearningContent(${item.id}, '${item.title}')" class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
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
      `).join('');

      const paginationHtml = generatePaginationHtml(pageNum, limitNum, total, req.query);
      res.send(contentHtml + paginationHtml);
    } else {
      res.json({ success: true, data: content, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
    }
  } catch (error) {
    logger.error('Error fetching learning content:', error);
    if (isHtmxRequest(req)) {
      res.status(500).send('<p class="text-red-500">Error loading learning content</p>');
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// Get single learning content by ID
export const getLearningContentItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: content, error } = await databaseService.supabase
      .from('learning_content')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!content) {
      return res.status(404).json({ success: false, error: 'Learning content not found' });
    }

    res.json({ success: true, data: content });
  } catch (error) {
    logger.error('Error fetching learning content:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create new learning content
export const createLearningContent = [
  validateLearningContentCreation,
  async (req, res) => {
    try {
      const contentData = req.body;

      const { data: content, error } = await databaseService.supabase
        .from('learning_content')
        .insert([contentData])
        .select()
        .single();

      if (error) throw error;

      logger.info(`Created learning content with ID: ${content.id}`);

      if (isHtmxRequest(req)) {
        res.send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-green-50 text-green-800 border-green-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="flex-1">Learning content "${content.title}" created successfully!</div>
              </div>
            </div>
          </div>
          <script>
            setTimeout(() => document.querySelector('.fixed').remove(), 5000);
            htmx.trigger('#learningContentTableContainer', 'learningContentCreated');
          </script>
        `);
      } else {
        res.status(201).json({ success: true, data: content });
      }
    } catch (error) {
      logger.error('Error creating learning content:', error);
      if (isHtmxRequest(req)) {
        res.status(500).send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="flex-1">Failed to create learning content: ${error.message}</div>
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

// Update learning content
export const updateLearningContent = [
  validateLearningContentUpdate,
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const { data: content, error } = await databaseService.supabase
        .from('learning_content')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!content) {
        return res.status(404).json({ success: false, error: 'Learning content not found' });
      }

      logger.info(`Updated learning content with ID: ${id}`);

      if (isHtmxRequest(req)) {
        res.send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-green-50 text-green-800 border-green-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                <div class="flex-1">Learning content "${content.title}" updated successfully!</div>
              </div>
            </div>
          </div>
          <script>
            setTimeout(() => document.querySelector('.fixed').remove(), 5000);
            htmx.trigger('#learningContentTableContainer', 'learningContentUpdated');
          </script>
        `);
      } else {
        res.json({ success: true, data: content });
      }
    } catch (error) {
      logger.error('Error updating learning content:', error);
      if (isHtmxRequest(req)) {
        res.status(500).send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="flex-1">Failed to update learning content: ${error.message}</div>
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

// Delete learning content
export const deleteLearningContent = [
  validateLearningContentDeletion,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Check if content exists
      const { data: existingContent, error: fetchError } = await databaseService.supabase
        .from('learning_content')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      if (!existingContent) {
        return res.status(404).json({ success: false, error: 'Learning content not found' });
      }

      const { error } = await databaseService.supabase
        .from('learning_content')
        .delete()
        .eq('id', id);

      if (error) throw error;

      logger.info(`Deleted learning content with ID: ${id}`);

      if (isHtmxRequest(req)) {
        res.send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                <div class="flex-1">Learning content "${existingContent.title}" has been deleted!</div>
              </div>
            </div>
          </div>
          <script>
            setTimeout(() => document.querySelector('.fixed').remove(), 5000);
            htmx.trigger('#learningContentTableContainer', 'learningContentDeleted');
          </script>
        `);
      } else {
        res.json({ success: true, message: 'Learning content deleted successfully' });
      }
    } catch (error) {
      logger.error('Error deleting learning content:', error);
      if (isHtmxRequest(req)) {
        res.status(500).send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="flex-1">Failed to delete learning content: ${error.message}</div>
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

  const search = query.search || '';
  const content_type = query.content_type || '';
  const category_id = query.category_id || '';
  const difficulty_level = query.difficulty_level || '';
  const status = query.status || '';
  const params = `limit=${limit}&search=${encodeURIComponent(search)}&content_type=${content_type}&category_id=${category_id}&difficulty_level=${difficulty_level}&status=${status}`;

  let html = `<div class="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border">`;
  if (page > 1) {
    html += `<button hx-get="/api/learning-content?page=${page-1}&${params}" hx-target="#learningContentTableContainer" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"></button>`;
  } else {
  }

  // Page number buttons
  html += `<div class="flex items-center space-x2">`;
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
      html += `<button hx-get="/api/learning-content?page=${i}&${params}" hx-target="#learningContentTableContainer" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9">${i}</button>`;
    }
  }
  html += `</div>`;

  if (page < totalPages) {
    html += `<button hx-get="/api/learning-content?page=${page+1}&${params}" hx-target="#learningContentTableContainer" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>/button>`;
  } else {
  }
  html += `</div>`;
  return html;
};

// Route setup function
export default function learningContentRoutes(app) {
  app.get('/api/learning-content', getLearningContent);
  app.get('/api/learning-content/:id', getLearningContentItem);
  app.post('/api/learning-content', ...createLearningContent);
  app.put('/api/learning-content/:id', ...updateLearningContent);
  app.delete('/api/learning-content/:id', ...deleteLearningContent);
}