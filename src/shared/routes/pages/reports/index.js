const express = require('express');
const router = express.Router();

// Helper function for page data
const getPageData = (title, activeKey, padding = 'py-8') => ({
  title: `${title} - Accelerator Platform`,
  [`isActive${activeKey}`]: true,
  mainPadding: padding,
});

// GET valuation
router.get('/valuation', (req, res) => {
  res.render(
    'pages/reports/valuation',
    getPageData('Valuation - Coming Soon', 'Valuation')
  );
});

// GET pitch deck
router.get('/pitch-deck', (req, res) => {
  res.render(
    'pages/reports/pitch-deck',
    getPageData('Pitch Deck - Create & Manage', 'PitchDeck')
  );
});

// GET business plan
router.get('/business-plan', (req, res) => {
  res.render(
    'pages/reports/business-plan',
    getPageData('Business Plan - Strategic Planning', 'BusinessPlan')
  );
});

module.exports = router;
