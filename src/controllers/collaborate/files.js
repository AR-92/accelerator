import logger from '../../utils/logger.js';

export const getFiles = async (req, res) => {
  try {
    logger.info('Files page accessed');

    res.render('collaborate/files', {
      title: 'Files',
      description: 'Shared documents and resources',
      layout: req.headers['hx-request'] ? false : 'main',
    });
  } catch (error) {
    logger.error('Error loading files page:', error);
    res.render('collaborate/files', {
      title: 'Files',
      description: 'Shared documents and resources',
      layout: req.headers['hx-request'] ? false : 'main',
    });
  }
};
