import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Enterprise Dashboard Users Page
export const getEnterpriseUsers = async (req, res) => {
  try {
    logger.info('Enterprise Dashboard users page accessed');

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('enterprise-dashboard/users', {
      title: 'Enterprise Dashboard Users',
      description: 'Enterprise Dashboard users',
      section: 'enterprise-dashboard',
      currentSection: 'enterprise-dashboard',
      currentPage: 'Users',
      layout,
    });
  } catch (error) {
    logger.error('Error loading enterprise dashboard users:', error);
    res.status(500).send('Error loading page');
  }
};
