import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Enterprise Dashboard Startups Page
export const getEnterpriseStartups = async (req, res) => {
  try {
    logger.info('Enterprise Dashboard startups page accessed');

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('enterprise-dashboard/startups', {
      title: 'Enterprise Dashboard Startups',
      description: 'Enterprise Dashboard startups',
      section: 'enterprise-dashboard',
      currentSection: 'enterprise-dashboard',
      currentPage: 'Startups',
      layout,
    });
  } catch (error) {
    logger.error('Error loading enterprise dashboard startups:', error);
    res.status(500).send('Error loading page');
  }
};
