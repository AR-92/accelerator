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