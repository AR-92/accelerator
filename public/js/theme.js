// Theme toggle functionality
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.classList.contains('dark');
  const themeIcon = document.getElementById('theme-icon');

  if (isDark) {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    // Update icon to sun
    if (themeIcon) {
      themeIcon.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><circle cx="12" cy="12" r="4"/><path d="M12 4h.01"/><path d="M20 12h.01"/><path d="M12 20h.01"/><path d="M4 12h.01"/><path d="M17.657 6.343h.01"/><path d="M17.657 17.657h.01"/><path d="M6.343 17.657h.01"/><path d="M6.343 6.343h.01"/></svg>';
    }
  } else {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    // Update icon to moon
    if (themeIcon) {
      themeIcon.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>';
    }
  }
}

// Initialize theme on load
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  const themeIcon = document.getElementById('theme-icon');

  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
    // Set moon icon for dark theme
    if (themeIcon) {
      themeIcon.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>';
    }
  } else {
    document.documentElement.classList.remove('dark');
    // Set sun icon for light theme
    if (themeIcon) {
      themeIcon.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><circle cx="12" cy="12" r="4"/><path d="M12 4h.01"/><path d="M20 12h.01"/><path d="M12 20h.01"/><path d="M4 12h.01"/><path d="M17.657 6.343h.01"/><path d="M17.657 17.657h.01"/><path d="M6.343 17.657h.01"/><path d="M6.343 6.343h.01"/></svg>';
    }
  }
}

// Initialize theme when DOM is ready
document.addEventListener('DOMContentLoaded', initializeTheme);
