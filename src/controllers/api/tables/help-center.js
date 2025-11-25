import logger from '../../../utils/logger.js';
import { databaseService } from '../../../services/index.js';
import { serviceFactory } from '../../../services/serviceFactory.js';
import {
  validateHelpCenterCreation,
  validateHelpCenterUpdate,
  validateHelpCenterDeletion,
} from '../../../middleware/validation/index.js';
import { formatDate } from '../../../helpers/format/index.js';
import { isHtmxRequest } from '../../../helpers/http/index.js';

// Get all help center articles with pagination and filtering
export const getHelpCenter = async (req, res) => {
  try {
    const {
      search,
      content_type,
      category_name,
      is_published,
      page = 1,
      limit = 10,
    } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    let query = databaseService.supabase
      .from('help_centers')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    if (content_type) {
      query = query.eq('content_type', content_type);
    }

    if (category_name) {
      query = query.eq('category_name', category_name);
    }

    if (is_published !== undefined) {
      query = query.eq('is_published', is_published === 'true');
    }

    const {
      data: articles,
      error,
      count,
    } = await query.range((pageNum - 1) * limitNum, pageNum * limitNum - 1);

    if (error) throw error;

    const total = count || 0;
    const filterStrings = [];
    if (search) filterStrings.push(`search: "${search}"`);
    if (content_type) filterStrings.push(`content_type: ${content_type}`);
    if (category_name) filterStrings.push(`category_name: ${category_name}`);
    if (is_published !== undefined)
      filterStrings.push(`is_published: ${is_published}`);
    if (pageNum > 1) filterStrings.push(`page: ${pageNum}`);
    logger.info(
      `Fetched ${articles.length} of ${total} help center articles${filterStrings.length ? ` (filtered by ${filterStrings.join(', ')})` : ''}`
    );

    if (isHtmxRequest(req)) {
      const articleHtml = articles
        .map(
          (article) => `
        <tr class="border-b border-gray-100/40 hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors duration-150">
          <td class="px-6 py-4">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10">
                <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span class="text-lg">❓</span>
                </div>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">${article.title}</div>
                <div class="text-sm text-gray-500">${article.excerpt?.substring(0, 50)}${article.excerpt?.length > 50 ? '...' : ''}</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              article.content_type === 'article'
                ? 'bg-blue-100 text-blue-800'
                : article.content_type === 'guide'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-purple-100 text-purple-800'
            }">${article.content_type}</span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-900">${article.category_name}</td>
          <td class="px-6 py-4 text-sm text-gray-900">${article.view_count || 0} views</td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              article.is_published
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }">${article.is_published ? 'Published' : 'Draft'}</span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-900">${formatDate(article.created_at)}</td>
          <td class="px-6 py-4">
            <div class="relative">
              <button onclick="toggleActionMenu('help-center', ${article.id})" class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black dark:text-white transition-colors">
                <svg class="w-4 h-4 lucide lucide-ellipsis-vertical" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
              </button>
              <div id="actionMenu-help-center-${article.id}" class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div class="py-1">
                  <a href="/admin/table-pages/help-center/${article.id}" class="flex items-center px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    View Details
                  </a>
                  <button onclick="editHelpCenterArticle(${article.id})" class="flex items-center w-full px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                    </svg>
                    Edit Article
                  </button>
                  <button onclick="deleteHelpCenterArticle(${article.id}, '${article.title}')" class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
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
      res.send(articleHtml + paginationHtml);
    } else {
      res.json({
        success: true,
        data: articles,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    }
  } catch (error) {
    logger.error('Error fetching help center articles:', error);
    if (isHtmxRequest(req)) {
      res
        .status(500)
        .send('<p class="text-red-500">Error loading help center articles</p>');
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// Get single help center article by ID
export const getHelpCenterArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const helpCenterService = serviceFactory.getHelpCenterService();
    const article = await helpCenterService.getHelpCenterArticleById(id);

    if (!article) {
      return res
        .status(404)
        .json({ success: false, error: 'Help center article not found' });
    }

    res.json({ success: true, data: article });
  } catch (error) {
    logger.error('Error fetching help center article:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create new help center article
export const createHelpCenterArticle = [
  validateHelpCenterCreation,
  async (req, res) => {
    try {
      const articleData = req.body;

      const { data: article, error } = await databaseService.supabase
        .from('help_centers')
        .insert([articleData])
        .select()
        .single();

      if (error) throw error;

      logger.info(`Created help center article with ID: ${article.id}`);

      if (isHtmxRequest(req)) {
        res.send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-green-50 text-green-800 border-green-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="flex-1">Help center article "${article.title}" created successfully!</div>
              </div>
            </div>
          </div>
          <script>
            setTimeout(() => document.querySelector('.fixed').remove(), 5000);
            htmx.trigger('#helpCenterTableContainer', 'helpCenterArticleCreated');
          </script>
        `);
      } else {
        res.status(201).json({ success: true, data: article });
      }
    } catch (error) {
      logger.error('Error creating help center article:', error);
      if (isHtmxRequest(req)) {
        res.status(500).send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="flex-1">Failed to create help center article: ${error.message}</div>
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

// Update help center article
export const updateHelpCenterArticle = [
  validateHelpCenterUpdate,
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const { data: article, error } = await databaseService.supabase
        .from('help_centers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!article) {
        return res
          .status(404)
          .json({ success: false, error: 'Help center article not found' });
      }

      logger.info(`Updated help center article with ID: ${id}`);

      if (isHtmxRequest(req)) {
        res.send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-green-50 text-green-800 border-green-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                <div class="flex-1">Help center article "${article.title}" updated successfully!</div>
              </div>
            </div>
          </div>
          <script>
            setTimeout(() => document.querySelector('.fixed').remove(), 5000);
            htmx.trigger('#helpCenterTableContainer', 'helpCenterArticleUpdated');
          </script>
        `);
      } else {
        res.json({ success: true, data: article });
      }
    } catch (error) {
      logger.error('Error updating help center article:', error);
      if (isHtmxRequest(req)) {
        res.status(500).send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="flex-1">Failed to update help center article: ${error.message}</div>
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

// Delete help center article
export const deleteHelpCenterArticle = [
  validateHelpCenterDeletion,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Check if article exists
      const { data: existingArticle, error: fetchError } =
        await databaseService.supabase
          .from('help_centers')
          .select('*')
          .eq('id', id)
          .single();

      if (fetchError) throw fetchError;
      if (!existingArticle) {
        return res
          .status(404)
          .json({ success: false, error: 'Help center article not found' });
      }

      const { error } = await databaseService.supabase
        .from('help_centers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      logger.info(`Deleted help center article with ID: ${id}`);

      if (isHtmxRequest(req)) {
        res.send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                <div class="flex-1">Help center article "${existingArticle.title}" has been deleted!</div>
              </div>
            </div>
          </div>
          <script>
            setTimeout(() => document.querySelector('.fixed').remove(), 5000);
            htmx.trigger('#helpCenterTableContainer', 'helpCenterArticleDeleted');
          </script>
        `);
      } else {
        res.json({
          success: true,
          message: 'Help center article deleted successfully',
        });
      }
    } catch (error) {
      logger.error('Error deleting help center article:', error);
      if (isHtmxRequest(req)) {
        res.status(500).send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="flex-1">Failed to delete help center article: ${error.message}</div>
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
const generatePaginationHtml = (page, limit, total, query) => {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return '';

  const search = query.search || '';
  const content_type = query.content_type || '';
  const category_name = query.category_name || '';
  const is_published = query.is_published || '';
  const params = `limit=${limit}&search=${encodeURIComponent(search)}&content_type=${content_type}&category_name=${category_name}&is_published=${is_published}`;

  let html = `<div class="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border">`;
  if (page > 1) {
    html += `<button hx-get="/api/help-center?page=${page - 1}&${params}" hx-target="#helpCenterTableContainer" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"></button>`;
  } else {
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
      html += `<button hx-get="/api/help-center?page=${i}&${params}" hx-target="#helpCenterTableContainer" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9">${i}</button>`;
    }
  }
  html += `</div>`;

  if (page < totalPages) {
    html += `<button hx-get="/api/help-center?page=${page + 1}&${params}" hx-target="#helpCenterTableContainer" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>/button>`;
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

    const helpCenterService = serviceFactory.getHelpCenterService();
    const results = [];
    const errors = [];

    for (const id of ids) {
      try {
        let result;
        switch (action) {
          case 'publish':
            result = await helpCenterService.publishHelpCenter(id);
            break;
          case 'archive':
            result = await helpCenterService.archiveHelpCenter(id);
            break;
          case 'delete':
            await helpCenterService.deleteHelpCenter(id);
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
      `Bulk ${action} completed for ${results.length} help center articles, ${errors.length} errors`
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
          htmx.ajax('GET', window.location.pathname + window.location.search, {target: '#help-centerTableContainer'});
          htmx.ajax('GET', window.location.pathname + '/filter-nav' + window.location.search, {target: '#filter-links'});
        </script>
      `);
    } else {
      res.json({
        success: true,
        data: { results, errors },
        message: `Bulk ${action} completed for ${results.length} help center articles`,
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
export default function helpCenterRoutes(app) {
  app.get('/api/help-center', getHelpCenter);
  app.get('/api/help-center/:id', getHelpCenterArticle);
  app.post('/api/help-center', ...createHelpCenterArticle);
  app.put('/api/help-center/:id', ...updateHelpCenterArticle);
  app.post('/api/help-center/bulk-action', bulkAction);
  app.delete('/api/help-center/:id', ...deleteHelpCenterArticle);
}
