import logger from '../../../utils/logger.js';
import { databaseService } from '../../../services/index.js';
import { serviceFactory } from '../../../services/serviceFactory.js';
import {
  validateLearningAnalyticsCreation,
  validateLearningAnalyticsUpdate,
  validateLearningAnalyticsDeletion,
} from '../../../middleware/validation/index.js';
import { formatDate } from '../../../helpers/format/index.js';
import { isHtmxRequest } from '../../../helpers/http/index.js';

// Get all learning analytics with pagination and filtering
export const getLearningAnalytics = async (req, res) => {
  try {
    const {
      search,
      event_type,
      country,
      is_processed,
      page = 1,
      limit = 10,
    } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    let query = databaseService.supabase
      .from('learning_analytics')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(
        `event_type.ilike.%${search}%,user_id.ilike.%${search}%`
      );
    }

    if (event_type) {
      query = query.eq('event_type', event_type);
    }

    if (country) {
      query = query.eq('country', country);
    }

    if (is_processed !== undefined) {
      query = query.eq('is_processed', is_processed === 'true');
    }

    const {
      data: analytics,
      error,
      count,
    } = await query.range((pageNum - 1) * limitNum, pageNum * limitNum - 1);

    if (error) throw error;

    const total = count || 0;
    const filters = [];
    if (event_type) filters.push(`event_type: ${event_type}`);
    if (country) filters.push(`country: ${country}`);
    if (is_processed !== undefined)
      filters.push(`is_processed: ${is_processed}`);
    if (pageNum > 1) filters.push(`page: ${pageNum}`);
    logger.info(
      `Fetched ${analytics.length} of ${total} learning analytics events${filters.length ? ` (filtered by ${filters.join(', ')})` : ''}`
    );

    if (isHtmxRequest(req)) {
      const analyticsHtml = analytics
        .map(
          (event) => `
        <tr class="border-b border-gray-100/40 hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors duration-150">
          <td class="px-6 py-4">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10">
                <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span class="text-lg">📊</span>
                </div>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">User ${event.user_id}</div>
                <div class="text-sm text-gray-500">Content ${event.content_id}</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              event.event_type === 'view'
                ? 'bg-blue-100 text-blue-800'
                : event.event_type === 'complete'
                  ? 'bg-green-100 text-green-800'
                  : event.event_type === 'start'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-purple-100 text-purple-800'
            }">${event.event_type}</span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-900">${event.session_duration_seconds || 0}s</td>
          <td class="px-6 py-4 text-sm text-gray-900">${event.engagement_score ? event.engagement_score.toFixed(2) : 'N/A'}</td>
          <td class="px-6 py-4 text-sm text-gray-900">${event.country || 'N/A'}</td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              event.is_processed
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }">${event.is_processed ? 'Processed' : 'Pending'}</span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-900">${formatDate(event.created_at)}</td>
          <td class="px-6 py-4">
            <div class="relative">
              <button onclick="toggleActionMenu('learning-analytics', ${event.id})" class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black dark:text-white transition-colors">
                <svg class="w-4 h-4 lucide lucide-ellipsis-vertical" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
              </button>
              <div id="actionMenu-learning-analytics-${event.id}" class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div class="py-1">
                  <a href="/admin/table-pages/learning-analytics/${event.id}" class="flex items-center px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    View Details
                  </a>
                  <button onclick="processAnalyticsEvent(${event.id})" class="flex items-center w-full px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                    <svg class="w-4 h-4 mr-3 lucide lucide-check-circle" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22,4 12,14.01 9,11.01"></polyline>
                    </svg>
                    Mark Processed
                  </button>
                  <button onclick="deleteAnalyticsEvent(${event.id})" class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
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
      res.send(analyticsHtml + paginationHtml);
    } else {
      res.json({
        success: true,
        data: analytics,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    }
  } catch (error) {
    logger.error('Error fetching learning analytics:', error);
    if (isHtmxRequest(req)) {
      res
        .status(500)
        .send('<p class="text-red-500">Error loading learning analytics</p>');
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// Get single learning analytics event by ID
export const getLearningAnalyticsEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const learningService = serviceFactory.getLearningService();
    const event = await learningService.analytics.getLearningAnalyticsById(id);

    if (!event) {
      return res
        .status(404)
        .json({ success: false, error: 'Learning analytics event not found' });
    }

    res.json({ success: true, data: event });
  } catch (error) {
    logger.error('Error fetching learning analytics event:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create new learning analytics event
export const createLearningAnalyticsEvent = [
  validateLearningAnalyticsCreation,
  async (req, res) => {
    try {
      const eventData = req.body;

      const { data: event, error } = await databaseService.supabase
        .from('learning_analytics')
        .insert([eventData])
        .select()
        .single();

      if (error) throw error;

      logger.info(`Created learning analytics event with ID: ${event.id}`);

      if (isHtmxRequest(req)) {
        res.send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-green-50 text-green-800 border-green-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="flex-1">Analytics event recorded successfully!</div>
              </div>
            </div>
          </div>
          <script>
            setTimeout(() => document.querySelector('.fixed').remove(), 5000);
            htmx.trigger('#learningAnalyticsTableContainer', 'learningAnalyticsEventCreated');
          </script>
        `);
      } else {
        res.status(201).json({ success: true, data: event });
      }
    } catch (error) {
      logger.error('Error creating learning analytics event:', error);
      if (isHtmxRequest(req)) {
        res.status(500).send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="flex-1">Failed to record analytics event: ${error.message}</div>
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

// Update learning analytics event
export const updateLearningAnalyticsEvent = [
  validateLearningAnalyticsUpdate,
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const { data: event, error } = await databaseService.supabase
        .from('learning_analytics')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!event) {
        return res.status(404).json({
          success: false,
          error: 'Learning analytics event not found',
        });
      }

      logger.info(`Updated learning analytics event with ID: ${id}`);

      if (isHtmxRequest(req)) {
        res.send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-green-50 text-green-800 border-green-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 2 2h11a2 2 0 0 2-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                <div class="flex-1">Analytics event updated successfully!</div>
              </div>
            </div>
          </div>
          <script>
            setTimeout(() => document.querySelector('.fixed').remove(), 5000);
            htmx.trigger('#learningAnalyticsTableContainer', 'learningAnalyticsEventUpdated');
          </script>
        `);
      } else {
        res.json({ success: true, data: event });
      }
    } catch (error) {
      logger.error('Error updating learning analytics event:', error);
      if (isHtmxRequest(req)) {
        res.status(500).send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="flex-1">Failed to update analytics event: ${error.message}</div>
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

// Delete learning analytics event
export const deleteLearningAnalyticsEvent = [
  validateLearningAnalyticsDeletion,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Check if event exists
      const { data: existingEvent, error: fetchError } =
        await databaseService.supabase
          .from('learning_analytics')
          .select('*')
          .eq('id', id)
          .single();

      if (fetchError) throw fetchError;
      if (!existingEvent) {
        return res.status(404).json({
          success: false,
          error: 'Learning analytics event not found',
        });
      }

      const { error } = await databaseService.supabase
        .from('learning_analytics')
        .delete()
        .eq('id', id);

      if (error) throw error;

      logger.info(`Deleted learning analytics event with ID: ${id}`);

      if (isHtmxRequest(req)) {
        res.send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
              <div class="flex items-start gap-3">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                <div class="flex-1">Analytics event has been deleted!</div>
              </div>
            </div>
          </div>
          <script>
            setTimeout(() => document.querySelector('.fixed').remove(), 5000);
            htmx.trigger('#learningAnalyticsTableContainer', 'learningAnalyticsEventDeleted');
          </script>
        `);
      } else {
        res.json({
          success: true,
          message: 'Learning analytics event deleted successfully',
        });
      }
    } catch (error) {
      logger.error('Error deleting learning analytics event:', error);
      if (isHtmxRequest(req)) {
        res.status(500).send(`
          <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
            <div class="flex items-start gap-3">
              <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
              <div class="flex-1">Failed to delete analytics event: ${error.message}</div>
            </div>
          </div>
        `);
      } else {
        res.status(500).json({ success: false, error: error.message });
      }
    }
  },
];

// Bulk action for learning analytics
export const bulkAction = async (req, res) => {
  try {
    const { action, ids, is_processed } = req.body;

    if (!action || !ids || !Array.isArray(ids)) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid request data' });
    }

    switch (action) {
      case 'delete':
        const { error: deleteError } = await databaseService.supabase
          .from('learning_analytics')
          .delete()
          .in('id', ids);

        if (deleteError) throw deleteError;

        logger.info(`Bulk deleted ${ids.length} learning analytics events`);
        break;

      case 'toggle_processed':
        if (is_processed === undefined) {
          return res.status(400).json({
            success: false,
            error: 'is_processed is required for toggle_processed action',
          });
        }

        const { error: updateError } = await databaseService.supabase
          .from('learning_analytics')
          .update({ is_processed })
          .in('id', ids);

        if (updateError) throw updateError;

        logger.info(
          `Bulk updated is_processed to ${is_processed} for ${ids.length} learning analytics events`
        );
        break;

      default:
        return res
          .status(400)
          .json({ success: false, error: 'Invalid action' });
    }

    if (isHtmxRequest(req)) {
      res.send(`
        <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
          <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-green-50 text-green-800 border-green-200">
            <div class="flex items-start gap-3">
              <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="flex-1">Bulk action completed successfully!</div>
            </div>
          </div>
        </div>
        <script>
          setTimeout(() => document.querySelector('.fixed').remove(), 5000);
          htmx.trigger('#learningAnalyticsTableContainer', 'learningAnalyticsBulkAction');
        </script>
      `);
    } else {
      res.json({
        success: true,
        message: 'Bulk action completed successfully',
      });
    }
  } catch (error) {
    logger.error('Error performing bulk action on learning analytics:', error);
    if (isHtmxRequest(req)) {
      res.status(500).send(`
        <div class="fixed top-4 right-4 z-50 max-w-sm w-full">
          <div class="relative w-full rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-800 border-red-200">
            <div class="flex items-start gap-3">
              <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="flex-1">Failed to perform bulk action: ${error.message}</div>
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

  const event_type = query.event_type || '';
  const country = query.country || '';
  const is_processed = query.is_processed || '';
  const params = `limit=${limit}&event_type=${event_type}&country=${country}&is_processed=${is_processed}`;

  let html = `<div class="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border">`;
  if (page > 1) {
    html += `<button hx-get="/api/learning-analytics?page=${page - 1}&${params}" hx-target="#learningAnalyticsTableContainer" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"></button>`;
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
      html += `<button hx-get="/api/learning-analytics?page=${i}&${params}" hx-target="#learningAnalyticsTableContainer" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9">${i}</button>`;
    }
  }
  html += `</div>`;

  if (page < totalPages) {
    html += `<button hx-get="/api/learning-analytics?page=${page + 1}&${params}" hx-target="#learningAnalyticsTableContainer" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>/button>`;
  } else {
  }
  html += `</div>`;
  return html;
};

// Route setup function
export default function learningAnalyticsRoutes(app) {
  app.get('/api/learning-analytics', getLearningAnalytics);
  app.get('/api/learning-analytics/:id', getLearningAnalyticsEvent);
  app.post('/api/learning-analytics', ...createLearningAnalyticsEvent);
  app.put('/api/learning-analytics/:id', ...updateLearningAnalyticsEvent);
  app.delete('/api/learning-analytics/:id', ...deleteLearningAnalyticsEvent);
  app.post('/api/learning-analytics/bulk-action', bulkAction);
}
