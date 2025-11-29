import logger from '../../utils/logger.js';

export const getChat = async (req, res) => {
  try {
    logger.info('Chat page accessed');

    res.render('collaborate/chat', {
      title: 'Chat',
      description: 'Team messaging and discussions',
      layout: req.headers['hx-request'] ? false : 'main',
    });
  } catch (error) {
    logger.error('Error loading chat page:', error);
    res.render('collaborate/chat', {
      title: 'Chat',
      description: 'Team messaging and discussions',
      layout: req.headers['hx-request'] ? false : 'main',
    });
  }
};
