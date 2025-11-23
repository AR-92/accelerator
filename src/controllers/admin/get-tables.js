import logger from '../../utils/logger.js';
import serviceFactory from '../../services/index.js';

// Database Tables Overview
export const getTables = async (req, res) => {
  try {
    logger.info('Admin tables page accessed');

    const databaseTableService = serviceFactory.getDatabaseTableService();
    const tableData = await databaseTableService.getAllTablesInfo();

    const isConnected = true; // Assume connected if service works

    const columns = [
      { key: 'name', label: 'Table Name', type: 'text' },
      { key: 'records', label: 'Records', type: 'text' },
      { key: 'size', label: 'Size', type: 'text' }
    ];

    const actions = [
      {
        type: 'link',
        url: '/admin/table-pages/tables',
        label: 'View Records',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>'
      }
    ];

    const pagination = {
      currentPage: 1,
      limit: 50,
      total: tableData.length,
      start: 1,
      end: tableData.length,
      hasPrev: false,
      hasNext: false,
      prevPage: 0,
      nextPage: 2,
      pages: [1]
    };

    const colspan = columns.length + 1; // checkbox not shown

    res.render('admin/table-pages/tables', {
      title: 'Database Tables',
      currentPage: 'tables',
      currentSection: 'system',
      tableId: 'tables',
      entityName: 'table',
      showCheckbox: false,
      showBulkActions: false,
      columns,
      data: tableData,
      actions,
      bulkActions: [],
      pagination,
      query: { search: '', status: '' },
      currentUrl: '/admin/table-pages/tables',
      colspan,
      supabaseConnected: isConnected
    });
  } catch (error) {
    logger.error('Error loading tables:', error);
    res.render('admin/table-pages/tables', {
      title: 'Database Tables',
      currentPage: 'tables',
      currentSection: 'system',
      data: [],
      pagination: { currentPage: 1, limit: 50, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] },
      query: { search: '', status: '' },
      supabaseConnected: false,
      error: error.message
    });
  }
};