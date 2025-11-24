// Ideas table functionality
console.log('ideas.js loaded');
function openCreateIdeaModal() {
  const modal = document.getElementById('createIdeaModal');
  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');

  // Focus first input
  const firstInput = modal.querySelector('input');
  if (firstInput) firstInput.focus();
}

function closeCreateIdeaModal() {
  const modal = document.getElementById('createIdeaModal');
  modal.classList.add('hidden');
  modal.style.display = '';
  modal.setAttribute('aria-hidden', 'true');

  // Reset form
  const form = modal.querySelector('form');
  if (form) form.reset();
}



function openEditIdeaModal(id) {
  // Fetch idea data and populate edit modal
  fetch(`/api/ideas/${id}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const idea = data.data;
        document.getElementById('editIdeaId').value = idea.id;
        document.getElementById('editIdeaTitle').value = idea.title;
        document.getElementById('editIdeaDescription').value = idea.description || '';
        document.getElementById('editIdeaUserId').value = idea.user_id || '';
        document.getElementById('editIdeaType').value = idea.type || '';
        document.getElementById('editIdeaStatus').value = idea.status || 'active';



        const modal = document.getElementById('editIdeaModal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
      }
    })
    .catch(error => {
      console.error('Error fetching idea:', error);
      showToast('Error loading idea for editing', 'error');
    });
}

function closeEditIdeaModal() {
  const modal = document.getElementById('editIdeaModal');
  modal.classList.add('hidden');
  modal.style.display = '';
  modal.setAttribute('aria-hidden', 'true');

  // Reset form
  const form = modal.querySelector('form');
  if (form) form.reset();
}

let deleteIdeaId = null;
let deleteIdeaTitle = null;
let approveIdeaId = null;
let rejectIdeaId = null;
let bulkActionType = null;
let bulkActionIds = [];

function openDeleteIdeaModal(id, title) {
  deleteIdeaId = id;
  deleteIdeaTitle = title;
  const message = title ? `Are you sure you want to delete "${title}"?` : 'Are you sure you want to delete this idea?';
  document.getElementById('deleteIdeaMessage').textContent = message;

  const modal = document.getElementById('deleteIdeaModal');
  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
}

function closeDeleteIdeaModal() {
  const modal = document.getElementById('deleteIdeaModal');
  modal.classList.add('hidden');
  modal.style.display = '';
  modal.setAttribute('aria-hidden', 'true');
  deleteIdeaId = null;
  deleteIdeaTitle = null;
}

function confirmDeleteIdea() {
  if (deleteIdeaId) {
    fetch(`/api/ideas/${deleteIdeaId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'HX-Request': 'true'
      }
    })
    .then(response => response.text())
    .then(message => {
      // Remove the row immediately
      const row = document.getElementById(`idea-row-${deleteIdeaId}`);
      if (row) {
        row.remove();
      }
      // Show success toast
      showToast(message, 'success');
      closeDeleteIdeaModal();
    })
    .catch(error => {
      console.error('Error deleting idea:', error);
      showToast('Error deleting idea', 'error');
      closeDeleteIdeaModal();
    });
  }
}

function cancelDeleteIdea() {
  closeDeleteIdeaModal();
}



// Idea actions
function approveIdea(id) {
  console.log('approveIdea called with', id);
  approveIdeaId = id;
  openApproveIdeaModal();
}

function openApproveIdeaModal() {
  const modal = document.getElementById('approveIdeaModal');
  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
}

function closeApproveIdeaModal() {
  const modal = document.getElementById('approveIdeaModal');
  modal.classList.add('hidden');
  modal.style.display = '';
  modal.setAttribute('aria-hidden', 'true');
  approveIdeaId = null;
}

function confirmApproveIdea() {
  if (approveIdeaId) {
    fetch(`/api/ideas/${approveIdeaId}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'HX-Request': 'true'
      }
    })
    .then(response => response.text())
    .then(html => {
      // Show success message
      document.body.insertAdjacentHTML('beforeend', html);
      closeApproveIdeaModal();
    })
    .catch(error => {
      console.error('Error approving idea:', error);
      showToast('Error approving idea', 'error');
      closeApproveIdeaModal();
    });
  }
}

function cancelApproveIdea() {
  closeApproveIdeaModal();
}

function rejectIdea(id) {
  console.log('rejectIdea called with', id);
  rejectIdeaId = id;
  openRejectIdeaModal();
}

function openRejectIdeaModal() {
  const modal = document.getElementById('rejectIdeaModal');
  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
}

function closeRejectIdeaModal() {
  const modal = document.getElementById('rejectIdeaModal');
  modal.classList.add('hidden');
  modal.style.display = '';
  modal.setAttribute('aria-hidden', 'true');
  rejectIdeaId = null;
}

function confirmRejectIdea() {
  if (rejectIdeaId) {
    fetch(`/api/ideas/${rejectIdeaId}/reject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'HX-Request': 'true'
      }
    })
    .then(response => response.text())
    .then(html => {
      // Show success message
      document.body.insertAdjacentHTML('beforeend', html);
      closeRejectIdeaModal();
    })
    .catch(error => {
      console.error('Error rejecting idea:', error);
      showToast('Error rejecting idea', 'error');
      closeRejectIdeaModal();
    });
  }
}

function cancelRejectIdea() {
  closeRejectIdeaModal();
}

function openBulkActionModal(type, ids) {
  bulkActionType = type;
  bulkActionIds = ids;
  const titles = { approve: 'Approve Ideas', reject: 'Reject Ideas', delete: 'Delete Ideas' };
  const messages = {
    approve: `Are you sure you want to approve ${ids.length} idea(s)?`,
    reject: `Are you sure you want to reject ${ids.length} idea(s)?`,
    delete: `Are you sure you want to delete ${ids.length} idea(s)?`
  };
  document.getElementById('bulkActionTitle').textContent = titles[type];
  document.getElementById('bulkActionMessage').textContent = messages[type];
  const btn = document.getElementById('bulkActionConfirmBtn');
  btn.textContent = type.charAt(0).toUpperCase() + type.slice(1);
  if (type === 'delete') {
    btn.className = 'px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md';
  } else {
    btn.className = 'px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md';
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
      promises = bulkActionIds.map(id =>
        fetch(`/api/ideas/${id}/approve`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' }
        })
      );
    } else if (bulkActionType === 'reject') {
      promises = bulkActionIds.map(id =>
        fetch(`/api/ideas/${id}/reject`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' }
        })
      );
    } else if (bulkActionType === 'delete') {
      promises = bulkActionIds.map(id =>
        fetch(`/api/ideas/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        })
      );
    }

    Promise.all(promises)
    .then(() => {
      showToast(`${bulkActionIds.length} idea(s) ${bulkActionType}d successfully`, 'success');
      htmx.trigger('#ideasTableContainer', 'ideaUpdated');
      closeBulkActionModal();
    })
    .catch(error => {
      console.error(`Error bulk ${bulkActionType}ing ideas:`, error);
      showToast(`Error ${bulkActionType}ing ideas`, 'error');
      closeBulkActionModal();
    });
  }
}

function cancelBulkAction() {
  closeBulkActionModal();
}

function deleteIdea(id, title) {
  console.log('deleteIdea called with', id, title);
  openDeleteIdeaModal(id, title);
}

function editIdea(id) {
  openEditIdeaModal(id);
}

function voteIdea(id, voteType) {
  fetch(`/api/ideas/${id}/vote`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'HX-Request': 'true'
    },
    body: JSON.stringify({ voteType })
  })
  .then(response => response.text())
  .then(html => {
    // Show success message
    document.body.insertAdjacentHTML('beforeend', html);
  })
  .catch(error => {
    console.error('Error voting on idea:', error);
    showToast('Error recording vote', 'error');
  });
}

// Bulk actions
function bulkApproveIdeas() {
  console.log('bulkApproveIdeas called');
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
  return Array.from(checkboxes).map(cb => parseInt(cb.value));
}

// Toast notification helper
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 z-50 max-w-sm w-full rounded-lg border px-4 py-3 text-sm ${
    type === 'success' ? 'bg-green-50 text-green-800 border-green-200' :
    type === 'error' ? 'bg-red-50 text-red-800 border-red-200' :
    type === 'warning' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' :
    'bg-blue-50 text-blue-800 border-blue-200'
  }`;

  toast.innerHTML = `
    <div class="flex items-start gap-3">
      <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${
          type === 'success' ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' :
          type === 'error' ? 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' :
          type === 'warning' ? 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z' :
          'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        }"></path>
      </svg>
      <div class="flex-1">${message}</div>
    </div>
  `;

  document.body.appendChild(toast);
}



// Auto-remove toasts after 2 seconds
const toastObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1 && node.classList.contains('fixed')) {
        setTimeout(() => {
          if (node.parentNode) node.parentNode.removeChild(node);
        }, 2000);
      }
    });
  });
});
toastObserver.observe(document.body, { childList: true });

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Handle modal close buttons
  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', function() {
      const modal = this.closest('[data-modal-backdrop]');
      if (modal) {
        modal.classList.add('hidden');
        modal.style.display = '';
        modal.setAttribute('aria-hidden', 'true');
        // Reset modals
        if (modal.id === 'deleteIdeaModal') {
          deleteIdeaId = null;
          deleteIdeaTitle = null;
        } else if (modal.id === 'approveIdeaModal') {
          approveIdeaId = null;
        } else if (modal.id === 'rejectIdeaModal') {
          rejectIdeaId = null;
        } else if (modal.id === 'bulkActionModal') {
          bulkActionType = null;
          bulkActionIds = [];
        }
      }
    });
  });

  // Handle table refresh after idea creation, update, or deletion
  const ideasTableContainer = document.getElementById('ideasTableContainer');
  if (ideasTableContainer) {
    ideasTableContainer.addEventListener('ideaCreated', function() {
      const url = new URL(window.location);
      htmx.ajax('GET', url.pathname + url.search, {target: '#ideasTableContainer'});
      htmx.ajax('GET', url.pathname + '/filter-nav' + url.search, {target: '#filter-links'});
    });
    ideasTableContainer.addEventListener('ideaUpdated', function() {
      const url = new URL(window.location);
      htmx.ajax('GET', url.pathname + url.search, {target: '#ideasTableContainer'});
      htmx.ajax('GET', url.pathname + '/filter-nav' + url.search, {target: '#filter-links'});
    });
    ideasTableContainer.addEventListener('ideaDeleted', function() {
      const url = new URL(window.location);
      htmx.ajax('GET', url.pathname + url.search, {target: '#ideasTableContainer'});
    });
  }



  // Handle checkbox selection for bulk actions
  const selectAllCheckbox = document.getElementById('selectAll-ideas');
  const itemCheckboxes = document.querySelectorAll('.ideaCheckbox');

  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', function() {
      itemCheckboxes.forEach(cb => cb.checked = this.checked);
      updateBulkActionsVisibility();
    });
  }

  itemCheckboxes.forEach(cb => {
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