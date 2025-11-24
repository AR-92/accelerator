import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// Activity Log
export const getActivity = async (req, res) => {
  try {
    logger.info('Admin activity page accessed');

    const activityService = serviceFactory.getActivityService();
    const { activities, stats } =
      await activityService.getActivityLogsForAdmin(100);

    const columns = [
      { key: 'activity_type', label: 'Type', type: 'text' },
      { key: 'action', label: 'Action', type: 'text' },
      { key: 'description', label: 'Description', type: 'text' },
      { key: 'user_id', label: 'User ID', type: 'text' },
      { key: 'ip_address', label: 'IP Address', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      {
        key: 'created_at',
        label: 'Created',
        type: 'date',
        hidden: true,
        responsive: 'lg:table-cell',
      },
    ];

    const actions = [
      {
        type: 'link',
        url: '/admin/other-pages/activity',
        label: 'View Details',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
    ];

    const bulkActions = [];

    const pagination = {
      currentPage: 1,
      limit: 100,
      total: activities.length,
      start: 1,
      end: activities.length,
      hasPrev: false,
      hasNext: false,
      prevPage: 0,
      nextPage: 2,
      pages: [1],
    };

    const colspan =
      columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/other-pages/activity', {
      title: 'Activity Log',
      currentPage: 'activity',
      currentSection: 'system',
      tableId: 'activity',
      entityName: 'activity',
      showCheckbox: false,
      showBulkActions: false,
      columns,
      data: activities,
      actions,
      bulkActions,
      pagination,
      query: { search: '', status: '' },
      currentUrl: '/admin/other-pages/activity',
      colspan,
      activities,
      activityStats: stats,
    });
  } catch (error) {
    logger.error('Error loading activity logs:', error);
    res.render('admin/other-pages/activity', {
      title: 'Activity Log',
      currentPage: 'activity',
      currentSection: 'system',
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
    });
  }
};
