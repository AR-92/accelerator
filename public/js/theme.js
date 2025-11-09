// Theme management utility for dynamic theme switching
class ThemeManager {
  constructor() {
    this.currentTheme = this.getStoredTheme() || 'system';
    this.init();
  }

  async init() {
    // Force light mode for auth pages
    if (this.isAuthPage()) {
      await this.applyTheme('light');
    } else {
      await this.applyTheme(this.currentTheme);
    }
    this.setupThemeListeners();
  }

  getStoredTheme() {
    // First try to get from session/user data, fallback to localStorage for backward compatibility
    if (window.userSettings && window.userSettings.theme) {
      return window.userSettings.theme;
    }
    return localStorage.getItem('theme') || 'system';
  }

  isAuthPage() {
    const path = window.location.pathname;
    return path.startsWith('/auth') || path === '/forgot-password';
  }

  async storeTheme(theme) {
    localStorage.setItem('theme', theme); // Keep for fallback

    // Try to save to database if user is logged in
    if (window.userSettings) {
      try {
        const response = await fetch('/api/settings/theme', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ theme }),
        });

        if (response.ok) {
          // Update the global user settings
          window.userSettings.theme = theme;
        }
      } catch (error) {
        console.warn('Failed to save theme to database:', error);
      }
    }
  }

  async applyTheme(themeName) {
    const root = document.documentElement;

    // Remove all theme classes
    root.classList.remove(
      'light',
      'dark',
      'theme-green',
      'theme-purple',
      'theme-sunset'
    );

    switch (themeName) {
      case 'light':
        root.classList.remove('dark');
        root.classList.add('light');
        break;
      case 'dark':
        root.classList.remove('light');
        root.classList.add('dark');
        break;
      case 'system':
        if (
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
        ) {
          root.classList.add('dark');
        } else {
          root.classList.add('light');
        }
        break;
      case 'green':
      case 'theme-green':
        root.classList.remove('light', 'dark');
        root.classList.add('theme-green');
        break;
      case 'purple':
      case 'theme-purple':
        root.classList.remove('light', 'dark');
        root.classList.add('theme-purple');
        break;
      case 'sunset':
      case 'theme-sunset':
        root.classList.remove('light', 'dark');
        root.classList.add('theme-sunset');
        break;
      default:
        // Default to system preference
        if (
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
        ) {
          root.classList.add('dark');
        } else {
          root.classList.add('light');
        }
    }

    this.currentTheme = themeName;
    await this.storeTheme(themeName);
  }

  setupThemeListeners() {
    // Listen for system theme changes
    if (window.matchMedia) {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', async () => {
          if (this.currentTheme === 'system') {
            await this.applyTheme('system');
          }
        });
    }
  }

  getAvailableThemes() {
    return [
      { id: 'system', name: 'System' },
      { id: 'light', name: 'Light' },
      { id: 'dark', name: 'Dark' },
      { id: 'green', name: 'Green' },
      { id: 'purple', name: 'Purple' },
      { id: 'sunset', name: 'Sunset' },
    ];
  }

  getCurrentTheme() {
    return this.currentTheme;
  }

  async toggleTheme() {
    const themes = this.getAvailableThemes();
    const currentIndex = themes.findIndex(
      (theme) => theme.id === this.currentTheme
    );
    const nextIndex = (currentIndex + 1) % themes.length;
    await this.applyTheme(themes[nextIndex].id);
  }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  window.themeManager = new ThemeManager();
  await window.themeManager.init();
});

// Export for use in modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
}
