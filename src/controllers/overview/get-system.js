import logger from '../../utils/logger.js';
import serviceFactory from '../../services/index.js';

// System Section Overview
export const getSystem = async (req, res) => {
  try {
    logger.info('Admin system section overview accessed');

    const systemOverviewService = serviceFactory.getSystemOverviewService();
    const stats = await systemOverviewService.getSystemStats();

    res.render('admin/other-pages/system', {
      title: 'System Overview',
      currentPage: 'system',
      currentSection: 'system',
      stats
    });
  } catch (error) {
    logger.error('Error loading system overview:', error);
    res.render('admin/other-pages/system', {
      title: 'System Overview',
      currentPage: 'system',
      currentSection: 'system',
      stats: {
        notifications: { total: 0, unread: 0, thisWeek: 0 },
        activityLogs: { total: 0, today: 0, thisWeek: 0 },
        systemHealth: { status: 'unknown', uptime: '0d 0h', memoryUsage: 0 }
      }
    });
  }
};