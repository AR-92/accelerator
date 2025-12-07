import { databaseService } from './index.js';
import logger from '../utils/logger.js';

export class ServerDataService {
  // Cache for frequently accessed data
  static cache = new Map();
  static CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  static getCacheKey(userId, type) {
    return `${userId}:${type}`;
  }

  static getCached(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }
    return null;
  }

  static setCached(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  static async getUserDashboardData(userId, role = 'startup') {
    const cacheKey = this.getCacheKey(userId, 'dashboard');
    let data = this.getCached(cacheKey);

    if (!data) {
      // Fetch all dashboard data in parallel
      const [credits, billing, projects, ideas, metrics] = await Promise.all([
        this.getCreditBalance(userId),
        this.getBillingInfo(userId),
        this.getRecentProjects(userId),
        this.getRecentIdeas(userId),
        this.getDashboardMetrics(role),
      ]);

      data = { credits, billing, projects, ideas, metrics };
      this.setCached(cacheKey, data);
    }

    return data;
  }

  static async getCreditBalance(userId) {
    try {
      const cacheKey = this.getCacheKey(userId, 'credits');
      let balance = this.getCached(cacheKey);

      if (balance === null) {
        const { data } = await databaseService.supabase
          .from('user_credits')
          .select('balance')
          .eq('user_id', userId)
          .single();

        balance = data?.balance || 0;
        this.setCached(cacheKey, balance);
      }

      return balance;
    } catch (error) {
      logger.error('Error fetching credit balance:', error);
      return 0;
    }
  }

  static async getUserCredits(userId) {
    try {
      const cacheKey = this.getCacheKey(userId, 'userCredits');
      let credits = this.getCached(cacheKey);

      if (!credits) {
        const { data } = await databaseService.supabase
          .from('user_credits')
          .select('*')
          .eq('user_id', userId)
          .single();

        credits = data || { balance: 0, reputation: 0 };
        this.setCached(cacheKey, credits);
      }

      return credits;
    } catch (error) {
      logger.error('Error fetching user credits:', error);
      return { balance: 0, reputation: 0 };
    }
  }

  static async getBillingInfo(userId) {
    try {
      const cacheKey = this.getCacheKey(userId, 'billing');
      let billing = this.getCached(cacheKey);

      if (!billing) {
        const { data } = await databaseService.supabase
          .from('billing')
          .select('*, plans(*)')
          .eq('user_id', userId)
          .eq('status', 'active')
          .single();

        billing = data || null;
        this.setCached(cacheKey, billing);
      }

      return billing;
    } catch (error) {
      logger.error('Error fetching billing info:', error);
      return null;
    }
  }

  static async getRecentProjects(userId, limit = 5) {
    try {
      const cacheKey = this.getCacheKey(userId, `projects:${limit}`);
      let projects = this.getCached(cacheKey);

      if (!projects) {
        const { data } = await databaseService.supabase
          .from('projects')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false })
          .limit(limit);

        projects = data || [];
        this.setCached(cacheKey, projects);
      }

      return projects;
    } catch (error) {
      logger.error('Error fetching recent projects:', error);
      return [];
    }
  }

  static async getRecentIdeas(userId, limit = 5) {
    try {
      const cacheKey = this.getCacheKey(userId, `ideas:${limit}`);
      let ideas = this.getCached(cacheKey);

      if (!ideas) {
        const { data } = await databaseService.supabase
          .from('ideas')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(limit);

        ideas = data || [];
        this.setCached(cacheKey, ideas);
      }

      return ideas;
    } catch (error) {
      logger.error('Error fetching recent ideas:', error);
      return [];
    }
  }

  static async getDashboardMetrics(role = 'startup') {
    // Mock metrics - in real implementation, calculate from actual data
    const baseMetrics = {
      activeProjects: 12,
      projectGrowth: 8,
      totalIdeas: 45,
      ideaGrowth: 15,
      teamMembers: 8,
      teamGrowth: 2,
      fundingRaised: 250000,
      fundingGrowth: 25,
      growthRate: 18,
      growthChange: 3,
      successRate: 85,
      successRateChange: 5,
      activeUsers: 1250,
      userGrowth: 12,
      totalEnterprises: 8,
      enterpriseGrowth: 2,
      portfolioValue: 45,
      portfolioGrowth: 18,
      systemHealth: 98,
    };

    // Role-based metrics
    switch (role) {
      case 'enterprise':
        return {
          ...baseMetrics,
          activeProjects: baseMetrics.activeProjects + 20,
          totalEnterprises: baseMetrics.totalEnterprises + 5,
        };
      case 'corporate':
        return {
          ...baseMetrics,
          activeProjects: baseMetrics.activeProjects + 50,
          totalEnterprises: baseMetrics.totalEnterprises + 15,
          fundingRaised: baseMetrics.fundingRaised * 3,
        };
      default:
        return baseMetrics;
    }
  }

  // Clear cache for a user (useful after data changes)
  static clearUserCache(userId) {
    const keysToDelete = [];
    for (const key of this.cache.keys()) {
      if (key.startsWith(`${userId}:`)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach((key) => this.cache.delete(key));
  }

  // Clear all cache (useful for maintenance)
  static clearAllCache() {
    this.cache.clear();
  }
}
