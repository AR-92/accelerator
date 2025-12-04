import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// Dashboard Team Management
export const getDashboardTeam = async (req, res) => {
  try {
    logger.info('Dashboard team section accessed');

    const user = req.user;
    const userRole = user?.role || 'startup';

    // Fetch team data
    const teamMembers = await getTeamMembers(user);
    const hiringPlans = await getHiringPlans(user);
    const skillsAssessment = await getSkillsAssessment(user);
    const organizationalStructure = await getOrganizationalStructure(user);

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
        active: true,
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

    res.render('dashboard/team', {
      layout: req.headers['hx-request'] ? false : 'dashboard',
      title: 'Team Management',
      currentSection: 'dashboard',
      currentPage: 'team',
      user,
      userRole,
      teamMembers,
      hiringPlans,
      skillsAssessment,
      organizationalStructure,
      features,
      filterLinks,
      lastUpdated: new Date().toLocaleString(),
    });
  } catch (error) {
    logger.error('Error loading dashboard team:', error);
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
        active: true,
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

    res.render('dashboard/team', {
      layout: req.headers['hx-request'] ? false : 'dashboard',
      title: 'Team Management',
      currentSection: 'dashboard',
      currentPage: 'team',
      user: req.user,
      userRole: req.user?.role || 'startup',
      teamMembers: getDefaultTeamMembers(),
      hiringPlans: getDefaultHiringPlans(),
      skillsAssessment: getDefaultSkillsAssessment(),
      organizationalStructure: getDefaultOrganizationalStructure(),
      features: getRoleBasedFeatures(req.user?.role || 'startup'),
      filterLinks,
      lastUpdated: new Date().toLocaleString(),
    });
  }
};

// Helper functions
async function getTeamMembers(user) {
  try {
    const { data: members } = await databaseService.supabase
      .from('team_members')
      .select('*')
      .eq('user_id', user.id)
      .order('hire_date', { ascending: false });

    const stats = {
      total: members?.length || 0,
      active: members?.filter((m) => m.status === 'active').length || 0,
      departments:
        members?.reduce((acc, m) => {
          acc[m.department] = (acc[m.department] || 0) + 1;
          return acc;
        }, {}) || {},
      avgTenure:
        members?.length > 0
          ? members.reduce(
              (sum, m) =>
                sum +
                (new Date() - new Date(m.hire_date)) /
                  (1000 * 60 * 60 * 24 * 365.25),
              0
            ) / members.length
          : 0,
    };

    return { members: members || [], stats };
  } catch (error) {
    logger.error('Error fetching team members:', error);
    return getDefaultTeamMembers();
  }
}

async function getHiringPlans(user) {
  try {
    const { data: plans } = await databaseService.supabase
      .from('hiring_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('target_date', { ascending: true });

    const stats = {
      totalPositions:
        plans?.reduce((sum, p) => sum + (p.positions_count || 0), 0) || 0,
      filled: plans?.filter((p) => p.status === 'filled').length || 0,
      inProgress: plans?.filter((p) => p.status === 'in_progress').length || 0,
      planned: plans?.filter((p) => p.status === 'planned').length || 0,
    };

    return { plans: plans || [], stats };
  } catch (error) {
    logger.error('Error fetching hiring plans:', error);
    return getDefaultHiringPlans();
  }
}

async function getSkillsAssessment(user) {
  try {
    const { data: assessments } = await databaseService.supabase
      .from('skills_assessments')
      .select('*')
      .eq('user_id', user.id)
      .order('assessment_date', { ascending: false });

    const skillsGap =
      assessments?.reduce((acc, a) => {
        if (a.skill_gap) {
          acc[a.skill_name] = (acc[a.skill_name] || 0) + 1;
        }
        return acc;
      }, {}) || {};

    const avgProficiency =
      assessments?.length > 0
        ? assessments.reduce((sum, a) => sum + (a.proficiency_level || 0), 0) /
          assessments.length
        : 0;

    return {
      assessments: assessments || [],
      skillsGap,
      avgProficiency: Math.round(avgProficiency * 10) / 10,
    };
  } catch (error) {
    logger.error('Error fetching skills assessment:', error);
    return getDefaultSkillsAssessment();
  }
}

async function getOrganizationalStructure(user) {
  try {
    const { data: structure } = await databaseService.supabase
      .from('organizational_structure')
      .select('*')
      .eq('user_id', user.id)
      .single();

    return structure || getDefaultOrganizationalStructure();
  } catch (error) {
    logger.error('Error fetching organizational structure:', error);
    return getDefaultOrganizationalStructure();
  }
}

function getRoleBasedFeatures(role) {
  return {
    basic: true,
    enterprise: role === 'enterprise' || role === 'corporate',
    corporate: role === 'corporate',
  };
}

function getDefaultTeamMembers() {
  return {
    members: [],
    stats: { total: 0, active: 0, departments: {}, avgTenure: 0 },
  };
}

function getDefaultHiringPlans() {
  return {
    plans: [],
    stats: { totalPositions: 0, filled: 0, inProgress: 0, planned: 0 },
  };
}

function getDefaultSkillsAssessment() {
  return {
    assessments: [],
    skillsGap: {},
    avgProficiency: 0,
  };
}

function getDefaultOrganizationalStructure() {
  return {
    structure_type: 'Flat',
    departments: [],
    reporting_lines: 'Direct',
    hierarchy_levels: 2,
  };
}
