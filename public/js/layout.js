// Common layout functionality
// Theme management - now handled by HTMX and server-side storage
// updateThemeIcon() moved to hyperscript in layout files

// Sidebar management
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  const isCollapsed = sidebar.style.width === '66px';

  if (isCollapsed) {
    sidebar.style.width = '224px';
    document
      .querySelectorAll('.sidebar-text')
      .forEach((el) => (el.style.display = 'flex'));
    document.querySelectorAll('#sidebar nav a').forEach((link) => {
      link.classList.remove('px-1', 'justify-center');
      link.classList.add('px-3');
    });
    document.querySelectorAll('#sidebar nav svg').forEach((icon) => {
      icon.classList.add('mr-3');
    });
    const expandedFooter = document.getElementById('sidebar-footer-expanded');
    const expandedButton = document.getElementById(
      'sidebar-footer-expanded-button'
    );
    const collapsedFooter = document.getElementById('sidebar-footer-collapsed');
    if (expandedFooter) {
      expandedFooter.style.display = 'flex';
    }
    if (expandedButton) {
      expandedButton.style.display = 'block';
    }
    if (collapsedFooter) {
      collapsedFooter.style.display = 'none';
    }
  } else {
    sidebar.style.width = '66px';
    document
      .querySelectorAll('.sidebar-text')
      .forEach((el) => (el.style.display = 'none'));
    document.querySelectorAll('#sidebar nav a').forEach((link) => {
      link.classList.remove('px-3');
      link.classList.add('px-1', 'justify-center');
    });
    document.querySelectorAll('#sidebar nav svg').forEach((icon) => {
      icon.classList.remove('mr-3');
    });
    const expandedFooter = document.getElementById('sidebar-footer-expanded');
    const expandedButton = document.getElementById(
      'sidebar-footer-expanded-button'
    );
    const collapsedFooter = document.getElementById('sidebar-footer-collapsed');
    if (expandedFooter) expandedFooter.style.display = 'none';
    if (expandedButton) expandedButton.style.display = 'none';
    if (collapsedFooter) collapsedFooter.style.display = 'flex';
  }

  localStorage.setItem('sidebarCollapsed', !isCollapsed);
}

function initializeSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return; // Exit if sidebar doesn't exist

  const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';

  if (isCollapsed) {
    sidebar.style.width = '66px';
    document
      .querySelectorAll('.sidebar-text')
      .forEach((el) => (el.style.display = 'none'));
    document.querySelectorAll('#sidebar nav a').forEach((link) => {
      link.classList.remove('px-3');
      link.classList.add('px-1', 'justify-center');
    });
    document.querySelectorAll('#sidebar nav svg').forEach((icon) => {
      icon.classList.remove('mr-3');
    });
    const expandedFooter = document.getElementById('sidebar-footer-expanded');
    const expandedButton = document.getElementById(
      'sidebar-footer-expanded-button'
    );
    const collapsedFooter = document.getElementById('sidebar-footer-collapsed');
    if (expandedFooter) expandedFooter.style.display = 'none';
    if (expandedButton) expandedButton.style.display = 'none';
    if (collapsedFooter) collapsedFooter.style.display = 'flex';
  } else {
    sidebar.style.width = '224px';
    document
      .querySelectorAll('.sidebar-text')
      .forEach((el) => (el.style.display = 'flex'));
    const expandedFooter = document.getElementById('sidebar-footer-expanded');
    const expandedButton = document.getElementById(
      'sidebar-footer-expanded-button'
    );
    const collapsedFooter = document.getElementById('sidebar-footer-collapsed');
    if (expandedFooter) {
      expandedFooter.style.display = 'flex';
    }
    if (expandedButton) {
      expandedButton.style.display = 'block';
    }
    if (collapsedFooter) {
      collapsedFooter.style.display = 'none';
    }
  }
}

function toggleSidebarOrMobile() {
  if (window.innerWidth < 768) {
    toggleMobileSidebar();
  } else {
    toggleSidebar();
  }
}

function toggleMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('mobile-sidebar-overlay');

  if (!sidebar || !overlay) {
    console.error('Sidebar or overlay elements not found');
    return;
  }

  const isOpen =
    sidebar.classList.contains('translate-x-0') &&
    sidebar.classList.contains('opacity-100');

  if (isOpen) {
    closeMobileSidebar();
  } else {
    sidebar.classList.remove('opacity-0');
    sidebar.classList.add('opacity-100');
    sidebar.classList.remove('-translate-x-full');
    sidebar.classList.add('translate-x-0');
    sidebar.classList.remove('pointer-events-none');
    sidebar.classList.add('pointer-events-auto');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('mobile-sidebar-overlay');

  if (!sidebar || !overlay) {
    console.error('Sidebar or overlay elements not found');
    return;
  }

  sidebar.classList.remove('opacity-100');
  sidebar.classList.add('opacity-0');
  sidebar.classList.remove('translate-x-0');
  sidebar.classList.add('-translate-x-full');
  sidebar.classList.remove('pointer-events-auto');
  sidebar.classList.add('pointer-events-none');
  overlay.classList.add('hidden');
  document.body.style.overflow = '';
}

function highlightSidebarLink() {
  const currentPath = window.location.pathname;
  const sidebarLinks = document.querySelectorAll('#sidebar a');
  sidebarLinks.forEach((link) => {
    link.classList.remove('bg-accent', 'text-foreground', 'font-bold');
    link.classList.add('text-muted-foreground');
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('bg-accent', 'text-foreground', 'font-bold');
      link.classList.remove('text-muted-foreground');
    }
  });
}

function forceLogout() {
  if (typeof localStorage !== 'undefined') {
    const sidebarCollapsed = localStorage.getItem('sidebarCollapsed');
    localStorage.clear();
    if (sidebarCollapsed)
      localStorage.setItem('sidebarCollapsed', sidebarCollapsed);
  }
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.clear();
  }
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name] = cookie.trim().split('=');
    document.cookie = `${name}=; path=/; max-age=0`;
  }
  window.location.href = '/auth';
}

// Supabase client removed - using full server-side auth

// Layout initialization
document.addEventListener('DOMContentLoaded', () => {
  const authLoading = document.getElementById('auth-loading');
  const mainContent = document.getElementById('main-content');

  // Server-side auth handles authentication - just show content
  if (authLoading && mainContent) {
    authLoading.classList.add('hidden');
    mainContent.classList.remove('hidden');
  }

  initializeSidebar();
  highlightSidebarLink();
  initFilterNavScroll();
  updateFilterNavActiveState();
});

// Authentication handled server-side only

// Handle HTMX updates
document.addEventListener('htmx:afterSwap', () => {
  highlightSidebarLink();
  initFilterNavScroll();
  updateFilterNavActiveState();
});
