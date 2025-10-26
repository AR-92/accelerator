// Theme management functions
(function() {
    'use strict';
    
    // Check for saved theme preference or respect system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set the initial theme
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
    
    // Toggle theme function
    window.toggleTheme = function() {
        const html = document.documentElement;
        const isDark = html.classList.contains('dark');
        const newTheme = isDark ? 'light' : 'dark';
        
        html.classList.remove('light', 'dark');
        html.classList.add(newTheme);
        
        localStorage.setItem('theme', newTheme);
        
        // Update all theme toggle indicators
        updateAllThemeToggles();
    };
    
    // Update theme toggle indicator
    function updateThemeToggleIndicator() {
        const indicator = document.getElementById('theme-toggle-indicator');
        if (indicator) {
            const isDark = document.documentElement.classList.contains('dark');
            const position = isDark ? 'translateX(28px)' : 'translateX(0px)';
            indicator.style.transform = position;
        }
    }
    
    // Update all theme toggles (navigation and settings)
    function updateAllThemeToggles() {
        const isDark = document.documentElement.classList.contains('dark');
        
        // Update navigation toggle
        const navIndicator = document.getElementById('theme-toggle-indicator');
        if (navIndicator) {
            const position = isDark ? 'translateX(28px)' : 'translateX(0px)';
            navIndicator.style.transform = position;
        }
        
        // Update settings toggle
        const settingsToggle = document.getElementById('dark-mode-toggle');
        if (settingsToggle) {
            settingsToggle.checked = isDark;
        }
    }
    
    // Initialize theme toggle indicators when needed
    window.initializeThemeToggle = function() {
        const html = document.documentElement;
        const isDark = html.classList.contains('dark');
        
        // Update toggle in navigation
        updateThemeToggleIndicator();
    };
    
    // Initialize theme toggle when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        window.initializeThemeToggle();
        updateAllThemeToggles();
        
        // Add event listener for settings toggle
        const settingsToggle = document.getElementById('dark-mode-toggle');
        if (settingsToggle) {
            settingsToggle.addEventListener('change', function() {
                window.toggleTheme();
            });
        }
    });
    
    // Listen for changes to the class attribute to update toggle
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                window.initializeThemeToggle();
            }
        });
    });
    
    observer.observe(document.documentElement, { attributes: true });
})();

// Portfolio search and filter functionality
(function() {
    'use strict';
    
    function initializePortfolioSearch() {
        const searchInput = document.querySelector('input[placeholder="Search ideas..."]');
        const filterButton = document.querySelector('button[aria-label*="Filter"]');
        const ideasGrid = document.querySelector('.grid.grid-cols-1');
        
        if (!searchInput || !ideasGrid) return;
        
        let ideas = Array.from(ideasGrid.children);
        
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            ideas.forEach(idea => {
                const title = idea.querySelector('h3')?.textContent.toLowerCase() || '';
                const description = idea.querySelector('p')?.textContent.toLowerCase() || '';
                const category = idea.querySelector('.text-gray-600')?.textContent.toLowerCase() || '';
                
                if (title.includes(query) || description.includes(query) || category.includes(query)) {
                    idea.style.display = 'flex';
                } else {
                    idea.style.display = 'none';
                }
            });
        });
        
        // Simple filter toggle (placeholder for future implementation)
        if (filterButton) {
            filterButton.addEventListener('click', function() {
                // Placeholder: Could open a filter modal or toggle categories
                console.log('Filter button clicked');
            });
        }
    }
    
    document.addEventListener('DOMContentLoaded', initializePortfolioSearch);
})();

// Portfolio interactions
(function() {
    'use strict';
    
    function initializePortfolioInteractions() {
        const shareButtons = document.querySelectorAll('.share-btn');
        const visibilityButtons = document.querySelectorAll('.visibility-btn');
        
        shareButtons.forEach(button => {
            button.addEventListener('click', function() {
                const originalText = this.textContent;
                this.textContent = 'Shared!';
                this.disabled = true;
                setTimeout(() => {
                    this.textContent = originalText;
                    this.disabled = false;
                }, 2000);
            });
        });
        
        visibilityButtons.forEach(button => {
            button.addEventListener('click', function() {
                const span = this.querySelector('span');
                const isPublic = span.textContent === 'Public';
                span.textContent = isPublic ? 'Private' : 'Public';
                this.classList.toggle('bg-green-500/10');
                this.classList.toggle('text-green-600');
                this.classList.toggle('bg-red-500/10');
                this.classList.toggle('text-red-600');
            });
        });
    }
    
    document.addEventListener('DOMContentLoaded', initializePortfolioInteractions);
})();