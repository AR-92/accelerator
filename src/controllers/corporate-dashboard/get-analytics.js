import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Corporate Dashboard Analytics Page
export const getCorporateAnalytics = async (req, res) => {
  try {
    logger.info('Corporate Dashboard analytics page accessed');

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('corporate-dashboard/analytics', {
      title: 'Corporate Dashboard Analytics',
      description: 'Corporate Dashboard analytics',
      section: 'corporate-dashboard',
      currentSection: 'corporate-dashboard',
      currentPage: 'Analytics',
      layout,
    });
  } catch (error) {
    logger.error('Error loading corporate dashboard analytics:', error);
    res.status(500).send('Error loading page');
  }
};
