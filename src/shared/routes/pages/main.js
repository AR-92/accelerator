const express = require('express');
const router = express.Router();
const { requireAuth, optionalAuth } = require('../../middleware/auth/auth');
const SettingsController = require('../../controllers/user/SettingsController');
const AuthService = require('../../services/auth/AuthService');
const UserRepository = require('../../repositories/user/UserRepository');
const { db } = require('../../../../../config/database');

// Initialize dependencies
const userRepository = new UserRepository(db);
const authService = new AuthService(userRepository);
const settingsController = new SettingsController(authService);

// Helper function for page data
const getPageData = (title, activeKey, padding = 'py-8') => ({
  title: `${title} - Accelerator Platform`,
  [`isActive${activeKey}`]: true,
  mainPadding: padding,
});

// GET dashboard
router.get('/dashboard', requireAuth, (req, res) => {
  res.render('pages/dashboard/startup/overview', {
    ...getPageData('Dashboard - Overview', 'Dashboard'),
    layout: 'reports',
    activeOverview: true,
  });
});

// GET enterprise dashboard
router.get('/enterprise-dashboard', requireAuth, (req, res) => {
  res.render('pages/dashboard/enterprise/overview', {
    ...getPageData('Enterprise Dashboard - Overview', 'EnterpriseDashboard'),
    layout: 'enterprise',
    activeOverview: true,
  });
});

// GET enterprise dashboard startups
router.get('/enterprise-dashboard/startups', requireAuth, (req, res) => {
  res.render('pages/dashboard/enterprise/startups', {
    ...getPageData('Enterprise Dashboard - Startups', 'EnterpriseDashboard'),
    layout: 'enterprise',
    activeStartups: true,
  });
});

// GET enterprise dashboard projects
router.get('/enterprise-dashboard/projects', (req, res) => {
  res.render('pages/dashboard/enterprise/projects', {
    ...getPageData('Enterprise Dashboard - Projects', 'EnterpriseDashboard'),
    layout: 'enterprise',
    activeProjects: true,
  });
});

// GET enterprise dashboard analytics
router.get('/enterprise-dashboard/analytics', (req, res) => {
  res.render('pages/dashboard/enterprise/analytics', {
    ...getPageData('Enterprise Dashboard - Analytics', 'EnterpriseDashboard'),
    layout: 'enterprise',
    activeAnalytics: true,
  });
});

// GET enterprise dashboard users
router.get('/enterprise-dashboard/users', (req, res) => {
  res.render('pages/dashboard/enterprise/users', {
    ...getPageData('Enterprise Dashboard - Users', 'EnterpriseDashboard'),
    layout: 'enterprise',
    activeUsers: true,
  });
});

// GET enterprise dashboard activity log
router.get('/enterprise-dashboard/activity-log', (req, res) => {
  res.render('pages/dashboard/enterprise/activity-log', {
    ...getPageData(
      'Enterprise Dashboard - Activity Log',
      'EnterpriseDashboard'
    ),
    layout: 'enterprise',
    activeActivityLog: true,
  });
});

// GET corporate dashboard overview
router.get('/corporate-dashboard', (req, res) => {
  res.render('pages/dashboard/corporate/overview', {
    ...getPageData('Corporate Dashboard - Overview', 'CorporateDashboard'),
    layout: 'corporate',
    activeOverview: true,
  });
});

// GET corporate dashboard enterprises
router.get('/corporate-dashboard/enterprises', (req, res) => {
  res.render('pages/dashboard/corporate/enterprises', {
    ...getPageData('Corporate Dashboard - Enterprises', 'CorporateDashboard'),
    layout: 'corporate',
    activeEnterprises: true,
  });
});

// GET corporate dashboard projects
router.get('/corporate-dashboard/projects', (req, res) => {
  res.render('pages/dashboard/corporate/projects', {
    ...getPageData('Corporate Dashboard - Projects', 'CorporateDashboard'),
    layout: 'corporate',
    activeProjects: true,
  });
});

// GET corporate dashboard analytics
router.get('/corporate-dashboard/analytics', (req, res) => {
  res.render('pages/dashboard/corporate/analytics', {
    ...getPageData('Corporate Dashboard - Analytics', 'CorporateDashboard'),
    layout: 'corporate',
    activeAnalytics: true,
  });
});

// GET corporate dashboard users
router.get('/corporate-dashboard/users', (req, res) => {
  res.render('pages/dashboard/corporate/users', {
    ...getPageData('Corporate Dashboard - Users', 'CorporateDashboard'),
    layout: 'corporate',
    activeUsers: true,
  });
});

// GET corporate dashboard activity log
router.get('/corporate-dashboard/activity-log', (req, res) => {
  res.render('pages/dashboard/corporate/activity-log', {
    ...getPageData('Corporate Dashboard - Activity Log', 'CorporateDashboard'),
    layout: 'corporate',
    activeActivityLog: true,
  });
});

// GET dashboard tabs
router.get('/dashboard/tab/business', requireAuth, (req, res) => {
  res.render('pages/dashboard/startup/business', {
    ...getPageData('Dashboard - Business', 'Dashboard'),
    layout: 'reports',
    activeBusiness: true,
  });
});

router.get('/dashboard/tab/financial', requireAuth, (req, res) => {
  res.render('pages/dashboard/startup/financial', {
    ...getPageData('Dashboard - Financial', 'Dashboard'),
    layout: 'reports',
    activeFinancial: true,
  });
});

router.get('/dashboard/tab/marketing', requireAuth, (req, res) => {
  res.render('pages/dashboard/startup/marketing', {
    ...getPageData('Dashboard - Marketing', 'Dashboard'),
    layout: 'reports',
    activeMarketing: true,
  });
});

router.get('/dashboard/tab/fund', requireAuth, (req, res) => {
  res.render('pages/dashboard/startup/fund', {
    ...getPageData('Dashboard - Funding', 'Dashboard'),
    layout: 'reports',
    activeFund: true,
  });
});

router.get('/dashboard/tab/team', requireAuth, (req, res) => {
  res.render('pages/dashboard/startup/team', {
    ...getPageData('Dashboard - Team', 'Dashboard'),
    layout: 'reports',
    activeTeam: true,
  });
});

router.get('/dashboard/tab/promote', requireAuth, (req, res) => {
  res.render('pages/dashboard/startup/promote', {
    ...getPageData('Dashboard - Promotion', 'Dashboard'),
    layout: 'reports',
    activePromote: true,
  });
});

router.get('/dashboard/tab/activity-log', requireAuth, (req, res) => {
  res.render('pages/dashboard/startup/activity-log', {
    ...getPageData('Dashboard - Activity Log', 'Dashboard'),
    layout: 'reports',
    activeActivityLog: true,
  });
});

router.get('/dashboard/tab/idea', requireAuth, (req, res) => {
  res.render('pages/dashboard/startup/idea', {
    ...getPageData('Dashboard - Ideas', 'Dashboard'),
    layout: 'reports',
    activeIdea: true,
  });
});

// GET collaborate
router.get('/collaborate', (req, res) => {
  res.render('pages/collaborate/collaborate', {
    ...getPageData('Collaboration Hub', 'Collaborate'),
    layout: 'collaborate',
    activeDashboard: true,
  });
});

// GET collaborate chat
router.get('/collaborate/chat', (req, res) => {
  res.render('pages/collaborate/chat', {
    ...getPageData('Team Chat', 'Collaborate'),
    layout: 'collaborate',
    activeChat: true,
  });
});

// GET collaborate tasks
router.get('/collaborate/tasks', (req, res) => {
  res.render('pages/collaborate/tasks', {
    ...getPageData('Task Board', 'Collaborate'),
    layout: 'collaborate',
    activeTasks: true,
  });
});

// GET collaborate files
router.get('/collaborate/files', (req, res) => {
  res.render('pages/collaborate/files', {
    ...getPageData('File Repository', 'Collaborate'),
    layout: 'collaborate',
    activeFiles: true,
  });
});

// GET collaborate team
router.get('/collaborate/team', (req, res) => {
  res.render('pages/collaborate/team', {
    ...getPageData('Team Directory', 'Collaborate'),
    layout: 'collaborate',
    activeTeam: true,
  });
});

// GET collaborate calendar
router.get('/collaborate/calendar', (req, res) => {
  res.render('pages/collaborate/calendar', {
    ...getPageData('Team Calendar', 'Collaborate'),
    layout: 'collaborate',
    activeCalendar: true,
  });
});

// GET collaborate activity
router.get('/collaborate/activity', (req, res) => {
  res.render('pages/collaborate/activity', {
    ...getPageData('Activity Timeline', 'Collaborate'),
    layout: 'collaborate',
    activeActivity: true,
  });
});

// GET collaborate settings
router.get('/collaborate/settings', (req, res) => {
  res.render('pages/collaborate/settings', {
    ...getPageData('Collaboration Settings', 'Collaborate'),
    layout: 'collaborate',
    activeSettings: true,
  });
});

// GET AI assistant chat
router.get('/collaborate/ai', (req, res) => {
  res.render(
    'pages/collaborate/ai-chat',
    getPageData('AI Assistant - Chat', 'Collaborate')
  );
});

// GET AI assistant detailed chat
router.get('/collaborate/ai-new', optionalAuth, (req, res) => {
  res.render('pages/collaborate/ai-chat-new', {
    ...getPageData('AI Assistant - Detailed Chat', 'Collaborate'),
    layout: 'main',
  });
});

// GET manus static chat
router.get('/collaborate/manus-static', (req, res) => {
  res.render(
    'pages/collaborate/manus-chat-static',
    getPageData('Manus Static Chat', 'Collaborate')
  );
});

// POST collaborate message
router.post('/pages/collaborate', (req, res) => {
  const { message } = req.body;
  const timestamp = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  res.send(`
    <div class="mb-4">
      <div class="font-medium text-gray-300">You</div>
      <div class="text-gray-400 text-sm mt-1">${message}</div>
      <div class="text-gray-600 text-xs mt-1">${timestamp}</div>
    </div>
  `);
});

// GET reports
router.get('/reports', (req, res) => {
  res.render(
    'pages/account/reports',
    getPageData('Analytics & Reports', 'Reports')
  );
});

// GET subscriptions billing
router.get('/subscriptions/billing', optionalAuth, (req, res) => {
  res.render('pages/account/billing/history', {
    ...getPageData('Billing History', 'Subscriptions'),
    layout: 'main',
  });
});

// GET subscriptions payment
router.get('/subscriptions/payment', optionalAuth, (req, res) => {
  res.render('pages/account/payment/methods', {
    ...getPageData('Payment Methods', 'Subscriptions'),
    layout: 'main',
  });
});

// GET subscriptions
router.get('/subscriptions', (req, res) => {
  res.render('pages/account/subscriptions/index', {
    ...getPageData('Subscriptions', 'Subscriptions'),
    layout: 'settings-billing',
  });
});

// GET subscriptions payment
router.get('/subscriptions/payment', optionalAuth, (req, res) => {
  res.render('pages/account/payment/methods', {
    ...getPageData('Payment Methods', 'Subscriptions'),
    layout: 'main',
  });
});

// POST profile settings
router.post(
  '/settings/profile',
  requireAuth,
  settingsController.updateProfile.bind(settingsController)
);

// POST security settings
router.post(
  '/settings/security',
  requireAuth,
  settingsController.changePassword.bind(settingsController)
);

// POST preference settings
router.post('/settings/preferences', (req, res) => {
  res.send('<div class="text-green-500">Preferences saved successfully!</div>');
});

// API routes for settings
router.post(
  '/api/settings/theme',
  requireAuth,
  settingsController.updateTheme.bind(settingsController)
);
router.get(
  '/api/settings',
  requireAuth,
  settingsController.getSettings.bind(settingsController)
);

// GET portfolio
router.get('/portfolio', requireAuth, async (req, res) => {
  try {
    const container = require('../../container');
    const portfolioRepo = container.get('portfolioRepository');
    let portfolioData = await portfolioRepo.findAll(req.user.id);

    // Handle filtering, sorting, grouping, and search
    const { category, sort, group, search } = req.query;

    if (category && category !== 'All') {
      portfolioData = portfolioData.filter(
        (item) => item.category === category
      );
    }

    if (search) {
      const term = search.toLowerCase();
      portfolioData = portfolioData.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term) ||
          item.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    }

    if (sort) {
      if (sort === 'votes') {
        portfolioData = portfolioData.sort((a, b) => b.votes - a.votes);
      } else if (sort === 'date') {
        portfolioData = portfolioData.sort(
          (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
        );
      }
    }

    let grouped = null;
    if (group === 'category') {
      grouped = portfolioData.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
      }, {});
    }

    // Calculate dynamic stats
    const totalProjects = portfolioData.length;
    const categories = [...new Set(portfolioData.map((item) => item.category))]
      .length;
    const avgVotes =
      portfolioData.length > 0
        ? Math.round(
            portfolioData.reduce((sum, item) => sum + item.votes, 0) /
              portfolioData.length
          )
        : 0;
    const totalTags = [...new Set(portfolioData.flatMap((item) => item.tags))]
      .length;

    res.render('pages/portfolio/portfolio', {
      ...getPageData('Idea Portfolio', 'Portfolio'),
      ideas: portfolioData,
      grouped: grouped,
      currentCategory: category || 'All',
      currentSort: sort || '',
      currentGroup: group || null,
      currentSearch: search || '',
      stats: {
        projects: totalProjects,
        categories: categories,
        avgVotes: avgVotes,
        tags: totalTags,
      },
      layout: 'main',
    });
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    res.render('pages/portfolio/portfolio', {
      ...getPageData('Idea Portfolio', 'Portfolio'),
      ideas: [],
      grouped: null,
      currentCategory: 'All',
      currentSort: '',
      currentGroup: null,
      currentSearch: '',
      stats: { projects: 0, categories: 0, avgVotes: 0, tags: 0 },
      layout: 'main',
    });
  }
});

// GET individual portfolio idea
router.get('/portfolio/:id', optionalAuth, async (req, res) => {
  try {
    const { getPortfolioById } = require('../../services/core/databaseService');
    const idea = await getPortfolioById(req.params.id);

    if (!idea) {
      return res.status(404).render('pages/error/page-not-found', {
        ...getPageData('Idea Not Found - Accelerator Platform', ''),
        layout: 'error-main',
      });
    }

    res.render('pages/portfolio/portfolio-idea', {
      ...getPageData('Idea Details', 'Portfolio'),
      idea: idea,
      layout: 'main',
    });
  } catch (error) {
    console.error('Error fetching portfolio item:', error);
    res.status(500).render('pages/error/page-not-found', {
      ...getPageData('Internal Server Error - Accelerator Platform', ''),
      layout: 'error-main',
    });
  }
});

// GET notifications
router.get('/notifications', optionalAuth, (req, res) => {
  res.render('pages/communication/notifications', {
    ...getPageData('Notifications', 'Notifications'),
    layout: 'main',
  });
});

// GET ideas
router.get('/ideas', (req, res) => {
  res.render('pages/ideas/ideas', getPageData('Submit New Idea', 'Ideas'));
});

// POST new idea
router.post('/ideas', (req, res) => {
  const { title, description, category } = req.body;

  res.send(`
    <div class="bg-gray-900 border border-gray-800 rounded p-6 mb-4 animate-fade-in">
      <div class="flex justify-between items-start">
        <div class="flex-grow">
          <h3 class="text-lg font-medium mb-2">${title}</h3>
          <p class="text-gray-400 mb-4">${description}</p>
          <div class="flex flex-wrap gap-2">
            <span class="px-2 py-1 bg-purple-900/30 text-purple-400 text-xs rounded border border-purple-800/50">${category}</span>
            <span class="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded border border-gray-600">New</span>
          </div>
        </div>
        <div class="flex gap-2 ml-4">
          <button class="p-2 text-gray-400 hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button class="p-2 text-gray-400 hover:text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `);
});

// GET valuation
router.get('/valuation', (req, res) => {
  res.render(
    'pages/reports/valuation',
    getPageData('Valuation - Coming Soon', 'Valuation')
  );
});

// GET pitch deck
router.get('/pitch-deck', (req, res) => {
  res.render(
    'pages/reports/pitch-deck',
    getPageData('Pitch Deck - Create & Manage', 'PitchDeck')
  );
});

// GET business plan
router.get('/business-plan', (req, res) => {
  res.render(
    'pages/reports/business-plan',
    getPageData('Business Plan - Strategic Planning', 'BusinessPlan')
  );
});

// GET new project page
router.get('/new-project', optionalAuth, (req, res) => {
  res.render('pages/projects/create-project', {
    ...getPageData('New Project - Accelerator Platform', 'NewProject'),
    layout: 'main',
  });
});

// GET explore ideas page
router.get('/explore-ideas', optionalAuth, async (req, res) => {
  try {
    const { getAllIdeas } = require('../../services/core/databaseService');
    const ideas = await getAllIdeas(); // Show all ideas for exploration

    res.render('pages/content/browse-ideas', {
      ...getPageData('Explore Ideas - Accelerator Platform', 'ExploreIdeas'),
      layout: 'main',
      ideas: ideas,
    });
  } catch (error) {
    console.error('Error fetching ideas:', error);
    res.render('pages/content/browse-ideas', {
      ...getPageData('Explore Ideas - Accelerator Platform', 'ExploreIdeas'),
      layout: 'main',
      ideas: [],
    });
  }
});

// GET upgrade page
router.get('/upgrade', optionalAuth, (req, res) => {
  res.render('pages/core/upgrade-plan', {
    ...getPageData('Upgrade to Pro - Accelerator Platform', 'Upgrade'),
    layout: 'main',
  });
});

// GET terms and conditions
router.get('/terms', optionalAuth, (req, res) => {
  res.render('pages/legal/terms', {
    title: 'Terms and Conditions - Accelerator Platform',
    layout: 'main',
  });
});

// GET learn center overview
router.get('/learn', optionalAuth, (req, res) => {
  const container = require('../../container');
  const learningController = container.get('learningController');
  learningController.getLearningCenter(req, res);
});

// GET search results (must come before category route)
router.get('/learn/search', optionalAuth, (req, res) => {
  const container = require('../../container');
  const learningController = container.get('learningController');
  learningController.searchArticles(req, res);
});

// GET learn category pages
router.get('/learn/:categorySlug', optionalAuth, (req, res) => {
  const container = require('../../container');
  const learningController = container.get('learningController');
  learningController.getCategoryArticles(req, res);
});

// GET individual article
router.get('/learn/article/:articleSlug', optionalAuth, (req, res) => {
  const container = require('../../container');
  const learningController = container.get('learningController');
  learningController.getArticle(req, res);
});

// GET help center overview
router.get('/help', optionalAuth, (req, res) => {
  const container = require('../../container');
  const helpController = container.get('helpController');
  helpController.getHelpCenter(req, res);
});

// GET individual help article (must come before category route)
router.get('/help/article/:articleSlug', optionalAuth, (req, res) => {
  console.log('ARTICLE ROUTE HIT:', req.params.articleSlug);
  const container = require('../../container');
  const helpController = container.get('helpController');
  helpController.getArticle(req, res);
});

// GET help category pages
router.get('/help/:categorySlug', optionalAuth, (req, res) => {
  const container = require('../../container');
  const helpController = container.get('helpController');
  helpController.getCategoryArticles(req, res);
});

// GET buy credits page
router.get('/buy-credits', optionalAuth, (req, res) => {
  res.render('pages/account/buy-credits', {
    ...getPageData('Buy Credits - Accelerator Platform', 'BuyCredits'),
    layout: 'main',
  });
});

// GET buy credits page with /pages prefix
router.get('/buy-credits', optionalAuth, (req, res) => {
  res.render('pages/account/buy-credits', {
    ...getPageData('Buy Credits - Accelerator Platform', 'BuyCredits'),
    layout: 'main',
  });
});

module.exports = router;
