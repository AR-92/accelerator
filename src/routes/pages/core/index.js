const express = require('express');
const router = express.Router();

// Helper function for page data
const getPageData = (title, activeKey, padding = 'py-8') => ({
  title: `${title} - Accelerator Platform`,
  [`isActive${activeKey}`]: true,
  mainPadding: padding,
});

// GET upgrade page
router.get('/upgrade', (req, res) => {
  res.render('pages/core/upgrade-plan', {
    ...getPageData('Upgrade to Pro - Accelerator Platform', 'Upgrade'),
    layout: 'main',
  });
});

// GET terms and conditions
router.get('/terms', (req, res) => {
  res.render('pages/legal/terms', {
    title: 'Terms and Conditions - Accelerator Platform',
    layout: 'main',
  });
});

// GET new project page
router.get('/new-project', (req, res) => {
  res.render('pages/projects/create-project', {
    ...getPageData('New Project - Accelerator Platform', 'NewProject'),
    layout: 'main',
  });
});

module.exports = router;
