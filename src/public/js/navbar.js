// Navbar functionality for the testing layout

document.addEventListener('DOMContentLoaded', function() {
  // User profile dropdown functionality
  const dropdownButton = document.querySelector('#navbar-user-profile-dropdown button');
  const dropdownMenu = document.querySelector('#navbar-user-profile-dropdown .absolute');

  if (dropdownButton && dropdownMenu) {
    // Toggle dropdown visibility
    dropdownButton.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdownMenu.classList.toggle('hidden');
      dropdownMenu.classList.toggle('opacity-0');
      dropdownMenu.classList.toggle('invisible');
      
      // Rotate the chevron icon
      const chevron = this.querySelector('.lucide-chevron-down');
      if (chevron) {
        chevron.classList.toggle('rotate-180');
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      const isClickInside = dropdownButton.contains(e.target) || dropdownMenu.contains(e.target);
      if (!isClickInside) {
        dropdownMenu.classList.add('hidden');
        dropdownMenu.classList.add('opacity-0');
        dropdownMenu.classList.add('invisible');
        
        // Reset chevron rotation if needed
        const chevron = dropdownButton.querySelector('.lucide-chevron-down');
        if (chevron) {
          chevron.classList.remove('rotate-180');
        }
      }
    });
  }

  // Theme toggle functionality
  const themeToggle = document.getElementById('navbar-theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      document.documentElement.classList.toggle('dark');
      
      // Update system preference if supported
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // User prefers dark mode
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      }
    });
  }

  // Handle theme preference on page load
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
  }

  // Handle logout link click to submit a POST request
  const logoutLink = document.querySelector('a[href="/auth/logout"]');
  if (logoutLink) {
    logoutLink.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Create a temporary form and submit it
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = '/auth/logout';
      form.style.display = 'none';
      
      document.body.appendChild(form);
      form.submit();
    });
  }
});