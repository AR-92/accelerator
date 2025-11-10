const express = require('express');
const router = express.Router();

// Helper function for page data
const getPageData = (title, activeKey, padding = 'py-8') => ({
  title: `${title} - Accelerator Platform`,
  [`isActive${activeKey}`]: true,
  mainPadding: padding,
});

// GET notifications
router.get('/notifications', (req, res) => {
  res.render('pages/communication/notifications', {
    ...getPageData('Notifications', 'Notifications'),
    layout: 'main',
  });
});

module.exports = router;
