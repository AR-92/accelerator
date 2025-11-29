import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Dashboard Promote Page
export const getDashboardPromote = async (req, res) => {
  try {
    logger.info('Dashboard promote page accessed');

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('dashboard/promote', {
      title: 'Dashboard Promote',
      description: 'Dashboard promote',
      section: 'dashboard',
      layout,
    });
  } catch (error) {
    logger.error('Error loading dashboard promote:', error);
    res.status(500).send('Error loading page');
  }
};
