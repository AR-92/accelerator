import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Enterprise Dashboard Activity Log Page
export const getEnterpriseActivityLog = async (req, res) => {
  try {
    logger.info('Enterprise Dashboard activity log page accessed');

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('enterprise-dashboard/activity-log', {
      title: 'Enterprise Dashboard Activity Log',
      description: 'Enterprise Dashboard activity log',
      section: 'enterprise-dashboard',
      currentSection: 'enterprise-dashboard',
      currentPage: 'Activity Log',
      layout,
    });
  } catch (error) {
    logger.error('Error loading enterprise dashboard activity log:', error);
    res.status(500).send('Error loading page');
  }
};
