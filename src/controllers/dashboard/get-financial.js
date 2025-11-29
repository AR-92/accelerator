import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Dashboard Financial Page
export const getDashboardFinancial = async (req, res) => {
  try {
    logger.info('Dashboard financial page accessed');

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('dashboard/financial', {
      title: 'Dashboard Financial',
      description: 'Dashboard financial',
      section: 'dashboard',
      layout,
    });
  } catch (error) {
    logger.error('Error loading dashboard financial:', error);
    res.status(500).send('Error loading page');
  }
};
