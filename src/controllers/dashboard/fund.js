import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// Dashboard Funding Management
export const getDashboardFund = async (req, res) => {
  try {
    logger.info('Dashboard funding section accessed');

    const user = req.user;
    const userRole = user?.role || 'startup';

    // Fetch funding data
    const investorPitches = await getInvestorPitches(user);
    const valuations = await getValuations(user);
    const capitalRaising = await getCapitalRaising(user);
    const fundingRounds = await getFundingRounds(user);

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
      },
      {
        id: 'fund-link',
        href: '/dashboard/fund',
        text: 'Funding',
        icon: 'wallet',
        active: true,
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

    res.render('dashboard/fund', {
      title: 'Funding Management',
      currentSection: 'dashboard',
      currentPage: 'fund',
      user,
      userRole,
      investorPitches,
      valuations,
      capitalRaising,
      fundingRounds,
      features,
      filterLinks,
      lastUpdated: new Date().toLocaleString(),
    });
  } catch (error) {
    logger.error('Error loading dashboard funding:', error);
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
        active: true,
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

    res.render('dashboard/fund', {
      title: 'Funding Management',
      currentSection: 'dashboard',
      currentPage: 'fund',
      user: req.user,
      userRole: req.user?.role || 'startup',
      investorPitches: getDefaultInvestorPitches(),
      valuations: getDefaultValuations(),
      capitalRaising: getDefaultCapitalRaising(),
      fundingRounds: getDefaultFundingRounds(),
      features: getRoleBasedFeatures(req.user?.role || 'startup'),
      filterLinks,
      lastUpdated: new Date().toLocaleString(),
    });
  }
};

// Helper functions
async function getInvestorPitches(user) {
  try {
    const { data: pitches } = await databaseService.supabase
      .from('investor_pitches')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    const stats = {
      total: pitches?.length || 0,
      sent: pitches?.filter((p) => p.status === 'sent').length || 0,
      responded: pitches?.filter((p) => p.status === 'responded').length || 0,
      meetings:
        pitches?.filter((p) => p.status === 'meeting_scheduled').length || 0,
    };

    return { pitches: pitches || [], stats };
  } catch (error) {
    logger.error('Error fetching investor pitches:', error);
    return getDefaultInvestorPitches();
  }
}

async function getValuations(user) {
  try {
    const { data: valuations } = await databaseService.supabase
      .from('company_valuations')
      .select('*')
      .eq('user_id', user.id)
      .order('valuation_date', { ascending: false });

    const latest = valuations?.[0] || null;
    const history = valuations?.slice(0, 5) || [];

    return { latest, history };
  } catch (error) {
    logger.error('Error fetching valuations:', error);
    return getDefaultValuations();
  }
}

async function getCapitalRaising(user) {
  try {
    const { data: raising } = await databaseService.supabase
      .from('capital_raising')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    const stats = {
      totalTarget:
        raising?.reduce((sum, r) => sum + (r.target_amount || 0), 0) || 0,
      totalRaised:
        raising?.reduce((sum, r) => sum + (r.amount_raised || 0), 0) || 0,
      activeRounds: raising?.filter((r) => r.status === 'active').length || 0,
    };

    return { rounds: raising || [], stats };
  } catch (error) {
    logger.error('Error fetching capital raising:', error);
    return getDefaultCapitalRaising();
  }
}

async function getFundingRounds(user) {
  try {
    const { data: rounds } = await databaseService.supabase
      .from('funding_rounds')
      .select('*')
      .eq('user_id', user.id)
      .order('round_date', { ascending: false });

    const stats = {
      totalRounds: rounds?.length || 0,
      totalRaised:
        rounds?.reduce((sum, r) => sum + (r.amount_raised || 0), 0) || 0,
      avgRoundSize:
        rounds?.length > 0
          ? rounds.reduce((sum, r) => sum + (r.amount_raised || 0), 0) /
            rounds.length
          : 0,
    };

    return { rounds: rounds || [], stats };
  } catch (error) {
    logger.error('Error fetching funding rounds:', error);
    return getDefaultFundingRounds();
  }
}

function getRoleBasedFeatures(role) {
  return {
    basic: true,
    enterprise: role === 'enterprise' || role === 'corporate',
    corporate: role === 'corporate',
  };
}

function getDefaultInvestorPitches() {
  return {
    pitches: [],
    stats: { total: 0, sent: 0, responded: 0, meetings: 0 },
  };
}

function getDefaultValuations() {
  return {
    latest: null,
    history: [],
  };
}

function getDefaultCapitalRaising() {
  return {
    rounds: [],
    stats: { totalTarget: 0, totalRaised: 0, activeRounds: 0 },
  };
}

function getDefaultFundingRounds() {
  return {
    rounds: [],
    stats: { totalRounds: 0, totalRaised: 0, avgRoundSize: 0 },
  };
}
