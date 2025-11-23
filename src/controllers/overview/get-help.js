import logger from '../../utils/logger.js';
import serviceFactory from '../../services/index.js';

// Help Section Overview
export const getHelp = async (req, res) => {
  try {
    logger.info('Admin help section overview accessed');

    const helpOverviewService = serviceFactory.getHelpOverviewService();
    const stats = await helpOverviewService.getHelpStats();

    res.render('admin/other-pages/help', {
      title: 'Help Overview',
      currentPage: 'help',
      currentSection: 'help',
      stats
    });
  } catch (error) {
    logger.error('Error loading help overview:', error);
    res.render('admin/other-pages/help', {
      title: 'Help Overview',
      currentPage: 'help',
      currentSection: 'help',
      stats: {
        helpCenter: { total: 0, published: 0, draft: 0 },
        support: { totalTickets: 0, open: 0, resolved: 0 }
      }
    });
  }
};