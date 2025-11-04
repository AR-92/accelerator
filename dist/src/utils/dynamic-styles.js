// Dynamic style generator for runtime CSS modifications
class DynamicStyleGenerator {
  constructor() {
    this.styleSheet = this.createStyleSheet();
    this.appliedStyles = new Map();
  }

  createStyleSheet() {
    const style = document.createElement('style');
    style.id = 'dynamic-tailwind-styles';
    style.type = 'text/css';
    document.head.appendChild(style);
    return style.sheet;
  }

  // Generate a unique class name based on properties
  generateClassName(properties) {
    const str = JSON.stringify(properties);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return `dynamic-${Math.abs(hash).toString(16)}`;
  }

  // Add dynamic CSS rule
  addDynamicRule(selector, styles) {
    const className = this.generateClassName({ selector, styles });
    const rule = `${selector} { ${this.stylesToCSS(styles)} }`;
    
    // Check if rule already exists
    if (!this.appliedStyles.has(className)) {
      try {
        this.styleSheet.insertRule(rule, this.styleSheet.cssRules.length);
        this.appliedStyles.set(className, { selector, styles });
      } catch (e) {
        console.error('Error adding dynamic CSS rule:', e);
      }
    }
    
    return className;
  }

  // Convert style object to CSS string
  stylesToCSS(styles) {
    return Object.entries(styles)
      .map(([property, value]) => {
        // Convert camelCase to kebab-case
        const kebabProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `${kebabProperty}: ${value}`;
      })
      .join('; ');
  }

  // Generate responsive styles
  addResponsiveRule(baseSelector, styles) {
    const breakpoints = {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    };

    // Add base styles
    this.addDynamicRule(baseSelector, styles.base || {});

    // Add responsive styles
    Object.entries(breakpoints).forEach(([breakpoint, width]) => {
      if (styles[breakpoint]) {
        const mediaQuery = `@media (min-width: ${width})`;
        const rule = `${mediaQuery} { ${baseSelector} { ${this.stylesToCSS(styles[breakpoint])} } }`;
        try {
          this.styleSheet.insertRule(rule, this.styleSheet.cssRules.length);
        } catch (e) {
          console.error('Error adding responsive CSS rule:', e);
        }
      }
    });
  }

  // Create gradient utilities
  createGradientUtility(className, gradient) {
    return this.addDynamicRule(`.${className}`, {
      backgroundImage: gradient
    });
  }

  // Create animation utilities
  createAnimationUtility(className, keyframes) {
    // Add keyframes
    const animationName = className.replace('animate-', '');
    const keyframeRule = `@keyframes ${animationName} { ${this.keyframesToCSS(keyframes)} }`;
    
    try {
      this.styleSheet.insertRule(keyframeRule, this.styleSheet.cssRules.length);
    } catch (e) {
      console.error('Error adding keyframes:', e);
    }

    // Add animation class
    return this.addDynamicRule(`.${className}`, {
      animation: `${animationName} 1s ease infinite`
    });
  }

  // Convert keyframes object to CSS string
  keyframesToCSS(keyframes) {
    return Object.entries(keyframes)
      .map(([step, styles]) => {
        return `${step} { ${this.stylesToCSS(styles)} }`;
      })
      .join(' ');
  }

  // Create custom property utilities
  createCustomPropertyUtility(className, property, value) {
    return this.addDynamicRule(`.${className}`, {
      [property]: value
    });
  }

  // Remove dynamic rule
  removeRule(className) {
    if (this.appliedStyles.has(className)) {
      const ruleIndex = Array.from(this.styleSheet.cssRules).findIndex(
        rule => rule.selectorText === `.${className}`
      );
      
      if (ruleIndex !== -1) {
        this.styleSheet.deleteRule(ruleIndex);
      }
      
      this.appliedStyles.delete(className);
    }
  }

  // Clear all dynamic styles
  clearAll() {
    // Remove all rules from stylesheet
    while (this.styleSheet.cssRules.length > 0) {
      this.styleSheet.deleteRule(0);
    }
    
    // Clear tracking map
    this.appliedStyles.clear();
  }
}

// Initialize dynamic style generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.dynamicStyles = new DynamicStyleGenerator();
});

// Export for use in modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DynamicStyleGenerator;
}