// Filter functionality for table pages
function updateFilterActiveState(tableName, activeStatus) {
  console.log(
    `Updating filter active state for ${tableName}: ${activeStatus || 'all'}`
  );

  // Reset all filter links to inactive state
  const allLinks = document.querySelectorAll('[id^="filter-link-"]');
  console.log(`Found ${allLinks.length} filter links to reset`);
  allLinks.forEach((link) => {
    console.log(`Resetting ${link.id}`);
    link.classList.remove('text-foreground', 'font-medium');
    link.classList.add('text-muted-foreground');

    // Update indicator (border div)
    const indicator = link.previousElementSibling;
    if (indicator) {
      indicator.classList.remove('opacity-100');
      indicator.classList.add('opacity-0', 'group-hover:opacity-100');
    }
  });

  // Set active state for the current filter
  const activeId = activeStatus
    ? `filter-link-${activeStatus}`
    : 'filter-link-all';
  console.log(`Setting active: ${activeId}`);
  const activeLink = document.getElementById(activeId);
  if (activeLink) {
    console.log(`Found active link: ${activeId}`);
    activeLink.classList.remove('text-muted-foreground');
    activeLink.classList.add('text-foreground', 'font-medium');

    // Update indicator for active link
    const indicator = activeLink.previousElementSibling;
    if (indicator) {
      indicator.classList.remove('opacity-0', 'group-hover:opacity-100');
      indicator.classList.add('opacity-100');
    }
  } else {
    console.log(`Active link not found: ${activeId}`);
  }
}

// Initialize filter state based on current URL (for page loads)
function initializeFilterState() {
  const currentUrl = new URL(window.location.href);
  const status = currentUrl.searchParams.get('status');

  // Find the table name from any filter button's data-table attribute
  const filterButton = document.querySelector('[id^="filter-link-"]');
  if (filterButton) {
    const tableName = filterButton.dataset.table;
    console.log(
      'Initializing filter state - table:',
      tableName,
      'status:',
      status || 'all'
    );
    updateFilterActiveState(tableName, status || '');
  }
}

// Listen for clicks on filter buttons and update state immediately and after HTMX completes
document.addEventListener('click', function (evt) {
  const target = evt.target;
  if (
    target.id &&
    target.id.startsWith('filter-link-') &&
    target.hasAttribute('hx-get')
  ) {
    console.log('Filter button clicked:', target.id);
    const tableName = target.dataset.table;
    const hxGet = target.getAttribute('hx-get');

    // Update immediately for instant feedback
    if (hxGet) {
      try {
        const url = new URL(hxGet, window.location.origin);
        const status = url.searchParams.get('status');
        console.log(
          'Updating filter state immediately - table:',
          tableName,
          'status:',
          status || 'all'
        );
        updateFilterActiveState(tableName, status || '');
      } catch (e) {
        console.error('Error parsing hx-get URL:', e);
        // Fallback: extract status from button id
        const buttonStatus = target.id.replace('filter-link-', '');
        const status = buttonStatus === 'all' ? '' : buttonStatus;
        console.log('Fallback: status from button id:', status);
        updateFilterActiveState(tableName, status);
      }
    }

    // Also update after a delay as backup in case HTMX changes something
    setTimeout(() => {
      if (hxGet) {
        try {
          const url = new URL(hxGet, window.location.origin);
          const status = url.searchParams.get('status');
          console.log(
            'Backup update - table:',
            tableName,
            'status:',
            status || 'all'
          );
          updateFilterActiveState(tableName, status || '');
        } catch (e) {
          const buttonStatus = target.id.replace('filter-link-', '');
          const status = buttonStatus === 'all' ? '' : buttonStatus;
          updateFilterActiveState(tableName, status);
        }
      }
    }, 300);
  }
});

// Settings filter functionality
function filterSettings(category) {
  const settingsSections = document.querySelectorAll(
    '.settings-section, .profile-settings-section'
  );

  settingsSections.forEach((section) => {
    const sectionCategories =
      section.getAttribute('data-category')?.split(',') || [];

    if (category === 'all' || sectionCategories.includes(category)) {
      section.style.display = 'block';
    } else {
      section.style.display = 'none';
    }
  });

  // Update URL without page reload
  const url = new URL(window.location);
  url.searchParams.set('category', category);
  window.history.pushState({}, '', url);
}

// Handle settings filter button clicks
document.addEventListener('click', function (evt) {
  const target = evt.target;
  if (target.classList.contains('settings-filter-btn')) {
    const category = target.getAttribute('data-category');
    filterSettings(category);
  }
});

// Initialize settings filter state on page load
function initializeSettingsFilterState() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category') || 'all';
  filterSettings(initialCategory);
}

// Handle browser back/forward navigation for settings
window.addEventListener('popstate', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category') || 'all';
  filterSettings(category);
});

// Filter navigation scrolling functionality
function initializeFilterScrolling() {
  // Initialize settings filter scrolling
  initializeScrollingForType('settings');

  // Initialize table filter scrolling
  initializeScrollingForType('table');
}

function initializeScrollingForType(type) {
  const scrollContainer = document.getElementById(
    `${type}-filter-scroll-container`
  );
  const scrollLeftBtn = document.getElementById(`${type}-filter-scroll-left`);
  const scrollRightBtn = document.getElementById(`${type}-filter-scroll-right`);

  if (!scrollContainer || !scrollLeftBtn || !scrollRightBtn) return;

  // Ensure scrollbars are hidden
  scrollContainer.style.msOverflowStyle = 'none';
  scrollContainer.style.scrollbarWidth = 'none';
  scrollContainer.style.overflowX = 'auto';

  // Scroll amount (width of one filter item + gap)
  const scrollAmount = 120;

  // Left scroll button
  scrollLeftBtn.addEventListener('click', function () {
    scrollContainer.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth',
    });
  });

  // Right scroll button
  scrollRightBtn.addEventListener('click', function () {
    scrollContainer.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  });

  // Touch/swipe support for mobile
  let startX = 0;
  let scrollLeft = 0;

  scrollContainer.addEventListener('touchstart', function (e) {
    startX = e.touches[0].pageX - scrollContainer.offsetLeft;
    scrollLeft = scrollContainer.scrollLeft;
  });

  scrollContainer.addEventListener('touchmove', function (e) {
    if (!startX) return;
    const x = e.touches[0].pageX - scrollContainer.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainer.scrollLeft = scrollLeft - walk;
  });

  scrollContainer.addEventListener('touchend', function () {
    startX = 0;
  });

  // Update arrow visibility based on scroll position
  function updateArrowVisibility() {
    const isAtStart = scrollContainer.scrollLeft <= 0;
    const isAtEnd =
      scrollContainer.scrollLeft >=
      scrollContainer.scrollWidth - scrollContainer.clientWidth - 1;

    scrollLeftBtn.style.opacity = isAtStart ? '0.3' : '1';
    scrollRightBtn.style.opacity = isAtEnd ? '0.3' : '1';
    scrollLeftBtn.disabled = isAtStart;
    scrollRightBtn.disabled = isAtEnd;
  }

  // Update arrows on scroll
  scrollContainer.addEventListener('scroll', updateArrowVisibility);

  // Initial arrow state
  updateArrowVisibility();

  // Update on window resize
  window.addEventListener('resize', updateArrowVisibility);
}

// Keyboard navigation for filter scrolling
function initializeKeyboardNavigation() {
  document.addEventListener('keydown', function (event) {
    // Only handle arrow keys when not in an input field
    if (
      event.target.tagName === 'INPUT' ||
      event.target.tagName === 'TEXTAREA' ||
      event.target.tagName === 'SELECT'
    ) {
      return;
    }

    const activeElement = document.activeElement;
    const isInFilterArea =
      activeElement &&
      (activeElement.closest('#settings-filter-scroll-container') ||
        activeElement.closest('#table-filter-scroll-container') ||
        activeElement.id.startsWith('settings-filter-scroll-') ||
        activeElement.id.startsWith('table-filter-scroll-') ||
        activeElement.classList.contains('settings-filter-btn') ||
        activeElement.id.startsWith('filter-link-'));

    if (!isInFilterArea) return;

    let scrollContainer, scrollLeftBtn, scrollRightBtn;

    if (
      activeElement.closest('#settings-filter-scroll-container') ||
      activeElement.id.startsWith('settings-filter-scroll-') ||
      activeElement.classList.contains('settings-filter-btn')
    ) {
      scrollContainer = document.getElementById(
        'settings-filter-scroll-container'
      );
      scrollLeftBtn = document.getElementById('settings-filter-scroll-left');
      scrollRightBtn = document.getElementById('settings-filter-scroll-right');
    } else if (
      activeElement.closest('#table-filter-scroll-container') ||
      activeElement.id.startsWith('table-filter-scroll-') ||
      activeElement.id.startsWith('filter-link-')
    ) {
      scrollContainer = document.getElementById(
        'table-filter-scroll-container'
      );
      scrollLeftBtn = document.getElementById('table-filter-scroll-left');
      scrollRightBtn = document.getElementById('table-filter-scroll-right');
    }

    if (!scrollContainer || !scrollLeftBtn || !scrollRightBtn) return;

    const scrollAmount = 120;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollContainer.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth',
      });
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollContainer.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  });
}

// Initialize filter functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  console.log('Filters.js loaded');
  initializeFilterState();
  initializeSettingsFilterState();
  initializeFilterScrolling();
  initializeKeyboardNavigation();
});
