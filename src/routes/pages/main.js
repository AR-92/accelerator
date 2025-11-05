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
    layout: 'main',
  });
});

// GET enterprise dashboard
router.get('/enterprise-dashboard', (req, res) => {
  res.render('pages/dashboard/enterprise-dashboard', {
    ...getPageData(
      'Enterprise Dashboard - Manage Startups',
      'EnterpriseDashboard'
    ),
    layout: 'main',
  });
});

// GET corporate dashboard
router.get('/corporate-dashboard', (req, res) => {
  // Mock data for corporate dashboard - replace with actual database queries
  const corporateData = {
    activeEnterprises: 12,
    totalEnterprises: 15,
    enterpriseGrowth: '+8.5%',
    recentEnterprises: 3,
    pendingApprovals: 2,
    pendingEnterprises: [
      {
        id: 101,
        name: 'Future Dynamics',
        description: 'AI-powered logistics optimization platform',
        requestedBy: 'Sarah Johnson',
        industry: 'Logistics',
        budget: '$750K',
        submittedDate: '3 days ago',
        daysPending: 3,
      },
      {
        id: 102,
        name: 'GreenTech Innovations',
        description: 'Sustainable energy solutions for urban environments',
        requestedBy: 'Michael Chen',
        industry: 'Clean Energy',
        budget: '$1.2M',
        submittedDate: '5 days ago',
        daysPending: 5,
      },
    ],
    enterpriseList: [
      {
        id: 1,
        name: 'TechCorp Enterprises',
        status: 'Active',
        initiatives: 5,
        revenue: '$2.5M',
        employees: 150,
        lastActivity: '2 hours ago',
      },
      {
        id: 2,
        name: 'Innovate Solutions',
        status: 'Active',
        initiatives: 3,
        revenue: '$1.8M',
        employees: 95,
        lastActivity: '1 day ago',
      },
      {
        id: 3,
        name: 'Future Dynamics',
        status: 'Pending Approval',
        initiatives: 2,
        revenue: '$750K',
        employees: 45,
        lastActivity: '3 days ago',
      },
    ],
    enterpriseStats: {
      totalRevenue: '$15.2M',
      avgRevenue: '$1.1M',
      totalEmployees: 850,
      avgEmployees: 62,
    },
    financialOverview: {
      totalBudget: '$50M',
      allocatedBudget: '$42.5M',
      availableBudget: '$7.5M',
      budgetUtilization: '85%',
      costCenters: [
        {
          name: 'Technology',
          allocated: '$15M',
          spent: '$12.8M',
          utilization: '85%',
          status: 'On Track',
        },
        {
          name: 'Operations',
          allocated: '$12M',
          spent: '$10.2M',
          utilization: '85%',
          status: 'On Track',
        },
        {
          name: 'Marketing',
          allocated: '$8M',
          spent: '$7.5M',
          utilization: '94%',
          status: 'Over Budget',
        },
        {
          name: 'HR & Talent',
          allocated: '$7.5M',
          spent: '$6.8M',
          utilization: '91%',
          status: 'On Track',
        },
        {
          name: 'Facilities',
          allocated: '$5M',
          spent: '$4.2M',
          utilization: '84%',
          status: 'On Track',
        },
        {
          name: 'R&D',
          allocated: '$2.5M',
          spent: '$1.0M',
          utilization: '40%',
          status: 'Under Budget',
        },
      ],
      roiTracking: [
        {
          enterprise: 'TechCorp Enterprises',
          investment: '$2.5M',
          revenue: '$8.2M',
          roi: '228%',
          status: 'Excellent',
        },
        {
          enterprise: 'Innovate Solutions',
          investment: '$1.8M',
          revenue: '$4.1M',
          roi: '128%',
          status: 'Good',
        },
        {
          enterprise: 'Future Dynamics',
          investment: '$750K',
          revenue: '$1.2M',
          roi: '60%',
          status: 'Moderate',
        },
      ],
      budgetVariance: '+2.3%',
      forecastAccuracy: '94%',
    },
    riskCompliance: {
      overallRiskScore: 'Medium',
      complianceStatus: '98.5%',
      activeRisks: 12,
      criticalRisks: 2,
      riskRegister: [
        {
          id: 1,
          enterprise: 'TechCorp Enterprises',
          risk: 'Market Competition',
          category: 'Strategic',
          impact: 'High',
          probability: 'Medium',
          status: 'Mitigating',
          owner: 'Sarah Chen',
        },
        {
          id: 2,
          enterprise: 'Innovate Solutions',
          risk: 'Technology Obsolescence',
          category: 'Operational',
          impact: 'Medium',
          probability: 'Low',
          status: 'Monitoring',
          owner: 'Mike Johnson',
        },
        {
          id: 3,
          enterprise: 'Future Dynamics',
          risk: 'Regulatory Changes',
          category: 'Compliance',
          impact: 'High',
          probability: 'High',
          status: 'Critical',
          owner: 'Lisa Park',
        },
      ],
      complianceMetrics: [
        {
          area: 'Data Privacy',
          status: 'Compliant',
          score: '100%',
          lastAudit: '2 weeks ago',
        },
        {
          area: 'Financial Reporting',
          status: 'Compliant',
          score: '98%',
          lastAudit: '1 week ago',
        },
        {
          area: 'Labor Laws',
          status: 'Review Needed',
          score: '85%',
          lastAudit: '3 weeks ago',
        },
        {
          area: 'Environmental',
          status: 'Compliant',
          score: '97%',
          lastAudit: '1 month ago',
        },
        {
          area: 'Cybersecurity',
          status: 'Compliant',
          score: '99%',
          lastAudit: '1 week ago',
        },
      ],
      auditTrail: [
        {
          action: 'Risk assessment completed',
          enterprise: 'TechCorp Enterprises',
          date: '2 days ago',
          status: 'Approved',
        },
        {
          action: 'Compliance audit passed',
          enterprise: 'All Enterprises',
          date: '1 week ago',
          status: 'Completed',
        },
        {
          action: 'New risk identified',
          enterprise: 'Future Dynamics',
          date: '3 days ago',
          status: 'Under Review',
        },
      ],
    },
    performanceAnalytics: {
      benchmarkData: {
        industryAvg: 78,
        topQuartile: 92,
        corporateAvg: 85,
        bestEnterprise: 'TechCorp Enterprises',
      },
      performanceHeatmap: [
        {
          enterprise: 'TechCorp Enterprises',
          q1: 95,
          q2: 88,
          q3: 92,
          q4: 96,
          average: 93,
        },
        {
          enterprise: 'Innovate Solutions',
          q1: 82,
          q2: 85,
          q3: 78,
          q4: 88,
          average: 83,
        },
        {
          enterprise: 'Future Dynamics',
          q1: 75,
          q2: 80,
          q3: 82,
          q4: 85,
          average: 81,
        },
      ],
      predictiveInsights: [
        {
          insight: 'TechCorp Enterprises shows 15% growth potential in Q2',
          confidence: 'High',
          impact: 'Positive',
        },
        {
          insight: 'Future Dynamics may face resource constraints',
          confidence: 'Medium',
          impact: 'Negative',
        },
        {
          insight: 'Innovate Solutions trending above industry average',
          confidence: 'High',
          impact: 'Positive',
        },
      ],
      kpiTracking: [
        {
          metric: 'Revenue Growth',
          target: '25%',
          actual: '22%',
          status: 'On Track',
        },
        {
          metric: 'Customer Acquisition',
          target: '150',
          actual: '142',
          status: 'On Track',
        },
        {
          metric: 'Employee Satisfaction',
          target: '4.2/5',
          actual: '4.1/5',
          status: 'Slightly Below',
        },
        {
          metric: 'Innovation Index',
          target: '85',
          actual: '88',
          status: 'Exceeding',
        },
      ],
    },
    recentActivities: [
      {
        action: 'New enterprise approved',
        enterprise: 'TechCorp Enterprises',
        time: '2 hours ago',
      },
      {
        action: 'Initiative launched',
        enterprise: 'Innovate Solutions',
        time: '5 hours ago',
      },
      {
        action: 'Revenue milestone reached',
        enterprise: 'Future Dynamics',
        time: '1 day ago',
      },
      {
        action: 'Budget reallocation approved',
        enterprise: 'Marketing',
        time: '3 hours ago',
      },
    ],
  };

  res.render('pages/dashboard/corporate-dashboard', {
    ...getPageData(
      'Corporate Dashboard - Executive Oversight',
      'CorporateDashboard'
    ),
    layout: 'main',
    ...corporateData,
  });
});

// GET dashboard tabs
router.get('/dashboard/tab/business', (req, res) => {
  res.render('pages/dashboard/dashboard-business', {
    ...getPageData('Dashboard - Business', 'Dashboard'),
    layout: 'main',
  });
});

router.get('/dashboard/tab/financial', (req, res) => {
  res.render('pages/dashboard/dashboard-financial', {
    ...getPageData('Dashboard - Financial', 'Dashboard'),
    layout: 'main',
  });
});

router.get('/dashboard/tab/marketing', (req, res) => {
  res.render('pages/dashboard/dashboard-marketing', {
    ...getPageData('Dashboard - Marketing', 'Dashboard'),
    layout: 'main',
  });
});

router.get('/dashboard/tab/fund', (req, res) => {
  res.render('pages/dashboard/dashboard-fund', {
    ...getPageData('Dashboard - Funding', 'Dashboard'),
    layout: 'main',
  });
});

router.get('/dashboard/tab/team', (req, res) => {
  res.render('pages/dashboard/dashboard-team', {
    ...getPageData('Dashboard - Team', 'Dashboard'),
    layout: 'main',
  });
});

router.get('/dashboard/tab/promote', (req, res) => {
  res.render('pages/dashboard/dashboard-promote', {
    ...getPageData('Dashboard - Promotion', 'Dashboard'),
    layout: 'main',
  });
});

// GET team chat
router.get('/chat', (req, res) => {
  res.render('pages/chat/team-chat', {
    ...getPageData('Team Collaboration - Chat', 'Chat'),
    layout: 'main',
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
    layout: 'main',
  });
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
    layout: 'main',
    activeTab: 'profile',
    pageTitle: 'Account Settings',
    pageDescription: 'Manage account and website settings.',
  });
});

// GET settings password
router.get('/settings/password', (req, res) => {
  res.render('pages/account/settings/password', {
    ...getPageData('Account Settings - Password', 'Settings'),
    layout: 'main',
    activeTab: 'password',
    pageTitle: 'Account Settings',
    pageDescription: 'Manage account and website settings.',
  });
});

// GET settings subscription
router.get('/settings/subscription', (req, res) => {
  res.render('pages/account/subscriptions/index', {
    ...getPageData('Account Settings - Subscription', 'Settings'),
    layout: 'main',
    activeTab: 'subscription',
    pageTitle: 'Account Settings',
    pageDescription: 'Manage account and website settings.',
  });
});

// GET settings payment
router.get('/settings/payment', (req, res) => {
  res.render('pages/account/payment/methods', {
    ...getPageData('Account Settings - Payment', 'Settings'),
    layout: 'main',
    activeTab: 'payment',
    pageTitle: 'Account Settings',
    pageDescription: 'Manage account and website settings.',
  });
});

// GET settings votes
router.get('/settings/votes', (req, res) => {
  res.render('pages/account/settings/votes', {
    ...getPageData('Account Settings - Votes', 'Settings'),
    layout: 'main',
    activeTab: 'votes',
    pageTitle: 'Account Settings',
    pageDescription: 'Manage account and website settings.',
  });
});

// GET settings billing
router.get('/settings/billing', (req, res) => {
  res.render('pages/account/billing/history', {
    ...getPageData('Account Settings - Billing', 'Settings'),
    layout: 'main',
    activeTab: 'billing',
    pageTitle: 'Account Settings',
    pageDescription: 'Manage account and website settings.',
  });
});

// GET settings rewards
router.get('/settings/rewards', (req, res) => {
  res.render('pages/account/settings/rewards', {
    ...getPageData('Account Settings - Rewards', 'Settings'),
    layout: 'main',
    activeTab: 'rewards',
    pageTitle: 'Account Settings',
    pageDescription: 'Manage account and website settings.',
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

// POST settings preferences
router.post('/settings/preferences', (req, res) => {
  res.send('<div class="text-green-500">Preferences saved successfully!</div>');
});

// GET subscriptions
router.get('/subscriptions', (req, res) => {
  res.render('pages/account/subscriptions/index', {
    ...getPageData('Subscriptions', 'Subscriptions'),
    layout: 'main',
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
          layout: 'main',
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
        layout: 'main',
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

// GET learn page
router.get('/learn', (req, res) => {
  res.render('pages/learning/courses', {
    ...getPageData('Learn - Accelerator Platform', 'Learn'),
    layout: 'main',
  });
});

// GET help center page
router.get('/help', (req, res) => {
  res.render('pages/help/help-center', {
    ...getPageData('Help Center - Accelerator Platform', 'Help'),
    layout: 'main',
  });
});

// GET buy credits page
router.get('/buy-credits', (req, res) => {
  res.render('pages/account/buy-credits', {
    ...getPageData('Buy Credits - Accelerator Platform', 'BuyCredits'),
    layout: 'main',
  });
});

// GET buy credits page with /pages prefix
router.get('/pages/buy-credits', (req, res) => {
  res.render('pages/account/buy-credits', {
    ...getPageData('Buy Credits - Accelerator Platform', 'BuyCredits'),
    layout: 'main',
  });
});

module.exports = router;
