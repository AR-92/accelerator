import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';
import { serviceFactory } from '../../services/serviceFactory.js';

// Activity Log
export const getActivity = async (req, res) => {
  try {
    console.log('getActivity controller called');
    logger.info('Admin activity page accessed');

    // Parse query parameters
    const {
      category = 'all',
      search = '',
      status = 'all',
      page = 1,
      limit = 50,
    } = req.query;

    const filters = {
      category,
      search,
      status,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };

    const activityService = serviceFactory.getActivityService();

    // Get activities with filters
    const { activities, stats, pagination } =
      await activityService.getActivityLogsForAdmin(filters, { count: true });

    // Get analytics data
    const activityAnalytics =
      await activityService.getActivityAnalytics(filters);

    // Get trends data
    const activityTrends = await activityService.getActivityTrends(filters);

    // Calculate pagination info
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    const start = (pagination.currentPage - 1) * pagination.limit + 1;
    const end = Math.min(
      pagination.currentPage * pagination.limit,
      pagination.total
    );
    const hasPrev = pagination.currentPage > 1;
    const hasNext = pagination.currentPage < totalPages;
    const prevPage = hasPrev ? pagination.currentPage - 1 : null;
    const nextPage = hasNext ? pagination.currentPage + 1 : null;

    const pages = [];
    const maxPages = 5;
    const halfMax = Math.floor(maxPages / 2);
    let startPage = Math.max(1, pagination.currentPage - halfMax);
    let endPage = Math.min(totalPages, startPage + maxPages - 1);

    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    const paginationInfo = {
      currentPage: pagination.currentPage,
      limit: pagination.limit,
      total: pagination.total,
      start,
      end,
      hasPrev,
      hasNext,
      prevPage,
      nextPage,
      pages,
    };

    try {
      res.render('admin/other-pages/activity', {
        title: 'Activity Management',
        currentPage: 'activity',
        currentSection: 'system',
        activities,
        activityStats: stats,
        activityTrends,
        activityAnalytics,
        pagination: paginationInfo,
        query: {
          search: filters.search,
          status: filters.status,
          category: filters.category,
        },
        currentUrl: '/admin/other-pages/activity',
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
      activities: [],
      activityStats: { today: 0, failed: 0, total: 0 },
      activityTrends: {
        volumeHistory: { labels: [], data: [] },
        typeDistribution: { labels: [], data: [] },
        errorRateHistory: { labels: [], data: [] },
      },
      activityAnalytics: {
        totalActivities: 0,
        uniqueUsers: 0,
        successRate: '0.0',
        topActivityTypes: [],
        peakHours: [],
        avgResponseTime: '0ms',
      },
      pagination: {
        currentPage: 1,
        limit: 50,
        total: 0,
        start: 0,
        end: 0,
        hasPrev: false,
        hasNext: false,
        prevPage: null,
        nextPage: null,
        pages: [],
      },
      query: { search: '', status: 'all', category: 'all' },
      lastUpdated: new Date().toLocaleString(),
    });
  }
};

// Export Activity Logs as CSV
export const exportActivityCSV = async (req, res) => {
  try {
    logger.info('Exporting activity logs as CSV');

    // Parse query parameters (same as main page)
    const { category = 'all', search = '', status = 'all' } = req.query;

    const filters = {
      category,
      search,
      status,
      page: 1,
      limit: 10000, // Large limit for export
    };

    const activityService = serviceFactory.getActivityService();
    const { activities } = await activityService.getActivityLogsForAdmin(
      filters,
      { count: false }
    );

    // Transform data for CSV
    const csvData = activities.map((activity) => ({
      ID: activity.id,
      'Created At': new Date(activity.created_at).toLocaleString(),
      'User ID': activity.user_id || 'N/A',
      'Session ID': activity.session_id || 'N/A',
      'Activity Type': activity.activity_type || 'N/A',
      Action: activity.action || 'N/A',
      'Entity Type': activity.entity_type || 'N/A',
      'Entity ID': activity.entity_id || 'N/A',
      Description: activity.description || 'N/A',
      'IP Address': activity.ip_address || 'N/A',
      'User Agent': activity.user_agent || 'N/A',
      Browser: activity.browser || 'N/A',
      OS: activity.os || 'N/A',
      Device: activity.device || 'N/A',
      'Location Country': activity.location_country || 'N/A',
      'Location City': activity.location_city || 'N/A',
      Status: activity.status || 'N/A',
      'Error Message': activity.error_message || 'N/A',
      'Error Code': activity.error_code || 'N/A',
      'Duration (ms)': activity.duration_ms || 'N/A',
      'Request Method': activity.request_method || 'N/A',
      'Request URL': activity.request_url || 'N/A',
      'Response Status': activity.response_status || 'N/A',
      Severity: activity.severity || 'N/A',
      Tags: activity.tags || 'N/A',
    }));

    // Convert to CSV
    if (csvData.length === 0) {
      const csv = 'No data available';
      res.header('Content-Type', 'text/csv');
      res.header(
        'Content-Disposition',
        `attachment; filename=activity_logs_${new Date().toISOString().split('T')[0]}.csv`
      );
      return res.send(csv);
    }

    const headers = Object.keys(csvData[0]);
    const csvRows = [
      headers.join(','),
      ...csvData.map((row) =>
        headers.map((header) => `"${row[header]}"`).join(',')
      ),
    ];
    const csv = csvRows.join('\n');

    // Set headers for file download
    res.header('Content-Type', 'text/csv');
    res.header(
      'Content-Disposition',
      `attachment; filename=activity_logs_${new Date().toISOString().split('T')[0]}.csv`
    );
    res.send(csv);
  } catch (error) {
    logger.error('Error exporting activity logs as CSV:', error);
    console.error('CSV Export Error:', error);
    res.status(500).send('Error exporting data');
  }
};

// Export Activity Logs as JSON
export const exportActivityJSON = async (req, res) => {
  try {
    logger.info('Exporting activity logs as JSON');

    // Parse query parameters (same as main page)
    const { category = 'all', search = '', status = 'all' } = req.query;

    const filters = {
      category,
      search,
      status,
      page: 1,
      limit: 10000, // Large limit for export
    };

    const activityService = serviceFactory.getActivityService();
    const { activities } = await activityService.getActivityLogsForAdmin(
      filters,
      { count: false }
    );

    // Set headers for file download
    res.header('Content-Type', 'application/json');
    res.header(
      'Content-Disposition',
      `attachment; filename=activity_logs_${new Date().toISOString().split('T')[0]}.json`
    );
    res.send(JSON.stringify(activities, null, 2));
  } catch (error) {
    logger.error('Error exporting activity logs as JSON:', error);
    res.status(500).send('Error exporting data');
  }
};
