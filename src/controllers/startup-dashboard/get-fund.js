import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Startup Dashboard Fund Page
export const getDashboardFund = async (req, res) => {
  try {
    logger.info('Startup Dashboard fund page accessed');

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('startup-dashboard/fund', {
      title: 'Startup Dashboard Fund',
      description: 'Startup Dashboard fund',
      section: 'startup-dashboard',
      currentSection: 'startup-dashboard',
      currentPage: 'Fund',
      layout,
    });
  } catch (error) {
    logger.error('Error loading startup dashboard fund:', error);
    res.status(500).send('Error loading page');
  }
};
