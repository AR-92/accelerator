const express = require('express');
const router = express.Router();

// Helper function for page data
const getAiAssistantModelPageData = (title, activeKey, padding = 'py-8') => ({
  title: `${title} - Accelerator Platform`,
  [`isActive${activeKey}`]: true,
  mainPadding: padding,
});

// GET idea model
router.get('/ai-assistant-models/idea-model', (req, res) => {
  res.render('pages/ai-assistant-models/idea-model', {
    ...getAiAssistantModelPageData('Idea Model Assistant', 'IdeaModel'),
    layout: 'main',
  });
});

// GET business model
router.get('/ai-assistant-models/business-model', (req, res) => {
  res.render('pages/ai-assistant-models/business-model', {
    ...getAiAssistantModelPageData('Business Model Assistant', 'BusinessModel'),
    layout: 'main',
  });
});

// GET financial model
router.get('/ai-assistant-models/financial-model', (req, res) => {
  res.render('pages/ai-assistant-models/financial-model', {
    ...getAiAssistantModelPageData(
      'Financial Model Assistant',
      'FinancialModel'
    ),
    layout: 'main',
  });
});

// GET fund model
router.get('/ai-assistant-models/fund-model', (req, res) => {
  res.render('pages/ai-assistant-models/fund-model', {
    ...getAiAssistantModelPageData('Funding Model Assistant', 'FundModel'),
    layout: 'main',
  });
});

// GET marketing model
router.get('/ai-assistant-models/marketing-model', (req, res) => {
  res.render('pages/ai-assistant-models/marketing-model', {
    ...getAiAssistantModelPageData(
      'Marketing Model Assistant',
      'MarketingModel'
    ),
    layout: 'main',
  });
});

// GET team model
router.get('/ai-assistant-models/team-model', (req, res) => {
  res.render('pages/ai-assistant-models/team-model', {
    ...getAiAssistantModelPageData('Team Model Assistant', 'TeamModel'),
    layout: 'main',
  });
});

// GET legal model
router.get('/ai-assistant-models/legal-model', (req, res) => {
  res.render('pages/ai-assistant-models/legal-model', {
    ...getAiAssistantModelPageData('Legal Model Assistant', 'LegalModel'),
    layout: 'main',
  });
});

module.exports = router;
