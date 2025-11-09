const express = require('express');
const router = express.Router();
const { requireAdminAuth } = require('../middleware/adminAuth');
const rateLimit = require('express-rate-limit');

// Rate limiter for system stats API (60 requests per minute)
const systemStatsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute (1 per second)
  message: {
    success: false,
    error:
      'Too many requests for system stats. Please wait before trying again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Import controllers and services
const container = require('../container');
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
  '/users/:userId',
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
  systemStatsLimiter,
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

module.exports = router;
