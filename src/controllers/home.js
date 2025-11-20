import databaseService from '../services/supabase.js';
import logger from '../utils/logger.js';

export const getHome = async (req, res) => {
  try {
    const isConnected = await databaseService.testConnection();
    logger.info('Home page accessed');

    res.render('home', {
      title: 'Todo App',
      message: '',
      supabaseConnected: isConnected
    });
  } catch (error) {
    logger.error('Error testing database connection:', error);
    res.render('home', {
      title: 'Todo App',
      message: '',
      supabaseConnected: false,
      error: error.message
    });
  }
};

export default function homeRoutes(app) {
  app.get('/', getHome);
  app.get('/home', getHome);
}