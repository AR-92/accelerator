const express = require('express');
const router = express.Router();
const { requireAdminAuth } = require('../../../../middleware/adminAuth');
const rateLimit = require('express-rate-limit');

// Rate limiter for system stats API (120 requests per minute)
const systemStatsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120, // 120 requests per minute (2 per second)
  message: {
    success: false,
    error:
      'Too many requests for system stats. Please wait before trying again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Import controllers and services
const container = require('../../../../container');
const adminController = container.get('adminController');
const adminAuthController = container.get('adminAuthController');

// Admin authentication routes
router.get('/login', adminAuthController.showLogin.bind(adminAuthController));
router.post('/login', adminAuthController.login.bind(adminAuthController));
router.post(
  '/logout',
  requireAdminAuth,
  adminAuthController.logout.bind(adminAuthController)
);

// Protected admin routes
router.get(
  '/dashboard',
  requireAdminAuth,
  adminController.showDashboard.bind(adminController)
);
router.get(
  '/users',
  requireAdminAuth,
  adminController.showUsers.bind(adminController)
);
router.get(
  '/users/:id',
  requireAdminAuth,
  adminController.showUserDetails.bind(adminController)
);
router.get(
  '/content',
  requireAdminAuth,
  adminController.showContent.bind(adminController)
);
router.get(
  '/content/help',
  requireAdminAuth,
  adminController.showHelpContent.bind(adminController)
);
router.get(
  '/content/learn',
  requireAdminAuth,
  adminController.showLearningContent.bind(adminController)
);
router.get(
  '/settings',
  requireAdminAuth,
  adminController.showSettings.bind(adminController)
);
router.get(
  '/system-health',
  requireAdminAuth,
  adminController.showSystemHealth.bind(adminController)
);
router.get(
  '/api/system-stats',
  requireAdminAuth,
  adminController.getSystemStatsAPI.bind(adminController)
);
router.get(
  '/startups',
  requireAdminAuth,
  adminController.showStartups.bind(adminController)
);
router.get(
  '/startups/:startupId',
  requireAdminAuth,
  adminController.showStartupDetails.bind(adminController)
);

// API routes for admin operations
router.post(
  '/api/users',
  requireAdminAuth,
  adminController.createUser.bind(adminController)
);
router.get(
  '/api/users/:userId',
  requireAdminAuth,
  adminController.getUser.bind(adminController)
);
router.put(
  '/api/users/:userId/credits',
  requireAdminAuth,
  adminController.updateUserCredits.bind(adminController)
);
router.put(
  '/api/users/:userId/role',
  requireAdminAuth,
  adminController.updateUserRole.bind(adminController)
);
router.put(
  '/api/users/:userId/status',
  requireAdminAuth,
  adminController.updateUserStatus.bind(adminController)
);
router.put(
  '/api/users/:userId/banned',
  requireAdminAuth,
  adminController.updateUserBanned.bind(adminController)
);
router.post(
  '/api/users/:userId/reset-password',
  requireAdminAuth,
  adminController.resetUserPassword.bind(adminController)
);
router.get(
  '/api/users/export/csv',
  requireAdminAuth,
  adminController.exportUsersToCSV.bind(adminController)
);
router.delete(
  '/api/users/:userId',
  requireAdminAuth,
  adminController.deleteUser.bind(adminController)
);
router.post(
  '/api/users/bulk-update-credits',
  requireAdminAuth,
  adminController.bulkUpdateCredits.bind(adminController)
);
router.post(
  '/api/users/bulk-update-roles',
  requireAdminAuth,
  adminController.bulkUpdateRoles.bind(adminController)
);

// Startup API routes
router.post(
  '/api/startups',
  requireAdminAuth,
  adminController.createStartup.bind(adminController)
);
router.get(
  '/api/startups/:startupId',
  requireAdminAuth,
  adminController.getStartup.bind(adminController)
);
router.put(
  '/api/startups/:startupId',
  requireAdminAuth,
  adminController.updateStartup.bind(adminController)
);
router.delete(
  '/api/startups/:startupId',
  requireAdminAuth,
  adminController.deleteStartup.bind(adminController)
);

// Enterprise management routes
router.get(
  '/enterprises',
  requireAdminAuth,
  adminController.showEnterprises.bind(adminController)
);
router.get(
  '/enterprises/:enterpriseId',
  requireAdminAuth,
  adminController.showEnterpriseDetails.bind(adminController)
);

// Collaboration management routes
router.get(
  '/collaborations',
  requireAdminAuth,
  adminController.showCollaborations.bind(adminController)
);
router.get(
  '/collaborations/:projectId',
  requireAdminAuth,
  adminController.showCollaborationDetails.bind(adminController)
);

// Enterprise API routes
router.post(
  '/api/enterprises',
  requireAdminAuth,
  adminController.createEnterprise.bind(adminController)
);
router.get(
  '/api/enterprises/:enterpriseId',
  requireAdminAuth,
  adminController.getEnterprise.bind(adminController)
);
router.put(
  '/api/enterprises/:enterpriseId',
  requireAdminAuth,
  adminController.updateEnterprise.bind(adminController)
);
router.delete(
  '/api/enterprises/:enterpriseId',
  requireAdminAuth,
  adminController.deleteEnterprise.bind(adminController)
);
router.post(
  '/api/enterprises/bulk/status',
  requireAdminAuth,
  adminController.bulkUpdateEnterpriseStatus.bind(adminController)
);
router.post(
  '/api/enterprises/bulk/delete',
  requireAdminAuth,
  adminController.bulkDeleteEnterprises.bind(adminController)
);
router.get(
  '/api/enterprises/export/csv',
  requireAdminAuth,
  adminController.exportEnterprisesToCSV.bind(adminController)
);

// Collaboration API routes
router.get(
  '/api/collaborations/:projectId',
  requireAdminAuth,
  adminController.getProject.bind(adminController)
);
router.put(
  '/api/collaborations/:projectId/status',
  requireAdminAuth,
  adminController.updateProjectStatus.bind(adminController)
);
router.delete(
  '/api/collaborations/:projectId/users/:userId',
  requireAdminAuth,
  adminController.removeUserFromProject.bind(adminController)
);
router.delete(
  '/api/collaborations/:projectId',
  requireAdminAuth,
  adminController.deleteProject.bind(adminController)
);

// Corporate management routes
router.get(
  '/corporates',
  requireAdminAuth,
  adminController.showCorporates.bind(adminController)
);
router.get(
  '/corporates/:corporateId',
  requireAdminAuth,
  adminController.showCorporateDetails.bind(adminController)
);

// Corporate API routes
router.post(
  '/api/corporates',
  requireAdminAuth,
  adminController.createCorporate.bind(adminController)
);
router.get(
  '/api/corporates/:corporateId',
  requireAdminAuth,
  adminController.getCorporate.bind(adminController)
);
router.put(
  '/api/corporates/:corporateId',
  requireAdminAuth,
  adminController.updateCorporate.bind(adminController)
);
router.delete(
  '/api/corporates/:corporateId',
  requireAdminAuth,
  adminController.deleteCorporate.bind(adminController)
);
router.post(
  '/api/corporates/bulk/status',
  requireAdminAuth,
  adminController.bulkUpdateCorporateStatus.bind(adminController)
);
router.post(
  '/api/corporates/bulk/delete',
  requireAdminAuth,
  adminController.bulkDeleteCorporates.bind(adminController)
);
router.get(
  '/api/corporates/export/csv',
  requireAdminAuth,
  adminController.exportCorporatesToCSV.bind(adminController)
);

// Ideas management routes
router.get(
  '/ideas',
  requireAdminAuth,
  adminController.showIdeas.bind(adminController)
);
router.get(
  '/ideas/:ideaId',
  requireAdminAuth,
  adminController.showIdeaDetails.bind(adminController)
);

// Ideas API routes
router.get(
  '/api/ideas/:ideaId',
  requireAdminAuth,
  adminController.getIdea.bind(adminController)
);
router.put(
  '/api/ideas/:ideaId',
  requireAdminAuth,
  adminController.updateIdea.bind(adminController)
);
router.delete(
  '/api/ideas/:ideaId',
  requireAdminAuth,
  adminController.deleteIdea.bind(adminController)
);

// Votes management routes
router.get(
  '/votes',
  requireAdminAuth,
  adminController.showVotes.bind(adminController)
);

// Package management routes
router.get(
  '/packages',
  requireAdminAuth,
  adminController.showPackages.bind(adminController)
);
router.get(
  '/packages/:packageId',
  requireAdminAuth,
  adminController.showPackageDetails.bind(adminController)
);

// Package API routes
router.post(
  '/api/packages',
  requireAdminAuth,
  adminController.createPackage.bind(adminController)
);
router.get(
  '/api/packages/:packageId',
  requireAdminAuth,
  adminController.getPackage.bind(adminController)
);
router.put(
  '/api/packages/:packageId',
  requireAdminAuth,
  adminController.updatePackage.bind(adminController)
);
router.delete(
  '/api/packages/:packageId',
  requireAdminAuth,
  adminController.deletePackage.bind(adminController)
);

// Billing management routes
router.get(
  '/billing',
  requireAdminAuth,
  adminController.showBilling.bind(adminController)
);
router.get(
  '/billing/:billingId',
  requireAdminAuth,
  adminController.showBillingDetails.bind(adminController)
);

// Billing API routes
router.post(
  '/api/billing',
  requireAdminAuth,
  adminController.createBillingTransaction.bind(adminController)
);
router.get(
  '/api/billing/:billingId',
  requireAdminAuth,
  adminController.getBillingTransaction.bind(adminController)
);
router.put(
  '/api/billing/:billingId/status',
  requireAdminAuth,
  adminController.updateBillingStatus.bind(adminController)
);
router.post(
  '/api/billing/:billingId/refund',
  requireAdminAuth,
  adminController.processRefund.bind(adminController)
);

// Reward management routes
router.get(
  '/rewards',
  requireAdminAuth,
  adminController.showRewards.bind(adminController)
);
router.get(
  '/rewards/:rewardId',
  requireAdminAuth,
  adminController.showRewardDetails.bind(adminController)
);

// Reward API routes
router.post(
  '/api/rewards',
  requireAdminAuth,
  adminController.createReward.bind(adminController)
);
router.post(
  '/api/rewards/grant',
  requireAdminAuth,
  adminController.grantReward.bind(adminController)
);
router.get(
  '/api/rewards/:rewardId',
  requireAdminAuth,
  adminController.getReward.bind(adminController)
);
router.put(
  '/api/rewards/:rewardId',
  requireAdminAuth,
  adminController.updateReward.bind(adminController)
);
router.delete(
  '/api/rewards/:rewardId',
  requireAdminAuth,
  adminController.deleteReward.bind(adminController)
);

// Landing page management routes
router.get(
  '/landing-page',
  requireAdminAuth,
  adminController.showLandingPage.bind(adminController)
);
router.get(
  '/landing-page/:sectionId',
  requireAdminAuth,
  adminController.showLandingPageSection.bind(adminController)
);

// Landing page API routes
router.get(
  '/api/landing-page/:sectionId',
  requireAdminAuth,
  adminController.getLandingPageSection.bind(adminController)
);
router.post(
  '/api/landing-page',
  requireAdminAuth,
  adminController.createLandingPageSection.bind(adminController)
);
router.put(
  '/api/landing-page/:sectionId',
  requireAdminAuth,
  adminController.updateLandingPageSection.bind(adminController)
);
router.delete(
  '/api/landing-page/:sectionId',
  requireAdminAuth,
  adminController.deleteLandingPageSection.bind(adminController)
);
router.patch(
  '/api/landing-page/:sectionId/toggle',
  requireAdminAuth,
  adminController.toggleLandingPageSectionStatus.bind(adminController)
);
router.patch(
  '/api/landing-page/:sectionId/order',
  requireAdminAuth,
  adminController.updateLandingPageSectionOrder.bind(adminController)
);

module.exports = router;
