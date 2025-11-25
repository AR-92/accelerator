import logger from '../../../utils/logger.js';
import { databaseService } from '../../../services/index.js';
import { formatDate } from '../../../helpers/format/index.js';
import { isHtmxRequest } from '../../../helpers/http/index.js';

// Pitchdeck API
export const getPitchDeck = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    let query = databaseService.supabase
      .from('pitch_deck')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }
    if (status) {
      query = query.eq('status', status);
    }

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    const { data: decks, error, count } = await query;

    if (error) throw error;

    const total = count || 0;
    logger.info(`Fetched ${decks.length} of ${total} pitchdecks`);

    if (isHtmxRequest(req)) {
      const deckHtml = decks
        .map(
          (deck) => `
        <tr class="border-b border-gray-100/40 hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors duration-150">
          <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">${deck.name}</td>
          <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">${deck.description || 'N/A'}</td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              deck.status === 'active'
                ? 'bg-green-100 text-green-800'
                : deck.status === 'draft'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
            }">${deck.status}</span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">${formatDate(deck.created_at)}</td>
        </tr>
      `
        )
        .join('');

      const paginationHtml = generatePaginationHtml(
        pageNum,
        limitNum,
        total,
        req.query,
        'pitchdeck'
      );
      res.send(deckHtml + paginationHtml);
    } else {
      res.json({
        success: true,
        data: decks,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    }
  } catch (error) {
    logger.error('Error fetching pitchdecks:', error);
    if (isHtmxRequest(req)) {
      res
        .status(500)
        .send('<p class="text-red-500">Error loading pitchdecks</p>');
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// Helper function to generate pagination HTML
const generatePaginationHtml = (page, limit, total, query, entity) => {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return '';

  const search = query.search || '';
  const status = query.status || '';
  const params = `limit=${limit}&search=${encodeURIComponent(search)}&status=${status}`;

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

// Bulk action for pitchdecks
export const bulkAction = async (req, res) => {
  try {
    const { action, ids, status } = req.body;

    if (!action || !ids || !Array.isArray(ids)) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid request data' });
    }

    switch (action) {
      case 'delete':
        const { error: deleteError } = await databaseService.supabase
          .from('pitch_deck')
          .delete()
          .in('id', ids);

        if (deleteError) throw deleteError;

        logger.info(`Bulk deleted ${ids.length} pitchdecks`);
        break;

      case 'update_status':
        if (!status) {
          return res.status(400).json({
            success: false,
            error: 'Status is required for update_status action',
          });
        }

        const { error: updateError } = await databaseService.supabase
          .from('pitch_deck')
          .update({ status })
          .in('id', ids);

        if (updateError) throw updateError;

        logger.info(
          `Bulk updated status to ${status} for ${ids.length} pitchdecks`
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
          htmx.trigger('#pitchdeckTableContainer', 'pitchdeckBulkAction');
        </script>
      `);
    } else {
      res.json({
        success: true,
        message: 'Bulk action completed successfully',
      });
    }
  } catch (error) {
    logger.error('Error performing bulk action on pitchdecks:', error);
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

// Route setup function
export default function pitchdeckRoutes(app) {
  app.get('/api/pitchdeck', getPitchDeck);
  app.post('/api/pitchdeck/bulk-action', bulkAction);
}
