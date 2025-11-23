import logger from '../../utils/logger.js';
import serviceFactory from '../../services/index.js';

// Notifications
export const getNotifications = async (req, res) => {
  try {
    logger.info('Admin notifications page accessed');

    const notificationService = serviceFactory.getNotificationService();

    // Get all notifications (admin view - no user filter)
    const { data: notifications } = await notificationService.getAllNotifications({}, { limit: 1000 }); // Get all for admin view

    // Map to expected format
    const mappedNotifications = notifications.map(notification => ({
      id: notification.id,
      user_id: notification.user_id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      is_read: notification.is_read,
      priority: notification.priority,
      created_at: notification.created_at
    }));

    const columns = [
      { key: 'type', label: 'Type', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'message', label: 'Message', type: 'text' },
      { key: 'user_id', label: 'User ID', type: 'text' },
      { key: 'is_read', label: 'Read', type: 'status' },
      { key: 'priority', label: 'Priority', type: 'text' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      {
        type: 'link',
        url: '/admin/other-pages/notifications',
        label: 'View Details',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>'
      },
      {
        type: 'button',
        onclick: 'markAsRead',
        label: 'Mark as Read',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-check" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,6 9,17 4,12"></polyline></svg>'
      }
    ];

    const bulkActions = [
      { onclick: 'bulkMarkAsRead', buttonId: 'bulkReadBtn', label: 'Mark as Read' },
      { onclick: 'bulkDeleteNotifications', buttonId: 'bulkDeleteBtn', label: 'Delete Selected' }
    ];

    const pagination = {
      currentPage: 1,
      limit: 10,
      total: mappedNotifications.length,
      start: 1,
      end: mappedNotifications.length,
      hasPrev: false,
      hasNext: false,
      prevPage: 0,
      nextPage: 2,
      pages: [1]
    };

    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    // Calculate notification stats using service
    const notificationStats = await notificationService.getNotificationStats();

    res.render('admin/other-pages/notifications', {
      title: 'Notifications',
      currentPage: 'notifications',
      currentSection: 'system',
      tableId: 'notifications',
      entityName: 'notification',
      showCheckbox: true,
      showBulkActions: true,
      columns,
      data: mappedNotifications,
      actions,
      bulkActions,
      pagination,
      query: { search: '', status: '' },
      currentUrl: '/admin/other-pages/notifications',
      colspan,
      notifications: mappedNotifications,
      notificationStats
    });
  } catch (error) {
    logger.error('Error loading notifications:', error);
    res.render('admin/other-pages/notifications', {
      title: 'Notifications',
      currentPage: 'notifications',
      currentSection: 'system',
      data: [],
      pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] },
      query: { search: '', status: '' }
    });
  }
};