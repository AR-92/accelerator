import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Startup Dashboard Marketing Page
export const getDashboardMarketing = async (req, res) => {
  try {
    logger.info('Startup Dashboard marketing page accessed');

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('startup-dashboard/marketing', {
      title: 'Startup Dashboard Marketing',
      description: 'Startup Dashboard marketing',
      section: 'startup-dashboard',
      currentSection: 'startup-dashboard',
      currentPage: 'Marketing',
      layout,
    });
  } catch (error) {
    logger.error('Error loading startup dashboard marketing:', error);
    res.status(500).send('Error loading page');
  }
};
