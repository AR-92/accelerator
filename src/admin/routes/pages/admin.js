const express = require('express');
const router = express.Router();
const container = require('../../../container');
const adminController = container.get('adminController');
const adminAuthController = container.get('adminAuthController');

// Import admin auth middleware and wrap it for async compatibility
const {
  requireAdminAuth: originalRequireAdminAuth,
} = require('../../../middleware/auth/adminAuth');

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
  adminAuthController.showLogin(req, res);
});

// POST admin login
router.post('/login', (req, res) => {
  adminAuthController.login(req, res).catch((err) => {
    console.error('Admin login error:', err);
    res.status(500).render('admin/pages/login', {
      title: 'Admin Login - Accelerator Platform',
      layout: 'admin-login',
      error: 'An error occurred during login',
    });
  });
});

// GET admin dashboard
router.get(
  '/dashboard',
  // requireAdminAuth, // Temporarily disabled for testing
  (req, res, next) => {
    console.log('Admin dashboard route hit');
    next();
  },
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

// GET admin package details
router.get(
  '/packages/:packageId',
  requireAdminAuth,
  adminController.showPackageDetails.bind(adminController)
);

// GET admin billing
router.get(
  '/billing',
  requireAdminAuth,
  adminController.showBilling.bind(adminController)
);

// GET admin billing details
router.get(
  '/billing/:billingId',
  requireAdminAuth,
  adminController.showBillingDetails.bind(adminController)
);

// GET admin rewards
router.get(
  '/rewards',
  requireAdminAuth,
  adminController.showRewards.bind(adminController)
);

// GET admin reward details
router.get(
  '/rewards/:rewardId',
  requireAdminAuth,
  adminController.showRewardDetails.bind(adminController)
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
  res.render('admin/pages/landing-page-section', {
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

// GET admin projects
router.get(
  '/projects',
  requireAdminAuth,
  adminController.showProjects.bind(adminController)
);

// GET admin project details
router.get(
  '/projects/:projectId',
  requireAdminAuth,
  adminController.showProjectDetails.bind(adminController)
);

// GET admin project collaborators
router.get(
  '/project-collaborators',
  requireAdminAuth,
  adminController.showProjectCollaborators.bind(adminController)
);

// GET admin tasks
router.get(
  '/tasks',
  requireAdminAuth,
  adminController.showTasks.bind(adminController)
);

// GET admin messages
router.get(
  '/messages',
  requireAdminAuth,
  adminController.showMessages.bind(adminController)
);

// GET admin startups
router.get(
  '/startups',
  requireAdminAuth,
  adminController.showStartups.bind(adminController)
);

// GET admin enterprises
router.get(
  '/enterprises',
  requireAdminAuth,
  adminController.showEnterprises.bind(adminController)
);

// GET admin corporates
router.get(
  '/corporates',
  requireAdminAuth,
  adminController.showCorporates.bind(adminController)
);

// GET admin help categories
router.get(
  '/help-categories',
  requireAdminAuth,
  adminController.showHelpCategories.bind(adminController)
);

// GET admin help articles
router.get(
  '/help-articles',
  requireAdminAuth,
  adminController.showHelpArticles.bind(adminController)
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

// GET admin impersonate user
router.get(
  '/impersonate/:userId',
  requireAdminAuth,
  adminController.impersonateUserPage.bind(adminController)
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

// API routes for SCRUD operations

// Projects API
router.post(
  '/api/projects',
  requireAdminAuth,
  adminController.createProject.bind(adminController)
);
router.put(
  '/api/projects/:projectId',
  requireAdminAuth,
  adminController.updateProject.bind(adminController)
);
router.delete(
  '/api/projects/:projectId',
  requireAdminAuth,
  adminController.deleteProject.bind(adminController)
);

// Project Collaborators API
router.post(
  '/api/project-collaborators',
  requireAdminAuth,
  adminController.createProjectCollaborator.bind(adminController)
);
router.put(
  '/api/project-collaborators/:collaboratorId',
  requireAdminAuth,
  adminController.updateProjectCollaborator.bind(adminController)
);
router.delete(
  '/api/project-collaborators/:collaboratorId',
  requireAdminAuth,
  adminController.deleteProjectCollaborator.bind(adminController)
);

// Tasks API
router.post(
  '/api/tasks',
  requireAdminAuth,
  adminController.createTask.bind(adminController)
);
router.put(
  '/api/tasks/:taskId',
  requireAdminAuth,
  adminController.updateTask.bind(adminController)
);
router.delete(
  '/api/tasks/:taskId',
  requireAdminAuth,
  adminController.deleteTask.bind(adminController)
);

// Messages API
router.post(
  '/api/messages',
  requireAdminAuth,
  adminController.createMessage.bind(adminController)
);
router.put(
  '/api/messages/:messageId',
  requireAdminAuth,
  adminController.updateMessage.bind(adminController)
);
router.delete(
  '/api/messages/:messageId',
  requireAdminAuth,
  adminController.deleteMessage.bind(adminController)
);

// Startups API
router.post(
  '/api/startups',
  requireAdminAuth,
  adminController.createStartup.bind(adminController)
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

// Enterprises API
router.post(
  '/api/enterprises',
  requireAdminAuth,
  adminController.createEnterprise.bind(adminController)
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

// Corporates API
router.post(
  '/api/corporates',
  requireAdminAuth,
  adminController.createCorporate.bind(adminController)
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

// Help Categories API
router.post(
  '/api/help-categories',
  requireAdminAuth,
  adminController.createHelpCategory.bind(adminController)
);
router.put(
  '/api/help-categories/:categoryId',
  requireAdminAuth,
  adminController.updateHelpCategory.bind(adminController)
);
router.delete(
  '/api/help-categories/:categoryId',
  requireAdminAuth,
  adminController.deleteHelpCategory.bind(adminController)
);

// Help Articles API
router.post(
  '/api/help-articles',
  requireAdminAuth,
  adminController.createHelpArticle.bind(adminController)
);
router.put(
  '/api/help-articles/:articleId',
  requireAdminAuth,
  adminController.updateHelpArticle.bind(adminController)
);
router.delete(
  '/api/help-articles/:articleId',
  requireAdminAuth,
  adminController.deleteHelpArticle.bind(adminController)
);

module.exports = router;
