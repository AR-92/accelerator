/**
 * Pages Module
 * Handles page routes for the application
 */

const express = require('express');

const createPagesModule = (container) => {
  const router = express.Router();

  // Import sub-routes
  const dashboardRoutes = require('../../shared/routes/pages/dashboard');
  const collaborateRoutes = require('../../shared/routes/pages/collaborate');
  const settingsRoutes = require('../../shared/routes/pages/settings')(
    container
  );
  const portfolioRoutes = require('../../shared/routes/pages/portfolio');
  const accountRoutes = require('../../shared/routes/pages/account');
  const contentRoutes = require('../../shared/routes/pages/content');
  const coreRoutes = require('../../shared/routes/pages/core');
  const reportsRoutes = require('../../shared/routes/pages/reports');
  const communicationRoutes = require('../../shared/routes/pages/communication');
  const aiAssistantModelsRoutes = require('../../shared/routes/pages/ai-assistant-models');

  // Mount sub-routes
  router.use('/', dashboardRoutes);
  router.use('/', collaborateRoutes);
  router.use('/', settingsRoutes);
  router.use('/', portfolioRoutes);
  router.use('/', accountRoutes);
  router.use('/', contentRoutes);
  router.use('/', coreRoutes);
  router.use('/', reportsRoutes);
  router.use('/', communicationRoutes);
  router.use('/', aiAssistantModelsRoutes);

  return router;
};

module.exports = createPagesModule;
