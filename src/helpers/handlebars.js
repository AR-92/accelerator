import icons from 'lucide-static';

export const handlebarsHelpers = {
  eq: function(a, b) { return a === b; },
  len: function(arr) { return arr ? arr.length : 0; },
  add: function(...args) { return args.slice(0, -1).reduce((a, b) => a + b, 0); },
  statusClass: function(status) {
    switch (status) {
      case 'completed':
      case 'active':
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  },
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
    if (!name || typeof name !== 'string') return '';
    let svg = icons[name];
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