import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Corporate Dashboard Projects Page
export const getCorporateProjects = async (req, res) => {
  try {
    logger.info('Corporate Dashboard projects page accessed');

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('corporate-dashboard/projects', {
      title: 'Corporate Dashboard Projects',
      description: 'Corporate Dashboard projects',
      section: 'corporate-dashboard',
      currentSection: 'corporate-dashboard',
      currentPage: 'Projects',
      layout,
    });
  } catch (error) {
    logger.error('Error loading corporate dashboard projects:', error);
    res.status(500).send('Error loading page');
  }
};
