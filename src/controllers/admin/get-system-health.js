import logger from '../../utils/logger.js';
import serviceFactory from '../../services/index.js';

// System Health
export const getSystemHealth = async (req, res) => {
  try {
    logger.info('Admin system health page accessed');

    const systemHealthService = serviceFactory.getSystemHealthService();
    const systemMetrics = await systemHealthService.getSystemMetrics();

    res.render('admin/other-pages/system-health', {
      title: 'System Health',
      currentPage: 'system-health',
      currentSection: 'system',
      systemMetrics
    });
  } catch (error) {
    logger.error('Error loading system health:', error);
    res.render('admin/other-pages/system-health', {
      title: 'System Health',
      currentPage: 'system-health',
      currentSection: 'system',
      systemMetrics: {
        dbConnected: false,
        memoryUsagePercent: 0,
        uptimeString: '0d 0h',
        cpuUsage: 0,
        diskUsage: 0,
        totalTables: 0,
        totalRecords: 0,
        queriesPerMin: 0,
        responseTime: 0,
        activeConnections: 0
      }
    });
  }
};