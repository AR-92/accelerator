 import logger from '../../utils/logger.js';
 import serviceFactory from '../../services/index.js';

// Ideas Management
export const getIdeas = async (req, res) => {
  try {
    logger.info('Admin ideas page accessed');

    const ideaService = serviceFactory.getIdeaService();
    const { data: ideas } = await ideaService.getAllIdeas({}, { limit: 1000 }); // Get all for admin view

    const columns = [
      { key: 'title', label: 'Title', type: 'title', descriptionKey: 'description' },
      { key: 'author', label: 'Author', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'votes', label: 'Votes', type: 'text', hidden: true, responsive: 'md:table-cell' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      {
        type: 'link',
        url: '/admin/table-pages/ideas',
        label: 'View Details',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>'
      },
      {
        type: 'button',
        onclick: 'approveIdea',
        label: 'Approve',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-check" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,6 9,17 4,12"></polyline></svg>'
      },
      {
        type: 'button',
        onclick: 'rejectIdea',
        label: 'Reject',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-x" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
      },
      {
        type: 'delete',
        onclick: 'deleteIdea',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>'
      }
    ];

    const bulkActions = [
      { onclick: 'bulkApproveIdeas', buttonId: 'bulkApproveBtn', label: 'Approve Selected' },
      { onclick: 'bulkRejectIdeas', buttonId: 'bulkRejectBtn', label: 'Reject Selected' },
      { onclick: 'bulkDeleteIdeas', buttonId: 'bulkDeleteBtn', label: 'Delete Selected' }
    ];

    const pagination = {
      currentPage: 1,
      limit: 10,
      total: ideas.length,
      start: 1,
      end: ideas.length,
      hasPrev: false,
      hasNext: false,
      prevPage: 0,
      nextPage: 2,
      pages: [1]
    };

    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/table-pages/ideas', {
      title: 'Ideas Management',
      currentPage: 'ideas',
      currentSection: 'main',
      tableId: 'ideas',
      entityName: 'idea',
      showCheckbox: true,
      showBulkActions: true,
      columns,
      data: ideas,
      actions,
      bulkActions,
      pagination,
      query: { search: '', status: '' },
      currentUrl: '/admin/table-pages/ideas',
      colspan
    });
  } catch (error) {
    logger.error('Error loading ideas:', error);
    res.render('admin/table-pages/ideas', {
      title: 'Ideas Management',
      currentPage: 'ideas',
      currentSection: 'main',
      data: [],
      pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] },
      query: { search: '', status: '' }
    });
  }
};