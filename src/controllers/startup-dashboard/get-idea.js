import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Startup Dashboard Idea Page
export const getDashboardIdea = async (req, res) => {
  try {
    logger.info('Startup Dashboard idea page accessed');

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('startup-dashboard/idea', {
      title: 'Startup Dashboard Idea',
      description: 'Startup Dashboard idea',
      section: 'startup-dashboard',
      currentSection: 'startup-dashboard',
      currentPage: 'Idea',
      layout,
    });
  } catch (error) {
    logger.error('Error loading startup dashboard idea:', error);
    res.status(500).send('Error loading page');
  }
};
