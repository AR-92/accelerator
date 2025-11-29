import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Dashboard Marketing Page
export const getDashboardMarketing = async (req, res) => {
  try {
    logger.info('Dashboard marketing page accessed');

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('dashboard/marketing', {
      title: 'Dashboard Marketing',
      description: 'Dashboard marketing',
      section: 'dashboard',
      layout,
    });
  } catch (error) {
    logger.error('Error loading dashboard marketing:', error);
    res.status(500).send('Error loading page');
  }
};
