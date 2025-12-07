// Common functions used across pages

// Filter nav scroll functionality
function initFilterNavScroll() {
  // Function to check and update chevron visibility
  function updateChevronVisibility(leftBtn, rightBtn, container) {
    if (!leftBtn || !rightBtn || !container) return;

    const hasOverflow = container.scrollWidth > container.clientWidth;
    const isAtStart = container.scrollLeft <= 0;
    const isAtEnd =
      container.scrollLeft >= container.scrollWidth - container.clientWidth - 1;

    leftBtn.style.display = hasOverflow && !isAtStart ? 'flex' : 'none';
    rightBtn.style.display = hasOverflow && !isAtEnd ? 'flex' : 'none';
  }

  // Settings filter scroll
  const settingsLeft = document.getElementById('settings-filter-scroll-left');
  const settingsRight = document.getElementById('settings-filter-scroll-right');
  const settingsContainer = document.getElementById(
    'settings-filter-scroll-container'
  );

  if (settingsLeft && settingsRight && settingsContainer) {
    settingsLeft.addEventListener('click', () => {
      settingsContainer.scrollBy({ left: -200, behavior: 'smooth' });
      setTimeout(
        () =>
          updateChevronVisibility(
            settingsLeft,
            settingsRight,
            settingsContainer
          ),
        300
      );
    });
    settingsRight.addEventListener('click', () => {
      settingsContainer.scrollBy({ left: 200, behavior: 'smooth' });
      setTimeout(
        () =>
          updateChevronVisibility(
            settingsLeft,
            settingsRight,
            settingsContainer
          ),
        300
      );
    });

    // Initial visibility check
    updateChevronVisibility(settingsLeft, settingsRight, settingsContainer);

    // Update on resize
    window.addEventListener('resize', () =>
      updateChevronVisibility(settingsLeft, settingsRight, settingsContainer)
    );
  }

  // Overview filter scroll
  const overviewLeft = document.getElementById('overview-filter-scroll-left');
  const overviewRight = document.getElementById('overview-filter-scroll-right');
  const overviewContainer = document.getElementById(
    'overview-filter-scroll-container'
  );

  if (overviewLeft && overviewRight && overviewContainer) {
    overviewLeft.addEventListener('click', () => {
      overviewContainer.scrollBy({ left: -200, behavior: 'smooth' });
      setTimeout(
        () =>
          updateChevronVisibility(
            overviewLeft,
            overviewRight,
            overviewContainer
          ),
        300
      );
    });
    overviewRight.addEventListener('click', () => {
      overviewContainer.scrollBy({ left: 200, behavior: 'smooth' });
      setTimeout(
        () =>
          updateChevronVisibility(
            overviewLeft,
            overviewRight,
            overviewContainer
          ),
        300
      );
    });

    // Initial visibility check
    updateChevronVisibility(overviewLeft, overviewRight, overviewContainer);

    // Update on resize
    window.addEventListener('resize', () =>
      updateChevronVisibility(overviewLeft, overviewRight, overviewContainer)
    );
  }
}

// Update filter nav active state
function updateFilterNavActiveState() {
  // Skip for dashboard pages as active state is set server-side
  if (window.location.pathname.startsWith('/dashboard')) {
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const filter = urlParams.get('filter') || 'all-projects';

  // Reset all filter links
  document.querySelectorAll('#filter-links a').forEach((link) => {
    link.classList.remove('text-foreground', 'font-medium');
    link.classList.add('text-muted-foreground');
    link.previousElementSibling.classList.remove('opacity-100');
    link.previousElementSibling.classList.add('opacity-0');
  });

  // Highlight active filter
  const activeLink = document.querySelector(
    `#filter-links a[href*="${filter}"]`
  );
  if (activeLink) {
    activeLink.classList.remove('text-muted-foreground');
    activeLink.classList.add('text-foreground', 'font-medium');
    activeLink.previousElementSibling.classList.remove('opacity-0');
    activeLink.previousElementSibling.classList.add('opacity-100');
  }
}

// Credit balance loaded server-side via HTMX

// Make functions globally available
window.initFilterNavScroll = initFilterNavScroll;
window.updateFilterNavActiveState = updateFilterNavActiveState;

// Plan details loaded server-side

// Toggle user menu dropdown
function toggleUserMenu() {
  const menu = document.getElementById('admin-user-dropdown');
  if (!menu) return;

  const isHidden = menu.classList.contains('hidden');
  if (isHidden) {
    menu.classList.remove('hidden');
    setTimeout(() => menu.classList.remove('opacity-0', 'invisible'), 10);
  } else {
    menu.classList.add('opacity-0', 'invisible');
    setTimeout(() => menu.classList.add('hidden'), 200);
  }
}

// Toggle grid menu dropdown
function toggleGridMenu() {
  const menu = document.getElementById('grid-dropdown');
  if (!menu) return;

  const isHidden = menu.classList.contains('hidden');
  if (isHidden) {
    menu.classList.remove('hidden');
    setTimeout(() => menu.classList.remove('opacity-0', 'invisible'), 10);
  } else {
    menu.classList.add('opacity-0', 'invisible');
    setTimeout(() => menu.classList.add('hidden'), 200);
  }
}

// Toggle action menu dropdown - consistent signature using button element
function toggleActionMenu(button) {
  const entity = button.getAttribute('data-entity');
  const id = button.getAttribute('data-id');

  if (!entity || !id || !button) {
    return;
  }

  const menu = document.getElementById(`actionMenu-${entity}-${id}`);
  if (!menu) {
    return;
  }

  // Close all other action menus
  document.querySelectorAll('[id^="actionMenu-"]').forEach((otherMenu) => {
    if (otherMenu !== menu && !otherMenu.classList.contains('hidden')) {
      otherMenu.classList.add('hidden');
    }
  });

  // Toggle current menu
  if (menu.classList.contains('hidden')) {
    menu.classList.remove('hidden');
  } else {
    menu.classList.add('hidden');
  }
}

// Toggle footer dropdown
function toggleFooterDropdown() {
  const menu = document.getElementById('footer-dropdown-menu');
  const isHidden = menu.classList.contains('hidden');
  if (isHidden) {
    menu.classList.remove('hidden');
    setTimeout(() => menu.classList.remove('opacity-0', 'invisible'), 10);
  } else {
    menu.classList.add('opacity-0', 'invisible');
    setTimeout(() => menu.classList.add('hidden'), 200);
  }
}

// Close dropdowns when clicking outside
document.addEventListener('click', function (event) {
  // Check if click is outside user menu
  if (!event.target.closest('#admin-user-menu')) {
    const userMenu = document.getElementById('admin-user-dropdown');
    if (userMenu && !userMenu.classList.contains('hidden')) {
      userMenu.classList.add('opacity-0', 'invisible');
      setTimeout(() => userMenu.classList.add('hidden'), 200);
    }
  }

  // Check if click is outside grid menu
  if (!event.target.closest('#grid-menu')) {
    const gridMenu = document.getElementById('grid-dropdown');
    if (gridMenu && !gridMenu.classList.contains('hidden')) {
      gridMenu.classList.add('opacity-0', 'invisible');
      setTimeout(() => gridMenu.classList.add('hidden'), 200);
    }
  }

  // Check if click is outside action menus
  if (
    !event.target.closest('[data-entity]') &&
    !event.target.closest('[id^="actionMenu-"]')
  ) {
    document.querySelectorAll('[id^="actionMenu-"]').forEach((menu) => {
      if (!menu.classList.contains('hidden')) {
        menu.classList.add('hidden');
      }
    });
  }

  // Check if click is outside footer dropdown
  if (
    !event.target.closest('#footer-dropdown-trigger') &&
    !event.target.closest('#footer-dropdown-menu')
  ) {
    const footerMenu = document.getElementById('footer-dropdown-menu');
    if (footerMenu && !footerMenu.classList.contains('hidden')) {
      footerMenu.classList.add('opacity-0', 'invisible');
      setTimeout(() => footerMenu.classList.add('hidden'), 200);
    }
  }
});

// Make functions globally available
window.initFilterNavScroll = initFilterNavScroll;
window.updateFilterNavActiveState = updateFilterNavActiveState;
window.toggleUserMenu = toggleUserMenu;
window.toggleGridMenu = toggleGridMenu;
window.toggleActionMenu = toggleActionMenu;
window.toggleFooterDropdown = toggleFooterDropdown;

// All data loaded server-side
