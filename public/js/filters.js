// Filter functionality for table pages
function updateFilterActiveState(tableName, activeStatus) {
  console.log(`Updating filter active state for ${tableName}: ${activeStatus || 'all'}`);

  // Reset all filter links to inactive state
  const allLinks = document.querySelectorAll('[id^="filter-link-"]');
  console.log(`Found ${allLinks.length} filter links to reset`);
  allLinks.forEach(link => {
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
  const activeId = activeStatus ? `filter-link-${activeStatus}` : 'filter-link-all';
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
    console.log('Initializing filter state - table:', tableName, 'status:', status || 'all');
    updateFilterActiveState(tableName, status || '');
  }
}

// Listen for clicks on filter buttons and update state immediately and after HTMX completes
document.addEventListener('click', function(evt) {
  const target = evt.target;
  if (target.id && target.id.startsWith('filter-link-') && target.hasAttribute('hx-get')) {
    console.log('Filter button clicked:', target.id);
    const tableName = target.dataset.table;
    const hxGet = target.getAttribute('hx-get');

    // Update immediately for instant feedback
    if (hxGet) {
      try {
        const url = new URL(hxGet, window.location.origin);
        const status = url.searchParams.get('status');
        console.log('Updating filter state immediately - table:', tableName, 'status:', status || 'all');
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
          console.log('Backup update - table:', tableName, 'status:', status || 'all');
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

// Initialize filter functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Filters.js loaded');
  initializeFilterState();
});