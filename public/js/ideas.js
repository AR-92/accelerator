// Ideas table functionality
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
}

function toggleActionMenu(entity, id) {
  const menu = document.getElementById(`actionMenu-${entity}-${id}`);
  const allMenus = document.querySelectorAll('[id^="actionMenu-"]');

  // Close all other menus
  allMenus.forEach(m => {
    if (m.id !== `actionMenu-${entity}-${id}`) {
      m.classList.add('hidden');
    }
  });

  // Toggle current menu
  menu.classList.toggle('hidden');
}

// Close menus when clicking outside
document.addEventListener('click', function(e) {
  if (!e.target.closest('[id^="actionMenu-"]') && !e.target.closest('button[onclick*="toggleActionMenu"]')) {
    const allMenus = document.querySelectorAll('[id^="actionMenu-"]');
    allMenus.forEach(menu => menu.classList.add('hidden'));
  }
});

// Idea actions
function approveIdea(id) {
  if (confirm('Are you sure you want to approve this idea?')) {
    fetch(`/api/ideas/${id}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.text())
    .then(html => {
      // Show success message
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      document.body.appendChild(tempDiv);

      // Refresh table after delay
      setTimeout(() => {
        location.reload();
      }, 2000);
    })
    .catch(error => {
      console.error('Error approving idea:', error);
      showToast('Error approving idea', 'error');
    });
  }
}

function rejectIdea(id) {
  if (confirm('Are you sure you want to reject this idea?')) {
    fetch(`/api/ideas/${id}/reject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.text())
    .then(html => {
      // Show success message
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      document.body.appendChild(tempDiv);

      // Refresh table after delay
      setTimeout(() => {
        location.reload();
      }, 2000);
    })
    .catch(error => {
      console.error('Error rejecting idea:', error);
      showToast('Error rejecting idea', 'error');
    });
  }
}

function deleteIdea(id, title) {
  const confirmMessage = title ? `Are you sure you want to delete "${title}"?` : 'Are you sure you want to delete this idea?';
  if (confirm(confirmMessage)) {
    fetch(`/api/ideas/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.text())
    .then(html => {
      // Show success message
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      document.body.appendChild(tempDiv);

      // Refresh table after delay
      setTimeout(() => {
        location.reload();
      }, 2000);
    })
    .catch(error => {
      console.error('Error deleting idea:', error);
      showToast('Error deleting idea', 'error');
    });
  }
}

function editIdea(id) {
  openEditIdeaModal(id);
}

function voteIdea(id, voteType) {
  fetch(`/api/ideas/${id}/vote`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ voteType })
  })
  .then(response => response.text())
  .then(html => {
    // Show success message
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    document.body.appendChild(tempDiv);

    // Remove after timeout
    setTimeout(() => {
      if (tempDiv.parentNode) {
        tempDiv.parentNode.removeChild(tempDiv);
      }
    }, 3000);
  })
  .catch(error => {
    console.error('Error voting on idea:', error);
    showToast('Error recording vote', 'error');
  });
}

// Bulk actions
function bulkApproveIdeas() {
  const selectedIds = getSelectedIdeaIds();
  if (selectedIds.length === 0) {
    showToast('No ideas selected', 'warning');
    return;
  }

  if (confirm(`Are you sure you want to approve ${selectedIds.length} idea(s)?`)) {
    Promise.all(selectedIds.map(id =>
      fetch(`/api/ideas/${id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      })
    ))
    .then(() => {
      showToast(`${selectedIds.length} idea(s) approved successfully`, 'success');
      setTimeout(() => location.reload(), 2000);
    })
    .catch(error => {
      console.error('Error bulk approving ideas:', error);
      showToast('Error approving ideas', 'error');
    });
  }
}

function bulkRejectIdeas() {
  const selectedIds = getSelectedIdeaIds();
  if (selectedIds.length === 0) {
    showToast('No ideas selected', 'warning');
    return;
  }

  if (confirm(`Are you sure you want to reject ${selectedIds.length} idea(s)?`)) {
    Promise.all(selectedIds.map(id =>
      fetch(`/api/ideas/${id}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      })
    ))
    .then(() => {
      showToast(`${selectedIds.length} idea(s) rejected successfully`, 'success');
      setTimeout(() => location.reload(), 2000);
    })
    .catch(error => {
      console.error('Error bulk rejecting ideas:', error);
      showToast('Error rejecting ideas', 'error');
    });
  }
}

function bulkDeleteIdeas() {
  const selectedIds = getSelectedIdeaIds();
  if (selectedIds.length === 0) {
    showToast('No ideas selected', 'warning');
    return;
  }

  if (confirm(`Are you sure you want to delete ${selectedIds.length} idea(s)?`)) {
    Promise.all(selectedIds.map(id =>
      fetch(`/api/ideas/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
    ))
    .then(() => {
      showToast(`${selectedIds.length} idea(s) deleted successfully`, 'success');
      setTimeout(() => location.reload(), 2000);
    })
    .catch(error => {
      console.error('Error bulk deleting ideas:', error);
      showToast('Error deleting ideas', 'error');
    });
  }
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

  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 5000);
}

// Helper function for edit form URL
function getEditUrl() {
  const id = document.getElementById('editIdeaId').value;
  return `/api/ideas/${id}`;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
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