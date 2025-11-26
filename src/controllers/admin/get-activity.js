import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';
import { serviceFactory } from '../../services/serviceFactory.js';

// Activity Log
export const getActivity = async (req, res) => {
  try {
    console.log('getActivity controller called');
    logger.info('Admin activity page accessed');

    const activityService = serviceFactory.getActivityService();
    const { activities, stats } =
      await activityService.getActivityLogsForAdmin(100);

    // Generate chart data for activity trends
    const now = new Date();
    console.log('Creating activityTrends object...');
    const activityTrends = {
      volumeHistory: {
        labels: [],
        data: [],
      },
      typeDistribution: {
        labels: [],
        data: [],
      },
      errorRateHistory: {
        labels: [],
        data: [],
      },
    };

    // Generate last 24 hours of activity volume data
    for (let i = 23; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourLabel = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
      activityTrends.volumeHistory.labels.push(hourLabel);

      // Simulate activity volume (in real app, query database for actual counts)
      const baseVolume = Math.floor(Math.random() * 50) + 10;
      const hourOfDay = date.getHours();
      // Add some realistic patterns (more activity during business hours)
      const multiplier = hourOfDay >= 9 && hourOfDay <= 17 ? 1.5 : 0.7;
      activityTrends.volumeHistory.data.push(
        Math.floor(baseVolume * multiplier)
      );
    }

    // Activity type distribution
    const typeCounts = {};
    activities.forEach((activity) => {
      const type = activity.activity_type || 'unknown';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    // Ensure we have at least some data for the chart
    if (Object.keys(typeCounts).length === 0) {
      typeCounts['login'] = 1; // Default data if no activities exist
      typeCounts['user'] = 1;
    }

    activityTrends.typeDistribution.labels = Object.keys(typeCounts);
    activityTrends.typeDistribution.data = Object.values(typeCounts);

    // Error rate history (simulate based on failed activities)
    for (let i = 23; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourLabel = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
      activityTrends.errorRateHistory.labels.push(hourLabel);

      // Simulate error rates (lower during normal hours)
      const baseErrorRate = Math.random() * 5;
      const hourOfDay = date.getHours();
      const errorMultiplier = hourOfDay >= 9 && hourOfDay <= 17 ? 0.5 : 1.2;
      activityTrends.errorRateHistory.data.push(
        Math.max(0, Math.min(100, baseErrorRate * errorMultiplier))
      );
    }

    // Activity analytics
    const activityAnalytics = {
      totalActivities: activities.length,
      uniqueUsers: new Set(activities.map((a) => a.user_id).filter((id) => id))
        .size,
      successRate:
        activities.length > 0
          ? (
              (activities.filter((a) => a.status === 'success').length /
                activities.length) *
              100
            ).toFixed(1)
          : 0,
      topActivityTypes: Object.entries(typeCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([type, count]) => ({ type, count })),
      peakHours: [9, 10, 11, 14, 15, 16], // Business hours
      avgResponseTime: '45ms', // Simulated
    };

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

    console.log(
      'Activity trends data:',
      JSON.stringify(activityTrends, null, 2)
    );

    try {
      res.render('admin/other-pages/activity', {
        title: 'Activity Management',
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
        activityTrends,
        activityAnalytics,
        lastUpdated: new Date().toLocaleString(),
      });
      console.log('Activity page rendered successfully');
    } catch (renderError) {
      console.error('Error rendering activity page:', renderError);
      throw renderError;
    }
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
