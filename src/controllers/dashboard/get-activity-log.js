import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Dashboard Activity Log Page
export const getDashboardActivityLog = async (req, res) => {
  try {
    logger.info('Dashboard activity log page accessed');

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('dashboard/activity-log', {
      title: 'Dashboard Activity Log',
      description: 'Dashboard activity log',
      section: 'dashboard',
      layout,
    });
  } catch (error) {
    logger.error('Error loading dashboard activity log:', error);
    res.status(500).send('Error loading page');
  }
};
