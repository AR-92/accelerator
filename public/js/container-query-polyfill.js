// Container query polyfill - detects container size and applies appropriate classes
class ContainerQueryPolyfill {
  constructor() {
    this.containers = new Map();
    this.breakpoints = {
      'sm': 640,  // matches Tailwind's sm breakpoint
      'md': 768,  // matches Tailwind's md breakpoint
      'lg': 1024, // matches Tailwind's lg breakpoint
      'xl': 1280  // matches Tailwind's xl breakpoint
    };
    this.init();
  }

  init() {
    // Initialize on DOM load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupContainers());
    } else {
      this.setupContainers();
    }

    // Observe for new containers added dynamically
    this.observeNewContainers();
  }

  setupContainers() {
    // Find all container-boundary elements
    const containerElements = document.querySelectorAll('.container-boundary');
    
    containerElements.forEach(container => {
      this.addContainer(container);
    });
  }

  addContainer(element) {
    // Skip if already observed
    if (this.containers.has(element)) return;

    // Create ResizeObserver to monitor container size
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        this.handleContainerResize(entry.target, entry.contentRect);
      }
    });

    // Start observing the container
    resizeObserver.observe(element);
    
    // Store observer reference
    this.containers.set(element, {
      observer: resizeObserver,
      currentSize: '',
      width: 0
    });

    // Initialize current size state
    const rect = element.getBoundingClientRect();
    this.handleContainerResize(element, rect);
  }

  handleContainerResize(container, rect) {
    const width = rect.width || rect.right - rect.left;
    const currentData = this.containers.get(container);

    if (currentData && currentData.width === width) {
      // No size change, return early
      return;
    }

    // Determine container size class based on width
    const newSizeClass = this.getContainerSizeClass(width);
    
    // Update data attribute to trigger CSS changes
    container.setAttribute('data-ctn-size', newSizeClass);
    
    // Store new width
    if (currentData) {
      currentData.width = width;
      currentData.currentSize = newSizeClass;
    }
  }

  getContainerSizeClass(width) {
    // Determine size class based on container width
    if (width >= this.breakpoints.xl) {
      return 'xl';
    } else if (width >= this.breakpoints.lg) {
      return 'lg';
    } else if (width >= this.breakpoints.md) {
      return 'md';
    } else if (width >= this.breakpoints.sm) {
      return 'sm';
    } else {
      return 'xs'; // smaller than smallest breakpoint
    }
  }

  observeNewContainers() {
    // Use MutationObserver to detect new containers added dynamically
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if the added node is a container
            if (node.classList && node.classList.contains('container-boundary')) {
              this.addContainer(node);
            }
            
            // Check if the added node contains containers
            const containers = node.querySelectorAll && node.querySelectorAll('.container-boundary');
            if (containers) {
              containers.forEach(container => this.addContainer(container));
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Public method to manually refresh container sizes
  refresh() {
    this.containers.forEach((data, container) => {
      const rect = container.getBoundingClientRect();
      this.handleContainerResize(container, rect);
    });
  }
}

// Initialize the polyfill when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.containerQueryPolyfill = new ContainerQueryPolyfill();
});

// Export for use in modules if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ContainerQueryPolyfill;
}