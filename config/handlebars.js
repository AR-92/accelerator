const path = require('path');
const fs = require('fs');
const { engine } = require('express-handlebars');
const handlebars = require('handlebars');
const icons = require('lucide-static');

// Register custom helpers
handlebars.registerHelper('ifeq', function (a, b, options) {
  if (a === b) {
    return options.fn(this);
  }
  return options.inverse(this);
});

handlebars.registerHelper('times', function (n, options) {
  let ret = '';
  for (let i = 0; i < n && i < 5; i++) {
    ret += options.fn(this);
  }
  return ret;
});

handlebars.registerHelper('timesDiff', function (max, n, options) {
  let ret = '';
  const count = Math.max(0, max - n);
  for (let i = 0; i < count; i++) {
    ret += options.fn(this);
  }
  return ret;
});

// Helper to filter items by group
handlebars.registerHelper('filterByGroup', function (items, group) {
  if (!items || !Array.isArray(items)) {
    return [];
  }
  return items.filter((item) => item.group === group);
});

// Helper for Lucide icons
handlebars.registerHelper('lucide', function (iconName, classes) {
  const icon = icons[iconName];
  if (!icon) return '';
  let svg = icon;
  if (classes) {
    svg = svg.replace('class="', 'class="' + classes + ' ');
  }
  return new handlebars.SafeString(svg);
});

// Helper for tag styling
handlebars.registerHelper('formatTags', function (tags) {
  if (!Array.isArray(tags)) return '';

  const colorMap = {
    Mapping: 'bg-blue-100 text-blue-800',
    Data: 'bg-purple-100 text-purple-800',
    Entertainment: 'bg-red-100 text-red-800',
    Video: 'bg-yellow-100 text-yellow-800',
    Analytics: 'bg-blue-100 text-blue-800',
    History: 'bg-yellow-100 text-yellow-800',
    Education: 'bg-indigo-100 text-indigo-800',
    AI: 'bg-purple-100 text-purple-800',
    Future: 'bg-blue-100 text-blue-800',
    Animation: 'bg-purple-100 text-purple-800',
    Game: 'bg-green-100 text-green-800',
    Art: 'bg-pink-100 text-pink-800',
    Music: 'bg-purple-100 text-purple-800',
    Science: 'bg-blue-100 text-blue-800',
    Business: 'bg-blue-100 text-blue-800',
    Finance: 'bg-yellow-100 text-yellow-800',
  };

  return tags
    .map(
      (tag) =>
        `<span class="px-2 py-0.5 ${colorMap[tag] || 'bg-gray-100 text-gray-800'} text-xs rounded-full">${tag}</span>`
    )
    .join('');
});

// Additional helpers
handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});

handlebars.registerHelper('gt', function (a, b) {
  return a > b;
});

handlebars.registerHelper('lt', function (a, b) {
  return a < b;
});

handlebars.registerHelper('gte', function (a, b) {
  return a >= b;
});

handlebars.registerHelper('lte', function (a, b) {
  return a <= b;
});

handlebars.registerHelper('not', function (a) {
  return !a;
});

handlebars.registerHelper('subtract', function (a, b) {
  return a - b;
});

handlebars.registerHelper('add', function (a, b) {
  return a + b;
});

handlebars.registerHelper('math', function (lvalue, operator, rvalue) {
  lvalue = parseFloat(lvalue);
  rvalue = parseFloat(rvalue);

  return {
    '+': lvalue + rvalue,
    '-': lvalue - rvalue,
    '*': lvalue * rvalue,
    '/': lvalue / rvalue,
    '%': lvalue % rvalue,
  }[operator];
});

handlebars.registerHelper('divide', function (a, b) {
  return a / b;
});

handlebars.registerHelper('multiply', function (a, b) {
  return a * b;
});

handlebars.registerHelper('round', function (a) {
  return Math.round(a);
});

handlebars.registerHelper('range', function (start, end) {
  const result = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
});

handlebars.registerHelper('formatDate', function (dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString();
});

handlebars.registerHelper('categoryIcon', function (category) {
  const iconMap = {
    'Web Design': 'Globe',
    Mobile: 'Smartphone',
    Data: 'BarChart',
    'E-commerce': 'ShoppingCart',
  };
  return iconMap[category] || 'Code';
});

// Helper to get character at index
handlebars.registerHelper('charAt', function (str, index) {
  if (typeof str !== 'string') return '';
  return str.charAt(index);
});

// Helper to get substring
handlebars.registerHelper('substr', function (str, start, length) {
  if (typeof str !== 'string') return '';
  return str.substr(start, length);
});

// Helper to capitalize first letter
handlebars.registerHelper('capitalize', function (str) {
  if (typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
});

// Helper to get user initials
handlebars.registerHelper('userInitials', function (user) {
  if (!user) return 'U';
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();
  return firstInitial + (lastInitial || '');
});

// Helper to get user full name
handlebars.registerHelper('userFullName', function (user) {
  if (!user) return 'User';
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  return firstName || lastName || 'User';
});

// Helper to calculate days since a date
handlebars.registerHelper('daysSince', function (dateString) {
  if (!dateString) return 0;
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Helper to stringify JSON
handlebars.registerHelper('json', function (obj) {
  return JSON.stringify(obj);
});

// Helper to concatenate strings
handlebars.registerHelper('concat', function (...args) {
  // Remove the last argument which is the options object
  args.pop();
  return args.join('');
});

// Helper to create arrays
handlebars.registerHelper('array', function (...args) {
  // Remove the last argument which is the options object
  args.pop();
  return args;
});

// Helper to create objects/hashes
handlebars.registerHelper('hash', function (options) {
  return options.hash;
});

// Helper for ternary conditional
handlebars.registerHelper('cond', function (condition, trueValue, falseValue) {
  return condition ? trueValue : falseValue;
});

// Helper to get length of array
handlebars.registerHelper('len', function (array) {
  if (Array.isArray(array)) {
    return array.length;
  }
  return 0;
});

// Helper to calculate colspan for data table
handlebars.registerHelper(
  'colspan',
  function (headers, showCheckbox, showActions) {
    let count = Array.isArray(headers) ? headers.length : 0;
    if (showCheckbox) count += 1;
    if (showActions) count += 1;
    return count;
  }
);

// Helper to get section type label
handlebars.registerHelper('sectionTypeLabel', function (sectionType) {
  const sectionTypeMap = {
    hero: 'Hero Section',
    features: 'Features',
    testimonials: 'Testimonials',
    cta: 'Call to Action',
    about: 'About',
    pricing: 'Pricing',
    contact: 'Contact',
  };
  return sectionTypeMap[sectionType] || sectionType;
});

// Function to recursively register partials with subfolder prefixes
function registerPartialsRecursively(dir, prefix = '') {
  console.log(`Registering partials in: ${dir} with prefix: ${prefix}`);
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Recurse into subdirectory
      registerPartialsRecursively(
        fullPath,
        prefix ? `${prefix}/${item}` : item
      );
    } else if (item.endsWith('.hbs')) {
      // Register partial
      const partialName = item.replace('.hbs', '');
      const fullPartialName = prefix ? `${prefix}/${partialName}` : partialName;
      console.log(`Registering partial: ${fullPartialName} from ${fullPath}`);
      const template = fs.readFileSync(fullPath, 'utf8');
      handlebars.registerPartial(fullPartialName, template);
    }
  }
}

// Collect all partials for Express Handlebars
const partials = {};

// Function to recursively collect partials with subfolder prefixes
function collectPartialsRecursively(dir, prefix = '') {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Recurse into subdirectory
      collectPartialsRecursively(fullPath, prefix ? `${prefix}/${item}` : item);
    } else if (item.endsWith('.hbs')) {
      // Collect partial
      const partialName = item.replace('.hbs', '');
      const fullPartialName = prefix ? `${prefix}/${partialName}` : partialName;
      const template = fs.readFileSync(fullPath, 'utf8');
      partials[fullPartialName] = template;
    }
  }
}

// Collect all partials
collectPartialsRecursively(path.join(__dirname, '../src/views/partials'));

const handlebarsConfig = engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, '../src/views/layouts'),
  partials: partials,
});

// Partials are now registered with Express Handlebars

module.exports = {
  handlebarsConfig,
  handlebars,
};
