import logger from '../../utils/logger.js';
import serviceFactory from '../../services/index.js';

// Main Section Overview
export const getMain = async (req, res) => {
  try {
    logger.info('Admin main section overview accessed');

    const mainOverviewService = serviceFactory.getMainOverviewService();
    const stats = await mainOverviewService.getMainStats();

    res.render('admin/other-pages/main', {
      title: 'Main Overview',
      currentPage: 'main',
      currentSection: 'main',
      stats
    });
  } catch (error) {
    logger.error('Error loading main overview:', error);
    res.render('admin/other-pages/main', {
      title: 'Main Overview',
      currentPage: 'main',
      currentSection: 'main',
      stats: {
        todos: { total: 0, completed: 0, pending: 0 },
        users: { total: 0, active: 0, pending: 0 },
        ideas: { total: 0, approved: 0, pending: 0 },
        votes: { total: 0, upvotes: 0, downvotes: 0 },
        collaborations: { total: 0, active: 0, archived: 0 }
      }
    });
  }
};