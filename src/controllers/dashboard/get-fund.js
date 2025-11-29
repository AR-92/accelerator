import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Dashboard Fund Page
export const getDashboardFund = async (req, res) => {
  try {
    logger.info('Dashboard fund page accessed');

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('dashboard/fund', {
      title: 'Dashboard Fund',
      description: 'Dashboard fund',
      section: 'dashboard',
      layout,
    });
  } catch (error) {
    logger.error('Error loading dashboard fund:', error);
    res.status(500).send('Error loading page');
  }
};
