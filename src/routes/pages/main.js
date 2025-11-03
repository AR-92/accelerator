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
  res.render('pages/dashboard/dashboard', {
    ...getPageData('Dashboard - My Ideas', 'Dashboard'),
    layout: 'testing',
  });
});

// GET dashboard tabs
router.get('/dashboard/tab/business', (req, res) => {
  res.render('pages/dashboard/dashboard-business', {
    ...getPageData('Dashboard - Business', 'Dashboard'),
    layout: 'testing',
  });
});

router.get('/dashboard/tab/financial', (req, res) => {
  res.render('pages/dashboard/dashboard-financial', {
    ...getPageData('Dashboard - Financial', 'Dashboard'),
    layout: 'testing',
  });
});

router.get('/dashboard/tab/marketing', (req, res) => {
  res.render('pages/dashboard/dashboard-marketing', {
    ...getPageData('Dashboard - Marketing', 'Dashboard'),
    layout: 'testing',
  });
});

router.get('/dashboard/tab/fund', (req, res) => {
  res.render('pages/dashboard/dashboard-fund', {
    ...getPageData('Dashboard - Funding', 'Dashboard'),
    layout: 'testing',
  });
});

router.get('/dashboard/tab/team', (req, res) => {
  res.render('pages/dashboard/dashboard-team', {
    ...getPageData('Dashboard - Team', 'Dashboard'),
    layout: 'testing',
  });
});

router.get('/dashboard/tab/promote', (req, res) => {
  res.render('pages/dashboard/dashboard-promote', {
    ...getPageData('Dashboard - Promotion', 'Dashboard'),
    layout: 'testing',
  });
});

// GET team chat
router.get('/chat', (req, res) => {
  res.render('pages/chat/team-chat', {
    ...getPageData('Team Collaboration - Chat', 'Chat'),
    layout: 'testing',
  });
});

// GET AI assistant chat
router.get('/chat/ai', (req, res) => {
  res.render('pages/chat/ai-chat', getPageData('AI Assistant - Chat', 'Chat'));
});

// GET AI assistant detailed chat
router.get('/chat/ai-new', (req, res) => {
  res.render('pages/chat/ai-chat-new', {
    ...getPageData('AI Assistant - Detailed Chat', 'Chat'),
    layout: 'testing',
  });
});

// GET manus static chat
router.get('/chat/manus-static', (req, res) => {
  res.render(
    'pages/chat/manus-chat-static',
    getPageData('Manus Static Chat', 'Chat')
  );
});

// GET manus static chat
router.get('/chat/manus-static', (req, res) => {
  res.render(
    'pages/chat/manus-chat-static',
    getPageData('Manus Static Chat', 'Chat')
  );
});

// POST chat message
router.post('/chat', (req, res) => {
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

// GET settings (redirect to profile)
router.get('/settings', (req, res) => {
  res.redirect('/pages/settings/profile');
});

// GET settings profile
router.get('/settings/profile', (req, res) => {
  res.render('pages/account/settings/profile', {
    ...getPageData('Account Settings - Profile', 'Settings'),
    layout: 'testing',
    activeTab: 'profile',
    pageTitle: 'Account Settings',
    pageDescription: 'Manage account and website settings.',
  });
});

// GET settings password
router.get('/settings/password', (req, res) => {
  res.render('pages/account/settings/password', {
    ...getPageData('Account Settings - Password', 'Settings'),
    layout: 'testing',
    activeTab: 'password',
    pageTitle: 'Account Settings',
    pageDescription: 'Manage account and website settings.',
  });
});

// GET settings subscription
router.get('/settings/subscription', (req, res) => {
  res.render('pages/account/subscriptions/index', {
    ...getPageData('Account Settings - Subscription', 'Settings'),
    layout: 'testing',
    activeTab: 'subscription',
    pageTitle: 'Account Settings',
    pageDescription: 'Manage account and website settings.',
  });
});

// GET settings payment
router.get('/settings/payment', (req, res) => {
  res.render('pages/account/payment/index', {
    ...getPageData('Account Settings - Payment', 'Settings'),
    layout: 'testing',
    activeTab: 'payment',
    pageTitle: 'Account Settings',
    pageDescription: 'Manage account and website settings.',
  });
});

// GET settings votes
router.get('/settings/votes', (req, res) => {
  res.render('pages/account/settings/votes', {
    ...getPageData('Account Settings - Votes', 'Settings'),
    layout: 'testing',
    activeTab: 'votes',
    pageTitle: 'Account Settings',
    pageDescription: 'Manage account and website settings.',
  });
});

// GET settings billing
router.get('/settings/billing', (req, res) => {
  res.render('pages/account/billing/history', {
    ...getPageData('Account Settings - Billing', 'Settings'),
    layout: 'testing',
    activeTab: 'billing',
    pageTitle: 'Account Settings',
    pageDescription: 'Manage account and website settings.',
  });
});

// GET settings rewards
router.get('/settings/rewards', (req, res) => {
  res.render('pages/account/settings/rewards', {
    ...getPageData('Account Settings - Rewards', 'Settings'),
    layout: 'testing',
    activeTab: 'rewards',
    pageTitle: 'Account Settings',
    pageDescription: 'Manage account and website settings.',
  });
});

// GET subscriptions billing
router.get('/subscriptions/billing', (req, res) => {
  res.render(
    'pages/account/billing/history',
    {
      ...getPageData('Billing History', 'Subscriptions'),
      layout: 'testing'
    }
  );
});

// GET subscriptions payment
router.get('/subscriptions/payment', (req, res) => {
  res.render(
    'pages/account/payment/methods',
    {
      ...getPageData('Payment Methods', 'Subscriptions'),
      layout: 'testing'
    }
  );
});

// POST settings preferences
router.post('/settings/preferences', (req, res) => {
  res.send('<div class="text-green-500">Preferences saved successfully!</div>');
});

// GET subscriptions
router.get('/subscriptions', (req, res) => {
  res.render(
    'pages/account/subscriptions/index',
    {
      ...getPageData('Subscriptions', 'Subscriptions'),
      layout: 'testing',
    }
  );
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
      const portfolioData = JSON.parse(data);
      res.render('pages/portfolio/portfolio', {
        ...getPageData('Idea Portfolio', 'Portfolio'),
        ideas: portfolioData,
        layout: 'testing',
      });
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
            'pages/404',
            getPageData('Idea Not Found - Accelerator Platform', '')
          );
      }

      res.render('pages/portfolio/portfolio-idea', {
        ...getPageData('Idea Details', 'Portfolio'),
        idea: idea,
        layout: 'testing',
      });
    })
    .catch((error) => {
      logger.error('Error reading portfolio data:', error);
      res
        .status(500)
        .render(
          'pages/404',
          getPageData('Internal Server Error - Accelerator Platform', '')
        );
    });
});

// GET notifications
router.get('/notifications', (req, res) => {
  res.render('pages/notifications', {
    ...getPageData('Notifications', 'Notifications'),
    layout: 'testing',
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

// GET idea model
router.get('/idea-model', (req, res) => {
  res.render(
    'pages/startup/build/idea/idea-model',
    getPageData('Idea Model - Coming Soon', 'IdeaModel')
  );
});

// GET business model
router.get('/business-model', (req, res) => {
  res.render(
    'pages/startup/build/business/business-model',
    getPageData('Business Model - Coming Soon', 'BusinessModel')
  );
});

// GET financial model
router.get('/financial-model', (req, res) => {
  res.render(
    'pages/startup/build/financial/financial-model',
    getPageData('Financial Model - Coming Soon', 'FinancialModel')
  );
});

// GET fund model
router.get('/fund-model', (req, res) => {
  res.render(
    'pages/startup/build/fund/fund-model',
    getPageData('Fund Model - Coming Soon', 'FundModel')
  );
});

// GET marketing model
router.get('/marketing-model', (req, res) => {
  res.render(
    'pages/startup/build/marketing/marketing-model',
    getPageData('Marketing Model - Coming Soon', 'MarketingModel')
  );
});

// GET team model
router.get('/team-model', (req, res) => {
  res.render(
    'pages/startup/build/team/team-model',
    getPageData('Team Model - Coming Soon', 'TeamModel')
  );
});

// GET legal model
router.get('/legal-model', (req, res) => {
  res.render(
    'pages/startup/build/legal/legal-model',
    getPageData('Legal Model - Coming Soon', 'LegalModel')
  );
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
  res.render('pages/new-project', {
    ...getPageData('New Project - Accelerator Platform', 'NewProject'),
    layout: 'testing',
  });
});

// GET explore ideas page
router.get('/explore-ideas', (req, res) => {
  res.render('pages/explore-ideas', {
    ...getPageData('Explore Ideas - Accelerator Platform', 'ExploreIdeas'),
    layout: 'testing',
  });
});

// GET upgrade page
router.get('/upgrade', (req, res) => {
  res.render('pages/upgrade', {
    ...getPageData('Upgrade to Pro - Accelerator Platform', 'Upgrade'),
    layout: 'testing',
  });
});

// GET learn page
router.get('/learn', (req, res) => {
  res.render('pages/learn', {
    ...getPageData('Learn - Accelerator Platform', 'Learn'),
    layout: 'testing',
  });
});

module.exports = router;

module.exports = router;
