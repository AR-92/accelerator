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

    // Generate system health trends for charts
    const now = new Date();
    const systemTrends = {
      activityVolume: {
        labels: [],
        data: [],
      },
      notificationVolume: {
        labels: [],
        data: [],
      },
      memoryUsage: {
        labels: [],
        data: [],
      },
    };

    // Generate last 7 days of activity and notification trends
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateLabel = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      systemTrends.activityVolume.labels.push(dateLabel);
      systemTrends.notificationVolume.labels.push(dateLabel);
      systemTrends.memoryUsage.labels.push(dateLabel);

      // Simulate activity volume (higher on weekdays)
      const dayOfWeek = date.getDay();
      const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
      const baseActivity = Math.floor(Math.random() * 200) + 100;
      const activityMultiplier = isWeekday ? 1.3 : 0.7;
      systemTrends.activityVolume.data.push(
        Math.floor(baseActivity * activityMultiplier)
      );

      // Simulate notification volume
      const baseNotifications = Math.floor(Math.random() * 50) + 20;
      const notificationMultiplier = isWeekday ? 1.2 : 0.8;
      systemTrends.notificationVolume.data.push(
        Math.floor(baseNotifications * notificationMultiplier)
      );

      // Simulate memory usage (gradually increasing)
      const baseMemory = memoryMB + Math.random() * 50 - 25;
      systemTrends.memoryUsage.data.push(Math.max(0, Math.round(baseMemory)));
    }

    // System performance metrics
    const systemPerformance = {
      uptime: '99.9%',
      responseTime: '245ms',
      errorRate: '0.1%',
      throughput: '1.2k req/min',
      activeUsers: Math.floor(Math.random() * 50) + 20,
      systemLoad: 'Normal',
    };

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
        icon: 'activity',
      },
      {
        id: 'system-config-btn',
        href: '/admin/system-config',
        text: 'System Config',
        icon: 'settings',
      },
      {
        id: 'system-logs-btn',
        href: '/admin/system-logs',
        text: 'System Logs',
        icon: 'file-text',
      },
      {
        id: 'notifications-btn',
        href: '/admin/table-pages/notifications',
        text: 'Notifications',
        icon: 'bell',
      },
      {
        id: 'activity-logs-btn',
        href: '/admin/table-pages/activity',
        text: 'Activity Logs',
        icon: 'activity',
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
      systemTrends,
      systemPerformance,
      lastUpdated: new Date().toLocaleString(),
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
