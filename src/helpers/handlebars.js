import Handlebars from 'handlebars';
import icons from 'lucide-static';
import {
  formatDate,
  statusClass,
  formatCurrency,
  formatNumber,
} from './format/index.js';

// Cache for processed icons to improve performance
const iconCache = new Map();

export const handlebarsHelpers = {
  icon: function (name, options) {
    if (!name || typeof name !== 'string') return '';
    const attrs = options.hash || {};
    const className = attrs.class || '';
    const size = attrs.size || 24;
    const cacheKey = `${name}-${size}-${className}`;

    // Check cache first
    if (iconCache.has(cacheKey)) {
      return new Handlebars.SafeString(iconCache.get(cacheKey));
    }

    const capitalizedName =
      name.charAt(0).toUpperCase() +
      name.slice(1).replace(/-./g, (match) => match[1].toUpperCase());
    let svg = icons[capitalizedName];
    if (!svg) {
      console.log(`Icon not found: ${capitalizedName} (original: ${name})`);
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-off-icon lucide-circle-off"><path d="m2 2 20 20"/><path d="M19.08 19.08A10 10 0 1 1 4.92 4.92"/></svg>`;
    }

    // Optimize string operations
    let processedSvg = svg;

    // If class contains 'fill-', make the icon filled
    if (className && className.includes('fill-')) {
      processedSvg = processedSvg.replace('fill="none"', 'fill="currentColor"');
    }

    // Replace width and height
    processedSvg = processedSvg.replace(/width="[^"]*"/, `width="${size}"`);
    processedSvg = processedSvg.replace(/height="[^"]*"/, `height="${size}"`);

    // Add or append class
    if (className) {
      if (processedSvg.includes('class="')) {
        processedSvg = processedSvg.replace(
          /(class="[^"]*)"/,
          `$1 ${className}"`
        );
      } else {
        processedSvg = processedSvg.replace(
          '<svg ',
          `<svg class="${className}" `
        );
      }
    }

    // Cache the result
    iconCache.set(cacheKey, processedSvg);

    return new Handlebars.SafeString(processedSvg);
  },
  eq: function (a, b) {
    return a === b;
  },
  ne: function (a, b) {
    return a !== b;
  },
  gt: function (a, b) {
    return a > b;
  },
  gte: function (a, b) {
    return a >= b;
  },
  lt: function (a, b) {
    return a < b;
  },
  lte: function (a, b) {
    return a <= b;
  },
  len: function (arr) {
    return arr ? arr.length : 0;
  },
  add: function (...args) {
    return args.slice(0, -1).reduce((a, b) => a + b, 0);
  },
  subtract: function (a, b) {
    return a - b;
  },
  multiply: function (a, b) {
    return a * b;
  },
  divide: function (a, b) {
    return b !== 0 ? a / b : 0;
  },
  max: function (arr) {
    if (!Array.isArray(arr) || arr.length === 0) return 0;
    return Math.max(...arr);
  },
  min: function (arr) {
    if (!Array.isArray(arr) || arr.length === 0) return 0;
    return Math.min(...arr);
  },
  last: function (arr) {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    return arr[arr.length - 1];
  },
  math: function (...args) {
    // Simple math evaluator for basic expressions
    const expression = args.slice(0, -1).join(' ');
    try {
      // Replace division and multiplication operators for safety
      const safeExpression = expression
        .replace(/\//g, ' / ')
        .replace(/\*/g, ' * ')
        .replace(/\+/g, ' + ')
        .replace(/-/g, ' - ');

      // Use Function constructor for safe evaluation
      return new Function('return ' + safeExpression)();
    } catch (e) {
      console.error('Math helper error:', e);
      return 0;
    }
  },
  concat: function (...args) {
    return args.slice(0, -1).join('');
  },
  capitalize: function (str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  },
  statusClass: statusClass,
  formatDate: formatDate,
  formatCurrency: formatCurrency,
  formatNumber: formatNumber,
  json: function (context) {
    return JSON.stringify(context);
  },
  'JSON.stringify': function (context) {
    return JSON.stringify(context);
  },
  array: function (...args) {
    return args.slice(0, -1);
  },
  hash: function (...args) {
    const options = args.pop();
    const hash = {};
    for (let i = 0; i < args.length; i += 2) {
      hash[args[i]] = args[i + 1];
    }
    return hash;
  },
  range: function (start, end) {
    const result = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  },
  or: function (...args) {
    // Remove the options object from args
    const values = args.slice(0, -1);
    return values.some((value) => !!value);
  },
};
