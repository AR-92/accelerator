import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Dashboard Business Page
export const getDashboardBusiness = async (req, res) => {
  try {
    logger.info('Dashboard business page accessed');

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('dashboard/business', {
      title: 'Dashboard Business',
      description: 'Dashboard business',
      section: 'dashboard',
      layout,
    });
  } catch (error) {
    logger.error('Error loading dashboard business:', error);
    res.status(500).send('Error loading page');
  }
};
