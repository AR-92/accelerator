import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Dashboard Overview Page
export const getDashboardOverview = async (req, res) => {
  try {
    logger.info('Dashboard overview page accessed');

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('dashboard/overview', {
      title: 'Dashboard Overview',
      description: 'Dashboard overview',
      section: 'dashboard',
      layout,
    });
  } catch (error) {
    logger.error('Error loading dashboard overview:', error);
    res.status(500).send('Error loading page');
  }
};
