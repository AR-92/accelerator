import logger from '../utils/logger.js';
import { databaseService } from '../services/index.js';
import {
  applyTableFilters,
  getStatusCounts,
  getFilterCounts,
} from '../helpers/tableFilters.js';
import { getTableConfig } from '../config/tableFilters.js';
import { isHtmxRequest } from '../helpers/http/index.js';
import { tableConfigs } from '../config/tableConfigs.js';

// Simple icon SVG getter for HTMX generated HTML
function getIconSvg(name, size = 16, className = 'w-4 h-4') {
  const icons = {
    eye: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${className}"><path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 12 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 12 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.999 5C16.4784 5 20.2687 7.94291 21.5429 12C21.2607 12.8089 20.9076 13.5684 20.5 14.263"/></svg>`,
    pencil: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${className}"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    trash: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${className}"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${className}"><polyline points="20,6 9,17 4,12"></polyline></svg>`,
    x: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${className}"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    link: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${className}"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
    button: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${className}"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>`,
  };
  return icons[name] || `<span>${name}</span>`;
}

/**
 * Generic table controller that handles all table operations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getGenericTable = async (req, res) => {
  try {
    const { tableName } = req.params;
    const config = tableConfigs[tableName];

    if (!config) {
      logger.error(`Table configuration not found for: ${tableName}`);
      if (isHtmxRequest(req)) {
        return res.status(404).send(`
          <div class="text-red-500 p-4 bg-red-50 border border-red-200 rounded-md">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              <span>Table configuration not found for: ${tableName}</span>
            </div>
          </div>
        `);
      } else {
        return res.status(404).send('Table configuration not found');
      }
    }

    // Ensure standard actions are present
    const standardActions = [
      {
        type: 'link',
        url: `/admin/table-pages/${tableName}/view`,
        label: 'View',
        icon: 'eye',
      },
      {
        type: 'link',
        url: `/admin/table-pages/${tableName}/edit`,
        label: 'Edit',
        icon: 'pencil',
      },
      {
        type: 'delete',
        hxDelete: `/api/${tableName}`,
        hxConfirm: `Are you sure you want to delete this ${config.entityName}?`,
        label: 'Delete',
        icon: 'trash',
      },
    ];

    // Filter out existing standard actions to avoid duplicates
    const existingLabels = standardActions.map((a) => a.label);
    const additionalActions = config.actions.filter(
      (a) => !existingLabels.includes(a.label)
    );

    config.actions = [...standardActions, ...additionalActions];

    const { search = '', status = '', page = 1, limit = 10 } = req.query;
    logger.info(
      `Generic table access: ${tableName}, query params: search="${search}", status="${status}", page=${page}, limit=${limit}`
    );

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    let data, count, error;

    if (tableName === 'votes_management') {
      // Special handling for votes - combine data from ideas and portfolios
      const { data: ideas, error: ideasError } = await databaseService.supabase
        .from('ideas')
        .select('id, title, upvotes, downvotes, created_at');

      const { data: portfolios, error: portfoliosError } =
        await databaseService.supabase
          .from('portfolios')
          .select('id, title, votes, upvotes, downvotes, created_date');

      if (ideasError) {
        logger.error('Error fetching ideas votes:', ideasError);
      }

      if (portfoliosError) {
        logger.error('Error fetching portfolios votes:', portfoliosError);
      }

      // Combine and format vote data
      let votes = [];

      // Process ideas votes
      if (ideas) {
        ideas.forEach((idea) => {
          if (idea.upvotes > 0) {
            votes.push({
              id: `idea-${idea.id}-up`,
              entity_type: 'idea',
              entity_title: idea.title,
              vote_type: 'upvote',
              vote_count: idea.upvotes,
              created_at: idea.created_at,
            });
          }
          if (idea.downvotes > 0) {
            votes.push({
              id: `idea-${idea.id}-down`,
              entity_type: 'idea',
              entity_title: idea.title,
              vote_type: 'downvote',
              vote_count: idea.downvotes,
              created_at: idea.created_at,
            });
          }
        });
      }

      // Process portfolios votes
      if (portfolios) {
        portfolios.forEach((portfolio) => {
          if (portfolio.upvotes > 0) {
            votes.push({
              id: `portfolio-${portfolio.id}-up`,
              entity_type: 'portfolio',
              entity_title: portfolio.title,
              vote_type: 'upvote',
              vote_count: portfolio.upvotes,
              created_at: portfolio.created_date,
            });
          }
          if (portfolio.downvotes > 0) {
            votes.push({
              id: `portfolio-${portfolio.id}-down`,
              entity_type: 'portfolio',
              entity_title: portfolio.title,
              vote_type: 'downvote',
              vote_count: portfolio.downvotes,
              created_at: portfolio.created_date,
            });
          }
        });
      }

      // Sort by creation date
      votes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      // Apply server-side filtering
      let filteredVotes = votes;

      // Apply search filter
      if (search) {
        const searchTerm = search.toLowerCase();
        filteredVotes = filteredVotes.filter((vote) => {
          return (
            (vote.entity_type &&
              vote.entity_type.toLowerCase().includes(searchTerm)) ||
            (vote.entity_title &&
              vote.entity_title.toLowerCase().includes(searchTerm)) ||
            (vote.vote_type &&
              vote.vote_type.toLowerCase().includes(searchTerm)) ||
            (vote.vote_count &&
              vote.vote_count.toString().toLowerCase().includes(searchTerm))
          );
        });
      }

      // Apply status filter (vote_type)
      if (status) {
        filteredVotes = filteredVotes.filter(
          (vote) => vote.vote_type === status
        );
      }

      // Apply pagination
      const paginatedVotes = filteredVotes.slice(offset, offset + limitNum);

      data = paginatedVotes;
      count = filteredVotes.length;
      error = null;
    } else {
      // Build Supabase query with filters
      let query = databaseService.supabase
        .from(config.tableName)
        .select('*', { count: 'exact' });

      // Apply dynamic filters
      query = applyTableFilters(query, tableName, req.query);

      // Apply pagination
      query = query.range(offset, offset + limitNum - 1);

      const result = await query;
      data = result.data;
      error = result.error;
      count = result.count;
    }

    if (error) {
      logger.error(`Error fetching ${tableName}:`, error);
      throw error;
    }

    logger.info(
      `Fetched ${data ? data.length : 0} ${tableName} records, total count: ${count}`
    );

    // Apply data mapper if exists
    const mappedData = config.dataMapper ? config.dataMapper(data) : data;

    const total = count || 0;
    const totalPages = Math.ceil(total / limitNum);
    const start = offset + 1;
    const end = Math.min(offset + limitNum, total);
    const hasPrev = pageNum > 1;
    const hasNext = pageNum < totalPages;
    const prevPage = hasPrev ? pageNum - 1 : null;
    const nextPage = hasNext ? pageNum + 1 : null;
    const pages = [];
    for (
      let i = Math.max(1, pageNum - 2);
      i <= Math.min(totalPages, pageNum + 2);
      i++
    ) {
      pages.push(i);
    }

    const filters = [];
    if (search) filters.push(`search: "${search}"`);
    if (status) filters.push(`status: ${status}`);
    if (pageNum > 1) filters.push(`page: ${pageNum}`);
    logger.info(
      `Fetched ${mappedData.length} of ${total} ${tableName}${filters.length ? ` (filtered by ${filters.join(', ')})` : ''}`
    );

    const pagination = {
      currentPage: pageNum,
      limit: limitNum,
      total,
      start,
      end,
      hasPrev,
      hasNext,
      prevPage,
      nextPage,
      pages,
    };

    const colspan =
      config.columns.length +
      (config.showCheckbox ? 1 : 0) +
      (config.actions.length > 0 ? 1 : 0);

    // Get status counts for filter buttons
    let statusCounts;
    if (tableName === 'votes_management') {
      // Custom status counts for votes
      const allVotes = data.concat(); // data is already filtered, but for counts we need all
      // Actually, need to get all votes without pagination
      const { data: ideas } = await databaseService.supabase
        .from('ideas')
        .select('upvotes, downvotes');
      const { data: portfolios } = await databaseService.supabase
        .from('portfolios')
        .select('upvotes, downvotes');

      statusCounts = {};
      if (ideas) {
        ideas.forEach((idea) => {
          if (idea.upvotes > 0)
            statusCounts.upvote = (statusCounts.upvote || 0) + idea.upvotes;
          if (idea.downvotes > 0)
            statusCounts.downvote =
              (statusCounts.downvote || 0) + idea.downvotes;
        });
      }
      if (portfolios) {
        portfolios.forEach((portfolio) => {
          if (portfolio.upvotes > 0)
            statusCounts.upvote =
              (statusCounts.upvote || 0) + portfolio.upvotes;
          if (portfolio.downvotes > 0)
            statusCounts.downvote =
              (statusCounts.downvote || 0) + portfolio.downvotes;
        });
      }
    } else {
      statusCounts = await getStatusCounts(tableName, databaseService);
    }
    const filterCounts = getFilterCounts(tableName, statusCounts);
    const tableFilterConfig = getTableConfig(tableName);

    // Make variables available to layout for filter-nav
    res.locals.tableConfig = tableFilterConfig;
    res.locals.filterCounts = filterCounts;
    res.locals.currentPage = tableName;
    res.locals.query = { search: search || '', status: status || '' };

    if (isHtmxRequest(req)) {
      // Generate table HTML for HTMX requests
      const tableHtml = generateTableHtml(
        mappedData,
        config,
        pagination,
        tableName
      );
      res.send(tableHtml);
    } else {
      // For full page renders, use the table partial which expects {{id}} placeholders
      res.render('admin/table-page', {
        title: config.title,
        currentPage: tableName,
        currentSection: getCurrentSection(tableName),
        isTablePage: true,
        tableId: tableName,
        entityName: config.entityName,
        showCheckbox: config.showCheckbox,
        showBulkActions: config.showBulkActions,

        columns: config.columns,
        data: mappedData,
        actions: config.actions, // Pass original actions with {{id}} placeholders
        bulkActions: config.bulkActions,
        pagination,
        query: { search: search || '', status: status || '' },
        currentUrl: `/admin/table-pages/${tableName}`,
        colspan,
        filterCounts,
        tableConfig: tableFilterConfig,
      });
    }
  } catch (error) {
    logger.error('Error loading generic table:', error);
    const { tableName } = req.params;

    if (isHtmxRequest(req)) {
      // Return error HTML for HTMX requests, not full page
      res.status(500).send(`
        <div class="text-red-500 p-4 bg-red-50 border border-red-200 rounded-md">
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            <span>Error loading ${tableName || 'table'}: ${error.message}</span>
          </div>
        </div>
      `);
    } else {
      res.render('admin/table-page', {
        title: 'Table Management',
        currentPage: tableName || 'unknown',
        currentSection: 'main',
        data: [],
        pagination: {
          currentPage: 1,
          limit: 10,
          total: 0,
          start: 0,
          end: 0,
          hasPrev: false,
          hasNext: false,
          prevPage: 0,
          nextPage: 2,
          pages: [],
        },
        query: { search: '', status: '' },
        filterCounts: {
          all: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
          active: 0,
          draft: 0,
        },
        error: `Error loading ${tableName || 'table'}`,
      });
    }
  }
};

/**
 * Generate table HTML for HTMX requests
 */
function generateTableHtml(data, config, pagination, tableName) {
  const { columns, actions, bulkActions, showCheckbox, entityName } = config;
  const {
    currentPage,
    limit,
    total,
    start,
    end,
    hasPrev,
    hasNext,
    prevPage,
    nextPage,
    pages,
  } = pagination;

  const colspan =
    columns.length + (showCheckbox ? 1 : 0) + (actions.length > 0 ? 1 : 0);

  let html = `<table class="min-w-full table-auto bg-card rounded-md">
    <thead class="bg-card border-b border-border rounded-t-xl">
      <tr>
        ${
          showCheckbox
            ? `<th class="px-6 py-4 text-left font-semibold text-card-foreground uppercase text-xs tracking-wider bg-muted">
          <input type="checkbox" id="selectAll-${tableName}" class="rounded border-input text-primary"
            aria-label="Select all ${entityName}">
        </th>`
            : ''
        }`;

  // Add column headers
  columns.forEach((column) => {
    const responsiveClass = column.hidden ? ` hidden ${column.responsive}` : '';
    html += `<th class="px-6 py-4 text-left font-semibold text-card-foreground uppercase text-xs tracking-wider${responsiveClass} bg-muted">${column.label}</th>`;
  });

  // Add actions header
  if (actions.length > 0) {
    html += `<th class="px-6 py-4 text-left font-semibold text-card-foreground uppercase text-xs tracking-wider bg-muted">Actions</th>`;
  }

  html += `
      </tr>
    </thead>
    <tbody class="text-sm text-card-foreground">`;

  // Add table rows
  if (data.length > 0) {
    data.forEach((item) => {
      html += `<tr id="${entityName}-row-${item.id}" class="h-16 border-b border-border hover:bg-muted/50 even:bg-muted/30 transition-colors duration-150">
        ${
          showCheckbox
            ? `<td class="px-6 py-4">
          <input type="checkbox" class="${entityName}Checkbox rounded border-input text-primary
            value="${item.id}" data-${entityName}-id="${item.id}" aria-label="Select ${entityName} ${item.title || item.name || item.id}">
        </td>`
            : ''
        }`;

      // Add data cells
      columns.forEach((column) => {
        const responsiveClass = column.hidden
          ? ` hidden ${column.responsive}`
          : '';
        let cellContent = '';

        if (column.type === 'status') {
          cellContent = `<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(item[column.key])}">${item[column.key]}</span>`;
        } else if (column.type === 'date') {
          cellContent = `<div class="text-sm text-card-foreground">${new Date(item[column.key]).toLocaleDateString()}</div>`;
        } else if (column.type === 'title') {
          cellContent = `<div>
            <div class="text-sm font-medium text-card-foreground">${item[column.key]}</div>
            ${column.descriptionKey && item[column.descriptionKey] ? `<div class="text-sm text-muted-foreground">${item[column.descriptionKey]}</div>` : ''}
          </div>`;
        } else {
          cellContent = `<div class="text-sm text-card-foreground truncate max-w-xs" title="${item[column.key]}">${item[column.key]}</div>`;
        }

        html += `<td class="px-6 py-4${responsiveClass}">${cellContent}</td>`;
      });

      // Add actions cell
      if (actions.length > 0) {
        html += `<td class="px-6 py-4">
          <div class="relative">
            <button onclick="toggleActionMenu(this)"
              class="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors"
              aria-label="Actions menu for ${entityName} ${item.id}"
              data-entity="${entityName}"
              data-id="${item.id}">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V6a1 1 0 100 2h0m0 4v.01M12 18v.01"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 12h.01M12 6h.01M12 18h.01"></path>
              </svg>
            </button>
          </div>
        </td>`;
      }

      html += `</tr>`;
    });
  } else {
    // Empty state
    html += `<tr class="h-16">
      <td colspan="${colspan}" class="px-6 py-8 text-center text-muted-foreground">
        <div class="flex flex-col items-center justify-center py-12">
          <svg class="w-16 h-16 text-muted-foreground/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p class="text-lg font-medium text-muted-foreground mb-2">No ${entityName} found</p>
          <p class="text-sm text-muted-foreground/70">Get started by creating your first ${entityName}.</p>
        </div>
      </td>
    </tr>`;
  }

  html += `
    </tbody>
    <tfoot>
      <tr>
        <td colspan="${colspan}" class="bg-card border-t border-border px-4 py-3">
          <div class="max-w-7xl mx-auto flex items-center justify-between">
            <div class="text-xs text-muted-foreground">
              ${start}-${end} of ${total}
            </div>

            <div class="flex items-center gap-3">
              <select id="rowsPerPage-${tableName}" name="limit"
                class="border border-input rounded px-2 py-1 text-xs bg-background focus:outline-none focus:border-ring transition-colors"
                hx-get="/admin/table-pages/${tableName}" hx-target="#${tableName}TableContainer"
                hx-vals="js:{limit: document.getElementById('rowsPerPage-${tableName}').value}">
                <option value="10" ${limit === 10 ? 'selected' : ''}>10</option>
                <option value="20" ${limit === 20 ? 'selected' : ''}>20</option>
                <option value="50" ${limit === 50 ? 'selected' : ''}>50</option>
                <option value="100" ${limit === 100 ? 'selected' : ''}>100</option>
              </select>

              <nav class="flex items-center gap-1">`;

  // Add pagination buttons
  if (hasPrev) {
    html += `<button hx-get="/admin/table-pages/${tableName}?page=${prevPage}"
      hx-target="#${tableName}TableContainer"
      class="inline-flex items-center justify-center w-8 h-8 rounded border border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      title="Previous page">
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
    </button>`;
  }

  pages.forEach((page) => {
    const isActive = page === currentPage;
    html += `<button hx-get="/admin/table-pages/${tableName}?page=${page}"
      hx-target="#${tableName}TableContainer"
      class="inline-flex items-center justify-center px-2 py-1 rounded${isActive ? ' bg-muted text-foreground' : ' text-muted-foreground hover:text-foreground'} transition-colors text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">${page}</button>`;
  });

  if (hasNext) {
    html += `<button hx-get="/admin/table-pages/${tableName}?page=${nextPage}"
      hx-target="#${tableName}TableContainer"
      class="inline-flex items-center justify-center w-8 h-8 rounded border border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      title="Next page">
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
    </button>`;
  }

  html += `
              </nav>
            </div>
          </td>
        </tr>
    </tfoot>
  </table>`;

  // Add action dropdowns (moved outside table to prevent overflow clipping)
  if (data.length > 0 && actions.length > 0) {
    data.forEach((item) => {
      html += `<div id="actionMenu-${entityName}-${item.id}"
        class="dropdown-menu fixed w-48 bg-popover rounded-md shadow-lg border border-border"
        style="display: none;">
        <div class="py-1">`;

      actions.forEach((action) => {
        let url = '';
        let hxGet = '';
        let hxPut = '';
        let hxDelete = '';
        const hxConfirm = action.hxConfirm || '';
        const hxTarget = action.hxTarget || '';
        const hxSwap = action.hxSwap || '';
        const onclick = action.onclick || '';

        if (action.type === 'link') {
          url = `${action.url}/${item.id}`;
        } else if (action.type === 'button') {
          hxGet = `${action.hxGet}/${item.id}`;
        } else if (action.type === 'approve') {
          hxPut = `${action.hxPut}/${item.id}/approve`;
        } else if (action.type === 'reject') {
          hxPut = `${action.hxPut}/${item.id}/reject`;
        } else if (action.type === 'delete') {
          hxDelete = `${action.hxDelete}/${item.id}`;
        }

        if (action.type === 'link') {
          html += `<a href="${url}"
            class="flex items-center px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
            ${getIconSvg(action.icon || 'link', 16, 'w-4 h-4 mr-2')}
            ${action.label}
          </a>`;
        } else if (action.type === 'button') {
          html += `<button ${hxGet ? `hx-get="${hxGet}"` : ''} ${hxTarget ? `hx-target="${hxTarget}"` : ''} ${hxSwap ? `hx-swap="${hxSwap}"` : ''}
            class="flex items-center w-full px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
            ${getIconSvg(action.icon || 'button', 16, 'w-4 h-4 mr-2')}
            ${action.label}
          </button>`;
        } else if (action.type === 'delete') {
          html += `<button ${hxDelete ? `hx-delete="${hxDelete}"` : ''} ${hxConfirm ? `hx-confirm="${hxConfirm.replace('this idea', `"${item.title || item.name || 'this item'}"`)}"` : ''} ${hxTarget ? `hx-target="${hxTarget}"` : ''} ${hxSwap ? `hx-swap="${hxSwap}"` : ''}
            class="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors">
            ${getIconSvg(action.icon || 'trash', 16, 'w-4 h-4 mr-2')}
            ${action.label}
          </button>`;
        } else if (action.type === 'approve') {
          html += `<button ${hxPut ? `hx-put="${hxPut}"` : ''} ${hxTarget ? `hx-target="${hxTarget}"` : ''} ${hxSwap ? `hx-swap="${hxSwap}"` : ''}
            class="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50 transition-colors">
            ${getIconSvg(action.icon || 'check', 16, 'w-4 h-4 mr-2')}
            ${action.label}
          </button>`;
        } else if (action.type === 'reject') {
          html += `<button ${hxPut ? `hx-put="${hxPut}"` : ''} ${hxTarget ? `hx-target="${hxTarget}"` : ''} ${hxSwap ? `hx-swap="${hxSwap}"` : ''}
            class="flex items-center w-full px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50 transition-colors">
            ${getIconSvg(action.icon || 'x', 16, 'w-4 h-4 mr-2')}
            ${action.label}
          </button>`;
        } else {
          html += `<div class="px-4 py-2 text-sm text-muted-foreground">No actions available</div>`;
        }
      });

      html += `
        </div>
      </div>`;
    });
  }

  // Add bulk actions panel
  if (showCheckbox && bulkActions && bulkActions.length > 0) {
    html += `<div id="bulkActions-${tableName}"
      class="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-6 py-3 rounded-full z-30"
      style="display: none;">
      <div class="flex items-center gap-4">
        <span id="selectedCount-${tableName}">0 ${entityName} selected</span>
        <div class="flex gap-2">`;

    bulkActions.forEach((action) => {
      html += `<button onclick="${action.onclick}" id="${action.buttonId}-${tableName}"
        class="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground px-3 py-1 rounded text-sm" disabled="">
        ${action.label}
      </button>`;
    });

    html += `
        </div>
      </div>
    </div>`;
  }

  // Add JavaScript for toggleActionMenu
  html += `<script>
    function toggleActionMenu(button) {
      const entity = button.getAttribute('data-entity');
      const id = button.getAttribute('data-id');

      if (!entity || !id) {
        console.error('Button missing data-entity or data-id attributes');
        return;
      }

      const menu = document.getElementById(\`actionMenu-\${entity}-\${id}\`);

      if (!menu) {
        console.error(\`Dropdown not found: actionMenu-\${entity}-\${id}\`);
        return;
      }

      const allMenus = document.querySelectorAll('[id^="actionMenu-"]');

      // Close all other menus
      allMenus.forEach((m) => {
        if (m !== menu) {
          m.style.display = 'none';
        }
      });

      // Toggle current menu
      if (menu.style.display === 'none' || menu.style.display === '') {
        // Position the menu next to the button first
        const rect = button.getBoundingClientRect();

        // Set position and make visible temporarily to get dimensions
        menu.style.position = 'fixed';
        menu.style.zIndex = '9999';
        menu.style.display = 'block';
        menu.style.visibility = 'hidden';
        menu.style.top = '0px';
        menu.style.left = '0px';

        // Get dimensions after it's in the DOM
        const menuWidth = menu.offsetWidth;
        const menuHeight = menu.offsetHeight;

        // Calculate position: prefer below and to the right of button
        let top = rect.bottom + window.scrollY + 5;
        let left = rect.right + window.scrollX - menuWidth;

        // If it would go off-screen to the left, position to the right of button
        if (left < 0) {
          left = rect.right + window.scrollX;
        }

        // If it would go off-screen to the bottom, position above button
        if (top + menuHeight > window.scrollY + window.innerHeight) {
          top = rect.top + window.scrollY - menuHeight - 5;
        }

        // If it would still go off-screen to the top, position below
        if (top < 0) {
          top = rect.bottom + window.scrollY + 5;
        }

        // Apply final position
        menu.style.top = \`\${top}px\`;
        menu.style.left = \`\${left}px\`;
        menu.style.visibility = 'visible';
      } else {
        menu.style.display = 'none';
      }
    }
  </script>`;

  return html;
}

/**
 * Get status class for styling
 */
function getStatusClass(status) {
  const statusClasses = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    draft: 'bg-gray-100 text-gray-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-blue-100 text-blue-800',
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Get row detail for a specific table and id
 */
export const getRowDetail = async (req, res) => {
  try {
    const { tableName, id } = req.params;
    const config = tableConfigs[tableName];

    if (!config) {
      logger.error(`Table configuration not found for: ${tableName}`);
      return res.status(404).send('Table configuration not found');
    }

    const { data, error } = await databaseService.supabase
      .from(config.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      logger.error(`Row not found for table ${tableName}, id ${id}:`, error);
      return res.status(404).send('Row not found');
    }

    const mappedData = data;

    // Define actions for the detail page
    const actions = [
      {
        link: `/admin/table-pages/${tableName}`,
        icon: 'arrow-left',
        text: 'Go Back',
      },
      {
        link: `/admin/table-pages/${tableName}/edit/${id}`,
        icon: 'edit',
        text: 'Edit',
      },
      {
        link: `/admin/table-pages/${tableName}/view/${id}`,
        icon: 'eye',
        text: 'View',
      },
    ];

    res.render('admin/row-detail', {
      title: `View ${config.entityName}`,
      description: `Details for ${config.entityName} ${id}`,
      table: tableName,
      entity: config.entityName,
      row: mappedData,
      columns: config.columns,
      actions,
      isRowPage: true,
      rowActions: actions,
    });
  } catch (error) {
    logger.error('Error loading row detail:', error);
    res.status(500).send('Error loading row detail');
  }
};

/**
 * Get row edit form for a specific table and id
 */
export const getRowEdit = async (req, res) => {
  try {
    const { tableName, id } = req.params;
    const config = tableConfigs[tableName];

    if (!config) {
      logger.error(`Table configuration not found for: ${tableName}`);
      return res.status(404).send('Table configuration not found');
    }

    const { data, error } = await databaseService.supabase
      .from(config.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      logger.error(`Row not found for table ${tableName}, id ${id}:`, error);
      return res.status(404).send('Row not found');
    }

    const mappedData = data;

    // Define actions for the edit page
    const actions = [
      {
        link: `/admin/table-pages/${tableName}`,
        icon: 'arrow-left',
        text: 'Go Back',
      },
      {
        link: `/admin/table-pages/${tableName}/edit/${id}`,
        icon: 'edit',
        text: 'Edit',
      },
      {
        link: `/admin/table-pages/${tableName}/create`,
        icon: 'plus',
        text: 'Create',
      },
    ];

    res.render('admin/row-edit', {
      title: `Edit ${config.entityName}`,
      description: `Edit details for ${config.entityName} ${id}`,
      table: tableName,
      entity: config.entityName,
      row: mappedData,
      columns: config.columns,
      actions,
      isRowPage: true,
      rowActions: actions,
    });
  } catch (error) {
    logger.error('Error loading row edit:', error);
    res.status(500).send('Error loading row edit');
  }
};

/**
 * Get row create form for a specific table
 */
export const getRowCreate = async (req, res) => {
  try {
    const { tableName } = req.params;
    const config = tableConfigs[tableName];

    if (!config) {
      logger.error(`Table configuration not found for: ${tableName}`);
      return res.status(404).send('Table configuration not found');
    }

    // Define actions for the create page
    const actions = [
      {
        link: `/admin/table-pages/${tableName}`,
        icon: 'arrow-left',
        text: 'Go Back',
      },
      {
        link: `/admin/table-pages/${tableName}/create`,
        icon: 'plus',
        text: 'Create',
      },
    ];

    res.render('admin/row-create', {
      title: `Create ${config.entityName}`,
      description: `Create a new ${config.entityName}`,
      table: tableName,
      entity: config.entityName,
      row: {}, // Empty row for new creation
      columns: config.columns,
      actions,
      isRowPage: true,
      rowActions: actions,
    });
  } catch (error) {
    logger.error('Error loading row create:', error);
    res.status(500).send('Error loading row create');
  }
};

/**
 * Get current section based on table name
 */
function getCurrentSection(tableName) {
  const sectionMap = {
    ideas: 'main',
    users: 'main',
    billing: 'financial',
    content: 'content-management',
    'landing-page': 'content-management',
    votes: 'main',
    collaborations: 'main',
    'learning-content': 'learning',
    'learning-categories': 'learning',
    'learning-assessments': 'learning',
    'learning-analytics': 'learning',
    packages: 'financial',
    rewards: 'financial',
    'business-model': 'business',
    'business-plan': 'business',
    'financial-model': 'business',
    pitchdeck: 'business',
    valuation: 'business',
    funding: 'business',
    team: 'business',
    legal: 'business',
    marketing: 'business',
    corporate: 'business',
    enterprises: 'business',
    messages: 'projects',
    'project-collaborators': 'projects',
    calendar: 'projects',
    'help-center': 'help',
  };
  return sectionMap[tableName] || 'main';
}
