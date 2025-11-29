import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Dashboard Team Page
export const getDashboardTeam = async (req, res) => {
  try {
    logger.info('Dashboard team page accessed');

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('dashboard/team', {
      title: 'Dashboard Team',
      description: 'Dashboard team',
      section: 'dashboard',
      layout,
    });
  } catch (error) {
    logger.error('Error loading dashboard team:', error);
    res.status(500).send('Error loading page');
  }
};
