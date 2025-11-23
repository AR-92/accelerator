import logger from '../../utils/logger.js';
import databaseService from '../../services/supabase.js';

// Content Management
export const getContent = async (req, res) => {
  try {
    logger.info('Admin content page accessed');

    // Fetch real data from Supabase learning_content table
    const { data: content, error } = await databaseService.supabase
      .from('learning_content')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching content:', error);
      throw error;
    }

    // Map to expected format
    const mappedContent = content.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      type: item.content_type,
      status: item.status,
      created_at: item.created_at
    }));

    const contentColumns = [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'text' },
      { key: 'type', label: 'Type', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      {
        type: 'link',
        url: '/admin/table-pages/content',
        label: 'View Details',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>'
      },
      {
        type: 'button',
        onclick: 'editContent',
        label: 'Edit',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>'
      },
      {
        type: 'delete',
        onclick: 'deleteContent',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>'
      }
    ];

    const bulkActions = [
      { onclick: 'bulkArchiveContent', buttonId: 'bulkArchiveBtn', label: 'Archive Selected' },
      { onclick: 'bulkDeleteContent', buttonId: 'bulkDeleteBtn', label: 'Delete Selected' }
    ];

    const pagination = {
      currentPage: 1,
      limit: 10,
      total: mappedContent.length,
      start: 1,
      end: mappedContent.length,
      hasPrev: false,
      hasNext: false,
      prevPage: 0,
      nextPage: 2,
      pages: [1]
    };

    const colspan = contentColumns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/table-pages/content', {
      title: 'Content Management',
      currentPage: 'content',
      currentSection: 'content-management',
      tableId: 'content',
      entityName: 'content',
      showCheckbox: true,
      showBulkActions: true,
      columns: contentColumns,
      data: mappedContent,
      actions,
      bulkActions,
      pagination,
      query: { search: '', status: '' },
      currentUrl: '/admin/table-pages/content',
      colspan
    });
  } catch (error) {
    logger.error('Error loading content:', error);
    res.render('admin/table-pages/content', {
      title: 'Content Management',
      currentPage: 'content',
      currentSection: 'content-management',
      data: [],
      pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] },
      query: { search: '', status: '' }
    });
  }
};