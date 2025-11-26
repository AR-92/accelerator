import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';
import { serviceFactory } from '../../services/serviceFactory.js';

// Notifications
export const getNotifications = async (req, res) => {
  try {
    logger.info('Admin notifications page accessed');

    const notificationService = serviceFactory.getNotificationService();

    // Get all notifications (admin view - no user filter)
    const { data: notifications } =
      await notificationService.getAllNotifications({}, { limit: 1000 }); // Get all for admin view

    // Map to expected format
    const mappedNotifications = notifications.map((notification) => ({
      id: notification.id,
      user_id: notification.user_id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      is_read: notification.is_read,
      priority: notification.priority,
      created_at: notification.created_at,
    }));

    const columns = [
      { key: 'type', label: 'Type', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'message', label: 'Message', type: 'text' },
      { key: 'user_id', label: 'User ID', type: 'text' },
      { key: 'is_read', label: 'Read', type: 'status' },
      { key: 'priority', label: 'Priority', type: 'text' },
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
        url: '/admin/other-pages/notifications',
        label: 'View Details',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'button',
        onclick: 'markAsRead',
        label: 'Mark as Read',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-check" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,6 9,17 4,12"></polyline></svg>',
      },
    ];

    const bulkActions = [
      {
        onclick: 'bulkMarkAsRead',
        buttonId: 'bulkReadBtn',
        label: 'Mark as Read',
      },
      {
        onclick: 'bulkDeleteNotifications',
        buttonId: 'bulkDeleteBtn',
        label: 'Delete Selected',
      },
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
      pages: [1],
    };

    const colspan =
      columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    // Calculate notification stats using service
    const notificationStats = await notificationService.getNotificationStats();

    // Generate chart data for notification trends
    const now = new Date();
    const notificationTrends = {
      volumeHistory: {
        labels: [],
        data: [],
      },
      typeDistribution: {
        labels: [],
        data: [],
      },
      readRateHistory: {
        labels: [],
        data: [],
      },
    };

    // Generate last 24 hours of notification volume data
    for (let i = 23; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourLabel = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
      notificationTrends.volumeHistory.labels.push(hourLabel);

      // Simulate notification volume
      const baseVolume = Math.floor(Math.random() * 30) + 5;
      const hourOfDay = date.getHours();
      const multiplier = hourOfDay >= 8 && hourOfDay <= 20 ? 1.3 : 0.6;
      notificationTrends.volumeHistory.data.push(
        Math.floor(baseVolume * multiplier)
      );
    }

    // Notification type distribution
    const typeCounts = {};
    mappedNotifications.forEach((notification) => {
      const type = notification.type || 'system';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    // Ensure we have at least some data for the chart
    if (Object.keys(typeCounts).length === 0) {
      typeCounts['system'] = 1; // Default data if no notifications exist
    }

    notificationTrends.typeDistribution.labels = Object.keys(typeCounts);
    notificationTrends.typeDistribution.data = Object.values(typeCounts);

    // Read rate history
    for (let i = 23; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourLabel = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
      notificationTrends.readRateHistory.labels.push(hourLabel);

      // Simulate read rates
      const baseReadRate = Math.random() * 40 + 60; // 60-100%
      notificationTrends.readRateHistory.data.push(Math.round(baseReadRate));
    }

    // Notification analytics
    const notificationAnalytics = {
      totalNotifications: mappedNotifications.length,
      readRate:
        mappedNotifications.length > 0
          ? (
              (mappedNotifications.filter((n) => n.is_read).length /
                mappedNotifications.length) *
              100
            ).toFixed(1)
          : 0,
      avgResponseTime: '2.3h', // Simulated
      topSenders: ['System', 'Admin', 'User Service'], // Simulated
      urgentCount: mappedNotifications.filter((n) => n.priority === 'high')
        .length,
      deliverySuccess: '99.8%', // Simulated
      userEngagement: {
        openRate: '78.5%',
        actionRate: '45.2%',
        unsubscribeRate: '2.1%',
      },
    };

    res.render('admin/other-pages/notifications', {
      title: 'Notifications Management',
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
      notificationStats,
      notificationTrends,
      notificationAnalytics,
      lastUpdated: new Date().toLocaleString(),
    });
  } catch (error) {
    logger.error('Error loading notifications:', error);
    res.render('admin/other-pages/notifications', {
      title: 'Notifications',
      currentPage: 'notifications',
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
      notifications: [],
      notificationStats: { total: 0, unread: 0, read: 0, thisWeek: 0 },
      notificationTrends: {
        volumeHistory: { labels: [], data: [] },
        typeDistribution: { labels: [], data: [] },
        readRateHistory: { labels: [], data: [] },
      },
      notificationAnalytics: {
        totalNotifications: 0,
        readRate: '0',
        avgResponseTime: 'N/A',
        urgentCount: 0,
        deliverySuccess: 'N/A',
        userEngagement: {
          openRate: 'N/A',
          actionRate: 'N/A',
          unsubscribeRate: 'N/A',
        },
      },
      lastUpdated: new Date().toLocaleString(),
    });
  }
};
