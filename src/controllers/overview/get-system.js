import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// System Section Overview
export const getSystem = async (req, res) => {
  try {
    logger.info('Admin system section overview accessed');

    // Prepare date filters
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Fetch all stats in parallel
    const [
      { count: totalNotifications },
      { count: unreadNotifications },
      { count: readNotifications },
      { count: totalActivityLogs },
      { count: todayActivityLogs },
      { count: thisWeekActivityLogs },
    ] = await Promise.all([
      databaseService.supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'unread'),
      databaseService.supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'read'),
      databaseService.supabase
        .from('activity_logs')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('activity_logs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString()),
      databaseService.supabase
        .from('activity_logs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString()),
    ]);

    // System Health - dynamic
    const dbConnection = await databaseService.testConnection();
    const memoryUsage = process.memoryUsage();
    const memoryMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const totalTables = 40; // Approximate from OpenAPI
    const totalRecords = totalNotifications + totalActivityLogs + 1000; // Rough estimate

    const statsGrid = [
      {
        icon: 'bell',
        title: 'Notifications',
        link: '/admin/table-pages/notifications',
        items: [
          { label: 'Total', value: totalNotifications || 0 },
          {
            label: 'Unread',
            value: unreadNotifications || 0,
            color: 'text-orange-600',
          },
          {
            label: 'Read',
            value: readNotifications || 0,
            color: 'text-green-600',
          },
        ],
      },
      {
        icon: 'activity',
        title: 'Activity Logs',
        link: '/admin/table-pages/activity',
        items: [
          { label: 'Total', value: totalActivityLogs || 0 },
          {
            label: 'Today',
            value: todayActivityLogs || 0,
            color: 'text-blue-600',
          },
          {
            label: 'This Week',
            value: thisWeekActivityLogs || 0,
            color: 'text-purple-600',
          },
        ],
      },
    ];

    const quickActions = [
      { link: '/admin/system-health', icon: 'activity', text: 'System Health' },
      { link: '/admin/system-config', icon: 'settings', text: 'System Config' },
      { link: '/admin/system-logs', icon: 'file-text', text: 'System Logs' },
      {
        link: '/admin/table-pages/notifications',
        icon: 'bell',
        text: 'Notifications',
      },
      {
        link: '/admin/table-pages/activity',
        icon: 'activity',
        text: 'Activity Logs',
      },
    ];

    const filterLinks = [
      {
        id: 'system-health-btn',
        href: '/admin/system-health',
        text: 'System Health',
      },
      {
        id: 'system-config-btn',
        href: '/admin/system-config',
        text: 'System Config',
      },
      {
        id: 'system-logs-btn',
        href: '/admin/system-logs',
        text: 'System Logs',
      },
      {
        id: 'notifications-btn',
        href: '/admin/table-pages/notifications',
        text: 'Notifications',
      },
      {
        id: 'activity-logs-btn',
        href: '/admin/table-pages/activity',
        text: 'Activity Logs',
      },
    ];

    res.render('admin/overview-page', {
      title: 'System Overview',
      description:
        'Overview of system health, notifications, and activity monitoring',
      section: 'system',
      currentSection: 'system',
      currentPage: 'system',
      statsGrid,
      quickActions,
      filterLinks,
      dbConnection,
      memoryMB,
      totalTables,
      totalRecords,
    });
  } catch (error) {
    logger.error('Error loading system overview:', error);
    res.render('admin/overview-page', {
      title: 'System Overview',
      description:
        'Overview of system health, notifications, and activity monitoring',
      section: 'system',
      currentSection: 'system',
      currentPage: 'system',
      statsGrid: [],
      quickActions: [],
      filterLinks: [],
    });
  }
};
