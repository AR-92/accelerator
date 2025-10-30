const express = require('express');
const router = express.Router();

// Helper function for page data
const getPageData = (title, activeKey, padding = 'py-8') => ({
  title: `${title} - Accelerator Platform`,
  [`isActive${activeKey}`]: true,
  mainPadding: padding
});



// GET dashboard
router.get('/dashboard', (req, res) => {
  res.render('dashboard/dashboard', getPageData('Dashboard - My Ideas', 'Dashboard'));
});

// GET dashboard tabs
router.get('/dashboard/tab/business', (req, res) => {
  res.render('dashboard/dashboard-business', getPageData('Dashboard - Business', 'Dashboard'));
});

router.get('/dashboard/tab/financial', (req, res) => {
  res.render('dashboard/dashboard-financial', getPageData('Dashboard - Financial', 'Dashboard'));
});

router.get('/dashboard/tab/marketing', (req, res) => {
  res.render('dashboard/dashboard-marketing', getPageData('Dashboard - Marketing', 'Dashboard'));
});

router.get('/dashboard/tab/fund', (req, res) => {
  res.render('dashboard/dashboard-fund', getPageData('Dashboard - Funding', 'Dashboard'));
});

router.get('/dashboard/tab/team', (req, res) => {
  res.render('dashboard/dashboard-team', getPageData('Dashboard - Team', 'Dashboard'));
});

router.get('/dashboard/tab/promote', (req, res) => {
  res.render('dashboard/dashboard-promote', getPageData('Dashboard - Promotion', 'Dashboard'));
});

// GET chat
router.get('/chat', (req, res) => {
  res.render('chat/chat', getPageData('Team Collaboration - Chat', 'Chat'));
});

// POST chat message
router.post('/chat', (req, res) => {
  const { message } = req.body;
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
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
  res.render('account/reports', getPageData('Analytics & Reports', 'Reports'));
});

// GET settings (redirect to profile)
router.get('/settings', (req, res) => {
  res.redirect('/pages/settings/profile');
});

// GET settings profile
router.get('/settings/profile', (req, res) => {
  res.render('account/settings/profile', {
    ...getPageData('Account Settings - Profile', 'Settings'),
    layout: 'settings',
    activeTab: 'profile',
    pageTitle: 'Account Settings',
    pageDescription: 'Manage account and website settings.'
  });
});

// GET settings password
router.get('/settings/password', (req, res) => {
  res.render('account/settings/password', {
    ...getPageData('Account Settings - Password', 'Settings'),
    layout: 'settings',
    activeTab: 'password',
    pageTitle: 'Account Settings',
    pageDescription: 'Manage account and website settings.'
  });
});

// GET settings subscription
router.get('/settings/subscription', (req, res) => {
  res.render('account/subscriptions/index', {
    ...getPageData('Account Settings - Subscription', 'Settings'),
    layout: 'settings',
    activeTab: 'subscription',
    pageTitle: 'Account Settings',
    pageDescription: 'Manage account and website settings.'
  });
});

// GET settings payment
router.get('/settings/payment', (req, res) => {
  res.render('account/payment/index', {
    ...getPageData('Account Settings - Payment', 'Settings'),
    layout: 'settings',
    activeTab: 'payment',
    pageTitle: 'Account Settings',
    pageDescription: 'Manage account and website settings.'
  });
});

// GET settings votes
router.get('/settings/votes', (req, res) => {
  res.render('account/settings/votes', {
    ...getPageData('Account Settings - Votes', 'Settings'),
    layout: 'settings',
    activeTab: 'votes',
    pageTitle: 'Account Settings',
    pageDescription: 'Manage account and website settings.'
  });
});

// GET settings billing
router.get('/settings/billing', (req, res) => {
  res.render('account/billing/history', {
    ...getPageData('Account Settings - Billing', 'Settings'),
    layout: 'settings',
    activeTab: 'billing',
    pageTitle: 'Account Settings',
    pageDescription: 'Manage account and website settings.'
  });
});

// GET settings rewards
router.get('/settings/rewards', (req, res) => {
  res.render('account/settings/rewards', {
    ...getPageData('Account Settings - Rewards', 'Settings'),
    layout: 'settings',
    activeTab: 'rewards',
    pageTitle: 'Account Settings',
    pageDescription: 'Manage account and website settings.'
  });
});

// GET subscriptions billing
router.get('/subscriptions/billing', (req, res) => {
  res.render('account/billing/history', getPageData('Billing History', 'Subscriptions'));
});

// GET subscriptions payment
router.get('/subscriptions/payment', (req, res) => {
  res.render('account/payment/methods', getPageData('Payment Methods', 'Subscriptions'));
});

// POST settings preferences
router.post('/settings/preferences', (req, res) => {
  res.send('<div class="text-green-500">Preferences saved successfully!</div>');
});

// GET subscriptions
router.get('/subscriptions', (req, res) => {
  res.render('account/subscriptions/index', getPageData('Subscriptions', 'Subscriptions'));
});

// POST profile settings
router.post('/settings/profile', (req, res) => {
  res.send('<div class="text-green-500">Profile updated successfully!</div>');
});

// POST security settings
router.post('/settings/security', (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  
  if (newPassword !== confirmNewPassword) {
    res.send('<div class="text-red-500">New passwords do not match.</div>');
  } else if (newPassword.length < 6) {
    res.send('<div class="text-red-500">Password must be at least 6 characters.</div>');
  } else {
    res.send('<div class="text-green-500">Password updated successfully!</div>');
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
  
  const portfolioDataPath = path.join(__dirname, '../data/portfolio.json');
  
  fs.readFile(portfolioDataPath, 'utf8')
    .then(data => {
      const portfolioData = JSON.parse(data);
      res.render('portfolio/portfolio', {
        ...getPageData('Idea Portfolio', 'Portfolio'),
        ideas: portfolioData
      });
    })
    .catch(error => {
      console.error('Error reading portfolio data:', error);
      res.render('portfolio/portfolio', {
        ...getPageData('Idea Portfolio', 'Portfolio'),
        ideas: [],
        error: 'Failed to load portfolio data. Please try again later.'
      });
    });
});

// GET individual portfolio idea
router.get('/portfolio/:id', (req, res) => {
  const fs = require('fs').promises;
  const path = require('path');
  
  const portfolioDataPath = path.join(__dirname, '../data/portfolio.json');
  
  fs.readFile(portfolioDataPath, 'utf8')
    .then(data => {
      const portfolioData = JSON.parse(data);
      const idea = portfolioData.find(i => i.id == req.params.id);
      
      if (!idea) {
        return res.status(404).render('public/404', getPageData('Idea Not Found - Accelerator Platform', ''));
      }
      
      res.render('portfolio/portfolio-idea', {
        ...getPageData('Idea Details', 'Portfolio'),
        idea: idea
      });
    })
    .catch(error => {
      console.error('Error reading portfolio data:', error);
      res.status(500).render('public/404', getPageData('Internal Server Error - Accelerator Platform', ''));
    });
});

// GET ideas
router.get('/ideas', (req, res) => {
  res.render('ideas/ideas', getPageData('Submit New Idea', 'Ideas'));
});

// POST new idea
router.post('/ideas', (req, res) => {
  const { title, description, category } = req.body;
  const timestamp = new Date().toLocaleDateString();
  
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

// GET UI test page
router.get('/test-ui', (req, res) => {
  res.render('pages/test-ui', getPageData('UI Test Page', ''));
});

// GET UI test page with minimal layout
router.get('/test-ui-minimal', (req, res) => {
  res.render('public/test-ui-minimal', {
    ...getPageData('UI Test Page (Minimal Layout)', ''),
    layout: 'minimal',
    currentPath: req.path
  });
});

// GET idea model
router.get('/idea-model', (req, res) => {
  res.render('startup/build/idea/idea-model', getPageData('Idea Model - Coming Soon', 'IdeaModel'));
});

// GET business model
router.get('/business-model', (req, res) => {
  res.render('startup/build/business/business-model', getPageData('Business Model - Coming Soon', 'BusinessModel'));
});

// GET financial model
router.get('/financial-model', (req, res) => {
  res.render('startup/build/financial/financial-model', getPageData('Financial Model - Coming Soon', 'FinancialModel'));
});

// GET fund model
router.get('/fund-model', (req, res) => {
  res.render('startup/build/fund/fund-model', getPageData('Fund Model - Coming Soon', 'FundModel'));
});

// GET marketing model
router.get('/marketing-model', (req, res) => {
  res.render('startup/build/marketing/marketing-model', getPageData('Marketing Model - Coming Soon', 'MarketingModel'));
});

// GET team model
router.get('/team-model', (req, res) => {
  res.render('startup/build/team/team-model', getPageData('Team Model - Coming Soon', 'TeamModel'));
});

// GET legal model
router.get('/legal-model', (req, res) => {
  res.render('startup/build/legal/legal-model', getPageData('Legal Model - Coming Soon', 'LegalModel'));
});

// GET valuation
router.get('/valuation', (req, res) => {
  res.render('startup/promote/valuation/valuation', getPageData('Valuation - Coming Soon', 'Valuation'));
});

// GET pitch deck
router.get('/pitch-deck', (req, res) => {
  res.render('startup/promote/pitch-deck/pitch-deck', getPageData('Pitch Deck - Create & Manage', 'PitchDeck'));
});

// GET business plan
router.get('/business-plan', (req, res) => {
  res.render('startup/promote/business-plan/business-plan', getPageData('Business Plan - Strategic Planning', 'BusinessPlan'));
});

// GET auth login page
router.get('/auth', (req, res) => {
  res.render('public/auth/auth', getPageData('Login - Accelerator Platform', 'Auth'));
});

// GET auth signup page
router.get('/auth/signup', (req, res) => {
  res.render('public/auth/auth-signup', getPageData('Sign Up - Accelerator Platform', 'Auth'));
});

module.exports = router;



module.exports = router;