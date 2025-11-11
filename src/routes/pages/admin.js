const express = require('express');
const router = express.Router();
const container = require('../../container');
const adminController = container.get('adminController');
const adminAuthController = container.get('adminAuthController');

// Import admin auth middleware and wrap it for async compatibility
const { requireAdminAuth: originalRequireAdminAuth } = require('../../middleware/auth/adminAuth');

const requireAdminAuth = (req, res, next) => {
  originalRequireAdminAuth(req, res, next).catch(next);
};

// Helper function for page data
const getPageData = (title, activeKey, padding = 'py-8', user = null) => ({
  title: `${title} - Admin Panel`,
  [`active${activeKey}`]: true,
  mainPadding: padding,
  user,
});

// GET admin login
router.get('/login', (req, res) => {
  res.render('pages/admin/login', {
    title: 'Admin Login - Accelerator Platform',
    layout: 'admin-login',
  });
});

// POST admin login
router.post('/login', (req, res) => {
  adminAuthController.login(req, res).catch(err => {
    console.error('Admin login error:', err);
    res.status(500).render('pages/admin/login', {
      title: 'Admin Login - Accelerator Platform',
      layout: 'admin-login',
      error: 'An error occurred during login',
    });
  });
});

// GET admin dashboard
router.get(
  '/dashboard',
  requireAdminAuth,
  adminController.showDashboard.bind(adminController)
);

// GET admin users
router.get(
  '/users',
  requireAdminAuth,
  adminController.showUsers.bind(adminController)
);

// GET admin user details
router.get(
  '/users/:userId',
  requireAdminAuth,
  adminController.showUserDetails.bind(adminController)
);

// GET admin startups
router.get(
  '/startups',
  requireAdminAuth,
  adminController.showStartups.bind(adminController)
);

// GET admin startup details
router.get(
  '/startups/:startupId',
  requireAdminAuth,
  adminController.showStartupDetails.bind(adminController)
);

// GET admin enterprises
router.get(
  '/enterprises',
  requireAdminAuth,
  adminController.showEnterprises.bind(adminController)
);

// GET admin enterprise details
router.get(
  '/enterprises/:enterpriseId',
  requireAdminAuth,
  adminController.showEnterpriseDetails.bind(adminController)
);

// GET admin corporates
router.get(
  '/corporates',
  requireAdminAuth,
  adminController.showCorporates.bind(adminController)
);

// GET admin corporate details
router.get(
  '/corporates/:corporateId',
  requireAdminAuth,
  adminController.showCorporateDetails.bind(adminController)
);

// GET admin organizations
router.get(
  '/organizations',
  requireAdminAuth,
  adminController.showOrganizations.bind(adminController)
);

// GET admin organization details
router.get(
  '/organizations/:organizationId',
  requireAdminAuth,
  adminController.showOrganizationDetails.bind(adminController)
);

// GET admin ideas
router.get(
  '/ideas',
  requireAdminAuth,
  adminController.showIdeas.bind(adminController)
);

// GET admin idea details
router.get(
  '/ideas/:ideaId',
  requireAdminAuth,
  adminController.showIdeaDetails.bind(adminController)
);

// GET admin votes
router.get(
  '/votes',
  requireAdminAuth,
  adminController.showVotes.bind(adminController)
);

// GET admin collaborations
router.get(
  '/collaborations',
  requireAdminAuth,
  adminController.showCollaborations.bind(adminController)
);

// GET admin collaboration details
router.get(
  '/collaborations/:projectId',
  requireAdminAuth,
  adminController.showCollaborationDetails.bind(adminController)
);

// GET admin packages
router.get(
  '/packages',
  requireAdminAuth,
  adminController.showPackages.bind(adminController)
);

// GET admin billing
router.get(
  '/billing',
  requireAdminAuth,
  adminController.showBilling.bind(adminController)
);

// GET admin rewards
router.get(
  '/rewards',
  requireAdminAuth,
  adminController.showRewards.bind(adminController)
);

// GET admin transactions
router.get(
  '/transactions',
  requireAdminAuth,
  adminController.showTransactions.bind(adminController)
);

// GET admin payment methods
router.get(
  '/payment-methods',
  requireAdminAuth,
  adminController.showPaymentMethods.bind(adminController)
);

// GET admin AI models
router.get(
  '/ai-models',
  requireAdminAuth,
  adminController.showAIModels.bind(adminController)
);

// GET admin AI workflows
router.get(
  '/ai-workflows',
  requireAdminAuth,
  adminController.showAIWorkflows.bind(adminController)
);

// GET admin AI workflow details
router.get(
  '/ai-workflows/:workflowId',
  requireAdminAuth,
  adminController.showAIWorkflowDetails.bind(adminController)
);

// GET admin credits
router.get(
  '/credits',
  requireAdminAuth,
  adminController.showCredits.bind(adminController)
);

// GET admin landing page
router.get(
  '/landing-page',
  requireAdminAuth,
  adminController.showLandingPage.bind(adminController)
);

// GET admin landing page section
router.get('/landing-page/:sectionId', requireAdminAuth, (req, res) => {
  res.render('pages/admin/landing-page-section', {
    ...getPageData('Landing Page Section', 'LandingPage', 'py-8', req.user),
    layout: 'admin',
    sectionId: req.params.sectionId,
  });
});

// GET admin content
router.get(
  '/content',
  requireAdminAuth,
  adminController.showContent.bind(adminController)
);

// GET admin learning content
router.get(
  '/learning-content',
  requireAdminAuth,
  adminController.showLearningContent.bind(adminController)
);

// GET admin help content
router.get(
  '/help-content',
  requireAdminAuth,
  adminController.showHelpContent.bind(adminController)
);

// GET admin settings
router.get(
  '/settings',
  requireAdminAuth,
  adminController.showSettings.bind(adminController)
);

// GET admin system health
router.get(
  '/system-health',
  requireAdminAuth,
  adminController.showSystemHealth.bind(adminController)
);

// POST admin logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Admin logout error:', err);
      return res.status(500).render('pages/error/page-not-found', {
        title: 'Error - Admin Panel',
        layout: 'main',
        message: 'An error occurred during logout',
      });
    }

    res.clearCookie('connect.sid');
    res.redirect('/admin/login');
  });
});

module.exports = router;
