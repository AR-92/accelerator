import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Enterprise Dashboard Analytics Page
export const getEnterpriseAnalytics = async (req, res) => {
  try {
    logger.info('Enterprise Dashboard analytics page accessed');

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('enterprise-dashboard/analytics', {
      title: 'Enterprise Dashboard Analytics',
      description: 'Enterprise Dashboard analytics',
      section: 'enterprise-dashboard',
      currentSection: 'enterprise-dashboard',
      currentPage: 'Analytics',
      layout,
    });
  } catch (error) {
    logger.error('Error loading enterprise dashboard analytics:', error);
    res.status(500).send('Error loading page');
  }
};
