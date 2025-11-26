import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';
import { serviceFactory } from '../../services/serviceFactory.js';

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
      systemMetrics,
      lastUpdated: new Date().toLocaleString(),
    });
  } catch (error) {
    logger.error('Error loading system health:', error);
    res.render('admin/other-pages/system-health', {
      title: 'System Health',
      currentPage: 'system-health',
      currentSection: 'system',
      systemMetrics: {
        systemInfo: {
          hostname: 'Unknown',
          platform: 'Unknown',
          arch: 'Unknown',
        },
        memory: { usagePercent: 0, usageGB: { used: 0, free: 0, total: 0 } },
        cpu: { usage: 0, count: 0 },
        uptime: '0d 0h 0m 0s',
        loadAverage: { '1min': 0, '5min': 0, '15min': 0 },
        disk: { usage: 0, info: { used: 0, free: 0, total: 0 } },
        network: [],
        database: {
          connected: false,
          totalTables: 0,
          totalRecords: 0,
          size: 0,
          connections: 0,
        },
        application: { nodeVersion: 'Unknown', environment: 'Unknown' },
        performance: {
          queriesPerMin: 0,
          responseTime: 0,
          activeConnections: 0,
        },
        fileSystem: [],
        process: { pid: 0, uptime: 0 },
        performanceTrends: {
          cpuHistory: { data: Array(24).fill(0), labels: Array(24).fill('') },
          memoryHistory: {
            data: Array(24).fill(0),
            labels: Array(24).fill(''),
          },
          responseTimeHistory: {
            data: Array(24).fill(0),
            labels: Array(24).fill(''),
          },
        },
      },
    });
  }
};
