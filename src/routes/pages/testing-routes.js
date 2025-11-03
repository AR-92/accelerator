const express = require('express');
const router = express.Router();

// Helper function for page data that uses testing layout
const getTestingPageData = (title, activeKey, padding = 'py-8') => ({
  title: `${title} - Accelerator Platform`,
  [`isActive${activeKey}`]: true,
  mainPadding: padding,
});

// Routes for settings pages using testing layout (with /pages/ prefix to match navbar links)
router.get('/settings/profile', (req, res) => {
  res.render('pages/account/settings/profile', {
    ...getTestingPageData('Account Settings - Profile', 'Settings'),
    layout: 'main',
    activeTab: 'profile',
    pageTitle: 'Account Settings',
    pageDescription: 'Manage account and website settings.',
  });
});

router.get('/settings/password', (req, res) => {
  res.render('pages/account/settings/password', {
    ...getTestingPageData('Account Settings - Password', 'Settings'),
    layout: 'main',
    activeTab: 'password',
    pageTitle: 'Account Settings',
    pageDescription: 'Manage account and website settings.',
  });
});

router.get('/settings/subscription', (req, res) => {
  res.render('pages/account/subscriptions/index', {
    ...getTestingPageData('Account Settings - Subscription', 'Settings'),
    layout: 'main',
    activeTab: 'subscription',
    pageTitle: 'Account Settings',
    pageDescription: 'Manage account and website settings.',
  });
});

router.get('/settings/payment', (req, res) => {
  res.render('pages/account/payment/methods', {
    ...getTestingPageData('Account Settings - Payment', 'Settings'),
    layout: 'main',
    activeTab: 'payment',
    pageTitle: 'Account Settings',
    pageDescription: 'Manage account and website settings.',
  });
});

router.get('/settings/votes', (req, res) => {
  res.render('pages/account/settings/votes', {
    ...getTestingPageData('Account Settings - Votes', 'Settings'),
    layout: 'main',
    activeTab: 'votes',
    pageTitle: 'Account Settings',
    pageDescription: 'Manage account and website settings.',
  });
});

router.get('/settings/billing', (req, res) => {
  res.render('pages/account/billing/history', {
    ...getTestingPageData('Account Settings - Billing', 'Settings'),
    layout: 'main',
    activeTab: 'billing',
    pageTitle: 'Account Settings',
    pageDescription: 'Manage account and website settings.',
  });
});

router.get('/settings/rewards', (req, res) => {
  res.render('pages/account/settings/rewards', {
    ...getTestingPageData('Account Settings - Rewards', 'Settings'),
    layout: 'main',
    activeTab: 'rewards',
    pageTitle: 'Account Settings',
    pageDescription: 'Manage account and website settings.',
  });
});

// Routes for subscription pages using testing layout (with /pages/ prefix to match navbar links)
router.get('/subscriptions', (req, res) => {
  res.render('pages/account/subscriptions/index', {
    ...getTestingPageData('Subscriptions', 'Subscriptions'),
    layout: 'main',
    pageTitle: 'Subscriptions',
    pageDescription: 'Manage your subscription plans.',
  });
});

router.get('/subscriptions/billing', (req, res) => {
  res.render('pages/account/billing/history', {
    ...getTestingPageData('Billing History', 'Subscriptions'),
    layout: 'main',
    pageTitle: 'Billing History',
    pageDescription: 'View your billing history.',
  });
});

router.get('/subscriptions/payment', (req, res) => {
  res.render('pages/account/payment/methods', {
    ...getTestingPageData('Payment Methods', 'Subscriptions'),
    layout: 'main',
    pageTitle: 'Payment Methods',
    pageDescription: 'Manage your payment methods.',
  });
});

// Route for upgrade page using testing layout (with /pages/ prefix to match navbar links)
router.get('/upgrade', (req, res) => {
  res.render('pages/core/upgrade-plan', {
    ...getTestingPageData('Upgrade to Pro', 'Upgrade'),
    layout: 'main',
  });
});

// Route for notifications page using testing layout (with /pages/ prefix to match navbar links)
router.get('/notifications', (req, res) => {
  res.render('pages/communication/notifications', {
    ...getTestingPageData('Notifications', 'Notifications'),
    layout: 'main',
  });
});

module.exports = router;