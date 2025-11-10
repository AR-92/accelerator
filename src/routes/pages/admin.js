const express = require('express');
const router = express.Router();
const { requireAdminAuth } = require('../../middleware/auth/adminAuth');
const container = require('../../container');
const adminController = container.get('adminController');

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
  '/collaborations/:collaborationId',
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

module.exports = router;
