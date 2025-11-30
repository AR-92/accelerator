import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Corporate Dashboard Activity Log Page
export const getCorporateActivityLog = async (req, res) => {
  try {
    logger.info('Corporate Dashboard activity log page accessed');

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('corporate-dashboard/activity-log', {
      title: 'Corporate Dashboard Activity Log',
      description: 'Corporate Dashboard activity log',
      section: 'corporate-dashboard',
      currentSection: 'corporate-dashboard',
      currentPage: 'Activity Log',
      layout,
    });
  } catch (error) {
    logger.error('Error loading corporate dashboard activity log:', error);
    res.status(500).send('Error loading page');
  }
};
