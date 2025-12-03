// Import controllers from organized folders

import {
  getProfileSettings,
  postProfileSettings,
} from './admin/get-profile-settings.js';
import { getSettings, postSettings } from './admin/get-settings.js';
import { getSystemHealth } from './admin/get-system-health.js';
import { getSystemConfig } from './admin/get-system-config.js';
import { getSystemLogs } from './admin/get-system-logs.js';
import { getNotifications } from './admin/get-notifications.js';

import {
  getActivity,
  exportActivityCSV,
  exportActivityJSON,
} from './admin/get-activity.js';
import { postLogout } from './admin/post-logout.js';
import { csrfProtection } from '../middleware/security/csrf.js';
import formConfigs from '../config/formConfigs.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import express from 'express';
import { createClient } from '@supabase/supabase-js';

import { getDashboard } from './overview/get-dashboard.js';
import { getPortfolio } from './overview/get-portfolio.js';
import { getPortfolioPage } from './overview/get-portfolio-page.js';
import { getCollaborate } from './overview/get-collaborate.js';
import { getNewProject } from './overview/get-new-project.js';
import { getExploreIdeas } from './overview/get-explore-ideas.js';
import { getAllProjects } from './projects/get-all-projects.js';
import { getProjectDetail } from './projects/get-project-detail.js';

import { getChat } from './collaborate/chat.js';
import { getTasks } from './collaborate/tasks.js';
import { getFiles } from './collaborate/files.js';
import { getTeam } from './collaborate/team.js';
import { getCalendar } from './collaborate/calendar.js';
import { getActivity as getActivityCollaborate } from './collaborate/activity.js';
import { getSettings as getSettingsCollaborate } from './collaborate/settings.js';

import { getHelp } from './help/index.js';
import { getLearn } from './learn/index.js';
import { getSettings as getSettingsPage } from './settings/index.js';
import { getBilling } from './billing/index.js';
import { serviceFactory } from '../services/serviceFactory.js';

import {
  getDashboardMain,
  getDashboardOverview,
  getDashboardIdea,
  getDashboardBusiness,
  getDashboardFinancial,
  getDashboardMarketing,
  getDashboardFund,
  getDashboardTeam,
  getDashboardPromote,
  getDashboardActivityLog,
} from './startup-dashboard/index.js';
import {
  getEnterpriseMain,
  getEnterpriseOverview,
  getEnterpriseStartups,
  getEnterpriseProjects,
  getEnterpriseAnalytics,
  getEnterpriseUsers,
  getEnterpriseActivityLog,
} from './enterprise-dashboard/index.js';
import {
  getCorporateMain,
  getCorporateOverview,
  getCorporateEnterprises,
  getCorporateProjects,
  getCorporateAnalytics,
  getCorporateUsers,
  getCorporateActivityLog,
} from './corporate-dashboard/index.js';

import { requireAuth, checkAuth } from '../middleware/auth/index.js';

// Re-export for backward compatibility

export { getProfileSettings, postProfileSettings };
export { getSettings, postSettings };
export { getSystemHealth };
export { getSystemConfig };
export { getSystemLogs };
export { getNotifications };

export { getActivity, exportActivityCSV, exportActivityJSON };
export { postLogout };
export { getDashboard };
export { getPortfolio };
export { getPortfolioPage };
export { getCollaborate };
export { getNewProject };
export { getExploreIdeas };
export { getAllProjects };
export { getProjectDetail };

export { getChat };
export { getTasks };
export { getFiles };
export { getTeam };
export { getCalendar };
export { getActivityCollaborate };
export { getSettingsCollaborate };

export { getDashboardActivityLog };

import { requireWebAuth } from '../middleware/auth/index.js';

// File upload configuration
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/svg+xml',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    // Check file type
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          `Invalid file type: ${file.mimetype}. Allowed types: ${allowedTypes.join(', ')}`
        ),
        false
      );
    }

    // Additional security checks
    if (
      file.originalname.includes('..') ||
      file.originalname.includes('/') ||
      file.originalname.includes('\\')
    ) {
      return cb(new Error('Invalid filename'), false);
    }

    cb(null, true);
  },
});

// Admin routes setup
export default function adminRoutes(app) {
  // Root route - redirect to startup dashboard overview
  app.get('/', requireWebAuth, (req, res) => {
    res.redirect('/startup-dashboard');
  });

  // Main pages (server-side auth protection)
  app.get('/admin/profile-settings', requireWebAuth, getProfileSettings);
  app.get('/admin/settings', requireWebAuth, getSettings);
  app.get('/admin/system-health', requireWebAuth, getSystemHealth);
  app.get('/admin/system-config', requireWebAuth, getSystemConfig);
  app.get('/admin/system-logs', requireWebAuth, getSystemLogs);
  app.get('/admin/notifications', requireWebAuth, getNotifications);

  app.get('/admin/activity', requireWebAuth, getActivity);
  app.post('/admin/logout', postLogout);

  // Overview pages (server-side auth protection)
  app.get('/admin/dashboard', requireWebAuth, getDashboard);
  app.get('/admin/portfolio', requireWebAuth, getPortfolio);
  app.get('/admin/collaborate', requireWebAuth, getCollaborate);
  app.get('/admin/new-project', requireWebAuth, getNewProject);
  app.get('/admin/explore-ideas', requireWebAuth, getExploreIdeas);

  app.post('/admin/ideas/:id/publish', requireWebAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const ideaService = serviceFactory.getIdeaService();
      const updatedIdea = await ideaService.publishIdea(id);
      res.json({ success: true, idea: updatedIdea });
    } catch (error) {
      console.error('Error publishing idea:', error);
      res.status(500).json({ error: 'Failed to publish idea' });
    }
  });

  app.post('/admin/ideas/:id/unpublish', requireWebAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const ideaService = serviceFactory.getIdeaService();
      const updatedIdea = await ideaService.unpublishIdea(id);
      res.json({ success: true, idea: updatedIdea });
    } catch (error) {
      console.error('Error unpublishing idea:', error);
      res.status(500).json({ error: 'Failed to unpublish idea' });
    }
  });

  app.get('/projects/all-projects', requireWebAuth, getAllProjects);
  app.get('/projects/idea-model', (req, res) => {
    const steps = [
      {
        number: 1,
        iconName: 'file-text',
        title: 'On-Boarding',
        description:
          'So you have an idea, that is great! We will help with some questions to get you started on your entrepreneurial journey.',
        time: '2.3s',
        confidence: '98%',
      },
      {
        number: 2,
        iconName: 'alert-triangle',
        title: 'Problem',
        description:
          'Write the problem that you want to solve with assumptions, and share it to validate that this is a real problem needs to be solved.',
        time: '5.7s',
        confidence: '95%',
      },
      {
        number: 3,
        iconName: 'check-circle',
        title: 'Solution',
        description:
          'Enter your solution for the proposed problem and how to overcome it.',
        time: '8.2s',
        confidence: '92%',
      },
      {
        number: 4,
        iconName: 'users',
        title: 'Customers',
        description:
          'Propose your customers segments, early adopters, and unique value proposition.',
        time: '3.1s',
        confidence: '96%',
      },
      {
        number: 5,
        iconName: 'palette',
        title: 'Brand',
        description:
          'Add your visual identity of your solution or startup to make it unique and easy to remember by customers.',
        time: '4.2s',
        confidence: '94%',
      },
      {
        number: 6,
        iconName: 'shield',
        title: 'IP',
        description:
          'Protect your idea by uploading your IP domain, elements, and any document which proof that you are the real owner of that idea.',
        time: '6.8s',
        confidence: '91%',
      },
    ];

    res.render('projects/idea-model', {
      layout: 'main',
      title: 'Idea Generation Model',
      section: 'main',
      currentSection: 'main',
      currentPage: 'Idea Model',
      steps: steps,
      formConfigs: formConfigs,
      progressBars1: [
        '<div class="bg-step-kpi h-4 rounded-l-full flex-1 transition-all duration-500" title="Problem Validation - Completed"></div>',
        '<div class="bg-step-revenue h-4 flex-1 transition-all duration-500" title="Solution Development - Completed"></div>',
        '<div class="bg-muted h-4 flex-1" title="Customer Model - Remaining"></div>',
        '<div class="bg-muted h-4 flex-1" title="Branding - Remaining"></div>',
        '<div class="bg-muted h-4 rounded-r-full flex-1" title="IP Protection - Remaining"></div>',
      ],
      progressLabels1: [
        '<span class="text-step-kpi font-medium">Problem</span>',
        '<span class="text-step-revenue font-medium">Solution</span>',
        '<span>Customer</span>',
        '<span>Branding</span>',
        '<span>IP</span>',
      ],
      progressBars2: [
        '<div class="bg-step-kpi h-4 rounded-l-full flex-1 transition-all duration-500" title="Problem Validation - Completed"></div>',
        '<div class="bg-step-revenue h-4 flex-1 transition-all duration-500" title="Solution Development - Completed"></div>',
        '<div class="bg-step-streams h-4 flex-1 transition-all duration-500" title="Customer Model - Completed"></div>',
        '<div class="bg-muted h-4 flex-1" title="Branding - Remaining"></div>',
        '<div class="bg-muted h-4 rounded-r-full flex-1" title="IP Protection - Remaining"></div>',
      ],
      progressLabels2: [
        '<span class="text-step-kpi font-medium">Problem</span>',
        '<span class="text-step-revenue font-medium">Solution</span>',
        '<span class="text-step-streams font-medium">Customer</span>',
        '<span>Branding</span>',
        '<span>IP</span>',
      ],
      progressBars3: [
        '<div class="bg-step-kpi h-4 rounded-l-full flex-1 transition-all duration-500" title="Problem Validation - Completed"></div>',
        '<div class="bg-step-revenue h-4 flex-1 transition-all duration-500" title="Solution Development - Completed"></div>',
        '<div class="bg-step-streams h-4 flex-1 transition-all duration-500" title="Customer Model - Completed"></div>',
        '<div class="bg-step-cogs h-4 flex-1 transition-all duration-500" title="Branding - Completed"></div>',
        '<div class="bg-muted h-4 rounded-r-full flex-1" title="IP Protection - Remaining"></div>',
      ],
      progressLabels3: [
        '<span class="text-step-kpi font-medium">Problem</span>',
        '<span class="text-step-revenue font-medium">Solution</span>',
        '<span class="text-step-streams font-medium">Customer</span>',
        '<span class="text-step-cogs font-medium">Branding</span>',
        '<span>IP</span>',
      ],
      progressBars4: [
        '<div class="bg-step-kpi h-4 rounded-l-full flex-1 transition-all duration-500" title="Problem Validation - Completed"></div>',
        '<div class="bg-step-revenue h-4 flex-1 transition-all duration-500" title="Solution Development - Completed"></div>',
        '<div class="bg-step-streams h-4 flex-1 transition-all duration-500" title="Customer Model - Completed"></div>',
        '<div class="bg-step-cogs h-4 flex-1 transition-all duration-500" title="Branding - Completed"></div>',
        '<div class="bg-step-opex h-4 rounded-r-full flex-1 transition-all duration-500" title="IP Protection - Completed"></div>',
      ],
      progressLabels4: [
        '<span class="text-step-kpi font-medium">Problem</span>',
        '<span class="text-step-revenue font-medium">Solution</span>',
        '<span class="text-step-streams font-medium">Customer</span>',
        '<span class="text-step-cogs font-medium">Branding</span>',
        '<span class="text-step-opex font-medium">IP</span>',
      ],
      progressBars5: [
        '<div class="bg-step-kpi h-4 rounded-l-full flex-1 transition-all duration-500" title="Problem Validation - Completed"></div>',
        '<div class="bg-step-revenue h-4 flex-1 transition-all duration-500" title="Solution Development - Completed"></div>',
        '<div class="bg-step-streams h-4 flex-1 transition-all duration-500" title="Customer Model - Completed"></div>',
        '<div class="bg-step-cogs h-4 flex-1 transition-all duration-500" title="Branding - Completed"></div>',
        '<div class="bg-step-opex h-4 rounded-r-full flex-1 transition-all duration-500" title="IP Protection - Completed"></div>',
      ],
      progressLabels5: [
        '<span class="text-step-kpi font-medium">Problem</span>',
        '<span class="text-step-revenue font-medium">Solution</span>',
        '<span class="text-step-streams font-medium">Customer</span>',
        '<span class="text-step-cogs font-medium">Branding</span>',
        '<span class="text-step-opex font-medium">IP</span>',
      ],
    });
  });
  app.get('/projects/business-model', requireWebAuth, (req, res) => {
    res.render('projects/business-model', {
      layout: 'main',
      title: 'Business Model Canvas',
      section: 'main',
      currentSection: 'main',
      currentPage: 'Business Model',
    });
  });
  app.get('/projects/business-plan', requireWebAuth, (req, res) => {
    res.render('projects/business-plan', {
      layout: 'main',
      title: 'Business Plan',
      section: 'main',
      currentSection: 'main',
      currentPage: 'Business Plan',
    });
  });
  app.get('/projects/financial-model', requireWebAuth, (req, res) => {
    res.render('projects/financial-model', {
      layout: 'main',
      title: 'Financial Model',
      section: 'main',
      currentSection: 'main',
      currentPage: 'Financial Model',
    });
  });
  app.get('/projects/funding-model', requireWebAuth, (req, res) => {
    res.render('projects/funding-model', {
      layout: 'main',
      title: 'Funding Model',
      section: 'main',
      currentSection: 'main',
      currentPage: 'Funding Model',
    });
  });
  app.get('/projects/legal-model', requireWebAuth, (req, res) => {
    res.render('projects/legal-model', {
      layout: 'main',
      title: 'Legal Model',
      section: 'main',
      currentSection: 'main',
      currentPage: 'Legal Model',
    });
  });
  app.get('/projects/marketing-model', requireWebAuth, (req, res) => {
    res.render('projects/marketing-model', {
      layout: 'main',
      title: 'Marketing Model',
      section: 'main',
      currentSection: 'main',
      currentPage: 'Marketing Model',
    });
  });
  app.get('/projects/pitch-deck', requireWebAuth, (req, res) => {
    res.render('projects/pitch-deck', {
      layout: 'main',
      title: 'Pitch Deck',
      section: 'main',
      currentSection: 'main',
      currentPage: 'Pitch Deck',
    });
  });
  app.get('/projects/team-model', requireWebAuth, (req, res) => {
    res.render('projects/team-model', {
      layout: 'main',
      title: 'Team Model',
      section: 'main',
      currentSection: 'main',
      currentPage: 'Team Model',
    });
  });
  app.get('/projects/valuation', requireWebAuth, (req, res) => {
    res.render('projects/valuation', {
      layout: 'main',
      title: 'Valuation',
      section: 'main',
      currentSection: 'main',
      currentPage: 'Valuation',
    });
  });
  app.get('/projects/:id', requireWebAuth, getProjectDetail);
  app.get(
    '/admin/other-pages/profile-settings',
    requireWebAuth,
    getProfileSettings
  );
  app.post(
    '/admin/other-pages/profile-settings',
    requireWebAuth,
    postProfileSettings
  );
  app.get('/admin/other-pages/settings', requireWebAuth, getSettings);
  app.post('/admin/other-pages/settings', requireWebAuth, postSettings);
  app.get('/admin/other-pages/system-health', requireWebAuth, getSystemHealth);
  app.get('/admin/other-pages/system-config', requireWebAuth, getSystemConfig);
  app.get('/admin/other-pages/system-logs', requireWebAuth, getSystemLogs);
  app.get('/admin/other-pages/notifications', requireWebAuth, getNotifications);
  app.get('/admin/other-pages/activity', requireWebAuth, getActivity);
  app.get(
    '/admin/other-pages/activity/export/csv',
    requireWebAuth,
    exportActivityCSV
  );
  app.get(
    '/admin/other-pages/activity/export/json',
    requireWebAuth,
    exportActivityJSON
  );
  app.get('/admin/other-pages/dashboard', requireWebAuth, getDashboard);
  app.get('/admin/other-pages/portfolio', requireWebAuth, getPortfolio);
  app.get('/pages/portfolio', requireWebAuth, getPortfolioPage);
  app.get('/admin/other-pages/collaborate', requireWebAuth, getCollaborate);
  app.get('/admin/other-pages/new-project', requireWebAuth, getNewProject);
  app.get('/admin/other-pages/explore-ideas', requireWebAuth, getExploreIdeas);

  // Collaboration pages
  app.get('/pages/collaborate/chat', requireWebAuth, getChat);
  app.get('/pages/collaborate/tasks', requireWebAuth, getTasks);
  app.get('/pages/collaborate/files', requireWebAuth, getFiles);
  app.get('/pages/collaborate/team', requireWebAuth, getTeam);
  app.get('/pages/collaborate/calendar', requireWebAuth, getCalendar);
  app.get(
    '/pages/collaborate/activity',
    requireWebAuth,
    getActivityCollaborate
  );
  app.get(
    '/pages/collaborate/settings',
    requireWebAuth,
    getSettingsCollaborate
  );

  // Help pages
  app.get('/pages/help', requireWebAuth, getHelp);

  // Learn pages
  app.get('/pages/learn', requireWebAuth, getLearn);

  // Settings pages
  app.get('/pages/settings', requireWebAuth, getSettingsPage);

  // Billing pages
  app.get('/pages/billing', requireWebAuth, getBilling);

  // Startup Dashboard pages
  app.get('/startup-dashboard', requireWebAuth, getDashboardMain);
  app.get('/startup-dashboard/overview', requireWebAuth, getDashboardOverview);
  app.get('/startup-dashboard/idea', requireWebAuth, getDashboardIdea);
  app.get('/startup-dashboard/business', requireWebAuth, getDashboardBusiness);
  app.get(
    '/startup-dashboard/financial',
    requireWebAuth,
    getDashboardFinancial
  );
  app.get(
    '/startup-dashboard/marketing',
    requireWebAuth,
    getDashboardMarketing
  );
  app.get('/startup-dashboard/fund', requireWebAuth, getDashboardFund);
  app.get('/startup-dashboard/team', requireWebAuth, getDashboardTeam);
  app.get('/startup-dashboard/promote', requireWebAuth, getDashboardPromote);
  app.get(
    '/startup-dashboard/activity-log',
    requireWebAuth,
    getDashboardActivityLog
  );

  // Enterprise Dashboard pages
  app.get('/enterprise-dashboard', requireWebAuth, getEnterpriseMain);
  app.get(
    '/enterprise-dashboard/overview',
    requireWebAuth,
    getEnterpriseOverview
  );
  app.get(
    '/enterprise-dashboard/startups',
    requireWebAuth,
    getEnterpriseStartups
  );
  app.get(
    '/enterprise-dashboard/projects',
    requireWebAuth,
    getEnterpriseProjects
  );
  app.get(
    '/enterprise-dashboard/analytics',
    requireWebAuth,
    getEnterpriseAnalytics
  );
  app.get('/enterprise-dashboard/users', requireWebAuth, getEnterpriseUsers);
  app.get(
    '/enterprise-dashboard/activity-log',
    requireWebAuth,
    getEnterpriseActivityLog
  );

  // Corporate Dashboard pages
  app.get('/corporate-dashboard', requireWebAuth, getCorporateMain);
  app.get(
    '/corporate-dashboard/overview',
    requireWebAuth,
    getCorporateOverview
  );
  app.get(
    '/corporate-dashboard/enterprises',
    requireWebAuth,
    getCorporateEnterprises
  );
  app.get(
    '/corporate-dashboard/projects',
    requireWebAuth,
    getCorporateProjects
  );
  app.get(
    '/corporate-dashboard/analytics',
    requireWebAuth,
    getCorporateAnalytics
  );
  app.get('/corporate-dashboard/users', requireWebAuth, getCorporateUsers);
  app.get(
    '/corporate-dashboard/activity-log',
    requireWebAuth,
    getCorporateActivityLog
  );

  // Additional pages
  app.get('/pages/terms', requireWebAuth, (req, res) => {
    res.render('terms', { layout: 'main', title: 'Terms and Conditions' });
  });
  app.get('/pages/core/upgrade-plan', requireWebAuth, (req, res) => {
    const filterLinks = [
      {
        id: 'billing-link',
        href: '/pages/billing',
        text: 'Billing',
        icon: 'credit-card',
      },
      {
        id: 'buy-credits-link',
        href: '/pages/buy-credits',
        text: 'Buy Credits',
        icon: 'coins',
      },
      {
        id: 'upgrade-plan-link',
        href: '/pages/core/upgrade-plan',
        text: 'Upgrade Plan',
        icon: 'star',
      },
    ];
    res.render('upgrade-plan', {
      layout: 'main',
      title: 'Upgrade Plan',
      currentSection: 'billing',
      currentPage: 'Upgrade Plan',
      filterLinks,
      section: 'billing',
    });
  });
  app.get('/pages/buy-credits', requireWebAuth, (req, res) => {
    const filterLinks = [
      {
        id: 'billing-link',
        href: '/pages/billing',
        text: 'Billing',
        icon: 'credit-card',
      },
      {
        id: 'buy-credits-link',
        href: '/pages/buy-credits',
        text: 'Buy Credits',
        icon: 'coins',
      },
      {
        id: 'upgrade-plan-link',
        href: '/pages/core/upgrade-plan',
        text: 'Upgrade Plan',
        icon: 'star',
      },
    ];
    res.render('buy-credits', {
      layout: 'main',
      title: 'Buy Credits',
      filterLinks,
      currentSection: 'billing',
      currentPage: 'Buy Credits',
    });
  });
  app.get('/pages/settings/profile', requireWebAuth, (req, res) => {
    const settingsCategories = [
      { value: 'account', label: 'Account', icon: 'user' },
      { value: 'privacy', label: 'Privacy', icon: 'shield' },
      { value: 'notifications', label: 'Notifications', icon: 'bell' },
      { value: 'appearance', label: 'Appearance', icon: 'palette' },
      { value: 'ai', label: 'AI Assistant', icon: 'brain' },
      { value: 'security', label: 'Security', icon: 'lock' },
      { value: 'accessibility', label: 'Accessibility', icon: 'eye' },
      {
        value: 'communication',
        label: 'Communication',
        icon: 'message-circle',
      },
      { value: 'integrations', label: 'Integrations', icon: 'link' },
      { value: 'preferences', label: 'Preferences', icon: 'sliders' },
    ];
    res.render('settings/profile', {
      layout: 'main',
      title: 'Profile Settings',
      currentSection: 'settings',
      currentPage: 'Account',
      settingsCategories,
      activeCategory: 'account',
    });
  });
  app.get('/pages/settings/billing', requireWebAuth, (req, res) => {
    const settingsCategories = [
      { value: 'account', label: 'Account', icon: 'user' },
      { value: 'privacy', label: 'Privacy', icon: 'shield' },
      { value: 'notifications', label: 'Notifications', icon: 'bell' },
      { value: 'appearance', label: 'Appearance', icon: 'palette' },
      { value: 'ai', label: 'AI Assistant', icon: 'brain' },
      { value: 'security', label: 'Security', icon: 'lock' },
      { value: 'accessibility', label: 'Accessibility', icon: 'eye' },
      {
        value: 'communication',
        label: 'Communication',
        icon: 'message-circle',
      },
      { value: 'integrations', label: 'Integrations', icon: 'link' },
      { value: 'preferences', label: 'Preferences', icon: 'sliders' },
    ];
    res.render('settings/billing', {
      layout: 'main',
      title: 'Billing Settings',
      currentSection: 'settings',
      currentPage: 'Billing',
      settingsCategories,
      activeCategory: 'billing',
    });
  });
  app.get('/pages/settings/other', requireWebAuth, (req, res) => {
    const settingsCategories = [
      { value: 'account', label: 'Account', icon: 'user' },
      { value: 'privacy', label: 'Privacy', icon: 'shield' },
      { value: 'notifications', label: 'Notifications', icon: 'bell' },
      { value: 'appearance', label: 'Appearance', icon: 'palette' },
      { value: 'ai', label: 'AI Assistant', icon: 'brain' },
      { value: 'security', label: 'Security', icon: 'lock' },
      { value: 'accessibility', label: 'Accessibility', icon: 'eye' },
      {
        value: 'communication',
        label: 'Communication',
        icon: 'message-circle',
      },
      { value: 'integrations', label: 'Integrations', icon: 'link' },
      { value: 'preferences', label: 'Preferences', icon: 'sliders' },
    ];
    res.render('settings/other', {
      layout: 'main',
      title: 'Security & Privacy',
      currentSection: 'settings',
      currentPage: 'Security & Privacy',
      settingsCategories,
      activeCategory: 'security',
    });
  });
  app.get('/startup-dashboard/team/invite', requireWebAuth, (req, res) => {
    res.render('startup-dashboard/team-invite', {
      layout: 'main',
      title: 'Invite Team Member',
    });
  });
  app.get(
    '/startup-dashboard/promote/social-post',
    requireWebAuth,
    (req, res) => {
      res.render('startup-dashboard/promote-social-post', {
        layout: 'main',
        title: 'Create Social Post',
      });
    }
  );
  app.get('/pages/portfolio/:id', requireWebAuth, (req, res) => {
    const id = req.params.id;
    res.render('portfolio-detail', {
      layout: 'main',
      title: `Portfolio Project ${id}`,
      id,
    });
  });
  app.get('/usecase-from-user', requireWebAuth, (req, res) => {
    res.render('usecase-from-user', {
      layout: 'main',
      title: 'User-Generated Use Cases',
    });
  });
  app.get('/startup-dashboard/fund/pitch-deck', requireWebAuth, (req, res) => {
    res.render('startup-dashboard/fund-pitch-deck', {
      layout: 'main',
      title: 'Create Pitch Deck',
    });
  });

  app.get(
    '/startup-dashboard/financial/add-expense',
    requireWebAuth,
    (req, res) => {
      res.render('startup-dashboard/financial-add-expense', {
        layout: 'main',
        title: 'Add Expense',
      });
    }
  );
  app.get(
    '/startup-dashboard/marketing/create-campaign',
    requireWebAuth,
    (req, res) => {
      res.render('startup-dashboard/marketing-create-campaign', {
        layout: 'main',
        title: 'Create Marketing Campaign',
      });
    }
  );
  app.post(
    '/projects/new',
    requireWebAuth,
    csrfProtection,
    async (req, res) => {
      try {
        // Extract and validate user from cookies (since requireWebAuth doesn't set req.user for HTML requests)
        const cookies = req.headers.cookie;
        if (!cookies) {
          return res.redirect('/auth/login?error=auth_required');
        }

        // Extract project ID from config
        const supabaseUrl = process.env.SUPABASE_URL;
        const projectMatch = supabaseUrl.match(/https:\/\/(.+)\.supabase\.co/);
        const projectId = projectMatch ? projectMatch[1] : null;

        if (!projectId) {
          console.error(
            'Could not extract Supabase project ID from URL:',
            supabaseUrl
          );
          return res.redirect('/auth/login?error=config_error');
        }

        // Extract access token from cookies
        const cookiePairs = cookies.split(';');
        let accessToken = null;

        for (const cookiePair of cookiePairs) {
          const [name, value] = cookiePair.trim().split('=');
          if (name.includes(`sb-${projectId}-auth-token`)) {
            try {
              accessToken = decodeURIComponent(value);
              break;
            } catch (e) {
              console.warn('Failed to decode auth token cookie:', e.message);
            }
          }
          if (name === 'sb-access-token') {
            try {
              accessToken = decodeURIComponent(value);
              break;
            } catch (e) {
              console.warn(
                'Failed to decode custom auth token cookie:',
                e.message
              );
            }
          }
        }

        if (!accessToken) {
          return res.redirect('/auth/login?error=no_token');
        }

        // Validate token and get user
        const supabase = createClient(
          process.env.SUPABASE_URL,
          process.env.SUPABASE_KEY
        );
        const { data, error } = await supabase.auth.getUser(accessToken);

        if (error || !data || !data.user) {
          console.warn('Invalid or expired Supabase token:', error?.message);

          return res.redirect('/auth/login?error=invalid_token');
        }

        const userId = data.user.id;

        // Extract form data
        const description = req.body.prompt;
        const title =
          req.body.title ||
          description.split('.')[0].substring(0, 255) ||
          'New Project';
        const category = req.body.category || 'General';
        let tags = [];
        try {
          tags = req.body.tags ? JSON.parse(req.body.tags) : [];
        } catch (e) {
          tags = [];
        }

        // Get idea service
        const ideaService = serviceFactory.getIdeaService();

        // Generate slug from title
        let slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

        // Ensure slug uniqueness
        let existingIdea;
        let counter = 1;
        let originalSlug = slug;
        do {
          existingIdea = await ideaService.getIdeaBySlug(slug);
          if (existingIdea) {
            slug = `${originalSlug}-${counter}`;
            counter++;
          }
        } while (existingIdea);

        // Default category icon (could be enhanced with AI categorization later)
        const category_icon = 'folder'; // Default icon

        // Create idea with all required fields matching schema
        const ideaData = {
          title: title,
          slug: slug,
          category_icon: category_icon,
          description: description,
          category: category,
          tags: tags,
          user_id: userId,
          status: 'active',
        };

        // Create the idea using the service
        const createdIdea = await ideaService.createIdea(ideaData);

        // Check if request expects JSON (AJAX) or HTML redirect
        if (
          req.headers.accept &&
          req.headers.accept.includes('application/json')
        ) {
          res.json({ success: true, idea: createdIdea });
        } else {
          // Redirect to projects page with success message
          res.redirect('/projects/all-projects?success=created');
        }
      } catch (error) {
        console.error('Error creating idea:', error);

        // Check if request expects JSON (AJAX) or HTML redirect
        if (
          req.headers.accept &&
          req.headers.accept.includes('application/json')
        ) {
          res.status(500).json({ error: 'Failed to create project' });
        } else {
          // Redirect back with error
          res.redirect('/projects/new?error=creation_failed');
        }
      }
    }
  );

  // File upload routes
  app.post('/api/upload', requireWebAuth, upload.single('file'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const fileInfo = {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        url: `/uploads/${req.file.filename}`,
      };

      res.json({
        success: true,
        file: fileInfo,
      });
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({ error: 'File upload failed' });
    }
  });

  app.post(
    '/api/upload-multiple',
    requireWebAuth,
    upload.array('files', 10),
    (req, res) => {
      try {
        if (!req.files || req.files.length === 0) {
          return res.status(400).json({ error: 'No files uploaded' });
        }

        const filesInfo = req.files.map((file) => ({
          filename: file.filename,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path,
          url: `/uploads/${file.filename}`,
        }));

        res.json({
          success: true,
          files: filesInfo,
        });
      } catch (error) {
        console.error('Multiple file upload error:', error);
        res.status(500).json({ error: 'File upload failed' });
      }
    }
  );

  // Serve uploaded files
  app.use('/uploads', express.static(uploadsDir));
}
