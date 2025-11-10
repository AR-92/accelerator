const express = require('express');
const router = express.Router();
const { requireAuth, optionalAuth } = require('../../../middleware/auth/auth');

// Helper function for page data
const getPageData = (title, activeKey, padding = 'py-8') => ({
  title: `${title} - Accelerator Platform`,
  [`isActive${activeKey}`]: true,
  mainPadding: padding,
});

// GET dashboard
router.get('/dashboard', requireAuth, (req, res) => {
  res.render('pages/dashboard/startup/overview', {
    ...getPageData('Dashboard - Overview', 'Dashboard'),
    layout: 'reports',
    activeOverview: true,
  });
});

// GET enterprise dashboard
router.get('/enterprise-dashboard', requireAuth, (req, res) => {
  res.render('pages/dashboard/enterprise/overview', {
    ...getPageData('Enterprise Dashboard - Overview', 'EnterpriseDashboard'),
    layout: 'enterprise',
    activeOverview: true,
  });
});

// GET enterprise dashboard startups
router.get('/enterprise-dashboard/startups', requireAuth, (req, res) => {
  res.render('pages/dashboard/enterprise/startups', {
    ...getPageData('Enterprise Dashboard - Startups', 'EnterpriseDashboard'),
    layout: 'enterprise',
    activeStartups: true,
  });
});

// GET enterprise dashboard projects
router.get('/enterprise-dashboard/projects', (req, res) => {
  res.render('pages/dashboard/enterprise/projects', {
    ...getPageData('Enterprise Dashboard - Projects', 'EnterpriseDashboard'),
    layout: 'enterprise',
    activeProjects: true,
  });
});

// GET enterprise dashboard analytics
router.get('/enterprise-dashboard/analytics', (req, res) => {
  res.render('pages/dashboard/enterprise/analytics', {
    ...getPageData('Enterprise Dashboard - Analytics', 'EnterpriseDashboard'),
    layout: 'enterprise',
    activeAnalytics: true,
  });
});

// GET enterprise dashboard users
router.get('/enterprise-dashboard/users', (req, res) => {
  res.render('pages/dashboard/enterprise/users', {
    ...getPageData('Enterprise Dashboard - Users', 'EnterpriseDashboard'),
    layout: 'enterprise',
    activeUsers: true,
  });
});

// GET enterprise dashboard activity log
router.get('/enterprise-dashboard/activity-log', (req, res) => {
  res.render('pages/dashboard/enterprise/activity-log', {
    ...getPageData(
      'Enterprise Dashboard - Activity Log',
      'EnterpriseDashboard'
    ),
    layout: 'enterprise',
    activeActivityLog: true,
  });
});

// GET corporate dashboard overview
router.get('/corporate-dashboard', (req, res) => {
  res.render('pages/dashboard/corporate/overview', {
    ...getPageData('Corporate Dashboard - Overview', 'CorporateDashboard'),
    layout: 'corporate',
    activeOverview: true,
  });
});

// GET corporate dashboard enterprises
router.get('/corporate-dashboard/enterprises', (req, res) => {
  res.render('pages/dashboard/corporate/enterprises', {
    ...getPageData('Corporate Dashboard - Enterprises', 'CorporateDashboard'),
    layout: 'corporate',
    activeEnterprises: true,
  });
});

// GET corporate dashboard projects
router.get('/corporate-dashboard/projects', (req, res) => {
  res.render('pages/dashboard/corporate/projects', {
    ...getPageData('Corporate Dashboard - Projects', 'CorporateDashboard'),
    layout: 'corporate',
    activeProjects: true,
  });
});

// GET corporate dashboard analytics
router.get('/corporate-dashboard/analytics', (req, res) => {
  res.render('pages/dashboard/corporate/analytics', {
    ...getPageData('Corporate Dashboard - Analytics', 'CorporateDashboard'),
    layout: 'corporate',
    activeAnalytics: true,
  });
});

// GET corporate dashboard users
router.get('/corporate-dashboard/users', (req, res) => {
  res.render('pages/dashboard/corporate/users', {
    ...getPageData('Corporate Dashboard - Users', 'CorporateDashboard'),
    layout: 'corporate',
    activeUsers: true,
  });
});

// GET corporate dashboard activity log
router.get('/corporate-dashboard/activity-log', (req, res) => {
  res.render('pages/dashboard/corporate/activity-log', {
    ...getPageData('Corporate Dashboard - Activity Log', 'CorporateDashboard'),
    layout: 'corporate',
    activeActivityLog: true,
  });
});

// GET dashboard tabs
router.get('/dashboard/tab/business', requireAuth, (req, res) => {
  res.render('pages/dashboard/startup/business', {
    ...getPageData('Dashboard - Business', 'Dashboard'),
    layout: 'reports',
    activeBusiness: true,
  });
});

router.get('/dashboard/tab/financial', requireAuth, (req, res) => {
  res.render('pages/dashboard/startup/financial', {
    ...getPageData('Dashboard - Financial', 'Dashboard'),
    layout: 'reports',
    activeFinancial: true,
  });
});

router.get('/dashboard/tab/marketing', requireAuth, (req, res) => {
  res.render('pages/dashboard/startup/marketing', {
    ...getPageData('Dashboard - Marketing', 'Dashboard'),
    layout: 'reports',
    activeMarketing: true,
  });
});

router.get('/dashboard/tab/fund', requireAuth, (req, res) => {
  res.render('pages/dashboard/startup/fund', {
    ...getPageData('Dashboard - Funding', 'Dashboard'),
    layout: 'reports',
    activeFund: true,
  });
});

router.get('/dashboard/tab/team', requireAuth, (req, res) => {
  res.render('pages/dashboard/startup/team', {
    ...getPageData('Dashboard - Team', 'Dashboard'),
    layout: 'reports',
    activeTeam: true,
  });
});

router.get('/dashboard/tab/promote', requireAuth, (req, res) => {
  res.render('pages/dashboard/startup/promote', {
    ...getPageData('Dashboard - Promotion', 'Dashboard'),
    layout: 'reports',
    activePromote: true,
  });
});

router.get('/dashboard/tab/activity-log', requireAuth, (req, res) => {
  res.render('pages/dashboard/startup/activity-log', {
    ...getPageData('Dashboard - Activity Log', 'Dashboard'),
    layout: 'reports',
    activeActivityLog: true,
  });
});

router.get('/dashboard/tab/idea', requireAuth, (req, res) => {
  res.render('pages/dashboard/startup/idea', {
    ...getPageData('Dashboard - Ideas', 'Dashboard'),
    layout: 'reports',
    activeIdea: true,
  });
});

module.exports = router;
