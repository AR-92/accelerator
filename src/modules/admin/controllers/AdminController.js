/**
 * Main Admin Controller
 * Delegates to specific admin controllers
 */
class AdminController {
  constructor(
    adminDashboardController,
    adminUserViewController,
    adminUserActionController,
    adminOrganizationController,
    adminBusinessController,
    adminAIController,
    adminCreditController,
    adminSystemStatsController
  ) {
    this.adminDashboardController = adminDashboardController;
    this.adminUserViewController = adminUserViewController;
    this.adminUserActionController = adminUserActionController;
    this.adminOrganizationController = adminOrganizationController;
    this.adminBusinessController = adminBusinessController;
    this.adminAIController = adminAIController;
    this.adminCreditController = adminCreditController;
    this.adminSystemStatsController = adminSystemStatsController;
  }

  // Dashboard methods
  showDashboard = (req, res) =>
    this.adminDashboardController.showDashboard(req, res);
  showSettings = (req, res) =>
    this.adminDashboardController.showSettings(req, res);
  showSystemHealth = (req, res) =>
    this.adminDashboardController.showSystemHealth(req, res);
  getSystemStatsAPI = (req, res) =>
    this.adminSystemStatsController.getSystemStatsAPI(req, res);
  showContent = (req, res) =>
    this.adminDashboardController.showContent(req, res);
  showHelpContent = (req, res) =>
    this.adminDashboardController.showHelpContent(req, res);
  showLearningContent = (req, res) =>
    this.adminDashboardController.showLearningContent(req, res);
  showIdeas = (req, res) => this.adminDashboardController.showIdeas(req, res);
  getIdea = (req, res) => this.adminDashboardController.getIdea(req, res);
  updateIdea = (req, res) => this.adminDashboardController.updateIdea(req, res);
  deleteIdea = (req, res) => this.adminDashboardController.deleteIdea(req, res);
  showVotes = (req, res) => this.adminDashboardController.showVotes(req, res);
  showPackages = (req, res) =>
    this.adminDashboardController.showPackages(req, res);
  createPackage = (req, res) =>
    this.adminDashboardController.createPackage(req, res);
  getPackage = (req, res) => this.adminDashboardController.getPackage(req, res);
  updatePackage = (req, res) =>
    this.adminDashboardController.updatePackage(req, res);
  deletePackage = (req, res) =>
    this.adminDashboardController.deletePackage(req, res);
  showBilling = (req, res) =>
    this.adminDashboardController.showBilling(req, res);
  createBillingTransaction = (req, res) =>
    this.adminCreditController.createBillingTransaction(req, res);
  getBillingTransaction = (req, res) =>
    this.adminCreditController.getBillingTransaction(req, res);
  updateBillingStatus = (req, res) =>
    this.adminCreditController.updateBillingStatus(req, res);
  processRefund = (req, res) =>
    this.adminCreditController.processRefund(req, res);
  showRewards = (req, res) =>
    this.adminDashboardController.showRewards(req, res);
  createReward = (req, res) =>
    this.adminDashboardController.createReward(req, res);
  grantReward = (req, res) =>
    this.adminDashboardController.grantReward(req, res);
  getReward = (req, res) => this.adminDashboardController.getReward(req, res);
  updateReward = (req, res) =>
    this.adminDashboardController.updateReward(req, res);
  deleteReward = (req, res) =>
    this.adminDashboardController.deleteReward(req, res);
  showCollaborations = (req, res) =>
    this.adminDashboardController.showCollaborations(req, res);
  getProject = (req, res) => this.adminDashboardController.getProject(req, res);
  updateProjectStatus = (req, res) =>
    this.adminDashboardController.updateProjectStatus(req, res);
  removeUserFromProject = (req, res) =>
    this.adminDashboardController.removeUserFromProject(req, res);
  deleteProject = (req, res) =>
    this.adminDashboardController.deleteProject(req, res);
  showLandingPage = (req, res) =>
    this.adminDashboardController.showLandingPage(req, res);
  updateLandingPageSectionOrder = (req, res) =>
    this.adminDashboardController.updateLandingPageSectionOrder(req, res);

  // User methods
  showUsers = (req, res) => this.adminUserViewController.showUsers(req, res);
  showUserDetails = (req, res) =>
    this.adminUserViewController.showUserDetails(req, res);
  createUser = (req, res) =>
    this.adminUserActionController.createUser(req, res);
  getUser = (req, res) => this.adminUserActionController.getUser(req, res);
  updateUserCredits = (req, res) =>
    this.adminUserActionController.updateUserCredits(req, res);
  updateUserRole = (req, res) =>
    this.adminUserActionController.updateUserRole(req, res);
  updateUserStatus = (req, res) =>
    this.adminUserActionController.updateUserStatus(req, res);
  updateUserBanned = (req, res) =>
    this.adminUserActionController.updateUserBanned(req, res);
  resetUserPassword = (req, res) =>
    this.adminUserActionController.resetUserPassword(req, res);
  exportUsersToCSV = (req, res) =>
    this.adminUserActionController.exportUsersToCSV(req, res);
  deleteUser = (req, res) =>
    this.adminUserActionController.deleteUser(req, res);
  bulkUpdateCredits = (req, res) =>
    this.adminUserActionController.bulkUpdateCredits(req, res);
  bulkUpdateRoles = (req, res) =>
    this.adminUserActionController.bulkUpdateRoles(req, res);

  // Organization methods
  showOrganizations = (req, res) =>
    this.adminOrganizationController.showOrganizations(req, res);
  showOrganizationDetails = (req, res) =>
    this.adminOrganizationController.showOrganizationDetails(req, res);

  // Business methods
  showStartups = (req, res) =>
    this.adminBusinessController.showStartups(req, res);
  showEnterprises = (req, res) =>
    this.adminBusinessController.showEnterprises(req, res);
  showCorporates = (req, res) =>
    this.adminBusinessController.showCorporates(req, res);

  // AI methods
  showAIModels = (req, res) => this.adminAIController.showAIModels(req, res);
  showAIWorkflows = (req, res) =>
    this.adminAIController.showAIWorkflows(req, res);
  showAIWorkflowDetails = (req, res) =>
    this.adminAIController.showAIWorkflowDetails(req, res);

  // Credit methods
  showCredits = (req, res) => this.adminCreditController.showCredits(req, res);

  // Additional methods that might be missing
  showProjects = (req, res) =>
    this.adminDashboardController.showCollaborations(req, res); // Reuse collaborations
  showProjectDetails = (req, res) => {
    res.status(501).send('Not implemented');
  };
  showProjectCollaborators = (req, res) => {
    res.status(501).send('Not implemented');
  };
  showTasks = (req, res) => {
    res.status(501).send('Not implemented');
  };
  showMessages = (req, res) => {
    res.status(501).send('Not implemented');
  };
  showHelpCategories = (req, res) => {
    res.status(501).send('Not implemented');
  };
  showHelpArticles = (req, res) => {
    res.status(501).send('Not implemented');
  };
  showTransactions = (req, res) => {
    res.status(501).send('Not implemented');
  };
  showPaymentMethods = (req, res) => {
    res.status(501).send('Not implemented');
  };
  showIdeaDetails = (req, res) => {
    res.status(501).send('Not implemented');
  };
  showCollaborationDetails = (req, res) => {
    res.status(501).send('Not implemented');
  };
  showPackageDetails = (req, res) => {
    res.status(501).send('Not implemented');
  };
  showBillingDetails = (req, res) => {
    res.status(501).send('Not implemented');
  };
  showRewardDetails = (req, res) => {
    res.status(501).send('Not implemented');
  };
  impersonateUserPage = (req, res) =>
    this.adminUserActionController.impersonateUserPage(req, res);
  stopImpersonateUserPage = (req, res) =>
    this.adminUserActionController.stopImpersonateUserPage(req, res);

  // API methods
  createProject = (req, res) => {
    res.status(501).send('Not implemented');
  };
  updateProject = (req, res) => {
    res.status(501).send('Not implemented');
  };
  deleteProject = (req, res) => {
    res.status(501).send('Not implemented');
  };
  createProjectCollaborator = (req, res) => {
    res.status(501).send('Not implemented');
  };
  updateProjectCollaborator = (req, res) => {
    res.status(501).send('Not implemented');
  };
  deleteProjectCollaborator = (req, res) => {
    res.status(501).send('Not implemented');
  };
  createTask = (req, res) => {
    res.status(501).send('Not implemented');
  };
  updateTask = (req, res) => {
    res.status(501).send('Not implemented');
  };
  deleteTask = (req, res) => {
    res.status(501).send('Not implemented');
  };
  createMessage = (req, res) => {
    res.status(501).send('Not implemented');
  };
  updateMessage = (req, res) => {
    res.status(501).send('Not implemented');
  };
  deleteMessage = (req, res) => {
    res.status(501).send('Not implemented');
  };
  createStartup = (req, res) => {
    res.status(501).send('Not implemented');
  };
  updateStartup = (req, res) => {
    res.status(501).send('Not implemented');
  };
  deleteStartup = (req, res) => {
    res.status(501).send('Not implemented');
  };
  createEnterprise = (req, res) => {
    res.status(501).send('Not implemented');
  };
  updateEnterprise = (req, res) => {
    res.status(501).send('Not implemented');
  };
  deleteEnterprise = (req, res) => {
    res.status(501).send('Not implemented');
  };
  createCorporate = (req, res) => {
    res.status(501).send('Not implemented');
  };
  updateCorporate = (req, res) => {
    res.status(501).send('Not implemented');
  };
  deleteCorporate = (req, res) => {
    res.status(501).send('Not implemented');
  };
  createHelpCategory = (req, res) => {
    res.status(501).send('Not implemented');
  };
  updateHelpCategory = (req, res) => {
    res.status(501).send('Not implemented');
  };
  deleteHelpCategory = (req, res) => {
    res.status(501).send('Not implemented');
  };
  createHelpArticle = (req, res) => {
    res.status(501).send('Not implemented');
  };
  updateHelpArticle = (req, res) => {
    res.status(501).send('Not implemented');
  };
  deleteHelpArticle = (req, res) => {
    res.status(501).send('Not implemented');
  };
}

module.exports = AdminController;
