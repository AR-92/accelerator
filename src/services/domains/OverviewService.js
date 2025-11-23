import logger from '../../utils/logger.js';

class BusinessOverviewService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  async getBusinessStats() {
    try {
      logger.debug('Fetching business overview statistics');

      // Fetch data from all business-related tables
      const results = await Promise.all([
        this.db.supabase.from('business_model').select('status'),
        this.db.supabase.from('business_plan').select('status'),
        this.db.supabase.from('financial_model').select('model_status'),
        this.db.supabase.from('pitchdeck').select('status'),
        this.db.supabase.from('valuation').select('created_at'),
        this.db.supabase.from('funding').select('status'),
        this.db.supabase.from('team').select('status'),
        this.db.supabase.from('legal').select('compliance_status'),
        this.db.supabase.from('marketing').select('status'),
        this.db.supabase.from('corporates').select('status'),
        this.db.supabase.from('enterprises').select('status')
      ]);

      const [
        businessModels,
        businessPlans,
        financialModels,
        pitchdecks,
        valuations,
        funding,
        teams,
        legal,
        marketing,
        corporate,
        enterprises
      ] = results;

      const stats = {
        businessModels: { total: 0, active: 0, draft: 0 },
        businessPlans: { total: 0, completed: 0, inProgress: 0 },
        financialModels: { total: 0, active: 0, archived: 0 },
        pitchdecks: { total: 0, reviewed: 0, pending: 0 },
        valuations: { total: 0, recent: 0 },
        funding: { total: 0, secured: 0, seeking: 0 },
        teams: { total: 0, complete: 0, forming: 0 },
        legal: { total: 0, compliant: 0, pending: 0 },
        marketing: { total: 0, active: 0, planned: 0 },
        corporate: { total: 0, active: 0, inactive: 0 },
        enterprises: { total: 0, growing: 0, stable: 0 }
      };

      // Process business models
      if (businessModels.data) {
        stats.businessModels.total = businessModels.data.length;
        stats.businessModels.active = businessModels.data.filter(b => b.status === 'active').length;
        stats.businessModels.draft = stats.businessModels.total - stats.businessModels.active;
      }

      // Process business plans
      if (businessPlans.data) {
        stats.businessPlans.total = businessPlans.data.length;
        stats.businessPlans.completed = businessPlans.data.filter(b => b.status === 'completed').length;
        stats.businessPlans.inProgress = stats.businessPlans.total - stats.businessPlans.completed;
      }

      // Process financial models
      if (financialModels.data) {
        stats.financialModels.total = financialModels.data.length;
        stats.financialModels.active = financialModels.data.filter(f => f.model_status === 'active').length;
        stats.financialModels.archived = stats.financialModels.total - stats.financialModels.active;
      }

      // Process pitchdecks
      if (pitchdecks.data) {
        stats.pitchdecks.total = pitchdecks.data.length;
        stats.pitchdecks.reviewed = pitchdecks.data.filter(p => p.status === 'reviewed').length;
        stats.pitchdecks.pending = stats.pitchdecks.total - stats.pitchdecks.reviewed;
      }

      // Process valuations
      if (valuations.data) {
        stats.valuations.total = valuations.data.length;
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        stats.valuations.recent = valuations.data.filter(v => new Date(v.created_at) >= monthAgo).length;
      }

      // Process funding
      if (funding.data) {
        stats.funding.total = funding.data.length;
        stats.funding.secured = funding.data.filter(f => f.status === 'secured').length;
        stats.funding.seeking = stats.funding.total - stats.funding.secured;
      }

      // Process teams
      if (teams.data) {
        stats.teams.total = teams.data.length;
        stats.teams.complete = teams.data.filter(t => t.status === 'complete').length;
        stats.teams.forming = stats.teams.total - stats.teams.complete;
      }

      // Process legal
      if (legal.data) {
        stats.legal.total = legal.data.length;
        stats.legal.compliant = legal.data.filter(l => l.compliance_status === 'compliant').length;
        stats.legal.pending = stats.legal.total - stats.legal.compliant;
      }

      // Process marketing
      if (marketing.data) {
        stats.marketing.total = marketing.data.length;
        stats.marketing.active = marketing.data.filter(m => m.status === 'active').length;
        stats.marketing.planned = stats.marketing.total - stats.marketing.active;
      }

      // Process corporate
      if (corporate.data) {
        stats.corporate.total = corporate.data.length;
        stats.corporate.active = corporate.data.filter(c => c.status === 'active').length;
        stats.corporate.inactive = stats.corporate.total - stats.corporate.active;
      }

      // Process enterprises
      if (enterprises.data) {
        stats.enterprises.total = enterprises.data.length;
        stats.enterprises.growing = enterprises.data.filter(e => e.status === 'growing').length;
        stats.enterprises.stable = stats.enterprises.total - stats.enterprises.growing;
      }

      logger.info('✅ Fetched business overview statistics');
      return stats;
    } catch (error) {
      logger.error('Error fetching business overview stats:', error);
      throw error;
    }
  }
}

class FinancialOverviewService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  async getFinancialStats() {
    try {
      logger.debug('Fetching financial overview statistics');

      const stats = {
        packages: { total: 0, active: 0, inactive: 0 },
        billing: { total: 0, paid: 0, pending: 0 },
        rewards: { total: 0, active: 0, expired: 0 },
        revenue: { total: 0, thisMonth: 0, growth: 0 }
      };

      const [packagesResult, billingResult, rewardsResult] = await Promise.all([
        this.db.supabase.from('packages').select('status'),
        this.db.supabase.from('Billing').select('status, amount_cents, created_at'),
        this.db.supabase.from('rewards').select('status')
      ]);

      if (packagesResult.data) {
        stats.packages.total = packagesResult.data.length;
        stats.packages.active = packagesResult.data.filter(p => p.status === 'active').length;
        stats.packages.inactive = stats.packages.total - stats.packages.active;
      }

      if (billingResult.data) {
        stats.billing.total = billingResult.data.length;
        stats.billing.paid = billingResult.data.filter(b => b.status === 'paid').length;
        stats.billing.pending = stats.billing.total - stats.billing.paid;

        // Calculate revenue
        stats.revenue.total = billingResult.data
          .filter(b => b.status === 'paid')
          .reduce((sum, b) => sum + (b.amount_cents || 0), 0) / 100;

        const thisMonth = new Date();
        thisMonth.setDate(1);
        stats.revenue.thisMonth = billingResult.data
          .filter(b => b.status === 'paid' && new Date(b.created_at) >= thisMonth)
          .reduce((sum, b) => sum + (b.amount_cents || 0), 0) / 100;

        stats.revenue.growth = stats.revenue.total > 0 ? (stats.revenue.thisMonth / stats.revenue.total) * 100 : 0;
      }

      if (rewardsResult.data) {
        stats.rewards.total = rewardsResult.data.length;
        stats.rewards.active = rewardsResult.data.filter(r => r.status === 'active').length;
        stats.rewards.expired = stats.rewards.total - stats.rewards.active;
      }

      logger.info('✅ Fetched financial overview statistics');
      return stats;
    } catch (error) {
      logger.error('Error fetching financial overview stats:', error);
      throw error;
    }
  }
}

class LearningOverviewService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  async getLearningStats() {
    try {
      logger.debug('Fetching learning overview statistics');

      const stats = {
        content: { total: 0, published: 0, draft: 0 },
        categories: { total: 0, featured: 0, regular: 0 },
        assessments: { total: 0, active: 0, archived: 0 },
        analytics: { total: 0, thisWeek: 0, thisMonth: 0 }
      };

      const [contentResult, categoriesResult, assessmentsResult, analyticsResult] = await Promise.all([
        this.db.supabase.from('learning_content').select('status'),
        this.db.supabase.from('learning_categories').select('is_featured'),
        this.db.supabase.from('learning_assessments').select('status'),
        this.db.supabase.from('learning_analytics').select('created_at')
      ]);

      if (contentResult.data) {
        stats.content.total = contentResult.data.length;
        stats.content.published = contentResult.data.filter(c => c.status === 'published').length;
        stats.content.draft = stats.content.total - stats.content.published;
      }

      if (categoriesResult.data) {
        stats.categories.total = categoriesResult.data.length;
        stats.categories.featured = categoriesResult.data.filter(c => c.is_featured).length;
        stats.categories.regular = stats.categories.total - stats.categories.featured;
      }

      if (assessmentsResult.data) {
        stats.assessments.total = assessmentsResult.data.length;
        stats.assessments.active = assessmentsResult.data.filter(a => a.status === 'active').length;
        stats.assessments.archived = stats.assessments.total - stats.assessments.active;
      }

      if (analyticsResult.data) {
        stats.analytics.total = analyticsResult.data.length;
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        stats.analytics.thisWeek = analyticsResult.data.filter(a => new Date(a.created_at) >= weekAgo).length;
        stats.analytics.thisMonth = analyticsResult.data.filter(a => new Date(a.created_at) >= monthAgo).length;
      }

      logger.info('✅ Fetched learning overview statistics');
      return stats;
    } catch (error) {
      logger.error('Error fetching learning overview stats:', error);
      throw error;
    }
  }
}

class SystemOverviewService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  async getSystemStats() {
    try {
      logger.debug('Fetching system overview statistics');

      const stats = {
        notifications: { total: 0, unread: 0, thisWeek: 0 },
        activityLogs: { total: 0, today: 0, thisWeek: 0 },
        systemHealth: { status: 'healthy', uptime: '0d 0h', memoryUsage: 0 }
      };

      const [notificationsResult, activityLogsResult] = await Promise.all([
        this.db.supabase.from('notifications').select('is_read, created_at').order('created_at', { ascending: false }),
        this.db.supabase.from('activity_logs').select('created_at').order('created_at', { ascending: false })
      ]);

      if (notificationsResult.data) {
        stats.notifications.total = notificationsResult.data.length;
        stats.notifications.unread = notificationsResult.data.filter(n => !n.is_read).length;
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        stats.notifications.thisWeek = notificationsResult.data.filter(n => new Date(n.created_at) >= weekAgo).length;
      }

      if (activityLogsResult.data) {
        stats.activityLogs.total = activityLogsResult.data.length;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        stats.activityLogs.today = activityLogsResult.data.filter(a => new Date(a.created_at) >= today).length;
        stats.activityLogs.thisWeek = activityLogsResult.data.filter(a => new Date(a.created_at) >= weekAgo).length;
      }

      // Mock system health stats
      const os = await import('os');
      const uptime = os.uptime();
      const uptimeDays = Math.floor(uptime / 86400);
      const uptimeHours = Math.floor((uptime % 86400) / 3600);
      stats.systemHealth.uptime = `${uptimeDays}d ${uptimeHours}h`;
      stats.systemHealth.memoryUsage = Math.floor(Math.random() * 30) + 40;

      logger.info('✅ Fetched system overview statistics');
      return stats;
    } catch (error) {
      logger.error('Error fetching system overview stats:', error);
      throw error;
    }
  }
}

class MainOverviewService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  async getMainStats() {
    try {
      logger.debug('Fetching main overview statistics');

      const stats = {
        todos: { total: 0, completed: 0, pending: 0 },
        users: { total: 0, active: 0, pending: 0 },
        ideas: { total: 0, approved: 0, pending: 0 },
        votes: { total: 0, upvotes: 0, downvotes: 0 },
        collaborations: { total: 0, active: 0, archived: 0 }
      };

      const [todosResult, usersResult, ideasResult, votesResult, collaborationsResult] = await Promise.all([
        this.db.supabase.from('todos').select('completed').order('created_at', { ascending: false }),
        this.db.supabase.from('Accounts').select('is_verified').order('created_at', { ascending: false }),
        this.db.supabase.from('ideas').select('status').order('created_at', { ascending: false }),
        this.db.supabase.from('ideas').select('upvotes, downvotes').order('created_at', { ascending: false }),
        this.db.supabase.from('collaborations').select('status').order('created_at', { ascending: false })
      ]);

      if (todosResult.data) {
        stats.todos.total = todosResult.data.length;
        stats.todos.completed = todosResult.data.filter(t => t.completed).length;
        stats.todos.pending = stats.todos.total - stats.todos.completed;
      }

      if (usersResult.data) {
        stats.users.total = usersResult.data.length;
        stats.users.active = usersResult.data.filter(u => u.is_verified).length;
        stats.users.pending = stats.users.total - stats.users.active;
      }

      if (ideasResult.data) {
        stats.ideas.total = ideasResult.data.length;
        stats.ideas.approved = ideasResult.data.filter(i => i.status === 'approved').length;
        stats.ideas.pending = stats.ideas.total - stats.ideas.approved;
      }

      if (votesResult.data) {
        stats.votes.total = votesResult.data.reduce((sum, idea) => sum + (idea.upvotes || 0) + (idea.downvotes || 0), 0);
        stats.votes.upvotes = votesResult.data.reduce((sum, idea) => sum + (idea.upvotes || 0), 0);
        stats.votes.downvotes = votesResult.data.reduce((sum, idea) => sum + (idea.downvotes || 0), 0);
      }

      if (collaborationsResult.data) {
        stats.collaborations.total = collaborationsResult.data.length;
        stats.collaborations.active = collaborationsResult.data.filter(c => c.status === 'active').length;
        stats.collaborations.archived = stats.collaborations.total - stats.collaborations.active;
      }

      logger.info('✅ Fetched main overview statistics');
      return stats;
    } catch (error) {
      logger.error('Error fetching main overview stats:', error);
      throw error;
    }
  }
}

class ProjectsOverviewService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  async getProjectsStats() {
    try {
      logger.debug('Fetching projects overview statistics');

      const stats = {
        collaborators: { total: 0, active: 0, inactive: 0 },
        calendar: { total: 0, upcoming: 0, thisMonth: 0 }
      };

      const [collaboratorsResult, calendarResult] = await Promise.all([
        this.db.supabase.from('project_collaborators').select('status'),
        this.db.supabase.from('calendar').select('start_date')
      ]);

      if (collaboratorsResult.data) {
        stats.collaborators.total = collaboratorsResult.data.length;
        stats.collaborators.active = collaboratorsResult.data.filter(c => c.status === 'active').length;
        stats.collaborators.inactive = stats.collaborators.total - stats.collaborators.active;
      }

      if (calendarResult.data) {
        stats.calendar.total = calendarResult.data.length;
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        stats.calendar.upcoming = calendarResult.data.filter(c => new Date(c.start_date) >= now).length;
        stats.calendar.thisMonth = calendarResult.data.filter(c => {
          const date = new Date(c.start_date);
          return date >= thisMonth && date < nextMonth;
        }).length;
      }

      logger.info('✅ Fetched projects overview statistics');
      return stats;
    } catch (error) {
      logger.error('Error fetching projects overview stats:', error);
      throw error;
    }
  }
}

class ContentManagementOverviewService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  async getContentManagementStats() {
    try {
      logger.debug('Fetching content management overview statistics');

      const stats = {
        content: { total: 0, published: 0, draft: 0 },
        landingPages: { total: 0, active: 0, inactive: 0 }
      };

      const [contentResult, landingPagesResult] = await Promise.all([
        this.db.supabase.from('learning_content').select('status').order('created_at', { ascending: false }),
        this.db.supabase.from('landing_pages').select('status').order('created_at', { ascending: false })
      ]);

      if (contentResult.data) {
        stats.content.total = contentResult.data.length;
        stats.content.published = contentResult.data.filter(c => c.status === 'published').length;
        stats.content.draft = stats.content.total - stats.content.published;
      }

      if (landingPagesResult.data) {
        stats.landingPages.total = landingPagesResult.data.length;
        stats.landingPages.active = landingPagesResult.data.filter(l => l.status === 'active').length;
        stats.landingPages.inactive = stats.landingPages.total - stats.landingPages.active;
      }

      logger.info('✅ Fetched content management overview statistics');
      return stats;
    } catch (error) {
      logger.error('Error fetching content management overview stats:', error);
      throw error;
    }
  }
}

class HelpOverviewService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  async getHelpStats() {
    try {
      logger.debug('Fetching help overview statistics');

      const stats = {
        helpCenter: { total: 0, published: 0, draft: 0 },
        support: { totalTickets: 0, open: 0, resolved: 0 }
      };

      const helpCenterResult = await this.db.supabase.from('help_center').select('status');

      if (helpCenterResult.data) {
        stats.helpCenter.total = helpCenterResult.data.length;
        stats.helpCenter.published = helpCenterResult.data.filter(h => h.status === 'published').length;
        stats.helpCenter.draft = stats.helpCenter.total - stats.helpCenter.published;
      }

      // Mock support stats
      stats.support.totalTickets = Math.floor(Math.random() * 100) + 50;
      stats.support.open = Math.floor(stats.support.totalTickets * 0.3);
      stats.support.resolved = stats.support.totalTickets - stats.support.open;

      logger.info('✅ Fetched help overview statistics');
      return stats;
    } catch (error) {
      logger.error('Error fetching help overview stats:', error);
      throw error;
    }
  }
}

export {
  BusinessOverviewService,
  FinancialOverviewService,
  LearningOverviewService,
  SystemOverviewService,
  MainOverviewService,
  ProjectsOverviewService,
  ContentManagementOverviewService,
  HelpOverviewService
};
export default BusinessOverviewService;