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
 * Toggles visibility of content in the aside panel
 * @param {HTMLElement} btn - The button element that was clicked
 */
function toggleMessage(btn) {
  const aside = btn.closest('aside');
  
  if (!aside) {
    console.error('Could not find parent aside element');
    return;
  }

  const content = aside.querySelector('.flex-1');
  if (content) {
    content.classList.toggle('hidden');
  } else {
    console.error('Could not find content with class .flex-1 in aside');
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

  // Add fade-out effect before hiding
  aside.style.opacity = '0';
  aside.style.transition = 'opacity 0.3s ease-out';
  
  setTimeout(() => {
    aside.style.display = 'none';
  }, 300);
}

// Export functions for use in modules if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    toggleMaximize,
    toggleMessage,
    closeAside
  };
}