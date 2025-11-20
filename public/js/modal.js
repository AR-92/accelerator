// modal.js — tiny vanilla modal toggle + simple focus trap
(function () {
  function openModal(id) {
    const root = document.getElementById(id);
    if (!root) return;
    root.classList.remove('hidden');
    root.style.display = 'flex';
    root.setAttribute('aria-hidden', 'false');
    // move focus to first focusable element inside modal
    const focusable = root.querySelector('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();
  }

  function closeModal(root) {
    if (!root) return;
    root.classList.add('hidden');
    root.style.display = '';
    root.setAttribute('aria-hidden', 'true');
  }

  document.addEventListener('click', function (e) {
    // open triggers: data-modal-target
    const openTrigger = e.target.closest('[data-modal-target]');
    if (openTrigger) {
      e.preventDefault();
      const id = openTrigger.getAttribute('data-modal-target');
      if (id) openModal(id);
      return;
    }

    // close triggers
    const closeTrigger = e.target.closest('[data-modal-close]');
    if (closeTrigger) {
      const modal = closeTrigger.closest('[role="dialog"]');
      closeModal(modal);
      return;
    }

    // backdrop click
    if (e.target && e.target.hasAttribute('data-modal-backdrop')) {
      const modal = e.target.closest('[role="dialog"]');
      closeModal(modal);
    }
  });

  // ESC key closes topmost modal
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      const openModalEl = document.querySelector('[role="dialog"][aria-hidden="false"]');
      if (openModalEl) closeModal(openModalEl);
    }
  });
})();