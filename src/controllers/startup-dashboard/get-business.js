import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Startup Dashboard Business Page
export const getDashboardBusiness = async (req, res) => {
  try {
    logger.info('Startup Dashboard business page accessed');

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('startup-dashboard/business', {
      title: 'Startup Dashboard Business',
      description: 'Startup Dashboard business',
      section: 'startup-dashboard',
      currentSection: 'startup-dashboard',
      currentPage: 'Business',
      layout,
    });
  } catch (error) {
    logger.error('Error loading startup dashboard business:', error);
    res.status(500).send('Error loading page');
  }
};
