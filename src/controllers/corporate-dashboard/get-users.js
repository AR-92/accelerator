import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Corporate Dashboard Users Page
export const getCorporateUsers = async (req, res) => {
  try {
    logger.info('Corporate Dashboard users page accessed');

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('corporate-dashboard/users', {
      title: 'Corporate Dashboard Users',
      description: 'Corporate Dashboard users',
      section: 'corporate-dashboard',
      currentSection: 'corporate-dashboard',
      currentPage: 'Users',
      layout,
    });
  } catch (error) {
    logger.error('Error loading corporate dashboard users:', error);
    res.status(500).send('Error loading page');
  }
};
