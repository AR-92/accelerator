import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// Dashboard Idea Management
export const getDashboardIdea = async (req, res) => {
  try {
    logger.info('Dashboard idea section accessed');

    const user = req.user;
    const userRole = user?.role || 'startup';

    // Fetch ideas data
    const ideasData = await getIdeasData(user);

    // Fetch validation metrics
    const validationMetrics = await getValidationMetrics(userRole);

    // Fetch customer models
    const customerModels = await getCustomerModels(user);

    // Fetch brand identity data
    const brandIdentity = await getBrandIdentity(user);

    // Fetch IP protection status
    const ipProtection = await getIPProtection(user);

    // Role-based features
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
        active: true,
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

    // Add role-based links
    if (userRole === 'enterprise' || userRole === 'corporate') {
      filterLinks.push({
        id: 'enterprise-link',
        href: '/dashboard/enterprise',
        text: 'Enterprise',
        icon: 'building',
      });
    }

    if (userRole === 'corporate') {
      filterLinks.push({
        id: 'corporate-link',
        href: '/dashboard/corporate',
        text: 'Corporate',
        icon: 'building-2',
      });
    }

    res.render('dashboard/idea', {
      layout: req.headers['hx-request'] ? false : 'dashboard',
      title: 'Idea Management',
      currentSection: 'dashboard',
      currentPage: 'idea',
      user,
      userRole,
      ideasData,
      validationMetrics,
      customerModels,
      brandIdentity,
      ipProtection,
      features,
      filterLinks,
      lastUpdated: new Date().toLocaleString(),
    });
  } catch (error) {
    logger.error('Error loading dashboard idea:', error);
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
        active: true,
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

    // Add role-based links
    const errorUserRole = req.user?.role || 'startup';
    if (errorUserRole === 'enterprise' || errorUserRole === 'corporate') {
      filterLinks.push({
        id: 'enterprise-link',
        href: '/dashboard/enterprise',
        text: 'Enterprise',
        icon: 'building',
      });
    }

    if (errorUserRole === 'corporate') {
      filterLinks.push({
        id: 'corporate-link',
        href: '/dashboard/corporate',
        text: 'Corporate',
        icon: 'building-2',
      });
    }

    res.render('dashboard/idea', {
      layout: req.headers['hx-request'] ? false : 'dashboard',
      title: 'Idea Management',
      currentSection: 'dashboard',
      currentPage: 'idea',
      user: req.user,
      userRole: req.user?.role || 'startup',
      ideasData: getDefaultIdeasData(),
      validationMetrics: getDefaultValidationMetrics(),
      customerModels: [],
      brandIdentity: getDefaultBrandIdentity(),
      ipProtection: getDefaultIPProtection(),
      features: getRoleBasedFeatures(req.user?.role || 'startup'),
      filterLinks,
      lastUpdated: new Date().toLocaleString(),
    });
  }
};

// Helper functions
async function getIdeasData(user) {
  try {
    const { data: ideas } = await databaseService.supabase
      .from('ideas')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    const stats = {
      total: ideas?.length || 0,
      validated: ideas?.filter((i) => i.status === 'validated').length || 0,
      inProgress: ideas?.filter((i) => i.status === 'in_progress').length || 0,
      archived: ideas?.filter((i) => i.status === 'archived').length || 0,
    };

    return { ideas: ideas || [], stats };
  } catch (error) {
    logger.error('Error fetching ideas data:', error);
    return {
      ideas: [],
      stats: { total: 0, validated: 0, inProgress: 0, archived: 0 },
    };
  }
}

async function getValidationMetrics(role) {
  const baseMetrics = [
    {
      label: 'Problem Validation',
      value: '85%',
      status: 'completed',
      color: 'success',
    },
    {
      label: 'Market Research',
      value: '72%',
      status: 'in_progress',
      color: 'warning',
    },
    {
      label: 'Customer Interviews',
      value: '60%',
      status: 'pending',
      color: 'muted',
    },
    {
      label: 'Competitive Analysis',
      value: '90%',
      status: 'completed',
      color: 'success',
    },
  ];

  if (role === 'enterprise' || role === 'corporate') {
    baseMetrics.push(
      {
        label: 'Enterprise Fit',
        value: '78%',
        status: 'in_progress',
        color: 'step-revenue',
      },
      {
        label: 'Scalability Assessment',
        value: '65%',
        status: 'pending',
        color: 'step-streams',
      }
    );
  }

  if (role === 'corporate') {
    baseMetrics.push(
      {
        label: 'Innovation Portfolio Fit',
        value: '82%',
        status: 'completed',
        color: 'step-kpi',
      },
      {
        label: 'Corporate Strategy Alignment',
        value: '88%',
        status: 'completed',
        color: 'step-cogs',
      }
    );
  }

  return baseMetrics;
}

async function getCustomerModels(user) {
  try {
    const { data: models } = await databaseService.supabase
      .from('customer_models')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    return models || [];
  } catch (error) {
    logger.error('Error fetching customer models:', error);
    return [];
  }
}

async function getBrandIdentity(user) {
  try {
    const { data: brand } = await databaseService.supabase
      .from('brand_identity')
      .select('*')
      .eq('user_id', user.id)
      .single();

    return brand || getDefaultBrandIdentity();
  } catch (error) {
    logger.error('Error fetching brand identity:', error);
    return getDefaultBrandIdentity();
  }
}

async function getIPProtection(user) {
  try {
    const { data: ipData } = await databaseService.supabase
      .from('ip_protection')
      .select('*')
      .eq('user_id', user.id);

    const stats = {
      patents: ipData?.filter((i) => i.type === 'patent').length || 0,
      trademarks: ipData?.filter((i) => i.type === 'trademark').length || 0,
      copyrights: ipData?.filter((i) => i.type === 'copyright').length || 0,
      pending: ipData?.filter((i) => i.status === 'pending').length || 0,
      approved: ipData?.filter((i) => i.status === 'approved').length || 0,
    };

    return { items: ipData || [], stats };
  } catch (error) {
    logger.error('Error fetching IP protection:', error);
    return {
      items: [],
      stats: {
        patents: 0,
        trademarks: 0,
        copyrights: 0,
        pending: 0,
        approved: 0,
      },
    };
  }
}

function getRoleBasedFeatures(role) {
  return {
    basic: true,
    enterprise: role === 'enterprise' || role === 'corporate',
    corporate: role === 'corporate',
  };
}

function getDefaultIdeasData() {
  return {
    ideas: [],
    stats: { total: 0, validated: 0, inProgress: 0, archived: 0 },
  };
}

function getDefaultValidationMetrics() {
  return [
    {
      label: 'Problem Validation',
      value: '0%',
      status: 'pending',
      color: 'muted',
    },
    {
      label: 'Market Research',
      value: '0%',
      status: 'pending',
      color: 'muted',
    },
    {
      label: 'Customer Interviews',
      value: '0%',
      status: 'pending',
      color: 'muted',
    },
    {
      label: 'Competitive Analysis',
      value: '0%',
      status: 'pending',
      color: 'muted',
    },
  ];
}

function getDefaultBrandIdentity() {
  return {
    name: 'Not Set',
    tagline: 'Not Set',
    colors: { primary: '#000000', secondary: '#666666' },
    logo: null,
    voice: 'Not Defined',
  };
}

function getDefaultIPProtection() {
  return {
    items: [],
    stats: {
      patents: 0,
      trademarks: 0,
      copyrights: 0,
      pending: 0,
      approved: 0,
    },
  };
}
