// Navbar-specific theme toggle functionality that works with main.js theme system
document.addEventListener('DOMContentLoaded', () => {
  // Add event listener for the navbar theme toggle button that calls the main theme toggle
  const navbarThemeToggle = document.getElementById('navbar-theme-toggle');
  if (navbarThemeToggle) {
    navbarThemeToggle.addEventListener('click', function() {
      // Use the global toggleTheme function from main.js
      if (window.toggleTheme) {
        window.toggleTheme();
      } else {
        // Fallback if main.js isn't loaded - manually toggle theme
        const html = document.documentElement;
        const isDark = html.classList.contains('dark');
        const newTheme = isDark ? 'light' : 'dark';
        
        html.classList.remove('light', 'dark');
        html.classList.add(newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update navbar theme toggle icons
        updateNavbarThemeToggle();
      }
    });
  }
  
  // Initialize navbar theme toggle icons when page loads
  if (document.documentElement.classList.contains('dark')) {
    updateNavbarThemeToggle();
  }
});

// Function to update the navbar theme toggle icons based on current theme
function updateNavbarThemeToggle() {
    const themeToggle = document.getElementById('navbar-theme-toggle');
    if (!themeToggle) return;
    
    // Get the sun and moon icons
    const sunIcon = themeToggle.querySelector('.lucide-sun');
    const moonIcon = themeToggle.querySelector('.lucide-moon');
    
    if (!sunIcon || !moonIcon) return;
    
    const isCurrentlyDark = document.documentElement.classList.contains('dark');
    
    if (isCurrentlyDark) {
        // Show sun icon (for switching to light mode), hide moon
        sunIcon.classList.remove('hidden');
        sunIcon.classList.add('block');
        moonIcon.classList.remove('block');
        moonIcon.classList.add('hidden');
    } else {
        // Show moon icon (for switching to dark mode), hide sun
        moonIcon.classList.remove('hidden');
        moonIcon.classList.add('block');
        sunIcon.classList.remove('block');
        sunIcon.classList.add('hidden');
    }
}