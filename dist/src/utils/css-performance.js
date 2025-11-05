// CSS Performance Monitor
class CSSPerformanceMonitor {
  constructor() {
    this.metrics = {
      unusedClasses: [],
      renderBlockingCSS: 0,
      totalCSSSize: 0,
      criticalCSSSize: 0,
      unusedCSSSize: 0,
    };

    this.cssUsageMap = new Map();
    this.startTime = performance.now();

    this.init();
  }

  init() {
    // Start monitoring after DOM is loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () =>
        this.startMonitoring()
      );
    } else {
      this.startMonitoring();
    }

    // Monitor for dynamically added classes
    this.observeDOMChanges();
  }

  startMonitoring() {
    this.analyzeCSSUsage();
    this.reportPerformance();

    // Run periodic checks
    setInterval(() => {
      this.updateMetrics();
      this.reportPerformance();
    }, 10000); // Every 10 seconds
  }

  // Analyze current CSS usage
  analyzeCSSUsage() {
    const allElements = document.querySelectorAll('*');
    const usedClasses = new Set();

    // Collect all classes in use
    allElements.forEach((element) => {
      Array.from(element.classList).forEach((className) => {
        usedClasses.add(className);

        // Track frequency of use
        if (!this.cssUsageMap.has(className)) {
          this.cssUsageMap.set(className, 0);
        }
        this.cssUsageMap.set(className, this.cssUsageMap.get(className) + 1);
      });
    });

    // Analyze stylesheets for potential unused classes
    this.analyzeStylesheets(usedClasses);
  }

  // Analyze stylesheets and compare with used classes
  analyzeStylesheets(usedClasses) {
    const allCSSRules = new Set();

    Array.from(document.styleSheets).forEach((sheet) => {
      try {
        if (sheet.cssRules) {
          Array.from(sheet.cssRules).forEach((rule) => {
            if (rule.selectorText) {
              // Extract class names from selector
              const classMatches =
                rule.selectorText.match(/\.([a-zA-Z0-9_-]+)/g);
              if (classMatches) {
                classMatches.forEach((className) => {
                  const cleanClass = className.substring(1); // Remove the '.'
                  allCSSRules.add(cleanClass);
                });
              }
            }
          });
        }
      } catch (e) {
        // Skip if we can't access the stylesheet due to CORS
        console.warn('Could not access stylesheet:', e);
      }
    });

    // Find unused classes
    this.metrics.unusedClasses = Array.from(allCSSRules).filter(
      (className) => !usedClasses.has(className)
    );
  }

  // Monitor DOM changes for dynamically added classes
  observeDOMChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          const element = mutation.target;
          Array.from(element.classList).forEach((className) => {
            if (!this.cssUsageMap.has(className)) {
              this.cssUsageMap.set(className, 0);
            }
            this.cssUsageMap.set(
              className,
              this.cssUsageMap.get(className) + 1
            );
          });
        } else if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && node.classList) {
              // Element node
              Array.from(node.classList).forEach((className) => {
                if (!this.cssUsageMap.has(className)) {
                  this.cssUsageMap.set(className, 0);
                }
                this.cssUsageMap.set(
                  className,
                  this.cssUsageMap.get(className) + 1
                );
              });
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
      childList: true,
      subtree: true,
    });
  }

  // Update performance metrics
  updateMetrics() {
    this.metrics.totalCSSSize = this.calculateTotalCSSSize();
    this.metrics.unusedCSSSize = this.calculateUnusedCSSSize();
    this.metrics.renderBlockingCSS = this.countRenderBlockingCSS();

    // Calculate critical path CSS size (top of viewport)
    this.metrics.criticalCSSSize = this.calculateCriticalCSSSize();
  }

  calculateTotalCSSSize() {
    let totalSize = 0;
    Array.from(document.styleSheets).forEach((sheet) => {
      try {
        if (sheet.cssRules) {
          Array.from(sheet.cssRules).forEach((rule) => {
            totalSize += rule.cssText.length;
          });
        }
      } catch (e) {
        console.warn('Could not access stylesheet:', e);
      }
    });
    return totalSize;
  }

  calculateUnusedCSSSize() {
    let unusedSize = 0;

    Array.from(document.styleSheets).forEach((sheet) => {
      try {
        if (sheet.cssRules) {
          Array.from(sheet.cssRules).forEach((rule) => {
            if (rule.selectorText) {
              // Check if any class in the selector is unused
              const classMatches =
                rule.selectorText.match(/\.([a-zA-Z0-9_-]+)/g);
              if (classMatches) {
                const hasUnusedClass = classMatches.some((className) => {
                  const cleanClass = className.substring(1);
                  return this.metrics.unusedClasses.includes(cleanClass);
                });

                if (hasUnusedClass) {
                  unusedSize += rule.cssText.length;
                }
              }
            }
          });
        }
      } catch (e) {
        console.warn('Could not access stylesheet:', e);
      }
    });

    return unusedSize;
  }

  countRenderBlockingCSS() {
    let blockingCount = 0;

    // Count external stylesheets (which block rendering)
    const linkElements = document.querySelectorAll('link[rel="stylesheet"]');
    linkElements.forEach((link) => {
      if (!link.media || link.media === 'all' || link.media === 'screen') {
        blockingCount++;
      }
    });

    return blockingCount;
  }

  calculateCriticalCSSSize() {
    // Calculate CSS for elements in viewport
    const criticalElements = Array.from(document.querySelectorAll('*')).filter(
      (el) => this.isElementInViewport(el)
    );

    let criticalSize = 0;

    // In a real implementation, we would match these elements to their CSS rules
    // For now, we'll simulate by checking if elements have Tailwind classes
    criticalElements.forEach((el) => {
      if (el.classList.length > 0) {
        // Approximate critical CSS size based on number of classes
        criticalSize += el.classList.length * 20; // 20 bytes per class estimate
      }
    });

    return criticalSize;
  }

  isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // Report performance metrics
  reportPerformance() {
    console.group('CSS Performance Report');
    console.log('Unused classes:', this.metrics.unusedClasses.length);
    console.log('Total CSS size (bytes):', this.metrics.totalCSSSize);
    console.log('Critical CSS size (bytes):', this.metrics.criticalCSSSize);
    console.log('Unused CSS size (bytes):', this.metrics.unusedCSSSize);
    console.log('Render-blocking stylesheets:', this.metrics.renderBlockingCSS);

    if (this.metrics.unusedClasses.length > 0) {
      console.log(
        'Sample unused classes:',
        this.metrics.unusedClasses.slice(0, 10)
      );
    }

    console.groupEnd();

    // Emit custom event for other parts of the app to listen to
    const event = new CustomEvent('cssPerformanceUpdate', {
      detail: { ...this.metrics },
    });
    document.dispatchEvent(event);
  }

  // Get recommendations for optimization
  getOptimizationRecommendations() {
    const recommendations = [];

    if (this.metrics.unusedClasses.length > 50) {
      recommendations.push(
        'Consider using more specific content paths in Tailwind config to reduce unused CSS'
      );
    }

    if (this.metrics.renderBlockingCSS > 2) {
      recommendations.push(
        'Consider deferring non-critical CSS to improve render performance'
      );
    }

    if (this.metrics.unusedCSSSize > this.metrics.totalCSSSize * 0.3) {
      recommendations.push(
        'More than 30% of CSS is unused - consider purging unused styles'
      );
    }

    if (this.metrics.totalCSSSize > 100000) {
      // 100KB
      recommendations.push(
        'CSS bundle is large - consider splitting critical and non-critical CSS'
      );
    }

    return recommendations;
  }
}

// Initialize performance monitor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.cssPerformanceMonitor = new CSSPerformanceMonitor();
});

// Export for use in modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CSSPerformanceMonitor;
}
