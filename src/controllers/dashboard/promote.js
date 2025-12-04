import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// Dashboard Promotion Management
export const getDashboardPromote = async (req, res) => {
  try {
    logger.info('Dashboard promote section accessed');

    const user = req.user;
    const userRole = user?.role || 'startup';

    // Fetch promotion data
    const pitchDecks = await getPitchDecks(user);
    const investorPresentations = await getInvestorPresentations(user);
    const corporateCommunications = await getCorporateCommunications(user);
    const investorRelations = await getInvestorRelations(user);

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
        active: true,
      },
      {
        id: 'activity-log-link',
        href: '/dashboard/activity-log',
        text: 'Activity Log',
        icon: 'activity',
      },
    ];

    res.render('dashboard/promote', {
      layout: req.headers['hx-request'] ? false : 'dashboard',
      title: 'Promotion Management',
      currentSection: 'dashboard',
      currentPage: 'promote',
      user,
      userRole,
      pitchDecks,
      investorPresentations,
      corporateCommunications,
      investorRelations,
      features,
      filterLinks,
      lastUpdated: new Date().toLocaleString(),
    });
  } catch (error) {
    logger.error('Error loading dashboard promote:', error);
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
        active: true,
      },
      {
        id: 'activity-log-link',
        href: '/dashboard/activity-log',
        text: 'Activity Log',
        icon: 'activity',
      },
    ];

    res.render('dashboard/promote', {
      layout: req.headers['hx-request'] ? false : 'dashboard',
      title: 'Promotion Management',
      currentSection: 'dashboard',
      currentPage: 'promote',
      user: req.user,
      userRole: req.user?.role || 'startup',
      pitchDecks: getDefaultPitchDecks(),
      investorPresentations: getDefaultInvestorPresentations(),
      corporateCommunications: getDefaultCorporateCommunications(),
      investorRelations: getDefaultInvestorRelations(),
      features: getRoleBasedFeatures(req.user?.role || 'startup'),
      filterLinks,
      lastUpdated: new Date().toLocaleString(),
    });
  }
};

// Helper functions
async function getPitchDecks(user) {
  try {
    const { data: decks } = await databaseService.supabase
      .from('pitch_decks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    const stats = {
      total: decks?.length || 0,
      published: decks?.filter((d) => d.status === 'published').length || 0,
      drafts: decks?.filter((d) => d.status === 'draft').length || 0,
      views: decks?.reduce((sum, d) => sum + (d.view_count || 0), 0) || 0,
    };

    return { decks: decks || [], stats };
  } catch (error) {
    logger.error('Error fetching pitch decks:', error);
    return getDefaultPitchDecks();
  }
}

async function getInvestorPresentations(user) {
  try {
    const { data: presentations } = await databaseService.supabase
      .from('investor_presentations')
      .select('*')
      .eq('user_id', user.id)
      .order('presentation_date', { ascending: false });

    const stats = {
      total: presentations?.length || 0,
      completed:
        presentations?.filter((p) => p.status === 'completed').length || 0,
      scheduled:
        presentations?.filter((p) => p.status === 'scheduled').length || 0,
      avgRating:
        presentations?.length > 0
          ? presentations.reduce(
              (sum, p) => sum + (p.investor_rating || 0),
              0
            ) / presentations.length
          : 0,
    };

    return { presentations: presentations || [], stats };
  } catch (error) {
    logger.error('Error fetching investor presentations:', error);
    return getDefaultInvestorPresentations();
  }
}

async function getCorporateCommunications(user) {
  try {
    const { data: communications } = await databaseService.supabase
      .from('corporate_communications')
      .select('*')
      .eq('user_id', user.id)
      .order('publish_date', { ascending: false });

    const stats = {
      total: communications?.length || 0,
      pressReleases:
        communications?.filter((c) => c.type === 'press_release').length || 0,
      newsletters:
        communications?.filter((c) => c.type === 'newsletter').length || 0,
      reports:
        communications?.filter((c) => c.type === 'annual_report').length || 0,
    };

    return { communications: communications || [], stats };
  } catch (error) {
    logger.error('Error fetching corporate communications:', error);
    return getDefaultCorporateCommunications();
  }
}

async function getInvestorRelations(user) {
  try {
    const { data: relations } = await databaseService.supabase
      .from('investor_relations')
      .select('*')
      .eq('user_id', user.id)
      .order('last_contact', { ascending: false });

    const stats = {
      totalInvestors: relations?.length || 0,
      active: relations?.filter((r) => r.status === 'active').length || 0,
      meetings:
        relations?.reduce((sum, r) => sum + (r.meeting_count || 0), 0) || 0,
      updates:
        relations?.reduce((sum, r) => sum + (r.update_count || 0), 0) || 0,
    };

    return { relations: relations || [], stats };
  } catch (error) {
    logger.error('Error fetching investor relations:', error);
    return getDefaultInvestorRelations();
  }
}

function getRoleBasedFeatures(role) {
  return {
    basic: true,
    enterprise: role === 'enterprise' || role === 'corporate',
    corporate: role === 'corporate',
  };
}

function getDefaultPitchDecks() {
  return {
    decks: [],
    stats: { total: 0, published: 0, drafts: 0, views: 0 },
  };
}

function getDefaultInvestorPresentations() {
  return {
    presentations: [],
    stats: { total: 0, completed: 0, scheduled: 0, avgRating: 0 },
  };
}

function getDefaultCorporateCommunications() {
  return {
    communications: [],
    stats: { total: 0, pressReleases: 0, newsletters: 0, reports: 0 },
  };
}

function getDefaultInvestorRelations() {
  return {
    relations: [],
    stats: { totalInvestors: 0, active: 0, meetings: 0, updates: 0 },
  };
}
