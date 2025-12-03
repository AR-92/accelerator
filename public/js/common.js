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

// Load credit balance in navigation
async function loadNavCreditBalance() {
  try {
    const response = await fetch('/api/credits/balance');
    const data = await response.json();

    if (data.success) {
      const balanceElement = document.getElementById('nav-credit-balance');
      if (balanceElement) {
        balanceElement.textContent = `${data.balance || 0} Credits`;
      }
    }
  } catch (error) {
    console.error('Error loading nav balance:', error);
  }
}

// Make functions globally available
window.initFilterNavScroll = initFilterNavScroll;
window.updateFilterNavActiveState = updateFilterNavActiveState;
window.loadNavCreditBalance = loadNavCreditBalance;

// Load credit balance on page load
document.addEventListener('DOMContentLoaded', function () {
  loadNavCreditBalance();
});
