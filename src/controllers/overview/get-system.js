import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// System Section Overview
export const getSystem = async (req, res) => {
  try {
    logger.info('Admin system section overview accessed');

    // Get system stats
    const { count: totalUsers, error: userError } =
      await databaseService.supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
    if (userError) throw userError;

    const { count: totalActivities, error: actError } =
      await databaseService.supabase
        .from('activity_logs')
        .select('*', { count: 'exact', head: true });
    if (actError) throw actError;

    const stats = {
      totalUsers: totalUsers || 0,
      totalActivities: totalActivities || 0,
    };

    res.render('admin/other-pages/system', {
      title: 'System Overview',
      currentPage: 'system',
      currentSection: 'system',
      stats,
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
        systemHealth: { status: 'unknown', uptime: '0d 0h', memoryUsage: 0 },
      },
    });
  }
};
