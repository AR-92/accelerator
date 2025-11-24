import logger from '../../../utils/logger.js';
import { databaseService } from '../../../services/index.js';


// Business Plan API
export const getBusinessPlan = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    let query = databaseService.supabase
      .from('business_plan')
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

    const { data: plans, error, count } = await query;

    if (error) throw error;

    const total = count || 0;
    logger.info(`Fetched ${plans.length} of ${total} business plans`);

    if (isHtmxRequest(req)) {
      const planHtml = plans.map(plan => `
        <tr class="border-b border-gray-100/40 hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors duration-150">
          <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">${plan.name}</td>
          <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">${plan.description || 'N/A'}</td>
          <td class="px-6 py-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              plan.status === 'active' ? 'bg-green-100 text-green-800' :
              plan.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }">${plan.status}</span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">${formatDate(plan.created_at)}</td>
        </tr>
      `).join('');

      const paginationHtml = generatePaginationHtml(pageNum, limitNum, total, req.query, 'business-plan');
      res.send(planHtml + paginationHtml);
    } else {
      res.json({ success: true, data: plans, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
    }
  } catch (error) {
    logger.error('Error fetching business plans:', error);
    if (isHtmxRequest(req)) {
      res.status(500).send('<p class="text-red-500">Error loading business plans</p>');
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

  let html = `<div class="flex items-center justify-between mt-4 pt-4 border-t">`;
  if (page > 1) {
    html += `<button hx-get="/api/${entity}?page=${page-1}&${params}" hx-target="#${entity}TableContainer" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">Previous</button>`;
  } else {
    html += `<span></span>`;
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
    html += `<button hx-get="/api/${entity}?page=${page+1}&${params}" hx-target="#${entity}TableContainer" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">Next</button>`;
  } else {
    html += `<span></span>`;
  }
  html += `</div>`;
  return html;
};

// Route setup function
export default function businessPlanRoutes(app) {
  app.get('/api/business-plan', getBusinessPlan);
}