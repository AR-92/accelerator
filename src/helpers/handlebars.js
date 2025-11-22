import icons from 'lucide-static';

export const handlebarsHelpers = {
  eq: function(a, b) { return a === b; },
  formatDate: function(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },
  icon: function(name, options) {
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1).replace(/-./g, match => match[1].toUpperCase());
    let svg = icons[capitalizedName];
    if (!svg) return '';
    const attrs = options.hash || {};
    const className = attrs.class || '';
    const size = attrs.size || 24;
    // Replace width and height
    svg = svg.replace(/width="[^"]*"/, `width="${size}"`);
    svg = svg.replace(/height="[^"]*"/, `height="${size}"`);
    // Add class
    if (className) {
      svg = svg.replace('<svg ', `<svg class="${className}" `);
    }
    return svg;
  },
  iconRaw: function(name, options) {
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1).replace(/-./g, match => match[1].toUpperCase());
    let svg = icons[capitalizedName];
    if (!svg) return '';
    const attrs = options.hash || {};
    const className = attrs.class || '';
    const size = attrs.size || 24;
    // Replace width and height
    svg = svg.replace(/width="[^"]*"/, `width="${size}"`);
    svg = svg.replace(/height="[^"]*"/, `height="${size}"`);
    // Add class
    if (className) {
      svg = svg.replace('<svg ', `<svg class="${className}" `);
    }
    // Escape quotes for JavaScript
    return svg.replace(/"/g, '&quot;');
  }
};