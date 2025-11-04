const path = require('path');
const { engine } = require('express-handlebars');
const handlebars = require('handlebars');
const icons = require('lucide-static');

// Register custom helpers
handlebars.registerHelper('ifeq', function(a, b, options) {
  if (a === b) {
    return options.fn(this);
  }
  return options.inverse(this);
});

handlebars.registerHelper('times', function(n, options) {
  let ret = '';
  for (let i = 0; i < n && i < 5; i++) {
    ret += options.fn(this);
  }
  return ret;
});

handlebars.registerHelper('timesDiff', function(max, n, options) {
  let ret = '';
  const count = Math.max(0, max - n);
  for (let i = 0; i < count; i++) {
    ret += options.fn(this);
  }
  return ret;
});

// Helper to filter items by group
handlebars.registerHelper('filterByGroup', function(items, group) {
  if (!items || !Array.isArray(items)) {
    return [];
  }
  return items.filter(item => item.group === group);
});

// Helper for Lucide icons
handlebars.registerHelper('lucide', function(iconName, classes) {
  const icon = icons[iconName];
  if (!icon) return '';
  let svg = icon;
  if (classes) {
    svg = svg.replace('class="', 'class="' + classes + ' ');
  }
  return new handlebars.SafeString(svg);
});



const handlebarsConfig = engine({ 
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, '../src/views/layouts'),
  partialsDir: path.join(__dirname, '../src/views/partials')
});

module.exports = {
  handlebarsConfig,
  handlebars
};