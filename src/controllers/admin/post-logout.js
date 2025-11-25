import { createClient } from '@supabase/supabase-js';
import config from '../../config/index.js';
import logger from '../../utils/logger.js';

const supabase = createClient(config.supabase.url, config.supabase.key);

// Logout
export const postLogout = async (req, res) => {
  try {
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      logger.error('Supabase logout error:', error);
    } else {
      logger.info('User logged out successfully');
    }

    // Clear any server-side session if needed
    // For now, just redirect to login page
    res.redirect('/auth');
  } catch (error) {
    logger.error('Logout error:', error);
    // Still redirect to login even if there's an error
    res.redirect('/auth');
  }
};
