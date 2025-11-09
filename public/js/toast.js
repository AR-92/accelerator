/**
 * Toast Notification System
 * Provides a simple API for showing toast notifications
 */
(function () {
  'use strict';

  // Configuration
  const TOAST_DURATION = 5000; // 5 seconds
  const MAX_TOASTS = 5; // Maximum number of toasts to show at once

  // Toast types with their configurations
  const TOAST_TYPES = {
    success: {
      bgClass:
        'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      textClass: 'text-green-800 dark:text-green-200',
      icon: `<svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>`,
    },
    error: {
      bgClass:
        'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
      textClass: 'text-red-800 dark:text-red-200',
      icon: `<svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>`,
    },
    warning: {
      bgClass:
        'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      textClass: 'text-yellow-800 dark:text-yellow-200',
      icon: `<svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
      </svg>`,
    },
    info: {
      bgClass:
        'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      textClass: 'text-blue-800 dark:text-blue-200',
      icon: `<svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>`,
    },
  };

  // Global toast queue
  let toastQueue = [];
  let activeToasts = 0;

  /**
   * Initialize the toast system
   */
  function init() {
    // Create container if it doesn't exist
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed top-4 right-4 z-[9999] space-y-2 max-w-sm';
      document.body.appendChild(container);
    }

    // Create template if it doesn't exist
    if (!document.getElementById('toast-template')) {
      const template = document.createElement('template');
      template.id = 'toast-template';
      template.innerHTML = `
        <div class="toast flex items-center p-4 rounded-lg shadow-lg border transform translate-x-full opacity-0 transition-all duration-300 ease-in-out max-w-sm"
             data-type="info">
          <div class="flex-shrink-0 toast-icon">
            <!-- Icon will be inserted here based on type -->
          </div>
          <div class="ml-3 flex-1">
            <p class="text-sm font-medium toast-message"></p>
          </div>
          <button class="toast-close ml-auto flex-shrink-0 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onclick="this.parentElement.remove()">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      `;
      document.body.appendChild(template);
    }
  }

  /**
   * Show a toast notification
   * @param {string} message - The message to display
   * @param {string} type - The type of toast (success, error, warning, info)
   * @param {number} duration - Duration in milliseconds (optional)
   */
  function show(message, type = 'info', duration = TOAST_DURATION) {
    // Initialize if needed
    init();

    // Validate type
    if (!TOAST_TYPES[type]) {
      console.warn(`Invalid toast type: ${type}. Using 'info' instead.`);
      type = 'info';
    }

    // Add to queue
    toastQueue.push({ message, type, duration });

    // Process queue
    processQueue();
  }

  /**
   * Process the toast queue
   */
  function processQueue() {
    if (toastQueue.length === 0 || activeToasts >= MAX_TOASTS) {
      return;
    }

    const { message, type, duration } = toastQueue.shift();
    activeToasts++;

    const container = document.getElementById('toast-container');
    const template = document.getElementById('toast-template');

    if (!container || !template) {
      console.error('Toast system not properly initialized');
      return;
    }

    // Clone template
    const toastElement = template.content.cloneNode(true).firstElementChild;

    // Configure toast
    const config = TOAST_TYPES[type];
    toastElement.className = `toast flex items-center p-4 rounded-lg shadow-lg border ${config.bgClass} transform translate-x-full opacity-0 transition-all duration-300 ease-in-out max-w-sm`;
    toastElement.setAttribute('data-type', type);

    // Set icon
    const iconContainer = toastElement.querySelector('.toast-icon');
    iconContainer.innerHTML = config.icon;

    // Set message
    const messageElement = toastElement.querySelector('.toast-message');
    messageElement.textContent = message;
    messageElement.className = `text-sm font-medium ${config.textClass}`;

    // Add to container
    container.appendChild(toastElement);

    // Animate in
    requestAnimationFrame(() => {
      toastElement.classList.remove('translate-x-full', 'opacity-0');
      toastElement.classList.add('translate-x-0', 'opacity-100');
    });

    // Set up auto-hide
    const hideTimeout = setTimeout(() => {
      hideToast(toastElement);
    }, duration);

    // Handle manual close
    const closeButton = toastElement.querySelector('.toast-close');
    closeButton.addEventListener('click', () => {
      clearTimeout(hideTimeout);
      hideToast(toastElement);
    });
  }

  /**
   * Hide a toast
   * @param {HTMLElement} toastElement - The toast element to hide
   */
  function hideToast(toastElement) {
    toastElement.classList.remove('translate-x-0', 'opacity-100');
    toastElement.classList.add('translate-x-full', 'opacity-0');

    // Remove after animation
    setTimeout(() => {
      if (toastElement.parentNode) {
        toastElement.parentNode.removeChild(toastElement);
        activeToasts--;
        // Process next toast in queue
        processQueue();
      }
    }, 300);
  }

  /**
   * Clear all active toasts
   */
  function clear() {
    const container = document.getElementById('toast-container');
    if (container) {
      const toasts = container.querySelectorAll('.toast');
      toasts.forEach((toast) => {
        hideToast(toast);
      });
    }
    toastQueue = [];
  }

  // Public API
  window.Toast = {
    show: show,
    success: (message, duration) => show(message, 'success', duration),
    error: (message, duration) => show(message, 'error', duration),
    warning: (message, duration) => show(message, 'warning', duration),
    info: (message, duration) => show(message, 'info', duration),
    clear: clear,
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
