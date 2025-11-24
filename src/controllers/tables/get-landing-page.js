import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';
import { applyTableFilters, getStatusCounts, getFilterCounts } from '../../helpers/tableFilters.js';
import { getTableConfig } from '../../config/tableFilters.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Landing Page Management
export const getLandingPage = async (req, res) => {
  try {
    logger.info('Admin landing page accessed');

    const { search = '', status = '' } = req.query;

    // Fetch real data from Supabase landing_pages table
    const { data: sections, error } = await databaseService.supabase
      .from('landing_pages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching landing pages:', error);
      throw error;
    }

    // Map to expected format
    const mappedSections = sections.map(section => ({
      id: section.id,
      name: section.title || section.name || `Section ${section.id}`,
      is_active: section.is_active,
      last_updated: section.updated_at || section.created_at
    }));

    let filteredSections = mappedSections;

    if (search) {
      const searchTerm = search.toLowerCase();
      filteredSections = sections.filter(section => {
        return (section.name && section.name.toLowerCase().includes(searchTerm)) ||
                (section.is_active !== undefined && section.is_active.toString().toLowerCase().includes(searchTerm));
      });
    }

    const columns = [
      { key: 'name', label: 'Section Name', type: 'text' },
      { key: 'is_active', label: 'Status', type: 'status' },
      { key: 'last_updated', label: 'Last Updated', type: 'date' }
    ];

    const actions = [
      { type: 'button', onclick: 'editSection', label: 'Edit', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>' },
      { type: 'button', onclick: 'toggleSection', label: 'Toggle', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-power" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>' }
    ];

    const pagination = { currentPage: 1, limit: 10, total: filteredSections.length, start: 1, end: filteredSections.length, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [1] };
    const colspan = columns.length + (false ? 1 : 0) + (actions.length > 0 ? 1 : 0);


    // Get status counts using the dynamic helper
    const statusCounts = await getStatusCounts('landing-pages', databaseService);
    logger.info(`Status counts: ${JSON.stringify(statusCounts)}`);

    // Prepare filter counts for template
    const filterCounts = getFilterCounts('landing-pages', statusCounts);
    const tableConfig = getTableConfig('landing-pages');

    // Make variables available to layout for filter-nav
    res.locals.tableConfig = tableConfig;
    res.locals.filterCounts = filterCounts;
    res.locals.currentPage = 'landing-pages';
    res.locals.query = { search: search || '', status: status || '' };

    res.render('admin/table-pages/landing-page', {
      title: 'Landing Page Management', currentPage: 'landing-pages', currentSection: 'content-management', isTablePage: true, tableId: 'landing-pages', entityName: 'section', showCheckbox: false, showBulkActions: false, columns, data: filteredSections, actions, bulkActions: [], pagination, query: { search: req.query.search || '', status: '' }, currentUrl: '/admin/table-pages/landing-page', colspan
    });
  } catch (error) {
    logger.error('Error loading landing page:', error);
    res.render('admin/table-pages/landing-page', { title: 'Landing Page Management', currentPage: 'landing-pages', currentSection: 'content-management', isTablePage: true, data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};