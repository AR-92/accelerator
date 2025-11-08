const express = require('express');
const router = express.Router();
const { logger } = require('../../../config/logger');

// Helper function for page data
const getPageData = (title, activeKey, padding = 'py-8') => ({
  title: `${title} - Accelerator Platform`,
  [`isActive${activeKey}`]: true,
  mainPadding: padding,
});

// GET dashboard
router.get('/dashboard', (req, res) => {
  res.render('pages/dashboard/startup/overview', {
    ...getPageData('Dashboard - Overview', 'Dashboard'),
    layout: 'startup',
    activeOverview: true,
  });
});

// GET enterprise dashboard
router.get('/enterprise-dashboard', (req, res) => {
  res.render('pages/dashboard/enterprise/overview', {
    ...getPageData('Enterprise Dashboard - Overview', 'EnterpriseDashboard'),
    layout: 'enterprise',
    activeOverview: true,
  });
});

// GET enterprise dashboard startups
router.get('/enterprise-dashboard/startups', (req, res) => {
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
router.get('/dashboard/tab/business', (req, res) => {
  res.render('pages/dashboard/startup/business', {
    ...getPageData('Dashboard - Business', 'Dashboard'),
    layout: 'startup',
    activeBusiness: true,
  });
});

router.get('/dashboard/tab/financial', (req, res) => {
  res.render('pages/dashboard/startup/financial', {
    ...getPageData('Dashboard - Financial', 'Dashboard'),
    layout: 'startup',
    activeFinancial: true,
  });
});

router.get('/dashboard/tab/marketing', (req, res) => {
  res.render('pages/dashboard/startup/marketing', {
    ...getPageData('Dashboard - Marketing', 'Dashboard'),
    layout: 'startup',
    activeMarketing: true,
  });
});

router.get('/dashboard/tab/fund', (req, res) => {
  res.render('pages/dashboard/startup/fund', {
    ...getPageData('Dashboard - Funding', 'Dashboard'),
    layout: 'startup',
    activeFund: true,
  });
});

router.get('/dashboard/tab/team', (req, res) => {
  res.render('pages/dashboard/startup/team', {
    ...getPageData('Dashboard - Team', 'Dashboard'),
    layout: 'startup',
    activeTeam: true,
  });
});

router.get('/dashboard/tab/promote', (req, res) => {
  res.render('pages/dashboard/startup/promote', {
    ...getPageData('Dashboard - Promotion', 'Dashboard'),
    layout: 'startup',
    activePromote: true,
  });
});

router.get('/dashboard/tab/activity-log', (req, res) => {
  res.render('pages/dashboard/startup/activity-log', {
    ...getPageData('Dashboard - Activity Log', 'Dashboard'),
    layout: 'startup',
    activeActivityLog: true,
  });
});

router.get('/dashboard/tab/idea', (req, res) => {
  res.render('pages/dashboard/startup/idea', {
    ...getPageData('Dashboard - Ideas', 'Dashboard'),
    layout: 'startup',
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
router.get('/collaborate/ai-new', (req, res) => {
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
router.post('/collaborate', (req, res) => {
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

// GET settings overview
router.get('/settings', (req, res) => {
  res.render('pages/account/settings/settings-center', {
    ...getPageData('Settings - Accelerator Platform', 'Settings'),
    layout: 'settings',
    activeOverview: true,
  });
});

// GET settings profile
router.get('/settings/profile', (req, res) => {
  res.render('pages/account/settings/profile', {
    ...getPageData('Profile Settings', 'Settings'),
    layout: 'settings',
    activeProfile: true,
  });
});

// GET settings password
router.get('/settings/password', (req, res) => {
  res.render('pages/account/settings/password', {
    ...getPageData('Password Settings', 'Settings'),
    layout: 'settings',
    activePassword: true,
  });
});

// GET settings subscription
router.get('/settings/subscription', (req, res) => {
  res.render('pages/account/subscriptions/index', {
    ...getPageData('Subscription Settings', 'Settings'),
    layout: 'settings',
    activeSubscription: true,
  });
});

// GET settings payment & billing
router.get('/settings/payment-billing', (req, res) => {
  res.render('pages/account/settings/payment-billing', {
    ...getPageData('Payment & Billing', 'Settings'),
    layout: 'settings',
    activePaymentBilling: true,
  });
});

// GET settings votes
router.get('/settings/votes', (req, res) => {
  res.render('pages/account/settings/votes', {
    ...getPageData('Vote Management', 'Settings'),
    layout: 'settings',
    activeVotes: true,
  });
});

// GET settings rewards
router.get('/settings/rewards', (req, res) => {
  res.render('pages/account/settings/rewards', {
    ...getPageData('Voting Rewards', 'Settings'),
    layout: 'settings',
    activeRewards: true,
  });
});

// GET settings credits
router.get('/settings/credits', (req, res) => {
  res.render('pages/account/settings/credits', {
    ...getPageData('Credits Management', 'Settings'),
    layout: 'settings',
    activeCredits: true,
  });
});

// GET subscriptions billing
router.get('/subscriptions/billing', (req, res) => {
  res.render('pages/account/billing/history', {
    ...getPageData('Billing History', 'Subscriptions'),
    layout: 'main',
  });
});

// GET subscriptions payment
router.get('/subscriptions/payment', (req, res) => {
  res.render('pages/account/payment/methods', {
    ...getPageData('Payment Methods', 'Subscriptions'),
    layout: 'main',
  });
});

// GET subscriptions
router.get('/subscriptions', (req, res) => {
  res.render('pages/account/subscriptions/index', {
    ...getPageData('Subscriptions', 'Subscriptions'),
    layout: 'main',
  });
});

// GET subscriptions payment
router.get('/subscriptions/payment', (req, res) => {
  res.render('pages/account/payment/methods', {
    ...getPageData('Payment Methods', 'Subscriptions'),
    layout: 'main',
  });
});

// POST settings preferences
router.post('/settings/preferences', (req, res) => {
  res.send('<div class="text-green-500">Preferences saved successfully!</div>');
});

// GET subscriptions
router.get('/subscriptions', (req, res) => {
  res.render('pages/account/subscriptions/index', {
    ...getPageData('Subscriptions', 'Subscriptions'),
    layout: 'fullwidth',
  });
});

// POST profile settings
router.post('/settings/profile', (req, res) => {
  res.send('<div class="text-green-500">Profile updated successfully!</div>');
});

// POST security settings
router.post('/settings/security', (req, res) => {
  const { newPassword, confirmNewPassword } = req.body;

  if (newPassword !== confirmNewPassword) {
    res.send('<div class="text-red-500">New passwords do not match.</div>');
  } else if (newPassword.length < 6) {
    res.send(
      '<div class="text-red-500">Password must be at least 6 characters.</div>'
    );
  } else {
    res.send(
      '<div class="text-green-500">Password updated successfully!</div>'
    );
  }
});

// POST preference settings
router.post('/settings/preferences', (req, res) => {
  res.send('<div class="text-green-500">Preferences saved successfully!</div>');
});

// GET portfolio
router.get('/portfolio', (req, res) => {
  // Load portfolio data from JSON file asynchronously
  const fs = require('fs').promises;
  const path = require('path');

  const portfolioDataPath = path.join(
    __dirname,
    '../../../data/portfolio.json'
  );

  fs.readFile(portfolioDataPath, 'utf8')
    .then((data) => {
      let portfolioData;
      try {
        portfolioData = JSON.parse(data);
      } catch (parseError) {
        logger.error('Error parsing portfolio data:', parseError);
        return res.render('pages/portfolio/portfolio', {
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

      try {
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
        const categories = [
          ...new Set(portfolioData.map((item) => item.category)),
        ].length;
        const avgVotes =
          portfolioData.length > 0
            ? Math.round(
                portfolioData.reduce((sum, item) => sum + item.votes, 0) /
                  portfolioData.length
              )
            : 0;
        const totalTags = [
          ...new Set(portfolioData.flatMap((item) => item.tags)),
        ].length;

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
          layout: 'fullwidth',
        });
      } catch (processingError) {
        logger.error('Error processing portfolio data:', processingError);
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
    })
    .catch((error) => {
      logger.error('Error reading portfolio data:', error);
      res.render('pages/portfolio/portfolio', {
        ...getPageData('Idea Portfolio', 'Portfolio'),
        ideas: [],
        error: 'Failed to load portfolio data. Please try again later.',
      });
    });
});

// GET individual portfolio idea
router.get('/portfolio/:id', (req, res) => {
  const fs = require('fs').promises;
  const path = require('path');

  const portfolioDataPath = path.join(
    __dirname,
    '../../../data/portfolio.json'
  );

  fs.readFile(portfolioDataPath, 'utf8')
    .then((data) => {
      const portfolioData = JSON.parse(data);
      const idea = portfolioData.find((i) => i.id == req.params.id);

      if (!idea) {
        return res
          .status(404)
          .render(
            'pages/error/page-not-found',
            getPageData('Idea Not Found - Accelerator Platform', '')
          );
      }

      res.render('pages/portfolio/portfolio-idea', {
        ...getPageData('Idea Details', 'Portfolio'),
        idea: idea,
        layout: 'fullwidth',
      });
    })
    .catch((error) => {
      logger.error('Error reading portfolio data:', error);
      res
        .status(500)
        .render(
          'pages/error/page-not-found',
          getPageData('Internal Server Error - Accelerator Platform', '')
        );
    });
});

// GET notifications
router.get('/notifications', (req, res) => {
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
    'pages/startup/promote/valuation/valuation',
    getPageData('Valuation - Coming Soon', 'Valuation')
  );
});

// GET pitch deck
router.get('/pitch-deck', (req, res) => {
  res.render(
    'pages/startup/promote/pitch-deck/pitch-deck',
    getPageData('Pitch Deck - Create & Manage', 'PitchDeck')
  );
});

// GET business plan
router.get('/business-plan', (req, res) => {
  res.render(
    'pages/startup/promote/business-plan/business-plan',
    getPageData('Business Plan - Strategic Planning', 'BusinessPlan')
  );
});

// GET auth login page
router.get('/auth', (req, res) => {
  res.render(
    'pages/auth/auth',
    getPageData('Login - Accelerator Platform', 'Auth')
  );
});

// GET auth signup page
router.get('/auth/signup', (req, res) => {
  res.render(
    'pages/auth/auth-signup',
    getPageData('Sign Up - Accelerator Platform', 'Auth')
  );
});

// GET forgot password page
router.get('/forgot-password', (req, res) => {
  res.render(
    'pages/auth/forgot-password',
    getPageData('Forgot Password - Accelerator Platform', 'Auth')
  );
});

// GET new project page
router.get('/new-project', (req, res) => {
  res.render('pages/projects/create-project', {
    ...getPageData('New Project - Accelerator Platform', 'NewProject'),
    layout: 'main',
  });
});

// GET explore ideas page
router.get('/explore-ideas', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const ideasPath = path.join(__dirname, '../../../data/ideas.json');
  const ideas = JSON.parse(fs.readFileSync(ideasPath, 'utf8'));

  res.render('pages/content/browse-ideas', {
    ...getPageData('Explore Ideas - Accelerator Platform', 'ExploreIdeas'),
    layout: 'main',
    ideas: ideas,
  });
});

// GET upgrade page
router.get('/upgrade', (req, res) => {
  res.render('pages/core/upgrade-plan', {
    ...getPageData('Upgrade to Pro - Accelerator Platform', 'Upgrade'),
    layout: 'main',
  });
});

// GET learn center overview
router.get('/learn', (req, res) => {
  res.render('pages/learn/learn-center', {
    ...getPageData('Learning Center - Accelerator Platform', 'Learn'),
    layout: 'learn',
    activeOverview: true,
  });
});

// GET learn getting started
router.get('/learn/getting-started', (req, res) => {
  res.render('pages/learn/getting-started', {
    ...getPageData('Getting Started - Learning Center', 'Learn'),
    layout: 'learn',
    activeGettingStarted: true,
  });
});

// GET learn courses
router.get('/learn/courses', (req, res) => {
  res.render('pages/learn/courses', {
    ...getPageData('Courses - Learning Center', 'Learn'),
    layout: 'learn',
    activeCourses: true,
  });
});

// GET learn tutorials
router.get('/learn/tutorials', (req, res) => {
  res.render('pages/learn/tutorials', {
    ...getPageData('Tutorials - Learning Center', 'Learn'),
    layout: 'learn',
    activeTutorials: true,
  });
});

// GET learn resources
router.get('/learn/resources', (req, res) => {
  res.render('pages/learn/resources', {
    ...getPageData('Resources - Learning Center', 'Learn'),
    layout: 'learn',
    activeResources: true,
  });
});

// GET help center overview
router.get('/help', (req, res) => {
  res.render('pages/help/help-center', {
    ...getPageData('Help Center - Accelerator Platform', 'Help'),
    layout: 'help',
    activeOverview: true,
  });
});

// GET help getting started
router.get('/help/getting-started', (req, res) => {
  res.render('pages/help/getting-started', {
    ...getPageData('Getting Started - Help Center', 'Help'),
    layout: 'help',
    activeGettingStarted: true,
  });
});

// GET help ai assistant
router.get('/help/ai-assistant', (req, res) => {
  res.render('pages/help/ai-assistant', {
    ...getPageData('AI Assistant - Help Center', 'Help'),
    layout: 'help',
    activeAIAssistant: true,
  });
});

// GET help account billing
router.get('/help/account-billing', (req, res) => {
  res.render('pages/help/account-billing', {
    ...getPageData('Account & Billing - Help Center', 'Help'),
    layout: 'help',
    activeAccountBilling: true,
  });
});

// GET help faq
router.get('/help/faq', (req, res) => {
  res.render('pages/help/faq', {
    ...getPageData('FAQ - Help Center', 'Help'),
    layout: 'help',
    activeFAQ: true,
  });
});

// GET buy credits page
router.get('/buy-credits', (req, res) => {
  res.render('pages/account/buy-credits', {
    ...getPageData('Buy Credits - Accelerator Platform', 'BuyCredits'),
    layout: 'fullwidth',
  });
});

// GET buy credits page with /pages prefix
router.get('/pages/buy-credits', (req, res) => {
  res.render('pages/account/buy-credits', {
    ...getPageData('Buy Credits - Accelerator Platform', 'BuyCredits'),
    layout: 'fullwidth',
  });
});

module.exports = router;
