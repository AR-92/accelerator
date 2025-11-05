/**
 * Unified framework utilities for all AI assistant models
 */

/**
 * Toggles the maximize state of the aside panel
 * @param {HTMLElement} btn - The button element that was clicked
 */
function toggleMaximize(btn) {
  const aside = btn.closest('aside');
  const main = aside.previousElementSibling;
  
  if (!aside || !main) {
    console.error('Could not find aside or main elements');
    return;
  }

  if (aside.classList.contains('maximized')) {
    // Restore normal view
    aside.classList.remove('maximized');
    aside.classList.remove('w-full');
    aside.classList.add('w-96');
    main.classList.remove('hidden');
  } else {
    // Maximize the aside
    aside.classList.add('maximized');
    aside.classList.remove('w-96');
    aside.classList.add('w-full');
    main.classList.add('hidden');
  }
}


/**
 * Closes the aside panel
 * @param {HTMLElement} btn - The button element that was clicked
 */
function closeAside(btn) {
  const aside = btn.closest('aside');
  
  if (!aside) {
    console.error('Could not find parent aside element');
    return;
  }

  const main = aside.previousElementSibling;
  
  // If the aside is maximized, collapse it first to normal size
  if (aside.classList.contains('maximized')) {
    // Remove maximized state (same logic as toggleMaximize when maximized)
    aside.classList.remove('maximized');
    aside.classList.remove('w-full');
    aside.classList.add('w-96');
    if (main) {
      main.classList.remove('hidden');
    }
    
    // Use a small delay to allow the transition to happen before completely hiding
    setTimeout(() => {
      // Store reference to the closed aside panel and its class list
      window.closedAsidePanel = aside;
      window.closedAsideClassList = Array.from(aside.classList);
      window.wasAsideMaximized = true; // Remember it was originally maximized
      
      // Add fade-out effect before hiding
      aside.style.opacity = '0';
      aside.style.transition = 'opacity 0.3s ease-out';
      
      setTimeout(() => {
        aside.style.display = 'none';
      }, 300);
    }, 50); // Small delay to allow the collapse animation to start
  } else {
    // If not maximized, just close directly
    // Store reference to the closed aside panel and its class list
    window.closedAsidePanel = aside;
    window.closedAsideClassList = Array.from(aside.classList);
    window.wasAsideMaximized = false;
    
    // Add fade-out effect before hiding
    aside.style.opacity = '0';
    aside.style.transition = 'opacity 0.3s ease-out';
    
    setTimeout(() => {
      aside.style.display = 'none';
    }, 300);
  }
}

/**
 * Reopens the last closed aside panel
 */
function reopenAside() {
  if (window.closedAsidePanel) {
    // Get the main panel that might need to be shown
    const main = window.closedAsidePanel.previousElementSibling;
    
    // Reset the styles to show the panel again
    window.closedAsidePanel.style.display = 'flex';
    window.closedAsidePanel.style.opacity = '1';
    
    // Restore the original classes if saved
    if (window.closedAsideClassList) {
      window.closedAsidePanel.classList.add(...window.closedAsideClassList);
      window.closedAsideClassList = null;
    }
    
    // If the aside was maximized when it was closed, maximize it again and hide the main panel
    if (window.wasAsideMaximized && main) {
      window.closedAsidePanel.classList.add('maximized');
      window.closedAsidePanel.classList.remove('w-96');
      window.closedAsidePanel.classList.add('w-full');
      main.classList.add('hidden');
    } 
    // Otherwise, ensure we're in normal view
    else {
      window.closedAsidePanel.classList.remove('maximized');
      window.closedAsidePanel.classList.remove('w-full');
      window.closedAsidePanel.classList.add('w-96');
      if (main) {
        main.classList.remove('hidden');
      }
    }
    
    // Clean up state tracking
    window.wasAsideMaximized = false;
    window.hiddenMainPanel = null;
    
    // Remove reference since it's now visible
    window.closedAsidePanel = null;
  } else {
    console.warn('No aside panel to reopen');
  }
}

// Export functions for use in modules if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    toggleMaximize,
    closeAside,
    reopenAside
  };
}