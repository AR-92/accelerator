import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Startup Dashboard Team Page
export const getDashboardTeam = async (req, res) => {
  try {
    logger.info('Startup Dashboard team page accessed');

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('startup-dashboard/team', {
      title: 'Startup Dashboard Team',
      description: 'Startup Dashboard team',
      section: 'startup-dashboard',
      currentSection: 'startup-dashboard',
      currentPage: 'Team',
      layout,
    });
  } catch (error) {
    logger.error('Error loading startup dashboard team:', error);
    res.status(500).send('Error loading page');
  }
};
