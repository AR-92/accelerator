// Ideas table functionality - simplified for HTMX
console.log('ideas.js loaded');

// Bulk actions (still using modals)
let bulkActionType = null;
let bulkActionIds = [];

function openBulkActionModal(type, ids) {
  bulkActionType = type;
  bulkActionIds = ids;
  const titles = {
    approve: 'Approve Ideas',
    reject: 'Reject Ideas',
    delete: 'Delete Ideas',
  };
  const messages = {
    approve: `Are you sure you want to approve ${ids.length} idea(s)?`,
    reject: `Are you sure you want to reject ${ids.length} idea(s)?`,
    delete: `Are you sure you want to delete ${ids.length} idea(s)?`,
  };
  document.getElementById('bulkActionTitle').textContent = titles[type];
  document.getElementById('bulkActionMessage').textContent = messages[type];
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
}

function closeBulkActionModal() {
  const modal = document.getElementById('bulkActionModal');
  modal.classList.add('hidden');
  modal.style.display = '';
  modal.setAttribute('aria-hidden', 'true');
  bulkActionType = null;
  bulkActionIds = [];
}

function confirmBulkAction() {
  if (bulkActionType && bulkActionIds.length > 0) {
    let promises;
    if (bulkActionType === 'approve') {
      promises = bulkActionIds.map((id) =>
        fetch(`/api/ideas/${id}/approve`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    } else if (bulkActionType === 'reject') {
      promises = bulkActionIds.map((id) =>
        fetch(`/api/ideas/${id}/reject`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    } else if (bulkActionType === 'delete') {
      promises = bulkActionIds.map((id) =>
        fetch(`/api/ideas/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }

    Promise.all(promises)
      .then(() => {
        showToast(
          `${bulkActionIds.length} idea(s) ${bulkActionType}d successfully`,
          'success'
        );
        htmx.trigger('#ideasTableContainer', 'ideaUpdated');
        closeBulkActionModal();
      })
      .catch((error) => {
        console.error(`Error bulk ${bulkActionType}ing ideas:`, error);
        showToast(`Error ${bulkActionType}ing ideas`, 'error');
        closeBulkActionModal();
      });
  }
}

function cancelBulkAction() {
  closeBulkActionModal();
}

// Bulk actions
function bulkApproveIdeas() {
  const selectedIds = getSelectedIdeaIds();
  if (selectedIds.length === 0) {
    showToast('No ideas selected', 'warning');
    return;
  }
  openBulkActionModal('approve', selectedIds);
}

function bulkRejectIdeas() {
  const selectedIds = getSelectedIdeaIds();
  if (selectedIds.length === 0) {
    showToast('No ideas selected', 'warning');
    return;
  }
  openBulkActionModal('reject', selectedIds);
}

function bulkDeleteIdeas() {
  const selectedIds = getSelectedIdeaIds();
  if (selectedIds.length === 0) {
    showToast('No ideas selected', 'warning');
    return;
  }
  openBulkActionModal('delete', selectedIds);
}

function getSelectedIdeaIds() {
  const checkboxes = document.querySelectorAll('.ideaCheckbox:checked');
  return Array.from(checkboxes).map((cb) => parseInt(cb.value));
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
        // Reset bulk action modal
        if (modal.id === 'bulkActionModal') {
          bulkActionType = null;
          bulkActionIds = [];
        }
      }
    });
  });

  // Handle table refresh after idea creation, update, or deletion
  const ideasTableContainer = document.getElementById('ideasTableContainer');
  if (ideasTableContainer) {
    ideasTableContainer.addEventListener('ideaCreated', function () {
      const url = new URL(window.location);
      htmx.ajax('GET', url.pathname + url.search, {
        target: '#ideasTableContainer',
      });
      htmx.ajax('GET', url.pathname + '/filter-nav' + url.search, {
        target: '#filter-links',
      });
    });
    ideasTableContainer.addEventListener('ideaUpdated', function () {
      const url = new URL(window.location);
      htmx.ajax('GET', url.pathname + url.search, {
        target: '#ideasTableContainer',
      });
      htmx.ajax('GET', url.pathname + '/filter-nav' + url.search, {
        target: '#filter-links',
      });
    });
    ideasTableContainer.addEventListener('ideaDeleted', function () {
      const url = new URL(window.location);
      htmx.ajax('GET', url.pathname + url.search, {
        target: '#ideasTableContainer',
      });
      htmx.ajax('GET', url.pathname + '/filter-nav' + url.search, {
        target: '#filter-links',
      });
    });
  }

  // Handle checkbox selection for bulk actions
  const selectAllCheckbox = document.getElementById('selectAll-ideas');
  const itemCheckboxes = document.querySelectorAll('.ideaCheckbox');

  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', function () {
      itemCheckboxes.forEach((cb) => (cb.checked = this.checked));
      updateBulkActionsVisibility();
    });
  }

  itemCheckboxes.forEach((cb) => {
    cb.addEventListener('change', updateBulkActionsVisibility);
  });

  function updateBulkActionsVisibility() {
    const checkedBoxes = document.querySelectorAll('.ideaCheckbox:checked');
    const bulkActions = document.getElementById('bulkActions-ideas');
    const selectedCount = document.getElementById('selectedCount-ideas');

    if (checkedBoxes.length > 0) {
      bulkActions.style.display = 'flex';
      selectedCount.textContent = `${checkedBoxes.length} idea${checkedBoxes.length > 1 ? 's' : ''} selected`;
    } else {
      bulkActions.style.display = 'none';
    }
  }
});
