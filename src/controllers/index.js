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
import { getUserManagement } from './admin/get-user-management.js';
import { postLogout } from './admin/post-logout.js';
import { csrfProtection } from '../middleware/security/csrf.js';
import formConfigs from '../config/formConfigs.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import express from 'express';

import { getDashboard } from './overview/get-dashboard.js';
import { getNewProject } from './overview/get-new-project.js';
import { getProjectDetail } from './projects/get-project-detail.js';

import { getSettings as getSettingsPage } from './settings/index.js';
import { getBilling } from './billing/index.js';
import { serviceFactory } from '../services/serviceFactory.js';

import { getDashboardMain } from './dashboard/index.js';
import { getDashboardOverview } from './dashboard/overview.js';
import { getDashboardIdea } from './dashboard/idea.js';
import { getDashboardBusiness } from './dashboard/business.js';
import { getDashboardFinancial } from './dashboard/financial.js';
import { getDashboardMarketing } from './dashboard/marketing.js';
import { getDashboardFund } from './dashboard/fund.js';
import { getDashboardTeam } from './dashboard/team.js';
import { getDashboardPromote } from './dashboard/promote.js';
import { getDashboardActivityLog } from './dashboard/activity-log.js';
import { getDashboardEnterprise } from './dashboard/enterprise.js';
import { getDashboardCorporate } from './dashboard/corporate.js';

import { getVotingReward } from './voting/index.js';

import { authenticateUser, requireAuth } from '../middleware/auth/index.js';

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
export { getNewProject };
export { getProjectDetail };

export { getVotingReward };

// Using requireAuth for web routes (requires authentication)

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
  // Root route - redirect to new project page
  app.get('/', requireAuth, (req, res) => {
    res.redirect('/admin/new-project?showCard=true');
  });

  // Main pages (server-side auth protection)
  app.get('/admin/profile-settings', requireAuth, getProfileSettings);
  app.get('/admin/settings', requireAuth, getSettings);
  app.get('/admin/system-health', requireAuth, getSystemHealth);
  app.get('/admin/system-config', requireAuth, getSystemConfig);
  app.get('/admin/system-logs', requireAuth, getSystemLogs);
  app.get('/admin/notifications', requireAuth, getNotifications);

  app.get('/admin/activity', requireAuth, getActivity);
  app.get('/admin/dashboard', requireAuth, getDashboard);
  app.get('/admin/new-project', requireAuth, getNewProject);

  app.post('/admin/ideas/:id/publish', requireAuth, async (req, res) => {
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

  app.post('/admin/ideas/:id/unpublish', requireAuth, async (req, res) => {
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

  app.post('/admin/ideas/:id/favorite', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const ideaService = serviceFactory.getIdeaService();
      const updatedIdea = await ideaService.favoriteIdea(id);
      res.json({ success: true, idea: updatedIdea });
    } catch (error) {
      console.error('Error favoriting idea:', error);
      res.status(500).json({ error: 'Failed to favorite idea' });
    }
  });

  app.post('/admin/ideas/:id/unfavorite', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const ideaService = serviceFactory.getIdeaService();
      const updatedIdea = await ideaService.unfavoriteIdea(id);
      res.json({ success: true, idea: updatedIdea });
    } catch (error) {
      console.error('Error unfavoriting idea:', error);
      res.status(500).json({ error: 'Failed to unfavorite idea' });
    }
  });

  app.post('/admin/ideas/:id/archive', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const ideaService = serviceFactory.getIdeaService();
      const updatedIdea = await ideaService.archiveIdea(id);
      res.json({ success: true, idea: updatedIdea });
    } catch (error) {
      console.error('Error archiving idea:', error);
      res.status(500).json({ error: 'Failed to archive idea' });
    }
  });

  app.post('/admin/ideas/:id/unarchive', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const ideaService = serviceFactory.getIdeaService();
      const updatedIdea = await ideaService.unarchiveIdea(id);
      res.json({ success: true, idea: updatedIdea });
    } catch (error) {
      console.error('Error unarchiving idea:', error);
      res.status(500).json({ error: 'Failed to unarchive idea' });
    }
  });

  app.delete('/admin/ideas/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const ideaService = serviceFactory.getIdeaService();
      await ideaService.deleteIdea(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting idea:', error);
      res.status(500).json({ error: 'Failed to delete idea' });
    }
  });

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

    res.render('pages/projects/models/idea-model', {
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
  app.get('/projects/business-model', requireAuth, (req, res) => {
    res.render('pages/projects/models/business-model', {
      title: 'Business Model',
    });
  });
  app.get('/projects/business-plan', requireAuth, (req, res) => {
    res.render('pages/projects/models/business-plan', {
      title: 'Business Plan',
    });
  });
  app.get('/projects/financial-model', requireAuth, (req, res) => {
    res.render('pages/projects/models/financial-model', {
      title: 'Financial Model',
    });
  });
  app.get('/projects/funding-model', requireAuth, (req, res) => {
    res.render('pages/projects/models/funding-model', {
      title: 'Funding Model',
    });
  });
  app.get('/projects/legal-model', requireAuth, (req, res) => {
    res.render('pages/projects/models/legal-model', { title: 'Legal Model' });
  });
  app.get('/projects/marketing-model', requireAuth, (req, res) => {
    res.render('pages/projects/models/marketing-model', {
      title: 'Marketing Model',
    });
  });
  app.get('/projects/pitch-deck', requireAuth, (req, res) => {
    res.render('pages/projects/models/pitch-deck', { title: 'Pitch Deck' });
  });
  app.get('/projects/team-model', requireAuth, (req, res) => {
    res.render('pages/projects/models/team-model', { title: 'Team Model' });
  });
  app.get('/projects/valuation', requireAuth, (req, res) => {
    res.render('pages/projects/models/valuation', { title: 'Valuation' });
  });
  app.get('/projects/:id', requireAuth, getProjectDetail);
  app.get('/admin/profile-settings', requireAuth, getProfileSettings);
  app.post('/admin/profile-settings', requireAuth, postProfileSettings);
  app.get('/admin/settings', requireAuth, getSettings);
  app.post('/admin/settings', requireAuth, postSettings);
  app.get('/admin/system-health', requireAuth, getSystemHealth);
  app.get('/admin/system-config', requireAuth, getSystemConfig);
  app.get('/admin/system-logs', requireAuth, getSystemLogs);
  app.get('/admin/notifications', requireAuth, getNotifications);
  app.get('/admin/activity', requireAuth, getActivity);
  app.get('/admin/user-management', requireAuth, getUserManagement);
  app.get('/admin/activity/export/csv', requireAuth, exportActivityCSV);
  app.get('/admin/activity/export/json', requireAuth, exportActivityJSON);
  app.get('/admin/dashboard', requireAuth, getDashboard);
  app.get('/admin/new-project', requireAuth, csrfProtection, getNewProject);

  // User settings
  app.get('/settings', requireAuth, getSettingsPage);

  // Settings pages
  // app.get('/pages/settings', requireAuth, getSettingsPage); // Removed duplicate

  // app.get('/pages/billing', requireAuth, getBilling); // Duplicate of /billing

  // Unified Dashboard pages
  // Dashboard routes
  app.get('/dashboard', requireAuth, getDashboardMain);
  app.get('/dashboard/overview', requireAuth, getDashboardOverview);
  app.get('/dashboard/idea', requireAuth, getDashboardIdea);
  app.get('/dashboard/business', requireAuth, getDashboardBusiness);
  app.get('/dashboard/financial', requireAuth, getDashboardFinancial);
  app.get('/dashboard/marketing', requireAuth, getDashboardMarketing);
  app.get('/dashboard/fund', requireAuth, getDashboardFund);
  app.get('/dashboard/team', requireAuth, getDashboardTeam);
  app.get('/dashboard/promote', requireAuth, getDashboardPromote);
  app.get('/dashboard/activity-log', requireAuth, getDashboardActivityLog);
  app.get('/dashboard/enterprise', requireAuth, getDashboardEnterprise);
  app.get('/dashboard/corporate', requireAuth, getDashboardCorporate);

  // Voting & Rewards page
  app.get('/voting', requireAuth, getVotingReward);

  // Legacy redirects for backward compatibility
  app.get('/startup-dashboard', requireAuth, (req, res) =>
    res.redirect('/dashboard')
  );

  app.get('/enterprise-dashboard', requireAuth, (req, res) =>
    res.redirect('/dashboard/enterprise')
  );

  app.get('/enterprise-dashboard/overview', requireAuth, (req, res) =>
    res.redirect('/dashboard/overview')
  );

  app.get('/enterprise-dashboard/projects', requireAuth, (req, res) =>
    res.redirect('/dashboard/projects')
  );

  app.get('/enterprise-dashboard/analytics', requireAuth, (req, res) =>
    res.redirect('/dashboard/analytics')
  );

  app.get('/enterprise-dashboard/users', requireAuth, (req, res) =>
    res.redirect('/dashboard/team')
  );

  app.get('/enterprise-dashboard/activity-log', requireAuth, (req, res) =>
    res.redirect('/dashboard/activity-log')
  );

  app.get('/corporate-dashboard', requireAuth, (req, res) =>
    res.redirect('/dashboard/corporate')
  );

  app.get('/corporate-dashboard/overview', requireAuth, (req, res) =>
    res.redirect('/dashboard/overview')
  );

  app.get('/corporate-dashboard/projects', requireAuth, (req, res) =>
    res.redirect('/dashboard/projects')
  );

  app.get('/corporate-dashboard/analytics', requireAuth, (req, res) =>
    res.redirect('/dashboard/analytics')
  );

  app.get('/corporate-dashboard/users', requireAuth, (req, res) =>
    res.redirect('/dashboard/team')
  );

  app.get('/corporate-dashboard/activity-log', requireAuth, (req, res) =>
    res.redirect('/dashboard/activity-log')
  );

  app.get('/enterprise-dashboard', requireAuth, (req, res) =>
    res.redirect('/dashboard')
  );
  app.get('/enterprise-dashboard/overview', requireAuth, (req, res) =>
    res.redirect('/dashboard/overview')
  );
  app.get('/enterprise-dashboard/projects', requireAuth, (req, res) =>
    res.redirect('/dashboard/projects')
  );
  app.get('/enterprise-dashboard/analytics', requireAuth, (req, res) =>
    res.redirect('/dashboard/analytics')
  );
  app.get('/enterprise-dashboard/users', requireAuth, (req, res) =>
    res.redirect('/dashboard/team')
  );
  app.get('/enterprise-dashboard/activity-log', requireAuth, (req, res) =>
    res.redirect('/dashboard/activity')
  );

  app.get('/corporate-dashboard', requireAuth, (req, res) =>
    res.redirect('/dashboard')
  );
  app.get('/corporate-dashboard/overview', requireAuth, (req, res) =>
    res.redirect('/dashboard/overview')
  );
  app.get('/corporate-dashboard/projects', requireAuth, (req, res) =>
    res.redirect('/dashboard/projects')
  );
  app.get('/corporate-dashboard/analytics', requireAuth, (req, res) =>
    res.redirect('/dashboard/analytics')
  );
  app.get('/corporate-dashboard/users', requireAuth, (req, res) =>
    res.redirect('/dashboard/team')
  );
  app.get('/corporate-dashboard/activity-log', requireAuth, (req, res) =>
    res.redirect('/dashboard/activity')
  );

  // Additional pages
  app.get('/pages/terms', (req, res) => {
    res.render('pages/shared/terms', {
      layout: 'main',
      title: 'Terms and Conditions',
    });
  });
  app.get('/pages/core/upgrade-plan', requireAuth, (req, res) => {
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
    res.render('pages/billing/upgrade-plan', {
      layout: 'main',
      title: 'Upgrade Plan',
      currentSection: 'billing',
      currentPage: 'Upgrade Plan',
      filterLinks,
      section: 'billing',
    });
  });
  // Test credits page (no auth required)
  app.get('/test-credits', (req, res) => {
    res.render('pages/shared/test-credits', {
      layout: false,
      title: 'Test Buy Credits',
    });
  });

  app.get('/pages/buy-credits', requireAuth, (req, res) => {
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
    res.render('pages/billing/buy-credits', {
      layout: 'main',
      title: 'Buy Credits',
      filterLinks,
      currentSection: 'billing',
      currentPage: 'Buy Credits',
    });
  });
  app.get('/settings/profile', requireAuth, (req, res) => {
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
    res.render('pages/settings/profile', {
      layout: req.headers['hx-request'] ? false : 'settings',
      title: 'Profile Settings',
      currentSection: 'settings',
      currentPage: 'Account',
      settingsCategories,
      activeCategory: 'profile',
    });
  });
  app.get('/settings/billing', requireAuth, (req, res) => {
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
    res.render('components/features/billing/billing-settings', {
      layout: req.headers['hx-request'] ? false : 'settings',
      title: 'Billing Settings',
      currentSection: 'settings',
      currentPage: 'Billing',
      settingsCategories,
      activeCategory: 'billing',
    });
  });
  app.get('/settings/other', requireAuth, (req, res) => {
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
    res.render('pages/settings/other', {
      layout: req.headers['hx-request'] ? false : 'settings',
      title: 'Security & Privacy',
      currentSection: 'settings',
      currentPage: 'Security & Privacy',
      settingsCategories,
      activeCategory: 'security',
    });
  });

  // Portfolio page - redirect to new project with portfolio filter
  app.get('/portfolio', requireAuth, (req, res) => {
    res.redirect('/admin/new-project?filter=portfolio');
  });

  app.get('/usecase-from-user', requireAuth, (req, res) => {
    res.render('pages/ai/usecase-from-user', {
      layout: 'main',
      title: 'User-Generated Use Cases',
    });
  });
  app.post(
    '/projects/new',
    authenticateUser,
    csrfProtection,
    async (req, res) => {
      try {
        // User is already authenticated via middleware
        const userId = req.user.id;

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

        // Handle different response types
        if (req.headers['hx-request']) {
          // HTMX request - return project component
          res.render('project-item', {
            layout: false,
            project: createdIdea,
          });
        } else if (
          req.headers.accept &&
          req.headers.accept.includes('application/json')
        ) {
          // JSON API request
          res.json({ success: true, idea: createdIdea });
        } else {
          // Regular form submission - redirect
          res.redirect(`/projects/${createdIdea.id}`);
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
  app.post('/api/upload', requireAuth, upload.single('file'), (req, res) => {
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
    requireAuth,
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
