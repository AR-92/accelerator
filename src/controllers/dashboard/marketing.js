import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// Dashboard Marketing Management
export const getDashboardMarketing = async (req, res) => {
  try {
    logger.info('Dashboard marketing section accessed');

    const user = req.user;
    const userRole = user?.role || 'startup';

    // Fetch marketing data
    const targetAudiences = await getTargetAudiences(user);
    const marketingChannels = await getMarketingChannels(user);
    const pricingModels = await getPricingModels(user);
    const competitiveAnalysis = await getCompetitiveAnalysis(user);
    const campaignPerformance = await getCampaignPerformance(user);

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
        active: true,
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

    res.render('dashboard/marketing', {
      layout: req.headers['hx-request'] ? false : 'dashboard',
      title: 'Marketing Management',
      currentSection: 'home',
      currentPage: 'marketing',
      user,
      userRole,
      targetAudiences,
      marketingChannels,
      pricingModels,
      competitiveAnalysis,
      campaignPerformance,
      features,
      filterLinks,
      lastUpdated: new Date().toLocaleString(),
    });
  } catch (error) {
    logger.error('Error loading dashboard marketing:', error);
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
        active: true,
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

    res.render('dashboard/marketing', {
      layout: req.headers['hx-request'] ? false : 'dashboard',
      title: 'Marketing Management',
      currentSection: 'home',
      currentPage: 'marketing',
      user: req.user,
      userRole: req.user?.role || 'startup',
      targetAudiences: getDefaultTargetAudiences(),
      marketingChannels: getDefaultMarketingChannels(),
      pricingModels: getDefaultPricingModels(),
      competitiveAnalysis: getDefaultCompetitiveAnalysis(),
      campaignPerformance: getDefaultCampaignPerformance(),
      features: getRoleBasedFeatures(req.user?.role || 'startup'),
      filterLinks,
      lastUpdated: new Date().toLocaleString(),
    });
  }
};

// Helper functions
async function getTargetAudiences(user) {
  try {
    const { data: audiences } = await databaseService.supabase
      .from('target_audiences')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    const stats = {
      total: audiences?.length || 0,
      active: audiences?.filter((a) => a.status === 'active').length || 0,
      segments:
        audiences?.reduce((acc, a) => {
          acc[a.segment] = (acc[a.segment] || 0) + 1;
          return acc;
        }, {}) || {},
    };

    return { audiences: audiences || [], stats };
  } catch (error) {
    logger.error('Error fetching target audiences:', error);
    return getDefaultTargetAudiences();
  }
}

async function getMarketingChannels(user) {
  try {
    const { data: channels } = await databaseService.supabase
      .from('marketing_channels')
      .select('*')
      .eq('user_id', user.id);

    const performance = {
      totalReach: channels?.reduce((sum, c) => sum + (c.reach || 0), 0) || 0,
      totalEngagement:
        channels?.reduce((sum, c) => sum + (c.engagement || 0), 0) || 0,
      totalConversions:
        channels?.reduce((sum, c) => sum + (c.conversions || 0), 0) || 0,
    };

    return { channels: channels || [], performance };
  } catch (error) {
    logger.error('Error fetching marketing channels:', error);
    return getDefaultMarketingChannels();
  }
}

async function getPricingModels(user) {
  try {
    const { data: models } = await databaseService.supabase
      .from('pricing_models')
      .select('*')
      .eq('user_id', user.id);

    const stats = {
      total: models?.length || 0,
      active: models?.filter((m) => m.status === 'active').length || 0,
      avgPrice:
        models?.length > 0
          ? models.reduce((sum, m) => sum + (m.price || 0), 0) / models.length
          : 0,
    };

    return { models: models || [], stats };
  } catch (error) {
    logger.error('Error fetching pricing models:', error);
    return getDefaultPricingModels();
  }
}

async function getCompetitiveAnalysis(user) {
  try {
    const { data: analysis } = await databaseService.supabase
      .from('competitive_analysis')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    return analysis || [];
  } catch (error) {
    logger.error('Error fetching competitive analysis:', error);
    return [];
  }
}

async function getCampaignPerformance(user) {
  try {
    const { data: campaigns } = await databaseService.supabase
      .from('marketing_campaigns')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    const stats = {
      total: campaigns?.length || 0,
      active: campaigns?.filter((c) => c.status === 'active').length || 0,
      completed: campaigns?.filter((c) => c.status === 'completed').length || 0,
      totalBudget: campaigns?.reduce((sum, c) => sum + (c.budget || 0), 0) || 0,
      totalROI: campaigns?.reduce((sum, c) => sum + (c.roi || 0), 0) || 0,
    };

    return { campaigns: campaigns || [], stats };
  } catch (error) {
    logger.error('Error fetching campaign performance:', error);
    return getDefaultCampaignPerformance();
  }
}

function getRoleBasedFeatures(role) {
  return {
    basic: true,
    enterprise: role === 'enterprise' || role === 'corporate',
    corporate: role === 'corporate',
  };
}

function getDefaultTargetAudiences() {
  return {
    audiences: [],
    stats: { total: 0, active: 0, segments: {} },
  };
}

function getDefaultMarketingChannels() {
  return {
    channels: [],
    performance: { totalReach: 0, totalEngagement: 0, totalConversions: 0 },
  };
}

function getDefaultPricingModels() {
  return {
    models: [],
    stats: { total: 0, active: 0, avgPrice: 0 },
  };
}

function getDefaultCompetitiveAnalysis() {
  return [];
}

function getDefaultCampaignPerformance() {
  return {
    campaigns: [],
    stats: { total: 0, active: 0, completed: 0, totalBudget: 0, totalROI: 0 },
  };
}
