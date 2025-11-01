const express = require('express');
const router = express.Router();

// Helper function for page data
const getPageData = (title, activeKey, padding = 'py-8') => ({
  title: `${title} - Accelerator Platform`,
  [`isActive${activeKey}`]: true,
  mainPadding: padding,
});

// GET test page
router.get('/test', (req, res) => {
  res.render('pages/test', {
    ...getPageData('Test UI Page', 'Test'),
    layout: 'testing',
  });
});

module.exports = router;
