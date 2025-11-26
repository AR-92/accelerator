import icons from 'lucide-static';
import {
  formatDate,
  statusClass,
  formatCurrency,
  formatNumber,
} from './format/index.js';

export const handlebarsHelpers = {
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
  icon: function (name, options) {
    if (!name || typeof name !== 'string') return '';
    const capitalizedName =
      name.charAt(0).toUpperCase() +
      name.slice(1).replace(/-./g, (match) => match[1].toUpperCase());
    let svg = icons[capitalizedName];
    if (!svg) {
      console.log(`Icon not found: ${capitalizedName} (original: ${name})`);
      return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-off-icon lucide-circle-off"><path d="m2 2 20 20"/><path d="M8.35 2.69A10 10 0 0 1 21.3 15.65"/><path d="M19.08 19.08A10 10 0 1 1 4.92 4.92"/></svg>`;
    }
    const attrs = options.hash || {};
    const className = attrs.class || '';
    const size = attrs.size || 24;
    // Replace width and height
    svg = svg.replace(/width="[^"]*"/, `width="${size}"`);
    svg = svg.replace(/height="[^"]*"/, `height="${size}"`);
    // Add or append class
    if (className) {
      if (svg.includes('class="')) {
        svg = svg.replace(/(class="[^"]*)"/, `$1 ${className}"`);
      } else {
        svg = svg.replace('<svg ', `<svg class="${className}" `);
      }
    }
    return svg;
  },
};
