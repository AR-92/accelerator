const express = require('express');
const router = express.Router();

// Helper function for page data
const getPageData = (title, activeKey, padding = 'py-8') => ({
  title: `${title} - Accelerator Platform`,
  [`isActive${activeKey}`]: true,
  mainPadding: padding,
});

// GET reports
router.get('/reports', (req, res) => {
  res.render(
    'pages/account/reports',
    getPageData('Analytics & Reports', 'Reports')
  );
});

// GET subscriptions billing
router.get('/subscriptions/billing', (req, res) => {
  res.render('pages/account/billing/history', {
    ...getPageData('Billing History', 'Subscriptions'),
    layout: 'main',
  });
});

// GET subscriptions payment
router.get('/subscriptions/payment', (req, res) => {
  res.render('pages/account/payment/methods', {
    ...getPageData('Payment Methods', 'Subscriptions'),
    layout: 'main',
  });
});

// GET subscriptions
router.get('/subscriptions', (req, res) => {
  res.render('pages/account/subscriptions/index', {
    ...getPageData('Subscriptions', 'Subscriptions'),
    layout: 'settings-billing',
  });
});

// GET subscriptions payment
router.get('/subscriptions/payment', (req, res) => {
  res.render('pages/account/payment/methods', {
    ...getPageData('Payment Methods', 'Subscriptions'),
    layout: 'main',
  });
});

// GET buy credits page
router.get('/buy-credits', (req, res) => {
  res.render('pages/account/buy-credits', {
    ...getPageData('Buy Credits - Accelerator Platform', 'BuyCredits'),
    layout: 'main',
  });
});

// GET buy credits page with /pages prefix
router.get('/buy-credits', (req, res) => {
  res.render('pages/account/buy-credits', {
    ...getPageData('Buy Credits - Accelerator Platform', 'BuyCredits'),
    layout: 'main',
  });
});

module.exports = router;
