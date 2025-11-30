import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Enterprise Dashboard Overview Page
export const getEnterpriseOverview = async (req, res) => {
  try {
    logger.info('Enterprise Dashboard overview page accessed');

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('enterprise-dashboard/overview', {
      title: 'Enterprise Dashboard Overview',
      description: 'Enterprise Dashboard overview',
      section: 'enterprise-dashboard',
      currentSection: 'enterprise-dashboard',
      currentPage: 'Overview',
      layout,
    });
  } catch (error) {
    logger.error('Error loading enterprise dashboard overview:', error);
    res.status(500).send('Error loading page');
  }
};
