const path = require('path');
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

handlebars.registerHelper('not', function (a) {
  return !a;
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

const handlebarsConfig = engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, '../src/views/layouts'),
  partialsDir: [
    path.join(__dirname, '../src/views/partials'),
    path.join(__dirname, '../src/components'),
  ],
});

// Manually register partials
const fs = require('fs');
const userMessagePath = path.join(
  __dirname,
  '../src/components/_user-message.hbs'
);
if (fs.existsSync(userMessagePath)) {
  const userMessageTemplate = fs.readFileSync(userMessagePath, 'utf8');
  handlebars.registerPartial('user-message', userMessageTemplate);
}

const ideaCardPath = path.join(__dirname, '../src/components/_idea-card.hbs');
if (fs.existsSync(ideaCardPath)) {
  const ideaCardTemplate = fs.readFileSync(ideaCardPath, 'utf8');
  handlebars.registerPartial('idea-card', ideaCardTemplate);
  const portfolioCardPath = path.join(
    __dirname,
    '../src/components/_portfolio-card.hbs'
  );
  if (fs.existsSync(portfolioCardPath)) {
    const portfolioCardTemplate = fs.readFileSync(portfolioCardPath, 'utf8');
    handlebars.registerPartial('portfolio-card', portfolioCardTemplate);
  }
}

module.exports = {
  handlebarsConfig,
  handlebars,
};
