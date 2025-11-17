const express = require('express');
const path = require('path');
const router = express.Router();
const { requireAuth } = require('../../../middleware/auth/auth');
const SettingsController = require('../../../modules/admin/controllers/SettingsController');
const container = require('../../../container');

// Initialize dependencies
const authService = container.get('authService');
const settingsController = new SettingsController(authService);

// Helper function for page data
const getPageData = (title, activeKey, padding = 'py-8') => ({
  title: `${title} - Accelerator Platform`,
  [`isActive${activeKey}`]: true,
  mainPadding: padding,
});

// GET settings overview
router.get('/settings', (req, res) => {
  res.render('pages/account/settings/settings-center', {
    ...getPageData('Settings - Accelerator Platform', 'Settings'),
    layout: 'settings',
    activeOverview: true,
  });
});

// GET settings accounts
router.get('/settings/accounts', (req, res) => {
  res.render('pages/account/settings/settings-accounts', {
    ...getPageData('Account Settings', 'Settings'),
    layout: 'settings-accounts',
    activeAccounts: true,
  });
});

// GET settings billing
router.get('/settings/billing', (req, res) => {
  res.render('pages/account/settings/settings-billing', {
    ...getPageData('Billing & Payments', 'Settings'),
    layout: 'settings-billing',
    activeBilling: true,
  });
});

// GET settings other
router.get('/settings/other', (req, res) => {
  res.render('pages/account/settings/settings-other', {
    ...getPageData('Other Settings', 'Settings'),
    layout: 'settings-other',
    activeOther: true,
  });
});

// GET settings profile
router.get('/settings/profile', requireAuth, async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.id);
    res.render('pages/account/settings/profile', {
      ...getPageData('Profile Settings', 'Settings'),
      layout: 'settings-accounts',
      activeProfile: true,
      user: user,
    });
  } catch (error) {
    console.error('Error loading profile:', error);
    res.redirect('/auth');
  }
});

// GET settings password
router.get('/settings/password', (req, res) => {
  res.render('pages/account/settings/password', {
    ...getPageData('Password Settings', 'Settings'),
    layout: 'settings-accounts',
    activePassword: true,
  });
});

// GET settings subscription
router.get('/settings/subscription', (req, res) => {
  res.render('pages/account/subscriptions/index', {
    ...getPageData('Subscription Settings', 'Settings'),
    layout: 'settings-billing',
    activeSubscription: true,
  });
});

// GET settings payment & billing
router.get('/settings/payment-billing', (req, res) => {
  res.render('pages/account/settings/payment-billing', {
    ...getPageData('Payment & Billing', 'Settings'),
    layout: 'settings-billing',
    activePaymentBilling: true,
  });
});

// GET settings votes
router.get('/settings/votes', (req, res) => {
  res.render('pages/account/settings/votes', {
    ...getPageData('Vote Management', 'Settings'),
    layout: 'settings-other',
    activeVotes: true,
  });
});

// GET settings rewards
router.get('/settings/rewards', (req, res) => {
  res.render('pages/account/settings/rewards', {
    ...getPageData('Voting Rewards', 'Settings'),
    layout: 'settings-other',
    activeRewards: true,
  });
});

// GET settings credits
router.get('/settings/credits', (req, res) => {
  res.render('pages/account/settings/credits', {
    ...getPageData('Credits Management', 'Settings'),
    layout: 'settings-billing',
    activeCredits: true,
  });
});

// POST settings preferences
router.post('/settings/preferences', (req, res) => {
  res.send('<div class="text-green-500">Preferences saved successfully!</div>');
});

// POST profile settings
router.post(
  '/settings/profile',
  requireAuth,
  settingsController.updateProfile.bind(settingsController)
);

// POST security settings
router.post(
  '/settings/security',
  requireAuth,
  settingsController.changePassword.bind(settingsController)
);

// POST preference settings
router.post('/settings/preferences', (req, res) => {
  res.send('<div class="text-green-500">Preferences saved successfully!</div>');
});

// API routes for settings
router.post(
  '/api/settings/theme',
  requireAuth,
  settingsController.updateTheme.bind(settingsController)
);
router.get(
  '/api/settings',
  requireAuth,
  settingsController.getSettings.bind(settingsController)
);

module.exports = router;
