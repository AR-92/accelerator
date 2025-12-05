import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// Dashboard Activity Log Management
export const getDashboardActivityLog = async (req, res) => {
  try {
    logger.info('Dashboard activity log section accessed');

    const user = req.user;
    const userRole = user?.role || 'startup';

    // Fetch activity log data
    const userActivities = await getUserActivities(user);
    const systemActivities = await getSystemActivities(userRole);
    const complianceLogs = await getComplianceLogs(user);
    const auditTrails = await getAuditTrails(user);

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
      },
      {
        id: 'activity-log-link',
        href: '/dashboard/activity-log',
        text: 'Activity Log',
        icon: 'activity',
        active: true,
      },
    ];

    res.render('dashboard/activity-log', {
      layout: req.headers['hx-request'] ? false : 'dashboard',
      title: 'Activity Log',
      currentSection: 'home',
      currentPage: 'activity-log',
      user,
      userRole,
      userActivities,
      systemActivities,
      complianceLogs,
      auditTrails,
      features,
      filterLinks,
      lastUpdated: new Date().toLocaleString(),
    });
  } catch (error) {
    logger.error('Error loading dashboard activity log:', error);
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
        active: true,
      },
    ];

    res.render('dashboard/activity-log', {
      layout: req.headers['hx-request'] ? false : 'dashboard',
      title: 'Activity Log',
      currentSection: 'home',
      currentPage: 'activity-log',
      user: req.user,
      userRole: req.user?.role || 'startup',
      userActivities: getDefaultUserActivities(),
      systemActivities: getDefaultSystemActivities(),
      complianceLogs: getDefaultComplianceLogs(),
      auditTrails: getDefaultAuditTrails(),
      features: getRoleBasedFeatures(req.user?.role || 'startup'),
      filterLinks,
      lastUpdated: new Date().toLocaleString(),
    });
  }
};

// Helper functions
async function getUserActivities(user) {
  try {
    const { data: activities } = await databaseService.supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    const stats = {
      total: activities?.length || 0,
      today:
        activities?.filter((a) => {
          const today = new Date().toDateString();
          return new Date(a.created_at).toDateString() === today;
        }).length || 0,
      thisWeek:
        activities?.filter((a) => {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return new Date(a.created_at) > weekAgo;
        }).length || 0,
    };

    return { activities: activities || [], stats };
  } catch (error) {
    logger.error('Error fetching user activities:', error);
    return getDefaultUserActivities();
  }
}

async function getSystemActivities(role) {
  try {
    let query = databaseService.supabase
      .from('system_activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    // Filter based on role - corporate can see all, enterprise can see enterprise-level, startup only their own
    if (role === 'corporate') {
      // No filter - see all
    } else if (role === 'enterprise') {
      query = query.eq('scope', 'enterprise');
    } else {
      query = query.eq('scope', 'startup');
    }

    const { data: activities } = await query;

    const stats = {
      total: activities?.length || 0,
      critical:
        activities?.filter((a) => a.severity === 'critical').length || 0,
      warnings: activities?.filter((a) => a.severity === 'warning').length || 0,
      info: activities?.filter((a) => a.severity === 'info').length || 0,
    };

    return { activities: activities || [], stats };
  } catch (error) {
    logger.error('Error fetching system activities:', error);
    return getDefaultSystemActivities();
  }
}

async function getComplianceLogs(user) {
  try {
    const { data: logs } = await databaseService.supabase
      .from('compliance_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    const stats = {
      total: logs?.length || 0,
      passed: logs?.filter((l) => l.status === 'passed').length || 0,
      failed: logs?.filter((l) => l.status === 'failed').length || 0,
      pending: logs?.filter((l) => l.status === 'pending').length || 0,
    };

    return { logs: logs || [], stats };
  } catch (error) {
    logger.error('Error fetching compliance logs:', error);
    return getDefaultComplianceLogs();
  }
}

async function getAuditTrails(user) {
  try {
    const { data: trails } = await databaseService.supabase
      .from('audit_trails')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false })
      .limit(30);

    const stats = {
      total: trails?.length || 0,
      security: trails?.filter((t) => t.category === 'security').length || 0,
      data: trails?.filter((t) => t.category === 'data').length || 0,
      access: trails?.filter((t) => t.category === 'access').length || 0,
    };

    return { trails: trails || [], stats };
  } catch (error) {
    logger.error('Error fetching audit trails:', error);
    return getDefaultAuditTrails();
  }
}

function getRoleBasedFeatures(role) {
  return {
    basic: true,
    enterprise: role === 'enterprise' || role === 'corporate',
    corporate: role === 'corporate',
  };
}

function getDefaultUserActivities() {
  return {
    activities: [],
    stats: { total: 0, today: 0, thisWeek: 0 },
  };
}

function getDefaultSystemActivities() {
  return {
    activities: [],
    stats: { total: 0, critical: 0, warnings: 0, info: 0 },
  };
}

function getDefaultComplianceLogs() {
  return {
    logs: [],
    stats: { total: 0, passed: 0, failed: 0, pending: 0 },
  };
}

function getDefaultAuditTrails() {
  return {
    trails: [],
    stats: { total: 0, security: 0, data: 0, access: 0 },
  };
}
