import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Startup Dashboard Activity Log Page
export const getDashboardActivityLog = async (req, res) => {
  try {
    logger.info('Startup Dashboard activity log page accessed');

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('startup-dashboard/activity-log', {
      title: 'Startup Dashboard Activity Log',
      description: 'Startup Dashboard activity log',
      section: 'startup-dashboard',
      currentSection: 'startup-dashboard',
      currentPage: 'Activity Log',
      layout,
    });
  } catch (error) {
    logger.error('Error loading startup dashboard activity log:', error);
    res.status(500).send('Error loading page');
  }
};
