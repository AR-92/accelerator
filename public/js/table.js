// Generic table functionality - works for all tables
console.log('Generic table.js loaded');

// Configuration for table-specific behavior
const tableConfigs = {
  ideas: {
    bulkActions: {
      approve: { endpoint: '/api/ideas', method: 'PUT', action: 'approve' },
      reject: { endpoint: '/api/ideas', method: 'PUT', action: 'reject' },
      delete: { endpoint: '/api/ideas', method: 'DELETE' },
    },
    entityName: 'idea',
  },
  users: {
    bulkActions: {
      activate: {
        endpoint: '/api/users/toggle-status',
        method: 'PUT',
        action: 'activate',
      },
      deactivate: {
        endpoint: '/api/users/toggle-status',
        method: 'PUT',
        action: 'deactivate',
      },
      delete: { endpoint: '/api/users', method: 'DELETE' },
    },
    entityName: 'user',
  },
  billing: {
    bulkActions: {
      refund: { endpoint: '/api/billing', method: 'PUT', action: 'refund' },
    },
    entityName: 'transaction',
  },
  calendar: {
    bulkActions: {
      complete: {
        endpoint: '/api/calendar',
        method: 'PUT',
        action: 'complete',
      },
      cancel: { endpoint: '/api/calendar', method: 'PUT', action: 'cancel' },
      delete: { endpoint: '/api/calendar', method: 'DELETE' },
    },
    entityName: 'event',
  },
  collaborations: {
    bulkActions: {
      archive: {
        endpoint: '/api/collaborations',
        method: 'PUT',
        action: 'archive',
      },
      delete: { endpoint: '/api/collaborations', method: 'DELETE' },
    },
    entityName: 'collaboration',
  },
  content: {
    bulkActions: {
      archive: { endpoint: '/api/content', method: 'PUT', action: 'archive' },
      delete: { endpoint: '/api/content', method: 'DELETE' },
    },
    entityName: 'content',
  },
  corporate: {
    bulkActions: {
      activate: {
        endpoint: '/api/corporate',
        method: 'PUT',
        action: 'activate',
      },
      deactivate: {
        endpoint: '/api/corporate',
        method: 'PUT',
        action: 'deactivate',
      },
      delete: { endpoint: '/api/corporate', method: 'DELETE' },
    },
    entityName: 'corporate',
  },
  enterprises: {
    bulkActions: {
      delete: { endpoint: '/api/enterprises', method: 'DELETE' },
    },
    entityName: 'enterprise',
  },
  'financial-model': {
    bulkActions: {
      finalize: {
        endpoint: '/api/financial-model',
        method: 'PUT',
        action: 'finalize',
      },
      archive: {
        endpoint: '/api/financial-model',
        method: 'PUT',
        action: 'archive',
      },
      delete: { endpoint: '/api/financial-model', method: 'DELETE' },
    },
    entityName: 'financial model',
  },
  funding: {
    bulkActions: {
      fund: { endpoint: '/api/funding', method: 'PUT', action: 'fund' },
      close: { endpoint: '/api/funding', method: 'PUT', action: 'close' },
      delete: { endpoint: '/api/funding', method: 'DELETE' },
    },
    entityName: 'funding',
  },
  'learning-assessments': {
    bulkActions: {
      activate: {
        endpoint: '/api/learning-assessments',
        method: 'PUT',
        action: 'activate',
      },
      deactivate: {
        endpoint: '/api/learning-assessments',
        method: 'PUT',
        action: 'deactivate',
      },
      delete: { endpoint: '/api/learning-assessments', method: 'DELETE' },
    },
    entityName: 'assessment',
  },
  'learning-categories': {
    bulkActions: {
      delete: { endpoint: '/api/learning-categories', method: 'DELETE' },
    },
    entityName: 'learning category',
  },
  'learning-content': {
    bulkActions: {
      delete: { endpoint: '/api/learning-content', method: 'DELETE' },
    },
    entityName: 'learning content',
  },
  legal: {
    bulkActions: {
      approve: { endpoint: '/api/legal', method: 'PUT', action: 'approve' },
      execute: { endpoint: '/api/legal', method: 'PUT', action: 'execute' },
      delete: { endpoint: '/api/legal', method: 'DELETE' },
    },
    entityName: 'legal item',
  },
  marketing: {
    bulkActions: {
      activate: {
        endpoint: '/api/marketing',
        method: 'PUT',
        action: 'activate',
      },
      archive: { endpoint: '/api/marketing', method: 'PUT', action: 'archive' },
      delete: { endpoint: '/api/marketing', method: 'DELETE' },
    },
    entityName: 'marketing item',
  },
  packages: {
    bulkActions: {
      activate: {
        endpoint: '/api/packages',
        method: 'PUT',
        action: 'activate',
      },
      deactivate: {
        endpoint: '/api/packages',
        method: 'PUT',
        action: 'deactivate',
      },
      delete: { endpoint: '/api/packages', method: 'DELETE' },
    },
    entityName: 'package',
  },
  'project-collaborators': {
    bulkActions: {
      activate: {
        endpoint: '/api/project-collaborators',
        method: 'PUT',
        action: 'activate',
      },
      deactivate: {
        endpoint: '/api/project-collaborators',
        method: 'PUT',
        action: 'deactivate',
      },
      delete: { endpoint: '/api/project-collaborators', method: 'DELETE' },
    },
    entityName: 'collaborator',
  },
  rewards: {
    bulkActions: {
      activate: { endpoint: '/api/rewards', method: 'PUT', action: 'activate' },
      deactivate: {
        endpoint: '/api/rewards',
        method: 'PUT',
        action: 'deactivate',
      },
      delete: { endpoint: '/api/rewards', method: 'DELETE' },
    },
    entityName: 'reward',
  },
  team: {
    bulkActions: {
      activate: { endpoint: '/api/team', method: 'PUT', action: 'activate' },
      deactivate: {
        endpoint: '/api/team',
        method: 'PUT',
        action: 'deactivate',
      },
      delete: { endpoint: '/api/team', method: 'DELETE' },
    },
    entityName: 'team',
  },
  valuation: {
    bulkActions: {
      complete: {
        endpoint: '/api/valuation',
        method: 'PUT',
        action: 'complete',
      },
      archive: { endpoint: '/api/valuation', method: 'PUT', action: 'archive' },
      delete: { endpoint: '/api/valuation', method: 'DELETE' },
    },
    entityName: 'valuation',
  },
  votes: {
    bulkActions: {
      delete: { endpoint: '/api/votes', method: 'DELETE' },
    },
    entityName: 'vote',
  },
  'help-center': {
    bulkActions: {
      publish: {
        endpoint: '/api/help-center',
        method: 'PUT',
        action: 'publish',
      },
      archive: {
        endpoint: '/api/help-center',
        method: 'PUT',
        action: 'archive',
      },
      delete: { endpoint: '/api/help-center', method: 'DELETE' },
    },
    entityName: 'article',
  },
  messages: {
    bulkActions: {
      markAsRead: {
        endpoint: '/api/messages',
        method: 'PUT',
        action: 'markAsRead',
      },
      delete: { endpoint: '/api/messages', method: 'DELETE' },
    },
    entityName: 'message',
  },
  'business-model': {
    bulkActions: {
      update_status: {
        endpoint: '/api/business-model',
        method: 'PUT',
      },
      delete: { endpoint: '/api/business-model', method: 'DELETE' },
    },
    entityName: 'business model',
  },
  'business-plan': {
    bulkActions: {
      update_status: {
        endpoint: '/api/business-plan',
        method: 'PUT',
      },
      delete: { endpoint: '/api/business-plan', method: 'DELETE' },
    },
    entityName: 'business plan',
  },
  pitchdeck: {
    bulkActions: {
      update_status: {
        endpoint: '/api/pitchdeck',
        method: 'PUT',
      },
      delete: { endpoint: '/api/pitchdeck', method: 'DELETE' },
    },
    entityName: 'pitchdeck',
  },
  portfolios: {
    bulkActions: {
      toggle_public: {
        endpoint: '/api/portfolios',
        method: 'PUT',
      },
      delete: { endpoint: '/api/portfolios', method: 'DELETE' },
    },
    entityName: 'portfolio',
  },
  accounts: {
    bulkActions: {
      toggle_verification: {
        endpoint: '/api/accounts',
        method: 'PUT',
      },
      delete: { endpoint: '/api/accounts', method: 'DELETE' },
    },
    entityName: 'account',
  },
  'landing-page': {
    bulkActions: {
      toggle_active: {
        endpoint: '/api/landing-page',
        method: 'PUT',
      },
      delete: { endpoint: '/api/landing-page', method: 'DELETE' },
    },
    entityName: 'landing page',
  },
  'learning-analytics': {
    bulkActions: {
      toggle_processed: {
        endpoint: '/api/learning-analytics',
        method: 'PUT',
      },
      delete: { endpoint: '/api/learning-analytics', method: 'DELETE' },
    },
    entityName: 'analytics event',
  },
  // Add more table configurations as needed...
};

// Generic bulk action handler
function openBulkActionModal(tableName, type, ids) {
  const config = tableConfigs[tableName];
  if (!config) {
    console.error(`No configuration found for table: ${tableName}`);
    return;
  }

  const titles = {
    approve: `Approve ${config.entityName}s`,
    reject: `Reject ${config.entityName}s`,
    delete: `Delete ${config.entityName}s`,
    activate: `Activate ${config.entityName}s`,
    deactivate: `Deactivate ${config.entityName}s`,
    refund: `Refund ${config.entityName}s`,
    complete: `Complete ${config.entityName}s`,
    cancel: `Cancel ${config.entityName}s`,
    archive: `Archive ${config.entityName}s`,
    finalize: `Finalize ${config.entityName}s`,
    fund: `Fund ${config.entityName}s`,
    close: `Close ${config.entityName}s`,
    execute: `Execute ${config.entityName}s`,
    publish: `Publish ${config.entityName}s`,
    markAsRead: `Mark ${config.entityName}s as Read`,
  };

  const messages = {
    approve: `Are you sure you want to ${type} ${ids.length} ${config.entityName}(s)?`,
    reject: `Are you sure you want to ${type} ${ids.length} ${config.entityName}(s)?`,
    delete: `Are you sure you want to ${type} ${ids.length} ${config.entityName}(s)?`,
    activate: `Are you sure you want to ${type} ${ids.length} ${config.entityName}(s)?`,
    deactivate: `Are you sure you want to ${type} ${ids.length} ${config.entityName}(s)?`,
    refund: `Are you sure you want to ${type} ${ids.length} ${config.entityName}(s)?`,
    complete: `Are you sure you want to ${type} ${ids.length} ${config.entityName}(s)?`,
    cancel: `Are you sure you want to ${type} ${ids.length} ${config.entityName}(s)?`,
    archive: `Are you sure you want to ${type} ${ids.length} ${config.entityName}(s)?`,
    finalize: `Are you sure you want to ${type} ${ids.length} ${config.entityName}(s)?`,
    fund: `Are you sure you want to ${type} ${ids.length} ${config.entityName}(s)?`,
    close: `Are you sure you want to ${type} ${ids.length} ${config.entityName}(s)?`,
    execute: `Are you sure you want to ${type} ${ids.length} ${config.entityName}(s)?`,
    publish: `Are you sure you want to ${type} ${ids.length} ${config.entityName}(s)?`,
    markAsRead: `Are you sure you want to ${type} ${ids.length} ${config.entityName}(s)?`,
  };

  document.getElementById('bulkActionTitle').textContent =
    titles[type] || `Confirm ${type}`;
  document.getElementById('bulkActionMessage').textContent =
    messages[type] || `Are you sure you want to ${type} ${ids.length} items?`;

  const btn = document.getElementById('bulkActionConfirmBtn');
  btn.textContent = type.charAt(0).toUpperCase() + type.slice(1);
  if (type === 'delete') {
    btn.className =
      'px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md';
  } else {
    btn.className =
      'px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md';
  }

  const modal = document.getElementById('bulkActionModal');
  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');

  // Store bulk action data
  window.currentBulkAction = { tableName, type, ids };
}

function closeBulkActionModal() {
  const modal = document.getElementById('bulkActionModal');
  modal.classList.add('hidden');
  modal.style.display = '';
  modal.setAttribute('aria-hidden', 'true');
  window.currentBulkAction = null;
}

function confirmBulkAction() {
  const action = window.currentBulkAction;
  if (!action) return;

  const { tableName, type, ids } = action;
  const config = tableConfigs[tableName];

  if (!config) {
    console.error(`No configuration found for table: ${tableName}`);
    closeBulkActionModal();
    return;
  }

  // Use the bulk-action endpoint
  fetch(`/api/${tableName}/bulk-action`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: type,
      ids: ids,
    }),
  })
    .then((response) => {
      if (response.ok) {
        // The response is HTML for HTMX, so let HTMX handle it
        return response.text();
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    })
    .then((html) => {
      // Insert the response HTML (toast notification)
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      document.body.appendChild(tempDiv);
      // The script in the HTML will handle refreshing the table
    })
    .catch((error) => {
      console.error('Bulk action error:', error);
      showToast(`Bulk ${type} failed: ${error.message}`, 'error');
      closeBulkActionModal();
    });
}

// Generic checkbox selection
function getSelectedIds(tableName) {
  const checkboxes = document.querySelectorAll(`.${tableName}Checkbox:checked`);
  return Array.from(checkboxes).map((cb) => parseInt(cb.value));
}

// Generic bulk action functions
function bulkApproveIdeas() {
  const ids = getSelectedIds('ideas');
  if (ids.length === 0) {
    showToast('No ideas selected', 'warning');
    return;
  }
  openBulkActionModal('ideas', 'approve', ids);
}

function bulkRejectIdeas() {
  const ids = getSelectedIds('ideas');
  if (ids.length === 0) {
    showToast('No ideas selected', 'warning');
    return;
  }
  openBulkActionModal('ideas', 'reject', ids);
}

function bulkDeleteIdeas() {
  const ids = getSelectedIds('ideas');
  if (ids.length === 0) {
    showToast('No ideas selected', 'warning');
    return;
  }
  openBulkActionModal('ideas', 'delete', ids);
}

function bulkActivate() {
  const ids = getSelectedIds('users');
  if (ids.length === 0) {
    showToast('No users selected', 'warning');
    return;
  }
  openBulkActionModal('users', 'activate', ids);
}

function bulkDeactivate() {
  const ids = getSelectedIds('users');
  if (ids.length === 0) {
    showToast('No users selected', 'warning');
    return;
  }
  openBulkActionModal('users', 'deactivate', ids);
}

function bulkDeleteUsers() {
  const ids = getSelectedIds('users');
  if (ids.length === 0) {
    showToast('No users selected', 'warning');
    return;
  }
  openBulkActionModal('users', 'delete', ids);
}

function bulkRefundTransactions() {
  const ids = getSelectedIds('billing');
  if (ids.length === 0) {
    showToast('No transactions selected', 'warning');
    return;
  }
  openBulkActionModal('billing', 'refund', ids);
}

// Calendar bulk actions
function bulkCompleteEvents() {
  const ids = getSelectedIds('calendar');
  if (ids.length === 0) {
    showToast('No events selected', 'warning');
    return;
  }
  openBulkActionModal('calendar', 'complete', ids);
}

function bulkCancelEvents() {
  const ids = getSelectedIds('calendar');
  if (ids.length === 0) {
    showToast('No events selected', 'warning');
    return;
  }
  openBulkActionModal('calendar', 'cancel', ids);
}

function bulkDeleteEvents() {
  const ids = getSelectedIds('calendar');
  if (ids.length === 0) {
    showToast('No events selected', 'warning');
    return;
  }
  openBulkActionModal('calendar', 'delete', ids);
}

// Collaborations bulk actions
function bulkArchiveCollaborations() {
  const ids = getSelectedIds('collaborations');
  if (ids.length === 0) {
    showToast('No collaborations selected', 'warning');
    return;
  }
  openBulkActionModal('collaborations', 'archive', ids);
}

function bulkDeleteCollaborations() {
  const ids = getSelectedIds('collaborations');
  if (ids.length === 0) {
    showToast('No collaborations selected', 'warning');
    return;
  }
  openBulkActionModal('collaborations', 'delete', ids);
}

// Content bulk actions
function bulkArchiveContent() {
  const ids = getSelectedIds('content');
  if (ids.length === 0) {
    showToast('No content selected', 'warning');
    return;
  }
  openBulkActionModal('content', 'archive', ids);
}

function bulkDeleteContent() {
  const ids = getSelectedIds('content');
  if (ids.length === 0) {
    showToast('No content selected', 'warning');
    return;
  }
  openBulkActionModal('content', 'delete', ids);
}

// Corporate bulk actions
function bulkActivateCorporates() {
  const ids = getSelectedIds('corporate');
  if (ids.length === 0) {
    showToast('No corporates selected', 'warning');
    return;
  }
  openBulkActionModal('corporate', 'activate', ids);
}

function bulkDeactivateCorporates() {
  const ids = getSelectedIds('corporate');
  if (ids.length === 0) {
    showToast('No corporates selected', 'warning');
    return;
  }
  openBulkActionModal('corporate', 'deactivate', ids);
}

function bulkDeleteCorporates() {
  const ids = getSelectedIds('corporate');
  if (ids.length === 0) {
    showToast('No corporates selected', 'warning');
    return;
  }
  openBulkActionModal('corporate', 'delete', ids);
}

// Enterprises bulk actions
function bulkDeleteEnterprises() {
  const ids = getSelectedIds('enterprises');
  if (ids.length === 0) {
    showToast('No enterprises selected', 'warning');
    return;
  }
  openBulkActionModal('enterprises', 'delete', ids);
}

// Financial model bulk actions
function bulkFinalizeModels() {
  const ids = getSelectedIds('financial-model');
  if (ids.length === 0) {
    showToast('No financial models selected', 'warning');
    return;
  }
  openBulkActionModal('financial-model', 'finalize', ids);
}

function bulkArchiveModels() {
  const ids = getSelectedIds('financial-model');
  if (ids.length === 0) {
    showToast('No financial models selected', 'warning');
    return;
  }
  openBulkActionModal('financial-model', 'archive', ids);
}

function bulkDeleteModels() {
  const ids = getSelectedIds('financial-model');
  if (ids.length === 0) {
    showToast('No financial models selected', 'warning');
    return;
  }
  openBulkActionModal('financial-model', 'delete', ids);
}

// Funding bulk actions
function bulkFundFundings() {
  const ids = getSelectedIds('funding');
  if (ids.length === 0) {
    showToast('No fundings selected', 'warning');
    return;
  }
  openBulkActionModal('funding', 'fund', ids);
}

function bulkCloseFundings() {
  const ids = getSelectedIds('funding');
  if (ids.length === 0) {
    showToast('No fundings selected', 'warning');
    return;
  }
  openBulkActionModal('funding', 'close', ids);
}

function bulkDeleteFundings() {
  const ids = getSelectedIds('funding');
  if (ids.length === 0) {
    showToast('No fundings selected', 'warning');
    return;
  }
  openBulkActionModal('funding', 'delete', ids);
}

// Learning assessments bulk actions
function bulkActivateAssessments() {
  const ids = getSelectedIds('learning-assessments');
  if (ids.length === 0) {
    showToast('No assessments selected', 'warning');
    return;
  }
  openBulkActionModal('learning-assessments', 'activate', ids);
}

function bulkDeactivateAssessments() {
  const ids = getSelectedIds('learning-assessments');
  if (ids.length === 0) {
    showToast('No assessments selected', 'warning');
    return;
  }
  openBulkActionModal('learning-assessments', 'deactivate', ids);
}

function bulkDeleteAssessments() {
  const ids = getSelectedIds('learning-assessments');
  if (ids.length === 0) {
    showToast('No assessments selected', 'warning');
    return;
  }
  openBulkActionModal('learning-assessments', 'delete', ids);
}

// Learning categories bulk actions
function bulkDeleteLearningCategories() {
  const ids = getSelectedIds('learning-categories');
  if (ids.length === 0) {
    showToast('No learning categories selected', 'warning');
    return;
  }
  openBulkActionModal('learning-categories', 'delete', ids);
}

// Learning content bulk actions
function bulkDeleteLearningContents() {
  const ids = getSelectedIds('learning-content');
  if (ids.length === 0) {
    showToast('No learning content selected', 'warning');
    return;
  }
  openBulkActionModal('learning-content', 'delete', ids);
}

// Legal bulk actions
function bulkApproveLegals() {
  const ids = getSelectedIds('legal');
  if (ids.length === 0) {
    showToast('No legal items selected', 'warning');
    return;
  }
  openBulkActionModal('legal', 'approve', ids);
}

function bulkExecuteLegals() {
  const ids = getSelectedIds('legal');
  if (ids.length === 0) {
    showToast('No legal items selected', 'warning');
    return;
  }
  openBulkActionModal('legal', 'execute', ids);
}

function bulkDeleteLegals() {
  const ids = getSelectedIds('legal');
  if (ids.length === 0) {
    showToast('No legal items selected', 'warning');
    return;
  }
  openBulkActionModal('legal', 'delete', ids);
}

// Marketing bulk actions
function bulkActivateMarketings() {
  const ids = getSelectedIds('marketing');
  if (ids.length === 0) {
    showToast('No marketing items selected', 'warning');
    return;
  }
  openBulkActionModal('marketing', 'activate', ids);
}

function bulkArchiveMarketings() {
  const ids = getSelectedIds('marketing');
  if (ids.length === 0) {
    showToast('No marketing items selected', 'warning');
    return;
  }
  openBulkActionModal('marketing', 'archive', ids);
}

function bulkDeleteMarketings() {
  const ids = getSelectedIds('marketing');
  if (ids.length === 0) {
    showToast('No marketing items selected', 'warning');
    return;
  }
  openBulkActionModal('marketing', 'delete', ids);
}

// Packages bulk actions
function bulkActivatePackages() {
  const ids = getSelectedIds('packages');
  if (ids.length === 0) {
    showToast('No packages selected', 'warning');
    return;
  }
  openBulkActionModal('packages', 'activate', ids);
}

function bulkDeactivatePackages() {
  const ids = getSelectedIds('packages');
  if (ids.length === 0) {
    showToast('No packages selected', 'warning');
    return;
  }
  openBulkActionModal('packages', 'deactivate', ids);
}

function bulkDeletePackages() {
  const ids = getSelectedIds('packages');
  if (ids.length === 0) {
    showToast('No packages selected', 'warning');
    return;
  }
  openBulkActionModal('packages', 'delete', ids);
}

// Project collaborators bulk actions
function bulkActivateCollaborators() {
  const ids = getSelectedIds('project-collaborators');
  if (ids.length === 0) {
    showToast('No collaborators selected', 'warning');
    return;
  }
  openBulkActionModal('project-collaborators', 'activate', ids);
}

function bulkDeactivateCollaborators() {
  const ids = getSelectedIds('project-collaborators');
  if (ids.length === 0) {
    showToast('No collaborators selected', 'warning');
    return;
  }
  openBulkActionModal('project-collaborators', 'deactivate', ids);
}

function bulkDeleteCollaborators() {
  const ids = getSelectedIds('project-collaborators');
  if (ids.length === 0) {
    showToast('No collaborators selected', 'warning');
    return;
  }
  openBulkActionModal('project-collaborators', 'delete', ids);
}

// Rewards bulk actions
function bulkActivateRewards() {
  const ids = getSelectedIds('rewards');
  if (ids.length === 0) {
    showToast('No rewards selected', 'warning');
    return;
  }
  openBulkActionModal('rewards', 'activate', ids);
}

function bulkDeactivateRewards() {
  const ids = getSelectedIds('rewards');
  if (ids.length === 0) {
    showToast('No rewards selected', 'warning');
    return;
  }
  openBulkActionModal('rewards', 'deactivate', ids);
}

function bulkDeleteRewards() {
  const ids = getSelectedIds('rewards');
  if (ids.length === 0) {
    showToast('No rewards selected', 'warning');
    return;
  }
  openBulkActionModal('rewards', 'delete', ids);
}

// Team bulk actions
function bulkActivateTeams() {
  const ids = getSelectedIds('team');
  if (ids.length === 0) {
    showToast('No teams selected', 'warning');
    return;
  }
  openBulkActionModal('team', 'activate', ids);
}

function bulkDeactivateTeams() {
  const ids = getSelectedIds('team');
  if (ids.length === 0) {
    showToast('No teams selected', 'warning');
    return;
  }
  openBulkActionModal('team', 'deactivate', ids);
}

function bulkDeleteTeams() {
  const ids = getSelectedIds('team');
  if (ids.length === 0) {
    showToast('No teams selected', 'warning');
    return;
  }
  openBulkActionModal('team', 'delete', ids);
}

// Valuation bulk actions
function bulkCompleteValuations() {
  const ids = getSelectedIds('valuation');
  if (ids.length === 0) {
    showToast('No valuations selected', 'warning');
    return;
  }
  openBulkActionModal('valuation', 'complete', ids);
}

function bulkArchiveValuations() {
  const ids = getSelectedIds('valuation');
  if (ids.length === 0) {
    showToast('No valuations selected', 'warning');
    return;
  }
  openBulkActionModal('valuation', 'archive', ids);
}

function bulkDeleteValuations() {
  const ids = getSelectedIds('valuation');
  if (ids.length === 0) {
    showToast('No valuations selected', 'warning');
    return;
  }
  openBulkActionModal('valuation', 'delete', ids);
}

// Votes bulk actions
function bulkDeleteVotes() {
  const ids = getSelectedIds('votes');
  if (ids.length === 0) {
    showToast('No votes selected', 'warning');
    return;
  }
  openBulkActionModal('votes', 'delete', ids);
}

// Help center bulk actions
function bulkPublishArticles() {
  const ids = getSelectedIds('help-center');
  if (ids.length === 0) {
    showToast('No articles selected', 'warning');
    return;
  }
  openBulkActionModal('help-center', 'publish', ids);
}

function bulkArchiveArticles() {
  const ids = getSelectedIds('help-center');
  if (ids.length === 0) {
    showToast('No articles selected', 'warning');
    return;
  }
  openBulkActionModal('help-center', 'archive', ids);
}

function bulkDeleteArticles() {
  const ids = getSelectedIds('help-center');
  if (ids.length === 0) {
    showToast('No articles selected', 'warning');
    return;
  }
  openBulkActionModal('help-center', 'delete', ids);
}

// Messages bulk actions
function bulkMarkAsRead() {
  const ids = getSelectedIds('messages');
  if (ids.length === 0) {
    showToast('No messages selected', 'warning');
    return;
  }
  openBulkActionModal('messages', 'markAsRead', ids);
}

function bulkDeleteMessages() {
  const ids = getSelectedIds('messages');
  if (ids.length === 0) {
    showToast('No messages selected', 'warning');
    return;
  }
  openBulkActionModal('messages', 'delete', ids);
}

// Generic table refresh
function refreshTable(tableName) {
  const url = new URL(window.location);
  htmx.ajax('GET', url.pathname + url.search, {
    target: `#${tableName}TableContainer`,
  });
  // Also refresh filter nav
  htmx.ajax('GET', url.pathname + '/filter-nav' + url.search, {
    target: '#filter-links',
  });
}

// Generic action menu toggle
function toggleActionMenu(button) {
  const entity = button.getAttribute('data-entity');
  const id = button.getAttribute('data-id');

  if (!entity || !id) {
    console.error('Button missing data-entity or data-id attributes');
    return;
  }

  const menu = document.getElementById(`actionMenu-${entity}-${id}`);

  if (!menu) {
    console.error(`Dropdown not found: actionMenu-${entity}-${id}`);
    return;
  }

  const allMenus = document.querySelectorAll('[id^="actionMenu-"]');

  // Close all other menus
  allMenus.forEach((m) => {
    if (m !== menu) {
      m.style.display = 'none';
    }
  });

  // Toggle current menu
  if (menu.style.display === 'none' || menu.style.display === '') {
    // Position the menu next to the button first
    const rect = button.getBoundingClientRect();

    // Set position and make visible temporarily to get dimensions
    menu.style.position = 'fixed';
    menu.style.zIndex = '9999';
    menu.style.display = 'block';
    menu.style.visibility = 'hidden';
    menu.style.top = '0px';
    menu.style.left = '0px';

    // Get dimensions after it's in the DOM
    const menuWidth = menu.offsetWidth;
    const menuHeight = menu.offsetHeight;

    // Calculate position: prefer below and to the right of button
    let top = rect.bottom + window.scrollY + 5;
    let left = rect.right + window.scrollX - menuWidth;

    // If it would go off-screen to the left, position to the right of button
    if (left < 0) {
      left = rect.right + window.scrollX;
    }

    // If it would go off-screen to the bottom, position above button
    if (top + menuHeight > window.scrollY + window.innerHeight) {
      top = rect.top + window.scrollY - menuHeight - 5;
    }

    // If it would still go off-screen to the top, position below
    if (top < 0) {
      top = rect.bottom + window.scrollY + 5;
    }

    // Apply final position
    menu.style.top = `${top}px`;
    menu.style.left = `${left}px`;
    menu.style.visibility = 'visible';
  } else {
    menu.style.display = 'none';
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  // Handle modal close buttons
  document.querySelectorAll('[data-modal-close]').forEach((btn) => {
    btn.addEventListener('click', function () {
      const modal = this.closest('[data-modal-backdrop]');
      if (modal) {
        modal.classList.add('hidden');
        modal.style.display = '';
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  });

  // Generic event listeners for all tables
  Object.keys(tableConfigs).forEach((tableName) => {
    const container = document.getElementById(`${tableName}TableContainer`);
    if (container) {
      // Generic table refresh listeners
      container.addEventListener(`${tableName}Created`, () =>
        refreshTable(tableName)
      );
      container.addEventListener(`${tableName}Updated`, () =>
        refreshTable(tableName)
      );
      container.addEventListener(`${tableName}Deleted`, () =>
        refreshTable(tableName)
      );

      // Generic checkbox handling
      setupCheckboxSelection(tableName);
    }
  });
});

// Generic checkbox selection setup
function setupCheckboxSelection(tableName) {
  const selectAllCheckbox = document.getElementById(`selectAll-${tableName}`);
  const itemCheckboxes = document.querySelectorAll(`.${tableName}Checkbox`);

  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', function () {
      itemCheckboxes.forEach((cb) => (cb.checked = this.checked));
      updateBulkActionsVisibility(tableName);
    });
  }

  itemCheckboxes.forEach((cb) => {
    cb.addEventListener('change', () => updateBulkActionsVisibility(tableName));
  });
}

// Generic bulk actions visibility
function updateBulkActionsVisibility(tableName) {
  const checkedBoxes = document.querySelectorAll(
    `.${tableName}Checkbox:checked`
  );
  const bulkActions = document.getElementById(`bulkActions-${tableName}`);
  const selectedCount = document.getElementById(`selectedCount-${tableName}`);
  const config = tableConfigs[tableName];

  if (checkedBoxes.length > 0 && bulkActions) {
    bulkActions.style.display = 'flex';
    if (selectedCount) {
      selectedCount.textContent = `${checkedBoxes.length} ${config ? config.entityName : 'item'}${checkedBoxes.length > 1 ? 's' : ''} selected`;
    }
  } else if (bulkActions) {
    bulkActions.style.display = 'none';
  }
}

// Toast notification helper (assuming this exists elsewhere)
function showToast(message, type = 'info') {
  console.log(`${type.toUpperCase()}: ${message}`);
  // Implement actual toast notification here
}
