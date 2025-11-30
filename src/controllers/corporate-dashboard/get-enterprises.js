import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Corporate Dashboard Enterprises Page
export const getCorporateEnterprises = async (req, res) => {
  try {
    logger.info('Corporate Dashboard enterprises page accessed');

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('corporate-dashboard/enterprises', {
      title: 'Corporate Dashboard Enterprises',
      description: 'Corporate Dashboard enterprises',
      section: 'corporate-dashboard',
      currentSection: 'corporate-dashboard',
      currentPage: 'Enterprises',
      layout,
    });
  } catch (error) {
    logger.error('Error loading corporate dashboard enterprises:', error);
    res.status(500).send('Error loading page');
  }
};
