const path = require('path');
const { engine } = require('express-handlebars');
const handlebars = require('handlebars');

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

const handlebarsConfig = engine({ 
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, '../views/layouts'),
  partialsDir: path.join(__dirname, '../views/partials')
});

module.exports = {
  handlebarsConfig,
  handlebars
};