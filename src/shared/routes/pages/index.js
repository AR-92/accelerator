const express = require('express');
const router = express.Router();

const dashboardRoutes = require('./dashboard');
const collaborateRoutes = require('./collaborate');
// const settingsRoutes = require('./settings');
const portfolioRoutes = require('./portfolio');
const accountRoutes = require('./account');
const contentRoutes = require('./content');
const coreRoutes = require('./core');
const reportsRoutes = require('./reports');
const communicationRoutes = require('./communication');
const aiAssistantModelsRoutes = require('./ai-assistant-models');

router.use('/', dashboardRoutes);
router.use('/', collaborateRoutes);
// router.use('/', settingsRoutes);
router.use('/', portfolioRoutes);
router.use('/', accountRoutes);
router.use('/', contentRoutes);
router.use('/', coreRoutes);
router.use('/', reportsRoutes);
router.use('/', communicationRoutes);
router.use('/', aiAssistantModelsRoutes);

module.exports = router;
