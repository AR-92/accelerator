import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Startup Dashboard Promote Page
export const getDashboardPromote = async (req, res) => {
  try {
    logger.info('Startup Dashboard promote page accessed');

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('startup-dashboard/promote', {
      title: 'Startup Dashboard Promote',
      description: 'Startup Dashboard promote',
      section: 'startup-dashboard',
      currentSection: 'startup-dashboard',
      currentPage: 'Promote',
      layout,
    });
  } catch (error) {
    logger.error('Error loading startup dashboard promote:', error);
    res.status(500).send('Error loading page');
  }
};
