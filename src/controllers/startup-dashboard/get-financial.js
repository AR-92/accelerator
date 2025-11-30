import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Startup Dashboard Financial Page
export const getDashboardFinancial = async (req, res) => {
  try {
    logger.info('Startup Dashboard financial page accessed');

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('startup-dashboard/financial', {
      title: 'Startup Dashboard Financial',
      description: 'Startup Dashboard financial',
      section: 'startup-dashboard',
      currentSection: 'startup-dashboard',
      currentPage: 'Financial',
      layout,
    });
  } catch (error) {
    logger.error('Error loading startup dashboard financial:', error);
    res.status(500).send('Error loading page');
  }
};
