import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Dashboard Idea Page
export const getDashboardIdea = async (req, res) => {
  try {
    logger.info('Dashboard idea page accessed');

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('dashboard/idea', {
      title: 'Dashboard Idea',
      description: 'Dashboard idea',
      section: 'dashboard',
      layout,
    });
  } catch (error) {
    logger.error('Error loading dashboard idea:', error);
    res.status(500).send('Error loading page');
  }
};
