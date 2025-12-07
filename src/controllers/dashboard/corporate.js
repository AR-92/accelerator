import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// Dashboard Corporate Overview
export const getDashboardCorporate = async (req, res) => {
  try {
    logger.info('Dashboard corporate section accessed');

    const user = req.user;
    const userRole = user?.role || 'startup';

    // Only allow corporate users
    if (userRole !== 'corporate') {
      return res.redirect('/dashboard');
    }

    // Fetch metrics based on user role
    const metrics = await getDashboardMetrics(userRole);

    // Fetch recent projects
    const recentProjects = await getRecentProjects(user);

    // Fetch trending indicators
    const trendingIndicators = await getTrendingIndicators(userRole);

    // Fetch analytics data
    const analytics = await getAnalyticsData(userRole);

    // Role-based feature visibility
    const features = getRoleBasedFeatures(userRole);

    const filterLinks = [
      {
        id: 'overview-link',
        href: '/dashboard/overview',
        text: 'Overview',
        icon: 'layout-dashboard',
      },
      {
        id: 'idea-link',
        href: '/dashboard/idea',
        text: 'Idea Management',
        icon: 'lightbulb',
      },
      {
        id: 'business-link',
        href: '/dashboard/business',
        text: 'Business',
        icon: 'briefcase',
      },
      {
        id: 'financial-link',
        href: '/dashboard/financial',
        text: 'Financial',
        icon: 'dollar-sign',
      },
      {
        id: 'marketing-link',
        href: '/dashboard/marketing',
        text: 'Marketing',
        icon: 'megaphone',
      },
      {
        id: 'fund-link',
        href: '/dashboard/fund',
        text: 'Funding',
        icon: 'wallet',
      },
      {
        id: 'team-link',
        href: '/dashboard/team',
        text: 'Team',
        icon: 'users',
      },
      {
        id: 'promote-link',
        href: '/dashboard/promote',
        text: 'Promotion',
        icon: 'presentation',
      },
      {
        id: 'activity-log-link',
        href: '/dashboard/activity-log',
        text: 'Activity Log',
        icon: 'activity',
      },
    ];

    res.render('dashboard/corporate', {
      layout: req.headers['hx-request'] ? false : 'dashboard',
      title: 'Corporate Dashboard',
      currentSection: 'home',
      currentPage: 'corporate',
      user,
      userRole,
      metrics,
      recentProjects,
      trendingIndicators,
      analytics,
      features,
      filterLinks,
      lastUpdated: new Date().toLocaleString(),
    });
  } catch (error) {
    logger.error('Error loading dashboard corporate:', error);
    const filterLinks = [
      {
        id: 'overview-link',
        href: '/dashboard/overview',
        text: 'Overview',
        icon: 'layout-dashboard',
      },
      {
        id: 'idea-link',
        href: '/dashboard/idea',
        text: 'Idea Management',
        icon: 'lightbulb',
      },
      {
        id: 'business-link',
        href: '/dashboard/business',
        text: 'Business',
        icon: 'briefcase',
      },
      {
        id: 'financial-link',
        href: '/dashboard/financial',
        text: 'Financial',
        icon: 'dollar-sign',
      },
      {
        id: 'marketing-link',
        href: '/dashboard/marketing',
        text: 'Marketing',
        icon: 'megaphone',
      },
      {
        id: 'fund-link',
        href: '/dashboard/fund',
        text: 'Funding',
        icon: 'wallet',
      },
      {
        id: 'team-link',
        href: '/dashboard/team',
        text: 'Team',
        icon: 'users',
      },
      {
        id: 'promote-link',
        href: '/dashboard/promote',
        text: 'Promotion',
        icon: 'presentation',
      },
      {
        id: 'activity-log-link',
        href: '/dashboard/activity-log',
        text: 'Activity Log',
        icon: 'activity',
      },
    ];

    res.render('dashboard/corporate', {
      layout: req.headers['hx-request'] ? false : 'dashboard',
      title: 'Corporate Dashboard',
      currentSection: 'home',
      currentPage: 'corporate',
      user: req.user,
      userRole: req.user?.role || 'startup',
      metrics: getDefaultMetrics(),
      recentProjects: [],
      trendingIndicators: [],
      analytics: getDefaultAnalytics(),
      features: getRoleBasedFeatures(req.user?.role || 'startup'),
      filterLinks,
      lastUpdated: new Date().toLocaleString(),
    });
  }
};

// Helper functions (reuse from overview.js)
async function getDashboardMetrics(role) {
  const baseMetrics = [
    {
      title: 'Active Projects',
      value: '12',
      change: '+2',
      changeType: 'positive',
      icon: 'folder-open',
      color: 'primary',
    },
    {
      title: 'Total Ideas',
      value: '47',
      change: '+8',
      changeType: 'positive',
      icon: 'lightbulb',
      color: 'secondary',
    },
    {
      title: 'Team Members',
      value: '15',
      change: '+3',
      changeType: 'positive',
      icon: 'users',
      color: 'primary',
    },
    {
      title: 'Funding Raised',
      value: '$125K',
      change: '+25%',
      changeType: 'positive',
      icon: 'dollar-sign',
      color: 'success',
    },
    {
      title: 'Growth Rate',
      value: '18%',
      change: '+5%',
      changeType: 'positive',
      icon: 'trending-up',
      color: 'primary',
    },
  ];

  // Add enterprise/corporate specific metrics
  if (role === 'enterprise' || role === 'corporate') {
    baseMetrics.push({
      title: 'Portfolio Value',
      value: '$2.3M',
      change: '+12%',
      changeType: 'positive',
      icon: 'briefcase',
      color: 'step-revenue',
    });
  }

  if (role === 'corporate') {
    baseMetrics.push({
      title: 'Governance Score',
      value: '94%',
      change: '+2%',
      changeType: 'positive',
      icon: 'shield',
      color: 'step-kpi',
    });
  }

  return baseMetrics;
}

async function getRecentProjects(user) {
  try {
    // Fetch recent projects from database
    const { data: projects } = await databaseService.supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(5);

    return projects || [];
  } catch (error) {
    logger.error('Error fetching recent projects:', error);
    return [];
  }
}

async function getTrendingIndicators(role) {
  const indicators = [
    { label: 'Market Growth', value: '+15%', trend: 'up', color: 'success' },
    {
      label: 'Competition',
      value: 'Medium',
      trend: 'neutral',
      color: 'warning',
    },
    {
      label: 'Innovation Index',
      value: '8.2/10',
      trend: 'up',
      color: 'primary',
    },
  ];

  if (role === 'enterprise' || role === 'corporate') {
    indicators.push(
      {
        label: 'Enterprise Adoption',
        value: '+22%',
        trend: 'up',
        color: 'step-revenue',
      },
      {
        label: 'Portfolio Performance',
        value: '+8%',
        trend: 'up',
        color: 'step-kpi',
      }
    );
  }

  if (role === 'corporate') {
    indicators.push(
      {
        label: 'Governance Compliance',
        value: '98%',
        trend: 'up',
        color: 'step-cogs',
      },
      {
        label: 'Subsidiary Growth',
        value: '+12%',
        trend: 'up',
        color: 'step-streams',
      }
    );
  }

  return indicators;
}

async function getAnalyticsData(role) {
  const baseAnalytics = {
    projectCreation: { current: 12, previous: 10, change: '+20%' },
    ideaValidation: { current: 47, previous: 39, change: '+21%' },
    teamProductivity: { current: 85, previous: 82, change: '+4%' },
  };

  if (role === 'enterprise' || role === 'corporate') {
    baseAnalytics.portfolioPerformance = {
      current: 92,
      previous: 88,
      change: '+5%',
    };
    baseAnalytics.enterpriseMetrics = {
      current: 78,
      previous: 75,
      change: '+4%',
    };
  }

  if (role === 'corporate') {
    baseAnalytics.governanceScore = {
      current: 94,
      previous: 92,
      change: '+2%',
    };
    baseAnalytics.consolidatedReporting = {
      current: 89,
      previous: 86,
      change: '+3%',
    };
  }

  return baseAnalytics;
}

function getRoleBasedFeatures(role) {
  const features = {
    basic: true, // Always available
    enterprise: role === 'enterprise' || role === 'corporate',
    corporate: role === 'corporate',
  };

  return features;
}

function getDefaultMetrics() {
  return [
    {
      title: 'Active Projects',
      value: '0',
      change: '0',
      changeType: 'neutral',
      icon: 'folder-open',
      color: 'primary',
    },
    {
      title: 'Total Ideas',
      value: '0',
      change: '0',
      changeType: 'neutral',
      icon: 'lightbulb',
      color: 'secondary',
    },
    {
      title: 'Team Members',
      value: '0',
      change: '0',
      changeType: 'neutral',
      icon: 'users',
      color: 'primary',
    },
    {
      title: 'Funding Raised',
      value: '$0',
      change: '0%',
      changeType: 'neutral',
      icon: 'dollar-sign',
      color: 'success',
    },
    {
      title: 'Growth Rate',
      value: '0%',
      change: '0%',
      changeType: 'neutral',
      icon: 'trending-up',
      color: 'primary',
    },
  ];
}

function getDefaultAnalytics() {
  return {
    projectCreation: { current: 0, previous: 0, change: '0%' },
    ideaValidation: { current: 0, previous: 0, change: '0%' },
    teamProductivity: { current: 0, previous: 0, change: '0%' },
  };
}
