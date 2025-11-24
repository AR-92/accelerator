// Import from common
export { handleValidationErrors } from './common.js';

// Import from user domain
export {
  validateUserCreation,
  validateUserUpdate,
  validateUserDeletion,
  validateAccountCreation,
  validateAccountUpdate,
  validateAccountDeletion,
  validateNotificationCreation,
  validateNotificationUpdate,
  validateNotificationDeletion,
} from './user/user.js';

// Import from engagement domain
export {
  validateTodoCreation,
  validateTodoUpdate,
  validateTodoDeletion,
} from './engagement/todo.js';

export {
  validateVoteCreation,
  validateVoteUpdate,
  validateVoteDeletion,
} from './engagement/vote.js';

export {
  validateIdeaCreation,
  validateIdeaUpdate,
  validateIdeaDeletion,
} from './engagement/idea.js';

export {
  validateRewardCreation,
  validateRewardUpdate,
  validateRewardDeletion,
} from './engagement/reward.js';

// Import from business domain
export {
  validateCorporateCreation,
  validateCorporateUpdate,
  validateCorporateDeletion,
} from './business/corporate.js';

export {
  validateEnterpriseCreation,
  validateEnterpriseUpdate,
  validateEnterpriseDeletion,
} from './business/enterprise.js';

export {
  validateStartupCreation,
  validateStartupUpdate,
  validateStartupDeletion,
} from './business/startup.js';

// Import from content domain
export {
  validateContentCreation,
  validateContentUpdate,
  validateContentDeletion,
} from './content/content.js';

export {
  validateLandingPageCreation,
  validateLandingPageUpdate,
  validateLandingPageDeletion,
} from './content/landing-page.js';

export {
  validateHelpCenterCreation,
  validateHelpCenterUpdate,
  validateHelpCenterDeletion,
} from './content/help-center.js';

export {
  validateMessageCreation,
  validateMessageUpdate,
  validateMessageDeletion,
} from './content/message.js';

// Import from project domain
export {
  validateProjectCreation,
  validateProjectUpdate,
  validateProjectDeletion,
} from './project/project.js';

export {
  validateTaskCreation,
  validateTaskUpdate,
  validateTaskDeletion,
} from './project/task.js';

export {
  validateProjectCollaboratorCreation,
  validateProjectCollaboratorUpdate,
  validateProjectCollaboratorDeletion,
} from './project/collaborator.js';

export {
  validateCollaborationCreation,
  validateCollaborationUpdate,
  validateCollaborationDeletion,
} from './project/collaboration.js';

// Import from learning domain
export {
  validateLearningContentCreation,
  validateLearningContentUpdate,
  validateLearningContentDeletion,
} from './learning/content.js';

export {
  validateLearningCategoryCreation,
  validateLearningCategoryUpdate,
  validateLearningCategoryDeletion,
} from './learning/category.js';

export {
  validateLearningAssessmentCreation,
  validateLearningAssessmentUpdate,
  validateLearningAssessmentDeletion,
} from './learning/assessment.js';

export {
  validateLearningAnalyticsCreation,
  validateLearningAnalyticsUpdate,
  validateLearningAnalyticsDeletion,
} from './learning/analytics.js';

// Import from system domain
export {
  validateCalendarCreation,
  validateCalendarUpdate,
  validateCalendarDeletion,
} from './system/calendar.js';

export {
  validateBusinessModelCreation,
  validateBusinessModelUpdate,
  validateBusinessModelDeletion,
} from './system/business-model.js';

export {
  validateBillingCreation,
  validateBillingUpdate,
  validateBillingDeletion,
} from './system/billing.js';

export {
  validatePackageCreation,
  validatePackageUpdate,
  validatePackageDeletion,
} from './system/package.js';

export {
  validatePortfolioCreation,
  validatePortfolioUpdate,
  validatePortfolioDeletion,
} from './system/portfolio.js';
