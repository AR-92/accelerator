import { ServerDataService } from '../../services/serverDataService.js';
import { databaseService } from '../../services/index.js';
import logger from '../../utils/logger.js';

// HTMX API endpoints for dynamic content updates

export const getCreditBalance = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send('Not authenticated');
    }
    const balance = await ServerDataService.getCreditBalance(req.user.id);
    res.render('components/billing/credit-balance', {
      layout: false,
      balance,
    });
  } catch (error) {
    logger.error('HTMX credit balance error:', error);
    res.status(500).send('Error loading credit balance');
  }
};

export const getBillingInfo = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send('Not authenticated');
    }
    const billing = await ServerDataService.getBillingInfo(req.user.id);
    res.render('components/billing/billing-info', {
      layout: false,
      plan: billing?.plan,
    });
  } catch (error) {
    logger.error('HTMX billing info error:', error);
    res.status(500).send('Error loading billing info');
  }
};

export const getRecentProjects = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send('Not authenticated');
    }
    const projects = await ServerDataService.getRecentProjects(req.user.id);
    res.render('components/project/project-list', {
      layout: false,
      projects,
    });
  } catch (error) {
    logger.error('HTMX recent projects error:', error);
    res.status(500).send('Error loading recent projects');
  }
};

export const getRecentIdeas = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send('Not authenticated');
    }
    const ideas = await ServerDataService.getRecentIdeas(req.user.id);
    res.render('components/project/idea-list', {
      layout: false,
      ideas,
    });
  } catch (error) {
    logger.error('HTMX recent ideas error:', error);
    res.status(500).send('Error loading recent ideas');
  }
};

export const getDashboardMetrics = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const userRole = req.user?.role || 'startup';
    const metrics = await ServerDataService.getDashboardMetrics(userRole);
    res.json(metrics);
  } catch (error) {
    logger.error('HTMX dashboard metrics error:', error);
    res.status(500).json({ error: 'Error loading dashboard metrics' });
  }
};

// Update user theme
export const updateTheme = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send('Not authenticated');
    }

    const { theme } = req.body;
    if (!theme || !['light', 'dark'].includes(theme)) {
      return res.status(400).send('Invalid theme');
    }

    logger.info(`Updating theme for user ${req.user.id} to ${theme}`);

    await databaseService.upsertUserSetting(
      req.user.id,
      'appearance',
      'theme',
      theme,
      'string'
    );

    logger.info(`Theme updated successfully for user ${req.user.id}`);

    // Return updated theme icon HTML
    res.render('components/base/theme-icon', {
      layout: false,
      theme,
    });
  } catch (error) {
    logger.error('HTMX update theme error:', error);
    res.status(500).send('Error updating theme');
  }
};

// Clear cache endpoint for development/testing
export const clearCache = async (req, res) => {
  try {
    ServerDataService.clearUserCache(req.user.id);
    // Also clear HTMX cache
    const { clearUserHtmxCache } = await import('../../middleware/cache.js');
    clearUserHtmxCache(req.user.id);
    res.json({ success: true, message: 'Cache cleared' });
  } catch (error) {
    logger.error('HTMX clear cache error:', error);
    res.status(500).json({ error: 'Failed to clear cache' });
  }
};
