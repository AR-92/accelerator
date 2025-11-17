const path = require('path');
const { engine } = require('express-handlebars');
const handlebars = require('handlebars');
const icons = require('lucide-static');

// Factory function for handlebars config
const createHandlebarsConfig = (pathService) => {
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

  // Helper to format numbers
  handlebars.registerHelper('formatNumber', function (num) {
    if (num === null || num === undefined) return '0';
    return Number(num).toLocaleString();
  });

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

  const handlebarsConfig = engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(pathService.views, 'main/layouts'),
    partialsDir: [
      path.join(pathService.views, 'main/partials'),
      path.join(pathService.src, 'components'),
    ],
  });

  // Manually register partials
  const fs = require('fs');
  const userMessagePath = path.join(
    pathService.views,
    'main/partials/components/_user-message.hbs'
  );
  if (fs.existsSync(userMessagePath)) {
    const userMessageTemplate = fs.readFileSync(userMessagePath, 'utf8');
    handlebars.registerPartial('user-message', userMessageTemplate);
  }

  const ideaCardPath = path.join(
    pathService.views,
    'main/partials/components/_idea-card.hbs'
  );
  if (fs.existsSync(ideaCardPath)) {
    const ideaCardTemplate = fs.readFileSync(ideaCardPath, 'utf8');
    handlebars.registerPartial('idea-card', ideaCardTemplate);
    const portfolioCardPath = path.join(
      pathService.views,
      'main/partials/components/_portfolio-card.hbs'
    );
    if (fs.existsSync(portfolioCardPath)) {
      const portfolioCardTemplate = fs.readFileSync(portfolioCardPath, 'utf8');
      handlebars.registerPartial('portfolio-card', portfolioCardTemplate);
    }
  }

  const aiMessagePath = path.join(
    pathService.views,
    'main/partials/components/_ai-message.hbs'
  );
  if (fs.existsSync(aiMessagePath)) {
    const aiMessageTemplate = fs.readFileSync(aiMessagePath, 'utf8');
    handlebars.registerPartial('ai-message', aiMessageTemplate);
  }

  const collaborateNavbarPath = path.join(
    pathService.views,
    'main/partials/_collaborate-navbar.hbs'
  );
  if (fs.existsSync(collaborateNavbarPath)) {
    const collaborateNavbarTemplate = fs.readFileSync(
      collaborateNavbarPath,
      'utf8'
    );
    handlebars.registerPartial(
      'user/collaborate-navbar',
      collaborateNavbarTemplate
    );
  }

  const helpNavbarPath = path.join(
    pathService.views,
    'main/partials/_help-navbar.hbs'
  );
  if (fs.existsSync(helpNavbarPath)) {
    const helpNavbarTemplate = fs.readFileSync(helpNavbarPath, 'utf8');
    handlebars.registerPartial('user/help-navbar', helpNavbarTemplate);
  }

  const ideaRatingWidgetPath = path.join(
    pathService.views,
    'main/partials/components/_idea-rating-widget.hbs'
  );
  if (fs.existsSync(ideaRatingWidgetPath)) {
    const ideaRatingWidgetTemplate = fs.readFileSync(
      ideaRatingWidgetPath,
      'utf8'
    );
    handlebars.registerPartial('_idea-rating-widget', ideaRatingWidgetTemplate);
  }

  const toastPath = path.join(
    pathService.views,
    'main/partials/components/_toast.hbs'
  );
  if (fs.existsSync(toastPath)) {
    const toastTemplate = fs.readFileSync(toastPath, 'utf8');
    handlebars.registerPartial('_toast', toastTemplate);
  }

  const buildStartUpPath = path.join(
    pathService.views,
    'main/partials/components/_build-start-up.hbs'
  );
  if (fs.existsSync(buildStartUpPath)) {
    const buildStartUpTemplate = fs.readFileSync(buildStartUpPath, 'utf8');
    handlebars.registerPartial(
      'components/build-start-up',
      buildStartUpTemplate
    );
  }

  const navbarPath = path.join(
    pathService.views,
    'main/partials/components/_navbar.hbs'
  );
  if (fs.existsSync(navbarPath)) {
    const navbarTemplate = fs.readFileSync(navbarPath, 'utf8');
    handlebars.registerPartial('shared/navbar', navbarTemplate);
  }

  const learnNavbarPath = path.join(
    pathService.views,
    'main/partials/_learn-navbar.hbs'
  );
  if (fs.existsSync(learnNavbarPath)) {
    const learnNavbarTemplate = fs.readFileSync(learnNavbarPath, 'utf8');
    handlebars.registerPartial('user/learn-navbar', learnNavbarTemplate);
  }

  const reportsNavbarPath = path.join(
    pathService.views,
    'main/partials/_reports-navbar.hbs'
  );
  if (fs.existsSync(reportsNavbarPath)) {
    const reportsNavbarTemplate = fs.readFileSync(reportsNavbarPath, 'utf8');
    handlebars.registerPartial('user/reports-navbar', reportsNavbarTemplate);
  }

  const settingsNavbarPath = path.join(
    pathService.views,
    'main/partials/_settings-navbar.hbs'
  );
  if (fs.existsSync(settingsNavbarPath)) {
    const settingsNavbarTemplate = fs.readFileSync(settingsNavbarPath, 'utf8');
    handlebars.registerPartial('user/settings-navbar', settingsNavbarTemplate);
  }

  const corporateNavbarPath = path.join(
    pathService.views,
    'main/partials/_corporate-navbar.hbs'
  );
  if (fs.existsSync(corporateNavbarPath)) {
    const corporateNavbarTemplate = fs.readFileSync(
      corporateNavbarPath,
      'utf8'
    );
    handlebars.registerPartial(
      'admin/corporate-navbar',
      corporateNavbarTemplate
    );
  }

  const enterpriseNavbarPath = path.join(
    pathService.views,
    'main/partials/_enterprise-navbar.hbs'
  );
  if (fs.existsSync(enterpriseNavbarPath)) {
    const enterpriseNavbarTemplate = fs.readFileSync(
      enterpriseNavbarPath,
      'utf8'
    );
    handlebars.registerPartial(
      'admin/enterprise-navbar',
      enterpriseNavbarTemplate
    );
  }

  const ideasListPath = path.join(
    pathService.views,
    'main/partials/components/_ideas-list.hbs'
  );
  if (fs.existsSync(ideasListPath)) {
    const ideasListTemplate = fs.readFileSync(ideasListPath, 'utf8');
    handlebars.registerPartial('components/ideas-list', ideasListTemplate);
  }

  const portfolioListPath = path.join(
    pathService.views,
    'main/partials/components/_portfolio-list.hbs'
  );
  if (fs.existsSync(portfolioListPath)) {
    const portfolioListTemplate = fs.readFileSync(portfolioListPath, 'utf8');
    handlebars.registerPartial(
      'components/portfolio-list',
      portfolioListTemplate
    );
  }

  const ideaModelPath = path.join(
    pathService.views,
    'main/partials/components/_idea-model.hbs'
  );
  if (fs.existsSync(ideaModelPath)) {
    const ideaModelTemplate = fs.readFileSync(ideaModelPath, 'utf8');
    handlebars.registerPartial('_idea-model', ideaModelTemplate);
  }

  const businessModelPath = path.join(
    pathService.views,
    'main/partials/components/_business-model.hbs'
  );
  if (fs.existsSync(businessModelPath)) {
    const businessModelTemplate = fs.readFileSync(businessModelPath, 'utf8');
    handlebars.registerPartial('_business-model', businessModelTemplate);
  }

  const marketingModelPath = path.join(
    pathService.views,
    'main/partials/components/_marketing-model.hbs'
  );
  if (fs.existsSync(marketingModelPath)) {
    const marketingModelTemplate = fs.readFileSync(marketingModelPath, 'utf8');
    handlebars.registerPartial('_marketing-model', marketingModelTemplate);
  }

  const financialModelPath = path.join(
    pathService.views,
    'main/partials/components/_financial-model.hbs'
  );
  if (fs.existsSync(financialModelPath)) {
    const financialModelTemplate = fs.readFileSync(financialModelPath, 'utf8');
    handlebars.registerPartial('_financial-model', financialModelTemplate);
  }

  const teamModelPath = path.join(
    pathService.views,
    'main/partials/components/_team-model.hbs'
  );
  if (fs.existsSync(teamModelPath)) {
    const teamModelTemplate = fs.readFileSync(teamModelPath, 'utf8');
    handlebars.registerPartial('_team-model', teamModelTemplate);
  }

  const legalModelPath = path.join(
    pathService.views,
    'main/partials/components/_legal-model.hbs'
  );
  if (fs.existsSync(legalModelPath)) {
    const legalModelTemplate = fs.readFileSync(legalModelPath, 'utf8');
    handlebars.registerPartial('_legal-model', legalModelTemplate);
  }

  const fundModelPath = path.join(
    pathService.views,
    'main/partials/components/_fund-model.hbs'
  );
  if (fs.existsSync(fundModelPath)) {
    const fundModelTemplate = fs.readFileSync(fundModelPath, 'utf8');
    handlebars.registerPartial('_fund-model', fundModelTemplate);
  }

  return {
    handlebarsConfig,
    handlebars,
  };
};

module.exports = createHandlebarsConfig;
