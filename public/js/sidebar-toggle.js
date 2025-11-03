(function () {
  'use strict';

  console.log('sidebar toggle');

  let sidebarCollapsed = localStorage.getItem('sidebarHidden') === 'true';

  function setSidebarState(collapsed) {
    console.log('setSidebarState called with collapsed:', collapsed);
    sidebarCollapsed = collapsed;
    localStorage.setItem('sidebarHidden', collapsed);

    const sidebar = document.getElementById('sidebar');
    const sidebarShowToggle = document.getElementById('sidebar-show-toggle');
    const sidebarToggle = document.getElementById('sidebar-collapse-toggle');
    const navbarSidebarToggle = document.getElementById(
      'navbar-sidebar-toggle'
    );

    console.log('Elements found:', {
      sidebar: !!sidebar,
      sidebarShowToggle: !!sidebarShowToggle,
      sidebarToggle: !!sidebarToggle,
      navbarSidebarToggle: !!navbarSidebarToggle,
    });

    if (sidebar) {
      sidebar.classList.toggle('hidden', collapsed);
    }

    if (!collapsed) {
      const initialStyle = document.getElementById('sidebar-initial-hide');
      if (initialStyle) initialStyle.remove();
    }

    if (sidebarShowToggle) {
      sidebarShowToggle.classList.toggle('hidden', !collapsed);
    }

    if (sidebarToggle) {
      const icon = sidebarToggle.querySelector('svg');
      if (icon) icon.style.transform = collapsed ? 'rotate(180deg)' : '';
      sidebarToggle.setAttribute(
        'title',
        collapsed ? 'Show sidebar' : 'Hide sidebar'
      );
    }

    if (navbarSidebarToggle) {
      const icon = navbarSidebarToggle.querySelector('svg');
      if (icon) icon.style.transform = collapsed ? '' : 'rotate(180deg)';
      navbarSidebarToggle.setAttribute(
        'title',
        collapsed ? 'Show sidebar' : 'Hide sidebar'
      );
    }

    updateNavbarElements(collapsed);
  }

  function updateNavbarElements(collapsed) {
    const navbarLogo = document.querySelector('.navbar-logo-section');
    const navbarToggle = document.getElementById('navbar-sidebar-toggle');
    const navbarDivider = document.querySelector('.navbar-divider');

    if (navbarLogo) navbarLogo.classList.toggle('hidden', !collapsed);
    if (navbarToggle) navbarToggle.classList.toggle('hidden', !collapsed);
    if (navbarDivider) navbarDivider.classList.toggle('hidden', !collapsed);
  }

  function toggleSidebar() {
    console.log('toggleSidebar called');
    setSidebarState(!sidebarCollapsed);
  }

  function init() {
    if (window.sidebarToggleInitialized) return;
    window.sidebarToggleInitialized = true;

    // Apply initial state immediately to prevent flash
    if (sidebarCollapsed) {
      const style = document.createElement('style');
      style.id = 'sidebar-initial-hide';
      style.textContent =
        '#sidebar { display: none !important; } #sidebar-show-toggle { display: block !important; }';
      document.head.appendChild(style);
    }

    // Set initial state when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () =>
        setSidebarState(sidebarCollapsed)
      );
    } else {
      setSidebarState(sidebarCollapsed);
    }

    // Add event listeners to all toggle buttons
    const toggles = document.querySelectorAll(
      '#sidebar-collapse-toggle, #sidebar-show-toggle, #navbar-sidebar-toggle'
    );
    console.log('Toggles found:', toggles.length);
    toggles.forEach((toggle) => {
      console.log('Adding listener to:', toggle.id);
      if (!toggle.hasAttribute('data-sidebar-listener')) {
        toggle.addEventListener('click', (e) => {
          console.log('Click event on:', toggle.id);
          e.preventDefault();
          toggleSidebar();
        });
        toggle.setAttribute('data-sidebar-listener', 'true');
      }
    });
  }

  init();
})();
