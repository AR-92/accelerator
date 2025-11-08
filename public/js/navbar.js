(function () {
  'use strict';
  // Initialize navbar functionality when DOM is loaded
  document.addEventListener('DOMContentLoaded', function () {
    initializeThemeToggle();
    initializeNavbarDropdowns();
  });

  // Theme management functions specific to navbar
  function initializeThemeToggle() {
    const themeToggle = document.getElementById('navbar-theme-toggle');

    if (themeToggle) {
      // Check for saved theme preference or respect system preference
      const savedTheme = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;

      // Set the initial theme based on saved preference or system preference
      const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

      // Apply theme to document
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(initialTheme);

      // Add 'dark' class for Tailwind CSS
      if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Add click event listener to theme toggle button
      themeToggle.addEventListener('click', function () {
        toggleTheme();
      });
    }
  }

  function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';

    html.classList.remove('light', 'dark');
    html.classList.add(newTheme);

    localStorage.setItem('theme', newTheme);

    // Update all theme toggle indicators
    updateAllThemeToggles();
  }

  function updateAllThemeToggles() {
    // Update navbar theme toggle icon visibility
    const darkIcon = document.querySelector(
      '#navbar-theme-toggle .dark\\:block'
    );
    const lightIcon = document.querySelector(
      '#navbar-theme-toggle .dark\\:hidden'
    );

    if (darkIcon && lightIcon) {
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        darkIcon.classList.remove('hidden');
        lightIcon.classList.add('hidden');
      } else {
        darkIcon.classList.add('hidden');
        lightIcon.classList.remove('hidden');
      }
    }
  }

  function initializeNavbarDropdowns() {
    // Initialize user profile dropdown
    initializeDropdown('navbar-user-profile-dropdown');

    // Initialize grid dropdown
    initializeDropdown('navbar-grid-dropdown');
  }

  function initializeDropdown(dropdownId) {
    const dropdownContainer = document.getElementById(dropdownId);

    if (dropdownContainer) {
      // Get the dropdown button and menu
      const dropdownButton = dropdownContainer.querySelector('button');
      const dropdownMenu = dropdownContainer.querySelector('div.absolute');

      if (dropdownButton && dropdownMenu) {
        // Ensure the dropdown is initially closed
        closeDropdown(dropdownMenu, dropdownButton);

        // Close dropdown when clicking outside
        document.addEventListener('click', function (event) {
          if (!dropdownContainer.contains(event.target)) {
            closeDropdown(dropdownMenu, dropdownButton);
          }
        });

        // Toggle dropdown when clicking the button
        dropdownButton.addEventListener('click', function (ev) {
          ev.preventDefault();
          ev.stopPropagation();

          const isHidden = dropdownMenu.classList.contains('hidden');

          if (isHidden) {
            openDropdown(dropdownMenu, dropdownButton);
          } else {
            closeDropdown(dropdownMenu, dropdownButton);
          }
        });
      }
    }
  }

  function openDropdown(dropdownMenu, dropdownButton) {
    // Remove hidden classes
    dropdownMenu.classList.remove('hidden', 'opacity-0', 'invisible');
    // Add visible classes
    dropdownMenu.classList.add('opacity-100', 'visible');
    // Update aria attribute
    dropdownButton.setAttribute('aria-expanded', 'true');
  }

  function closeDropdown(dropdownMenu, dropdownButton) {
    // Add hidden classes
    dropdownMenu.classList.add('hidden', 'opacity-0', 'invisible');
    // Remove visible classes
    dropdownMenu.classList.remove('opacity-100', 'visible');
    // Update aria attribute
    dropdownButton.setAttribute('aria-expanded', 'false');
  }

  // Expose functions globally if needed
  window.AcceleratorNavbar = {
    initialize: initializeNavbarDropdowns,
  };
})();
