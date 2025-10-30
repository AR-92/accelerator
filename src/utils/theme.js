// Theme management utility for dynamic theme switching
class ThemeManager {
  constructor() {
    this.currentTheme = this.getStoredTheme() || 'system';
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.setupThemeListeners();
  }

  getStoredTheme() {
    return localStorage.getItem('theme');
  }

  storeTheme(theme) {
    localStorage.setItem('theme', theme);
  }

  applyTheme(themeName) {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark', 'theme-green', 'theme-purple', 'theme-sunset');
    
    switch(themeName) {
      case 'light':
        root.classList.remove('dark');
        root.classList.add('light');
        break;
      case 'dark':
        root.classList.remove('light');
        root.classList.add('dark');
        break;
      case 'system':
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
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
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          root.classList.add('dark');
        } else {
          root.classList.add('light');
        }
    }
    
    this.currentTheme = themeName;
    this.storeTheme(themeName);
  }

  setupThemeListeners() {
    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (this.currentTheme === 'system') {
          this.applyTheme('system');
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
      { id: 'sunset', name: 'Sunset' }
    ];
  }

  getCurrentTheme() {
    return this.currentTheme;
  }

  toggleTheme() {
    const themes = this.getAvailableThemes();
    const currentIndex = themes.findIndex(theme => theme.id === this.currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    this.applyTheme(themes[nextIndex].id);
  }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.themeManager = new ThemeManager();
});

// Export for use in modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
}