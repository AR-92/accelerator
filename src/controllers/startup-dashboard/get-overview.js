import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Startup Dashboard Overview Page
export const getDashboardOverview = async (req, res) => {
  try {
    logger.info('Startup Dashboard overview page accessed');

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('startup-dashboard/overview', {
      title: 'Startup Dashboard Overview',
      description: 'Startup Dashboard overview',
      section: 'startup-dashboard',
      currentSection: 'startup-dashboard',
      currentPage: 'Overview',
      layout,
    });
  } catch (error) {
    logger.error('Error loading startup dashboard overview:', error);
    res.status(500).send('Error loading page');
  }
};
