import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Enterprise Dashboard Projects Page
export const getEnterpriseProjects = async (req, res) => {
  try {
    logger.info('Enterprise Dashboard projects page accessed');

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('enterprise-dashboard/projects', {
      title: 'Enterprise Dashboard Projects',
      description: 'Enterprise Dashboard projects',
      section: 'enterprise-dashboard',
      currentSection: 'enterprise-dashboard',
      currentPage: 'Projects',
      layout,
    });
  } catch (error) {
    logger.error('Error loading enterprise dashboard projects:', error);
    res.status(500).send('Error loading page');
  }
};
