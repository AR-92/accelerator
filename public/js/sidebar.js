document.addEventListener('DOMContentLoaded', function() {
  // Load open states from localStorage
  const openMenus = JSON.parse(localStorage.getItem('sidebarOpenMenus') || '[]');
  openMenus.forEach(href => {
    const link = document.querySelector(`a[href="${href}"]`);
    if (link) {
      const menuItem = link.closest('[data-slot="collapsible"]');
      if (menuItem) {
        menuItem.setAttribute('data-state', 'open');
        const button = menuItem.querySelector('[data-slot="collapsible-trigger"]');
        if (button) {
          button.setAttribute('data-state', 'open');
          button.setAttribute('aria-expanded', 'true');
        }
        const content = menuItem.querySelector('[data-slot="collapsible-content"]');
        if (content) {
          content.setAttribute('data-state', 'open');
          content.removeAttribute('hidden');
        }
      }
    }
  });

  // Add event listeners to collapsible triggers
  document.querySelectorAll('[data-slot="collapsible-trigger"]').forEach(button => {
    button.addEventListener('click', function() {
      const menuItem = this.closest('[data-slot="collapsible"]');
      const link = menuItem ? menuItem.querySelector('a') : null;
      const href = link ? link.getAttribute('href') : null;
      const currentState = this.getAttribute('data-state');
      const newState = currentState === 'open' ? 'closed' : 'open';
      this.setAttribute('data-state', newState);
      this.setAttribute('aria-expanded', newState === 'open' ? 'true' : 'false');
      const content = menuItem ? menuItem.querySelector('[data-slot="collapsible-content"]') : null;
      if (content) {
        content.setAttribute('data-state', newState);
        if (newState === 'open') {
          content.removeAttribute('hidden');
        } else {
          content.setAttribute('hidden', '');
        }
      }
      // Update localStorage
      let storedOpenMenus = JSON.parse(localStorage.getItem('sidebarOpenMenus') || '[]');
      if (newState === 'open') {
        if (href && !storedOpenMenus.includes(href)) storedOpenMenus.push(href);
      } else {
        storedOpenMenus = storedOpenMenus.filter(menuHref => menuHref !== href);
      }
      localStorage.setItem('sidebarOpenMenus', JSON.stringify(storedOpenMenus));
    });
  });

  // Set active based on current path
  const currentPath = window.location.pathname;
  const currentHash = window.location.hash;
  document.querySelectorAll('[data-slot="sidebar-menu-button"], [data-slot="sidebar-menu-sub-button"]').forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      if (href.includes('#')) {
        // For hash links, check pathname + hash
        if (currentPath + currentHash === href) {
          link.setAttribute('data-active', 'true');
        }
      } else {
        // For page links, check pathname
        if (currentPath === href) {
          link.setAttribute('data-active', 'true');
        }
      }
    }
  });

  // Theme toggle functionality
  const themeToggle = document.getElementById('sidebar-theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function (e) {
      e.preventDefault();
      // Use the existing theme toggle function from main.js if available
      if (typeof window.toggleTheme === 'function') {
        window.toggleTheme();
      } else {
        // Fallback implementation if main.js is not loaded
        const html = document.documentElement;
        const isDark = html.classList.contains('dark');
        const newTheme = isDark ? 'light' : 'dark';

        html.classList.remove('light', 'dark');
        html.classList.add(newTheme);

        localStorage.setItem('theme', newTheme);

        // Update theme indicator
        updateSidebarThemeIndicator();
      }
    });
  }

  // Update theme indicator in sidebar
  function updateSidebarThemeIndicator() {
    const indicatorBall = document.getElementById('sidebar-theme-indicator-ball');
    if (indicatorBall) {
      const isDark = document.documentElement.classList.contains('dark');
      indicatorBall.style.transform = isDark ? 'translateX(16px)' : 'translateX(0px)';
    }
  }

  // Initialize theme indicator
  updateSidebarThemeIndicator();

  // Watch for theme changes
  const themeObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        updateSidebarThemeIndicator();
      }
    });
  });

  themeObserver.observe(document.documentElement, { attributes: true });

  // Sidebar collapse/expand functionality
  const sidebarCollapseToggle = document.getElementById('sidebar-collapse-toggle');
  const sidebar = document.querySelector('[data-sidebar="sidebar"]');
  const upgradeProElement = document.getElementById('upgrade-pro-component');

  // Function to update visibility of all collapsible elements based on sidebar state
  function updateCollapsibleElements() {
    const isCollapsed = sidebar.getAttribute('data-collapsible') === 'icon';

    // Update upgrade to pro visibility
    if (upgradeProElement) {
      if (isCollapsed) {
        upgradeProElement.classList.add('hidden');
      } else {
        upgradeProElement.classList.remove('hidden');
      }
    }

    // Update all text elements in sidebar
    const textElements = document.querySelectorAll(
      '[data-slot="sidebar-menu-button"] span:not(.sr-only), ' +
      '[data-slot="sidebar-menu-sub-button"] span:not(.sr-only), ' +
      '[data-sidebar="group-label"], ' +
      '[data-slot="card-title"], ' +
      '[data-slot="card-description"], ' +
      '[data-slot="avatar"] + div span, ' +
      '#sidebar-theme-toggle span'
    );

    textElements.forEach(element => {
      if (isCollapsed) {
        element.classList.add('hidden');
      } else {
        element.classList.remove('hidden');
      }
    });

    // Update collapsible content visibility
    const collapsibleContents = document.querySelectorAll('[data-slot="collapsible-content"]');
    collapsibleContents.forEach(content => {
      if (isCollapsed) {
        content.classList.add('hidden');
      } else {
        content.classList.remove('hidden');
      }
    });

    // Update dropdown menu trigger visibility (the ellipsis icons)
    const dropdownTriggers = document.querySelectorAll('[data-slot="dropdown-menu-trigger"]');
    dropdownTriggers.forEach(trigger => {
      if (isCollapsed) {
        trigger.classList.add('hidden');
      } else {
        trigger.classList.remove('hidden');
      }
    });

    // Update collapsible trigger visibility (the arrow/chevron icons)
    const collapsibleTriggers = document.querySelectorAll('[data-slot="collapsible-trigger"]');
    collapsibleTriggers.forEach(trigger => {
      if (isCollapsed) {
        trigger.classList.add('hidden');
      } else {
        trigger.classList.remove('hidden');
      }
    });

    // Update theme toggle visibility
    if (themeToggle) {
      if (isCollapsed) {
        themeToggle.classList.add('hidden');
      } else {
        themeToggle.classList.remove('hidden');
      }
    }

    // Update sidebar sections alignment when collapsed
    const headerSection = document.querySelector('[data-slot="sidebar-header"]');
    const contentSection = document.querySelector('[data-slot="sidebar-content"]');
    const footerSection = document.querySelector('[data-slot="sidebar-footer"]');

    [contentSection, footerSection].forEach(section => {
      if (section) {
        if (isCollapsed) {
          section.classList.add('items-center', 'justify-center');
          // Make sure padding is consistent
          section.classList.remove('px-2');
          section.classList.add('px-1');
        } else {
          section.classList.remove('items-center', 'justify-center');
          section.classList.remove('px-1');
          section.classList.add('px-2');
        }
      }
    });

    // Special handling for header section to maintain logo and toggle button alignment
    if (headerSection) {
      if (isCollapsed) {
        headerSection.classList.add('items-start');
        headerSection.classList.remove('p-2');
        headerSection.classList.add('p-1');
      } else {
        headerSection.classList.remove('items-start');
        headerSection.classList.remove('p-1');
        headerSection.classList.add('p-2');
      }
    }

    // Update logo and menu item sizes when collapsed
    const logoItems = document.querySelectorAll('[data-slot="sidebar-menu-item"] .bg-sidebar-primary');
    const menuButtons = document.querySelectorAll('[data-slot="sidebar-menu-button"]');

    logoItems.forEach(item => {
      if (isCollapsed) {
        item.classList.remove('size-8');
        item.classList.add('size-10');
      } else {
        item.classList.remove('size-10');
        item.classList.add('size-8');
      }
    });

    menuButtons.forEach(button => {
      if (isCollapsed) {
        // Update button sizing classes
        button.classList.remove('h-8', 'h-12');
        button.classList.add('h-12'); // Make all buttons taller for better click area
        // Update padding for better spacing
        button.classList.remove('p-2');
        button.classList.add('p-3');
      } else {
        // Restore original sizing
        button.classList.remove('h-12', 'p-3');
        button.classList.add('p-2');
        // Restore original heights based on the button type
        if (button.dataset.size === 'lg') {
          button.classList.add('h-12');
        } else if (button.dataset.size === 'default') {
          button.classList.add('h-8');
        } else if (button.dataset.size === 'sm') {
          button.classList.add('h-7');
        }
      }
    });

    // Update collapse toggle button alignment in collapsed state
    if (sidebarCollapseToggle) {
      if (isCollapsed) {
        // When collapsed, ensure the collapse button is properly positioned inside sidebar
        sidebarCollapseToggle.classList.remove('ml-auto');
        sidebarCollapseToggle.classList.add('self-center', 'justify-self-center');
      } else {
        // When expanded, restore original positioning (on the right)
        sidebarCollapseToggle.classList.remove('self-center', 'justify-self-center');
        sidebarCollapseToggle.classList.add('ml-auto');
      }
    }
  }

  if (sidebarCollapseToggle) {
    sidebarCollapseToggle.addEventListener('click', function (e) {
      e.preventDefault();
      const isCollapsed = sidebar.getAttribute('data-collapsible') === 'icon';

      if (isCollapsed) {
        // Expand sidebar
        sidebar.classList.remove('w-20');
        sidebar.classList.add('w-[250px]');
        sidebar.setAttribute('data-collapsible', 'sidebar');
        this.innerHTML = 
          '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-left-close stroke-muted-foreground">' +
          '<rect width="18" height="18" x="3" y="3" rx="2"></rect>' +
          '<path d="M9 3v18"></path>' +
          '<path d="m16 15-3-3 3-3"></path>' +
          '</svg>';
      } else {
        // Collapse sidebar
        sidebar.classList.remove('w-[250px]');
        sidebar.classList.add('w-20');
        sidebar.setAttribute('data-collapsible', 'icon');
        this.innerHTML = 
          '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-left-open stroke-muted-foreground">' +
          '<rect width="18" height="18" x="3" y="3" rx="2"></rect>' +
          '<path d="M9 3v18"></path>' +
          '<path d="m14 9 3 3-3 3"></path>' +
          '</svg>';
      }

      // Update all collapsible elements immediately
      updateCollapsibleElements();
    });
  }

  // Also watch for changes to the data-collapsible attribute in case they happen externally
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-collapsible') {
        updateCollapsibleElements();
      }
    });
  });

  if (sidebar) {
    observer.observe(sidebar, {
      attributes: true
    });
  }

  // Initialize visibility on load
  updateCollapsibleElements();

  // Consolidated dropdown handler function
  function handleDropdownClick(triggerElement) {
    const currentState = triggerElement.getAttribute('data-state') || 'closed';
    const newState = currentState === 'open' ? 'closed' : 'open';

    // Check if this is the user profile dropdown
    const isUserProfile = triggerElement.id === 'user-profile-dropdown' || triggerElement.id === 'navbar-user-profile-dropdown';

    if (newState === 'open') {
      // Close any existing dropdowns first
      closeDropdownMenu();

      if (isUserProfile) {
        // For user profile, create the user profile dropdown
        createUserProfileDropdown(triggerElement);
      } else {
        // For other dropdowns, get items based on context
        let items = [];
        const parentItem = triggerElement.closest('[data-sidebar="menu-item"]');

        if (parentItem) {
          const spanElement = parentItem.querySelector('span');
          const itemText = spanElement ? spanElement.textContent : '';
          if (itemText.includes('Pitch Deck')) {
            items = [
              { label: 'View Pitch Deck', action: () => console.log('View Pitch Deck') },
              { label: 'Edit Pitch Deck', action: () => console.log('Edit Pitch Deck') },
              { label: 'Share Pitch Deck', action: () => console.log('Share Pitch Deck') },
              { label: 'Download Pitch Deck', action: () => console.log('Download Pitch Deck') }
            ];
          } else if (itemText.includes('Business Plan')) {
            items = [
              { label: 'View Business Plan', action: () => console.log('View Business Plan') },
              { label: 'Edit Business Plan', action: () => console.log('Edit Business Plan') },
              { label: 'Share Business Plan', action: () => console.log('Share Business Plan') },
              { label: 'Export Business Plan', action: () => console.log('Export Business Plan') }
            ];
          } else if (itemText.includes('Valuation')) {
            items = [
              { label: 'View Valuation', action: () => console.log('View Valuation') },
              { label: 'Edit Valuation', action: () => console.log('Edit Valuation') },
              { label: 'Share Valuation', action: () => console.log('Share Valuation') },
              { label: 'Export Valuation', action: () => console.log('Export Valuation') }
            ];
          }
        }

        createDropdownMenu(items, triggerElement);
      }

      // Update the state and styling
      triggerElement.setAttribute('data-state', 'open');
      if (isUserProfile) {
        triggerElement.classList.add('data-[state=open]:bg-sidebar-accent', 'data-[state=open]:text-sidebar-accent-foreground');
      }
    } else {
      // Close dropdown for both user profile and other dropdowns
      closeDropdownMenu();
      triggerElement.setAttribute('data-state', 'closed');
      if (isUserProfile) {
        triggerElement.classList.remove('data-[state=open]:bg-sidebar-accent', 'data-[state=open]:text-sidebar-accent-foreground');
      }
    }
  }

  // Function to create user profile dropdown
  function createUserProfileDropdown(buttonElement) {
    // Create dropdown menu element
    const dropdownMenu = document.createElement('div');
    dropdownMenu.id = 'right-dropdown-menu';
    dropdownMenu.className = 'bg-popover text-popover-foreground border rounded-md shadow-lg py-1';
    dropdownMenu.setAttribute('data-state', 'open');
    dropdownMenu.setAttribute('role', 'menu');
    dropdownMenu.setAttribute('aria-orientation', 'vertical');
    dropdownMenu.setAttribute('data-slot', 'dropdown-menu-content');
    dropdownMenu.setAttribute('data-radix-menu-content', '');
    dropdownMenu.setAttribute('data-side', 'right');
    dropdownMenu.style.outline = 'none';
    dropdownMenu.style.pointerEvents = 'auto';
    dropdownMenu.style.minWidth = '300px';
    dropdownMenu.style.width = '300px';

    // Add the avatar section
    const labelDiv = document.createElement('div');
    labelDiv.setAttribute('data-slot', 'dropdown-menu-label');
    labelDiv.className = 'text-sm data-[inset]:pl-8 p-0 font-normal';

    const flexDiv = document.createElement('div');
    flexDiv.className = 'flex items-center gap-2 px-1 py-1.5 text-left text-sm';

    const avatarDiv = document.createElement('span');
    avatarDiv.setAttribute('data-slot', 'avatar');
    avatarDiv.className = 'relative flex size-8 shrink-0 overflow-hidden h-8 w-8 rounded-full bg-purple-500 dark:bg-purple-600 text-white items-center justify-center text-xs font-bold';
    avatarDiv.textContent = 'AI';

    const gridDiv = document.createElement('div');
    gridDiv.className = 'grid flex-1 text-left text-sm leading-tight';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'truncate font-medium';
    nameSpan.textContent = 'Admin';
    gridDiv.appendChild(nameSpan);

    const emailSpan = document.createElement('span');
    emailSpan.className = 'truncate text-xs';
    emailSpan.textContent = 'admin@example.com';
    gridDiv.appendChild(emailSpan);

    flexDiv.appendChild(avatarDiv);
    flexDiv.appendChild(gridDiv);
    labelDiv.appendChild(flexDiv);
    dropdownMenu.appendChild(labelDiv);

    // Add separator
    const separator1 = document.createElement('div');
    separator1.setAttribute('role', 'separator');
    separator1.setAttribute('aria-orientation', 'horizontal');
    separator1.setAttribute('data-slot', 'dropdown-menu-separator');
    separator1.className = 'bg-border -mx-1 my-1 h-px';
    dropdownMenu.appendChild(separator1);

    // Add Upgrade to Pro item
    const upgradeItem = document.createElement('div');
    upgradeItem.setAttribute('role', 'menuitem');
    upgradeItem.setAttribute('data-slot', 'dropdown-menu-item');
    upgradeItem.setAttribute('data-variant', 'default');
    upgradeItem.className = 'focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*="text-"])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4';
    upgradeItem.setAttribute('tabindex', '-1');
    upgradeItem.setAttribute('data-orientation', 'vertical');

    const upgradeIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    upgradeIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    upgradeIcon.setAttribute('width', '24');
    upgradeIcon.setAttribute('height', '24');
    upgradeIcon.setAttribute('viewBox', '0 0 24 24');
    upgradeIcon.setAttribute('fill', 'none');
    upgradeIcon.setAttribute('stroke', 'currentColor');
    upgradeIcon.setAttribute('stroke-width', '2');
    upgradeIcon.setAttribute('stroke-linecap', 'round');
    upgradeIcon.setAttribute('stroke-linejoin', 'round');
    upgradeIcon.className = 'lucide lucide-sparkles';

    const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path1.setAttribute('d', 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z');
    upgradeIcon.appendChild(path1);

    const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path2.setAttribute('d', 'M20 3v4');
    upgradeIcon.appendChild(path2);

    const path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path3.setAttribute('d', 'M4 17v2');
    upgradeIcon.appendChild(path3);

    const path4 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path4.setAttribute('d', 'M5 18H3');
    upgradeIcon.appendChild(path4);

    upgradeItem.appendChild(upgradeIcon);

    const upgradeText = document.createElement('span');
    upgradeText.textContent = 'Upgrade to Pro';
    upgradeItem.appendChild(upgradeText);

    upgradeItem.addEventListener('click', function () {
      console.log('Upgrade to Pro clicked');
      closeDropdownMenu();
    });

    dropdownMenu.appendChild(upgradeItem);

    // Add separator
    const separator2 = document.createElement('div');
    separator2.setAttribute('role', 'separator');
    separator2.setAttribute('aria-orientation', 'horizontal');
    separator2.setAttribute('data-slot', 'dropdown-menu-separator');
    separator2.className = 'bg-border -mx-1 my-1 h-px';
    dropdownMenu.appendChild(separator2);

    // Add account-related items
    const accountGroup = document.createElement('div');
    accountGroup.setAttribute('role', 'group');
    accountGroup.setAttribute('data-slot', 'dropdown-menu-group');

    // Account item
    const accountItem = document.createElement('div');
    accountItem.setAttribute('role', 'menuitem');
    accountItem.setAttribute('data-slot', 'dropdown-menu-item');
    accountItem.setAttribute('data-variant', 'default');
    accountItem.className = 'focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*="text-"])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4';
    accountItem.setAttribute('tabindex', '-1');
    accountItem.setAttribute('data-orientation', 'vertical');

    const accountIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    accountIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    accountIcon.setAttribute('width', '24');
    accountIcon.setAttribute('height', '24');
    accountIcon.setAttribute('viewBox', '0 0 24 24');
    accountIcon.setAttribute('fill', 'none');
    accountIcon.setAttribute('stroke', 'currentColor');
    accountIcon.setAttribute('stroke-width', '2');
    accountIcon.setAttribute('stroke-linecap', 'round');
    accountIcon.setAttribute('stroke-linejoin', 'round');
    accountIcon.className = 'lucide lucide-badge-check';

    const accountPath1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    accountPath1.setAttribute('d', 'M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z');
    accountIcon.appendChild(accountPath1);

    const accountPath2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    accountPath2.setAttribute('d', 'm9 12 2 2 4-4');
    accountIcon.appendChild(accountPath2);

    accountItem.appendChild(accountIcon);

    const accountText = document.createElement('span');
    accountText.textContent = 'Account';
    accountItem.appendChild(accountText);

    accountItem.addEventListener('click', function () {
      window.location.href = '/pages/settings/profile';
      closeDropdownMenu();
    });

    accountGroup.appendChild(accountItem);

    // Subscriptions item
    const subscriptionItem = document.createElement('div');
    subscriptionItem.setAttribute('role', 'menuitem');
    subscriptionItem.setAttribute('data-slot', 'dropdown-menu-item');
    subscriptionItem.setAttribute('data-variant', 'default');
    subscriptionItem.className = 'focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*="text-"])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4';
    subscriptionItem.setAttribute('tabindex', '-1');
    subscriptionItem.setAttribute('data-orientation', 'vertical');

    const subscriptionIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    subscriptionIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    subscriptionIcon.setAttribute('width', '24');
    subscriptionIcon.setAttribute('height', '24');
    subscriptionIcon.setAttribute('viewBox', '0 0 24 24');
    subscriptionIcon.setAttribute('fill', 'none');
    subscriptionIcon.setAttribute('stroke', 'currentColor');
    subscriptionIcon.setAttribute('stroke-width', '2');
    subscriptionIcon.setAttribute('stroke-linecap', 'round');
    subscriptionIcon.setAttribute('stroke-linejoin', 'round');
    subscriptionIcon.className = 'lucide lucide-credit-card';

    const subscriptionRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    subscriptionRect.setAttribute('width', '20');
    subscriptionRect.setAttribute('height', '14');
    subscriptionRect.setAttribute('x', '2');
    subscriptionRect.setAttribute('y', '5');
    subscriptionRect.setAttribute('rx', '2');
    subscriptionIcon.appendChild(subscriptionRect);

    const subscriptionLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    subscriptionLine.setAttribute('x1', '2');
    subscriptionLine.setAttribute('x2', '22');
    subscriptionLine.setAttribute('y1', '10');
    subscriptionLine.setAttribute('y2', '10');
    subscriptionIcon.appendChild(subscriptionLine);

    subscriptionItem.appendChild(subscriptionIcon);

    const subscriptionText = document.createElement('span');
    subscriptionText.textContent = 'Subscriptions';
    subscriptionItem.appendChild(subscriptionText);

    subscriptionItem.addEventListener('click', function () {
      window.location.href = '/pages/subscriptions';
      closeDropdownMenu();
    });

    accountGroup.appendChild(subscriptionItem);

    // Billing item
    const billingItem = document.createElement('div');
    billingItem.setAttribute('role', 'menuitem');
    billingItem.setAttribute('data-slot', 'dropdown-menu-item');
    billingItem.setAttribute('data-variant', 'default');
    billingItem.className = 'focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*="text-"])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4';
    billingItem.setAttribute('tabindex', '-1');
    billingItem.setAttribute('data-orientation', 'vertical');

    const billingIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    billingIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    billingIcon.setAttribute('width', '24');
    billingIcon.setAttribute('height', '24');
    billingIcon.setAttribute('viewBox', '0 0 24 24');
    billingIcon.setAttribute('fill', 'none');
    billingIcon.setAttribute('stroke', 'currentColor');
    billingIcon.setAttribute('stroke-width', '2');
    billingIcon.setAttribute('stroke-linecap', 'round');
    billingIcon.setAttribute('stroke-linejoin', 'round');
    billingIcon.className = 'lucide lucide-credit-card';

    billingItem.appendChild(billingIcon);

    const billingText = document.createElement('span');
    billingText.textContent = 'Billing';
    billingItem.appendChild(billingText);

    billingItem.addEventListener('click', function () {
      window.location.href = '/pages/settings/billing';
      closeDropdownMenu();
    });

    accountGroup.appendChild(billingItem);

    // Payment Methods item
    const paymentItem = document.createElement('div');
    paymentItem.setAttribute('role', 'menuitem');
    paymentItem.setAttribute('data-slot', 'dropdown-menu-item');
    paymentItem.setAttribute('data-variant', 'default');
    paymentItem.className = 'focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*="text-"])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4';
    paymentItem.setAttribute('tabindex', '-1');
    paymentItem.setAttribute('data-orientation', 'vertical');

    const paymentIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    paymentIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    paymentIcon.setAttribute('width', '24');
    paymentIcon.setAttribute('height', '24');
    paymentIcon.setAttribute('viewBox', '0 0 24 24');
    paymentIcon.setAttribute('fill', 'none');
    paymentIcon.setAttribute('stroke', 'currentColor');
    paymentIcon.setAttribute('stroke-width', '2');
    paymentIcon.setAttribute('stroke-linecap', 'round');
    paymentIcon.setAttribute('stroke-linejoin', 'round');
    paymentIcon.className = 'lucide lucide-credit-card';

    const paymentRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    paymentRect.setAttribute('width', '20');
    paymentRect.setAttribute('height', '14');
    paymentRect.setAttribute('x', '2');
    paymentRect.setAttribute('y', '5');
    paymentRect.setAttribute('rx', '2');
    paymentIcon.appendChild(paymentRect);

    const paymentLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    paymentLine.setAttribute('x1', '2');
    paymentLine.setAttribute('x2', '22');
    paymentLine.setAttribute('y1', '10');
    paymentLine.setAttribute('y2', '10');
    paymentIcon.appendChild(paymentLine);

    paymentItem.appendChild(paymentIcon);

    const paymentText = document.createElement('span');
    paymentText.textContent = 'Payment Methods';
    paymentItem.appendChild(paymentText);

    paymentItem.addEventListener('click', function () {
      window.location.href = '/pages/subscriptions/payment';
      closeDropdownMenu();
    });

    accountGroup.appendChild(paymentItem);

    // Votes Management item
    const votesItem = document.createElement('div');
    votesItem.setAttribute('role', 'menuitem');
    votesItem.setAttribute('data-slot', 'dropdown-menu-item');
    votesItem.setAttribute('data-variant', 'default');
    votesItem.className = 'focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*="text-"])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4';
    votesItem.setAttribute('tabindex', '-1');
    votesItem.setAttribute('data-orientation', 'vertical');

    const votesIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    votesIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    votesIcon.setAttribute('width', '24');
    votesIcon.setAttribute('height', '24');
    votesIcon.setAttribute('viewBox', '0 0 24 24');
    votesIcon.setAttribute('fill', 'none');
    votesIcon.setAttribute('stroke', 'currentColor');
    votesIcon.setAttribute('stroke-width', '2');
    votesIcon.setAttribute('stroke-linecap', 'round');
    votesIcon.setAttribute('stroke-linejoin', 'round');
    votesIcon.className = 'lucide lucide-vote';

    const votesPath1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    votesPath1.setAttribute('d', 'm9 12 2 2 4-4');
    votesIcon.appendChild(votesPath1);

    const votesPath2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    votesPath2.setAttribute('d', 'M5 8c0-2.5 2-2.5 2-5');
    votesIcon.appendChild(votesPath2);

    const votesPath3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    votesPath3.setAttribute('d', 'M19 8c0-2.5-2-2.5-2-5');
    votesIcon.appendChild(votesPath3);

    const votesPath4 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    votesPath4.setAttribute('d', 'M12 19c-4 0-7-1-7-1');
    votesIcon.appendChild(votesPath4);

    votesItem.appendChild(votesIcon);

    const votesText = document.createElement('span');
    votesText.textContent = 'Votes Management';
    votesItem.appendChild(votesText);

    votesItem.addEventListener('click', function () {
      window.location.href = '/pages/settings/votes';
      closeDropdownMenu();
    });

    accountGroup.appendChild(votesItem);

    // Voting Rewards item
    const rewardsItem = document.createElement('div');
    rewardsItem.setAttribute('role', 'menuitem');
    rewardsItem.setAttribute('data-slot', 'dropdown-menu-item');
    rewardsItem.setAttribute('data-variant', 'default');
    rewardsItem.className = 'focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*="text-"])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4';
    rewardsItem.setAttribute('tabindex', '-1');
    rewardsItem.setAttribute('data-orientation', 'vertical');

    const rewardsIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    rewardsIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    rewardsIcon.setAttribute('width', '24');
    rewardsIcon.setAttribute('height', '24');
    rewardsIcon.setAttribute('viewBox', '0 0 24 24');
    rewardsIcon.setAttribute('fill', 'none');
    rewardsIcon.setAttribute('stroke', 'currentColor');
    rewardsIcon.setAttribute('stroke-width', '2');
    rewardsIcon.setAttribute('stroke-linecap', 'round');
    rewardsIcon.setAttribute('stroke-linejoin', 'round');
    rewardsIcon.className = 'lucide lucide-hand-coins';

    const rewardsPath1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    rewardsPath1.setAttribute('d', 'M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17');
    rewardsIcon.appendChild(rewardsPath1);

    const rewardsPath2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    rewardsPath2.setAttribute('d', 'M16 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L8 17');
    rewardsIcon.appendChild(rewardsPath2);

    const rewardsPath3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    rewardsPath3.setAttribute('d', 'M9 9h.01');
    rewardsIcon.appendChild(rewardsPath3);

    const rewardsPath4 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    rewardsPath4.setAttribute('d', 'M15 9h.01');
    rewardsIcon.appendChild(rewardsPath4);

    const rewardsPath5 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    rewardsPath5.setAttribute('d', 'M21 15a2 2 0 0 1-2 2h-1a1 1 0 0 0 0 2h1a2 2 0 0 1 2-2');
    rewardsIcon.appendChild(rewardsPath5);

    const rewardsPath6 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    rewardsPath6.setAttribute('d', 'M21 9a2 2 0 0 1-2-2h-1a1 1 0 0 0 0-2h1a2 2 0 0 1 2 2');
    rewardsIcon.appendChild(rewardsPath6);

    rewardsItem.appendChild(rewardsIcon);

    const rewardsText = document.createElement('span');
    rewardsText.textContent = 'Voting Rewards';
    rewardsItem.appendChild(rewardsText);

    rewardsItem.addEventListener('click', function () {
      window.location.href = '/pages/settings/rewards';
      closeDropdownMenu();
    });

    accountGroup.appendChild(rewardsItem);

    // Password Settings item
    const passwordItem = document.createElement('div');
    passwordItem.setAttribute('role', 'menuitem');
    passwordItem.setAttribute('data-slot', 'dropdown-menu-item');
    passwordItem.setAttribute('data-variant', 'default');
    passwordItem.className = 'focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*="text-"])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4';
    passwordItem.setAttribute('tabindex', '-1');
    passwordItem.setAttribute('data-orientation', 'vertical');

    const passwordIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    passwordIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    passwordIcon.setAttribute('width', '24');
    passwordIcon.setAttribute('height', '24');
    passwordIcon.setAttribute('viewBox', '0 0 24 24');
    passwordIcon.setAttribute('fill', 'none');
    passwordIcon.setAttribute('stroke', 'currentColor');
    passwordIcon.setAttribute('stroke-width', '2');
    passwordIcon.setAttribute('stroke-linecap', 'round');
    passwordIcon.setAttribute('stroke-linejoin', 'round');
    passwordIcon.className = 'lucide lucide-lock';

    const lockRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    lockRect.setAttribute('width', '18');
    lockRect.setAttribute('height', '11');
    lockRect.setAttribute('x', '3');
    lockRect.setAttribute('y', '11');
    lockRect.setAttribute('rx', '2');
    lockRect.setAttribute('ry', '2');
    passwordIcon.appendChild(lockRect);

    const lockPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    lockPath.setAttribute('d', 'M7 11V7a5 5 0 0 1 10 0v4');
    passwordIcon.appendChild(lockPath);

    passwordItem.appendChild(passwordIcon);

    const passwordText = document.createElement('span');
    passwordText.textContent = 'Password Settings';
    passwordItem.appendChild(passwordText);

    passwordItem.addEventListener('click', function () {
      window.location.href = '/pages/settings/password';
      closeDropdownMenu();
    });

    accountGroup.appendChild(passwordItem);

    // Notifications item
    const notificationsItem = document.createElement('div');
    notificationsItem.setAttribute('role', 'menuitem');
    notificationsItem.setAttribute('data-slot', 'dropdown-menu-item');
    notificationsItem.setAttribute('data-variant', 'default');
    notificationsItem.className = 'focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*="text-"])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4';
    notificationsItem.setAttribute('tabindex', '-1');
    notificationsItem.setAttribute('data-orientation', 'vertical');

    const notificationsIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    notificationsIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    notificationsIcon.setAttribute('width', '24');
    notificationsIcon.setAttribute('height', '24');
    notificationsIcon.setAttribute('viewBox', '0 0 24 24');
    notificationsIcon.setAttribute('fill', 'none');
    notificationsIcon.setAttribute('stroke', 'currentColor');
    notificationsIcon.setAttribute('stroke-width', '2');
    notificationsIcon.setAttribute('stroke-linecap', 'round');
    notificationsIcon.setAttribute('stroke-linejoin', 'round');
    notificationsIcon.className = 'lucide lucide-bell';

    const bellPath1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    bellPath1.setAttribute('d', 'M10.268 21a2 2 0 0 0 3.464 0');
    notificationsIcon.appendChild(bellPath1);

    const bellPath2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    bellPath2.setAttribute('d', 'M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326');
    notificationsIcon.appendChild(bellPath2);

    notificationsItem.appendChild(notificationsIcon);

    const notificationsText = document.createElement('span');
    notificationsText.textContent = 'Notifications';
    notificationsItem.appendChild(notificationsText);

    notificationsItem.addEventListener('click', function () {
      window.location.href = '/pages/settings/profile';
      closeDropdownMenu();
    });

    accountGroup.appendChild(notificationsItem);

    dropdownMenu.appendChild(accountGroup);

    // Add separator
    const separator3 = document.createElement('div');
    separator3.setAttribute('role', 'separator');
    separator3.setAttribute('aria-orientation', 'horizontal');
    separator3.setAttribute('data-slot', 'dropdown-menu-separator');
    separator3.className = 'bg-border -mx-1 my-1 h-px';
    dropdownMenu.appendChild(separator3);

    // Log out item
    const logoutItem = document.createElement('div');
    logoutItem.setAttribute('role', 'menuitem');
    logoutItem.setAttribute('data-slot', 'dropdown-menu-item');
    logoutItem.setAttribute('data-variant', 'default');
    logoutItem.className = 'focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*="text-"])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4';
    logoutItem.setAttribute('tabindex', '-1');
    logoutItem.setAttribute('data-orientation', 'vertical');

    const logoutIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    logoutIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    logoutIcon.setAttribute('width', '24');
    logoutIcon.setAttribute('height', '24');
    logoutIcon.setAttribute('viewBox', '0 0 24 24');
    logoutIcon.setAttribute('fill', 'none');
    logoutIcon.setAttribute('stroke', 'currentColor');
    logoutIcon.setAttribute('stroke-width', '2');
    logoutIcon.setAttribute('stroke-linecap', 'round');
    logoutIcon.setAttribute('stroke-linejoin', 'round');
    logoutIcon.className = 'lucide lucide-log-out';

    const logoutPath1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    logoutPath1.setAttribute('d', 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4');
    logoutIcon.appendChild(logoutPath1);

    const logoutPolyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    logoutPolyline.setAttribute('points', '16 17 21 12 16 7');
    logoutIcon.appendChild(logoutPolyline);

    const logoutLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    logoutLine.setAttribute('x1', '21');
    logoutLine.setAttribute('x2', '9');
    logoutLine.setAttribute('y1', '12');
    logoutLine.setAttribute('y2', '12');
    logoutIcon.appendChild(logoutLine);

    logoutItem.appendChild(logoutIcon);

    const logoutText = document.createElement('span');
    logoutText.textContent = 'Log out';
    logoutItem.appendChild(logoutText);

    logoutItem.addEventListener('click', function () {
      console.log('Signing out...');
      // POST to logout endpoint
      fetch('/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        if (response.ok) {
          window.location.href = '/auth';
        } else {
          console.error('Logout failed');
        }
      })
      .catch(error => {
        console.error('Logout error:', error);
        // Fallback: redirect anyway
        window.location.href = '/auth';
      });
      closeDropdownMenu();
    });

    dropdownMenu.appendChild(logoutItem);

    // Add to document
    document.body.appendChild(dropdownMenu);

    // Position the dropdown
    dropdownMenu.style.position = 'fixed';
    const buttonRect = buttonElement.getBoundingClientRect();
    const menuRect = dropdownMenu.getBoundingClientRect();

    let topPos = buttonRect.top + (buttonRect.height / 2) - (menuRect.height / 2);
    let leftPos = buttonRect.right + 5;

    if (topPos + menuRect.height > window.innerHeight) {
      topPos = window.innerHeight - menuRect.height - 10;
    }
    if (topPos < 0) {
      topPos = 10;
    }
    if (leftPos + menuRect.width > window.innerWidth) {
      leftPos = buttonRect.left - menuRect.width - 5;
    }

    dropdownMenu.style.top = topPos + 'px';
    dropdownMenu.style.left = leftPos + 'px';

    // Close on outside click
    setTimeout(() => {
      document.addEventListener('click', handleOutsideClick);
    }, 10);
  }

  // Function to create dropdown menu for other items
  function createDropdownMenu(items, buttonElement) {
    const dropdownMenu = document.createElement('div');
    dropdownMenu.id = 'right-dropdown-menu';
    dropdownMenu.className = 'bg-popover text-popover-foreground border rounded-md shadow-lg py-1';
    dropdownMenu.setAttribute('data-state', 'open');
    dropdownMenu.setAttribute('role', 'menu');
    dropdownMenu.setAttribute('aria-orientation', 'vertical');
    dropdownMenu.setAttribute('data-slot', 'dropdown-menu-content');
    dropdownMenu.setAttribute('data-radix-menu-content', '');
    dropdownMenu.setAttribute('data-side', 'right');
    dropdownMenu.style.outline = 'none';
    dropdownMenu.style.pointerEvents = 'auto';
    dropdownMenu.style.minWidth = '200px';

    if (items && items.length > 0) {
      items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.setAttribute('role', 'menuitem');
        itemElement.setAttribute('data-slot', 'dropdown-menu-item');
        itemElement.setAttribute('data-variant', 'default');
        itemElement.className = 'focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*="text-"])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4';
        itemElement.setAttribute('tabindex', '-1');
        itemElement.setAttribute('data-orientation', 'vertical');

        const itemText = document.createElement('span');
        itemText.textContent = item.label;
        itemElement.appendChild(itemText);

        itemElement.addEventListener('click', function () {
          if (item.action) {
            item.action();
          }
          closeDropdownMenu();
        });

        dropdownMenu.appendChild(itemElement);
      });
    }

    document.body.appendChild(dropdownMenu);

    // Position
    dropdownMenu.style.position = 'fixed';
    const buttonRect = buttonElement.getBoundingClientRect();
    const menuRect = dropdownMenu.getBoundingClientRect();

    let topPos = buttonRect.top + (buttonRect.height / 2) - (menuRect.height / 2);
    let leftPos = buttonRect.right + 5;

    if (topPos + menuRect.height > window.innerHeight) {
      topPos = window.innerHeight - menuRect.height - 10;
    }
    if (topPos < 0) {
      topPos = 10;
    }
    if (leftPos + menuRect.width > window.innerWidth) {
      leftPos = buttonRect.left - menuRect.width - 5;
    }

    dropdownMenu.style.top = topPos + 'px';
    dropdownMenu.style.left = leftPos + 'px';

    setTimeout(() => {
      document.addEventListener('click', handleOutsideClick);
    }, 10);
  }

  // Function to close dropdown menu
  function closeDropdownMenu() {
    const dropdownMenu = document.getElementById('right-dropdown-menu');
    if (dropdownMenu) {
      dropdownMenu.remove();
    }
    const dropdownTrigger = document.querySelector('[data-slot="dropdown-menu-trigger"][data-state="open"]');
    if (dropdownTrigger) {
      dropdownTrigger.setAttribute('data-state', 'closed');
      dropdownTrigger.classList.remove('data-[state=open]:bg-sidebar-accent', 'data-[state=open]:text-sidebar-accent-foreground');
    }
    document.removeEventListener('click', handleOutsideClick);
  }

  // Handler for clicking outside dropdown
  function handleOutsideClick(event) {
    const dropdownMenu = document.getElementById('right-dropdown-menu');
    const dropdownTrigger = event.target.closest('[data-slot="dropdown-menu-trigger"]');

    if (dropdownMenu && !dropdownMenu.contains(event.target) && !dropdownTrigger) {
      closeDropdownMenu();
    }
  }

  // Handle all dropdown triggers
  document.addEventListener('click', function (e) {
    const dropdownTrigger = e.target.closest('[data-slot="dropdown-menu-trigger"]');
    if (dropdownTrigger) {
      e.preventDefault();
      handleDropdownClick(dropdownTrigger);
    }
  });
});