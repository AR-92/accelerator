const path = require('path');
const { engine } = require('express-handlebars');
const handlebars = require('handlebars');

// Register custom helpers
handlebars.registerHelper('ifeq', function(a, b, options) {
  if (a === b) {
    return options.fn(this);
  }
  return options.inverse(this);
});

handlebars.registerHelper('times', function(n, options) {
  let ret = '';
  for (let i = 0; i < n && i < 5; i++) {
    ret += options.fn(this);
  }
  return ret;
});

handlebars.registerHelper('timesDiff', function(max, n, options) {
  let ret = '';
  const count = Math.max(0, max - n);
  for (let i = 0; i < count; i++) {
    ret += options.fn(this);
  }
  return ret;
});

// Helper to filter items by group
handlebars.registerHelper('filterByGroup', function(items, group) {
  if (!items || !Array.isArray(items)) {
    return [];
  }
  return items.filter(item => item.group === group);
});

// Recursive helper for rendering sidebar items
handlebars.registerHelper('renderSidebarItem', function(item, currentPath) {
  let html = '';
  
  // Helper function to get icon class
  const getIconClass = (iconName) => {
    if (!iconName) return '';
    if (iconName === 'logo') return 'lucide lucide-layers';
    return `lucide lucide-${iconName}`;
  };

  if (item && item.id === 'logo') {
    // Handle logo item
    html += '<li data-slot="sidebar-menu-item" data-sidebar="menu-item" class="group/menu-item relative"><a href="' + (item.url || '#') + 
           '" data-slot="sidebar-menu-button" data-sidebar="menu-button" data-size="' + (item.size || 'lg') + '" data-active="' + (item.active || false) + 
           '" class="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! [&amp;gt;span:last-child]:truncate [&amp;gt;svg]:size-4 [&amp;gt;svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-12 text-sm group-data-[collapsible=icon]:p-0!">';
    html += '<div class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">';
    html += '<img src="/public/images/favicons/favcon.svg" alt="Logo" class="size-4">';
    html += '</div>';
    html += '<div class="grid flex-1 text-left text-sm leading-tight"><span class="truncate font-medium group-data-[collapsible=icon]:!hidden">' + (item.title || '') + 
           '</span><span class="truncate text-xs group-data-[collapsible=icon]:!hidden">' + (item.subtitle || '') + '</span></div>';
    html += '</a></li>';
  } else if (item && item.children && Array.isArray(item.children) && item.children.length > 0) {
    // Handle collapsible items with children
    html += '<li data-slot="collapsible" data-sidebar="menu-item" class="group/menu-item relative" data-state="closed"><a href="' + (item.url || '#') + 
           '" data-slot="sidebar-menu-button" data-sidebar="menu-button" data-size="' + (item.size || 'default') + '" data-active="' + (item.active || false) + 
           '" class="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&amp;gt;span:last-child]:truncate [&amp;gt;svg]:size-4 [&amp;gt;svg]:shrink-0 hover:bg-sidebar-accent hover:text-purple-500 h-8 text-sm" data-state="closed">';
    if (item.icon) {
      html += '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="' + getIconClass(item.icon) + '"></svg>';
    }
    html += '<span class="group-data-[collapsible=icon]:!hidden">' + item.title + '</span></a><button data-slot="collapsible-trigger" data-sidebar="menu-action" class="text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&amp;gt;svg]:size-4 [&amp;gt;svg]:shrink-0 after:absolute after:-inset-2 md:after:hidden peer-data-[size=sm]/menu-button:top-1 peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 group-data-[collapsible=icon]:hidden data-[state=open]:rotate-90" type="button" aria-controls="radix-' + item.id + '" aria-expanded="false" data-state="closed"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"></path></svg><span class="sr-only">Toggle</span></button>';
    
    // Render children as submenu
    html += '<div data-state="closed" id="radix-' + item.id + '" hidden="" data-slot="collapsible-content" style="">';
    html += '<ul data-slot="sidebar-menu-sub" data-sidebar="menu-sub" class="border-sidebar-border dark:border-gray-500 mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5 group-data-[collapsible=icon]:hidden">';
    for (let i = 0; i < item.children.length; i++) {
      html += this.renderSidebarItem(item.children[i], currentPath);
    }
    html += '</ul>';
    html += '</div>';
    html += '</li>';
  } else if (item && item.hasDropdown) {
    // Handle items with dropdown
    html += '<li data-slot="sidebar-menu-item" data-sidebar="menu-item" class="group/menu-item relative"><a href="' + (item.url || '#') + 
           '" data-slot="sidebar-menu-button" data-sidebar="menu-button" data-size="' + (item.size || 'default') + '" data-active="' + (item.active || false) + 
           '" class="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&amp;gt;span:last-child]:truncate [&amp;gt;svg]:size-4 [&amp;gt;svg]:shrink-0 hover:bg-sidebar-accent hover:text-purple-500 h-8 text-sm">';
    if (item.icon) {
      html += '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="' + getIconClass(item.icon) + '"></svg>';
    }
    html += '<span>' + item.title + '</span></a><button data-slot="dropdown-menu-trigger" data-sidebar="menu-action" class="text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&amp;gt;svg]:size-4 [&amp;gt;svg]:shrink-0 after:absolute after:-inset-2 md:after:hidden peer-data-[size=sm]/menu-button:top-1 peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 group-data-[collapsible=icon]:hidden peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 opacity-100" type="button" id="radix-' + item.id + 'd" aria-haspopup="menu" aria-expanded="false" data-state="closed"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg><span class="sr-only">More</span></button></li>';
  } else if (item && item.isButton) {
    // Handle button items
    html += '<li data-slot="sidebar-menu-item" data-sidebar="menu-item" class="group/menu-item relative"><button data-slot="sidebar-menu-button" data-sidebar="menu-button" data-size="' + (item.size || 'default') + '" data-active="' + (item.active || false) + '" class="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&amp;gt;span:last-child]:truncate [&amp;gt;svg]:size-4 [&amp;gt;svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm">';
    if (item.icon) {
      html += '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="' + getIconClass(item.icon) + '"></svg>';
    }
    html += '<span>' + item.title + '</span></button></li>';
  } else if (item && item.isThemeToggle) {
    // Handle theme toggle
    html += '<li data-slot="sidebar-menu-item" data-sidebar="menu-item" class="group/menu-item relative">';
    html += '<button id="sidebar-theme-toggle" class="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate group-data-[collapsible=icon]:!hidden [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-12 text-sm group-data-[collapsible=icon]:p-0!" type="button">';
    html += '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="' + getIconClass(item.icon) + '"></svg>';
    html += '<span class="group-data-[collapsible=icon]:!hidden">' + item.title + '</span>';
    html += '<div class="ml-auto flex items-center">';
    html += '<div id="sidebar-theme-indicator" class="relative h-4 w-8 rounded-full bg-gray-300 dark:bg-gray-600">';
    html += '<div id="sidebar-theme-indicator-ball" class="absolute left-0 top-0 h-4 w-4 rounded-full bg-white transition-transform dark:translate-x-4"></div>';
    html += '</div>';
    html += '</div>';
    html += '</button>';
    html += '</li>';
  } else if (item && item.isNewsletter) {
    // Handle newsletter section
    html += '<div id="newsletter-component" class="p-1 group-data-[collapsible=icon]:!hidden">';
    html += '<div data-slot="card" class="bg-card text-card-foreground flex flex-col rounded-xl border gap-2 py-4 shadow-none">';
    html += '<div data-slot="card-header" class="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 px-4">';
    html += '<div data-slot="card-title" class="font-semibold text-sm">' + item.title + '</div>';
    html += '<div data-slot="card-description" class="text-muted-foreground text-sm">' + item.description + '</div>';
    html += '</div>';
    html += '<div data-slot="card-content" class="px-4">';
    html += '<form>';
    html += '<div class="grid gap-2.5">';
    html += '<input type="email" data-slot="sidebar-input" class="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input min-w-0 rounded-md border px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-background h-8 w-full shadow-none" data-sidebar="input" placeholder="' + item.placeholder + '">';
    html += '<button data-slot="button" class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*=\'size-\'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-primary/90 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 bg-primary text-primary-foreground w-full shadow-none">' + item.buttonText + '</button>';
    html += '</div>';
    html += '</form>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
  } else if (item && item.isUserMenu) {
    // Handle user menu
    html += '<li data-slot="sidebar-menu-item" data-sidebar="menu-item" class="group/menu-item relative"><button data-slot="dropdown-menu-trigger" data-sidebar="menu-button" data-size="' + (item.size || 'lg') + '" data-active="' + (item.active || false) + '" class="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! [&amp;gt;span:last-child]:truncate [&amp;gt;svg]:size-4 [&amp;gt;svg]:shrink-0 hover:bg-sidebar-accent hover:text-purple-500 h-12 text-sm group-data-[collapsible=icon]:p-0! data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground" type="button" id="radix-«R767neplb»" aria-haspopup="menu" aria-expanded="false" data-state="closed"><span data-slot="avatar" class="relative flex size-8 shrink-0 overflow-hidden h-8 w-8 rounded-full bg-purple-500 dark:bg-purple-600 text-white items-center justify-center text-xs font-bold">' + item.initials + '</span>';
    html += '<div class="grid flex-1 text-left text-sm leading-tight"><span class="truncate font-medium">' + item.title + '</span><span class="truncate text-xs">' + item.subtitle + '</span></div><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevrons-up-down ml-auto size-4"></svg>';
    html += '</button></li>';
  } else if (item) {
    // Handle regular link items
    const isActive = (currentPath === item.url) ? 'data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground' : '';
    html += '<li data-slot="sidebar-menu-item" data-sidebar="menu-item" class="group/menu-item relative"><a href="' + (item.url || '#') + '" data-slot="sidebar-menu-button" data-sidebar="menu-button" data-size="' + (item.size || 'default') + '" data-active="' + (item.active || false) + '" class="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 ' + isActive + ' data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&amp;gt;span:last-child]:truncate [&amp;gt;svg]:size-4 [&amp;gt;svg]:shrink-0 hover:bg-sidebar-accent hover:text-purple-500 h-8 text-sm">';
    if (item.icon) {
      html += '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="' + getIconClass(item.icon) + '"></svg>';
    }
    html += '<span>' + item.title + '</span></a></li>';
  }
  
  return new handlebars.SafeString(html);
});

const handlebarsConfig = engine({ 
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, '../views/layouts'),
  partialsDir: path.join(__dirname, '../views/partials')
});

module.exports = {
  handlebarsConfig,
  handlebars
};