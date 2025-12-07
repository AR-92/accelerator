import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// Dashboard Business Management
export const getDashboardBusiness = async (req, res) => {
  try {
    logger.info('Dashboard business section accessed');

    const user = req.user;
    const userRole = user?.role || 'startup';

    // Fetch business model data
    const businessModel = await getBusinessModel(user);

    // Fetch value propositions
    const valuePropositions = await getValuePropositions(user);

    // Fetch revenue streams
    const revenueStreams = await getRevenueStreams(user);

    // Fetch cost structure
    const costStructure = await getCostStructure(user);

    // Fetch market analysis
    const marketAnalysis = await getMarketAnalysis(user);

    // Fetch partnerships
    const partnerships = await getPartnerships(user);

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
      },
      {
        id: 'business-link',
        href: '/dashboard/business',
        text: 'Business',
        icon: 'briefcase',
        active: true,
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

    res.render('dashboard/business', {
      layout: req.headers['hx-request'] ? false : 'dashboard',
      title: 'Business Management',
      currentSection: 'home',
      currentPage: 'business',
      user,
      userRole,
      businessModel,
      valuePropositions,
      revenueStreams,
      costStructure,
      marketAnalysis,
      partnerships,
      features,
      filterLinks,
      lastUpdated: new Date().toLocaleString(),
    });
  } catch (error) {
    logger.error('Error loading dashboard business:', error);
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
        active: true,
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

    res.render('dashboard/business', {
      layout: req.headers['hx-request'] ? false : 'dashboard',
      title: 'Business Management',
      currentSection: 'home',
      currentPage: 'business',
      user: req.user,
      userRole: req.user?.role || 'startup',
      businessModel: getDefaultBusinessModel(),
      valuePropositions: [],
      revenueStreams: getDefaultRevenueStreams(),
      costStructure: getDefaultCostStructure(),
      marketAnalysis: getDefaultMarketAnalysis(),
      partnerships: [],
      features: getRoleBasedFeatures(req.user?.role || 'startup'),
      filterLinks,
      lastUpdated: new Date().toLocaleString(),
    });
  }
};

// Helper functions
async function getBusinessModel(user) {
  try {
    const { data: model } = await databaseService.supabase
      .from('business_models')
      .select('*')
      .eq('user_id', user.id)
      .single();

    return model || getDefaultBusinessModel();
  } catch (error) {
    logger.error('Error fetching business model:', error);
    return getDefaultBusinessModel();
  }
}

async function getValuePropositions(user) {
  try {
    const { data: propositions } = await databaseService.supabase
      .from('value_propositions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return propositions || [];
  } catch (error) {
    logger.error('Error fetching value propositions:', error);
    return [];
  }
}

async function getRevenueStreams(user) {
  try {
    const { data: streams } = await databaseService.supabase
      .from('revenue_streams')
      .select('*')
      .eq('user_id', user.id);

    const categorized = {
      productSales: streams?.filter((s) => s.type === 'product_sales') || [],
      serviceFees: streams?.filter((s) => s.type === 'service_fees') || [],
      subscriptions: streams?.filter((s) => s.type === 'subscriptions') || [],
      licensing: streams?.filter((s) => s.type === 'licensing') || [],
    };

    const totals = {
      monthly:
        streams?.reduce((sum, s) => sum + (s.monthly_revenue || 0), 0) || 0,
      annual:
        streams?.reduce((sum, s) => sum + (s.annual_revenue || 0), 0) || 0,
    };

    return { streams: streams || [], categorized, totals };
  } catch (error) {
    logger.error('Error fetching revenue streams:', error);
    return getDefaultRevenueStreams();
  }
}

async function getCostStructure(user) {
  try {
    const { data: costs } = await databaseService.supabase
      .from('cost_structures')
      .select('*')
      .eq('user_id', user.id);

    const categorized = {
      fixed: costs?.filter((c) => c.type === 'fixed') || [],
      variable: costs?.filter((c) => c.type === 'variable') || [],
      operational: costs?.filter((c) => c.type === 'operational') || [],
    };

    const totals = {
      monthly: costs?.reduce((sum, c) => sum + (c.monthly_cost || 0), 0) || 0,
      annual: costs?.reduce((sum, c) => sum + (c.annual_cost || 0), 0) || 0,
    };

    return { costs: costs || [], categorized, totals };
  } catch (error) {
    logger.error('Error fetching cost structure:', error);
    return getDefaultCostStructure();
  }
}

async function getMarketAnalysis(user) {
  try {
    const { data: analysis } = await databaseService.supabase
      .from('market_analysis')
      .select('*')
      .eq('user_id', user.id)
      .single();

    return analysis || getDefaultMarketAnalysis();
  } catch (error) {
    logger.error('Error fetching market analysis:', error);
    return getDefaultMarketAnalysis();
  }
}

async function getPartnerships(user) {
  try {
    const { data: partnerships } = await databaseService.supabase
      .from('partnerships')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    const stats = {
      active: partnerships?.filter((p) => p.status === 'active').length || 0,
      pending: partnerships?.filter((p) => p.status === 'pending').length || 0,
      completed:
        partnerships?.filter((p) => p.status === 'completed').length || 0,
    };

    return { partnerships: partnerships || [], stats };
  } catch (error) {
    logger.error('Error fetching partnerships:', error);
    return { partnerships: [], stats: { active: 0, pending: 0, completed: 0 } };
  }
}

function getRoleBasedFeatures(role) {
  return {
    basic: true,
    enterprise: role === 'enterprise' || role === 'corporate',
    corporate: role === 'corporate',
  };
}

function getDefaultBusinessModel() {
  return {
    type: 'Not Defined',
    description: 'Business model not yet defined',
    status: 'draft',
  };
}

function getDefaultRevenueStreams() {
  return {
    streams: [],
    categorized: {
      productSales: [],
      serviceFees: [],
      subscriptions: [],
      licensing: [],
    },
    totals: { monthly: 0, annual: 0 },
  };
}

function getDefaultCostStructure() {
  return {
    costs: [],
    categorized: {
      fixed: [],
      variable: [],
      operational: [],
    },
    totals: { monthly: 0, annual: 0 },
  };
}

function getDefaultMarketAnalysis() {
  return {
    marketSize: 'Not Analyzed',
    growthRate: '0%',
    competition: 'Not Analyzed',
    targetSegments: [],
    opportunities: [],
    threats: [],
  };
}
