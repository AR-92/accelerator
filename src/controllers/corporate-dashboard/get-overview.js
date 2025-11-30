import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Corporate Dashboard Overview Page
export const getCorporateOverview = async (req, res) => {
  try {
    logger.info('Corporate Dashboard overview page accessed');

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('corporate-dashboard/overview', {
      title: 'Corporate Dashboard Overview',
      description: 'Corporate Dashboard overview',
      section: 'corporate-dashboard',
      currentSection: 'corporate-dashboard',
      currentPage: 'Overview',
      layout,
    });
  } catch (error) {
    logger.error('Error loading corporate dashboard overview:', error);
    res.status(500).send('Error loading page');
  }
};
