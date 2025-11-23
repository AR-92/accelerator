import logger from '../../utils/logger.js';

class BillingService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  async createBilling(billingData) {
    try {
      logger.debug('Creating billing record:', billingData.description);
      const result = await this.db.create('Billing', {
        ...billingData,
        status: billingData.status || 'pending',
        created_at: new Date().toISOString()
      });
      logger.info(`✅ Created billing record with ID: ${result.id}`);
      return result;
    } catch (error) {
      logger.error('Error creating billing record:', error);
      throw error;
    }
  }

  async getBillingById(id) {
    try {
      const billing = await this.db.read('Billing', id);
      return billing[0] || null;
    } catch (error) {
      logger.error(`Error fetching billing record ${id}:`, error);
      throw error;
    }
  }

  async getBillingByUser(userId, filters = {}) {
    try {
      const billingFilters = { user_id: userId };
      if (filters.status) billingFilters.status = filters.status;
      if (filters.type) billingFilters.type = filters.type;

      const billing = await this.db.read('Billing', null, billingFilters);
      return billing.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } catch (error) {
      logger.error(`Error fetching billing records for user ${userId}:`, error);
      throw error;
    }
  }

  async updateBilling(id, updates) {
    try {
      logger.debug(`Updating billing record ${id}:`, updates);
      const result = await this.db.update('Billing', id, updates);
      logger.info(`✅ Updated billing record ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error updating billing record ${id}:`, error);
      throw error;
    }
  }

  async deleteBilling(id) {
    try {
      logger.debug(`Deleting billing record ${id}`);
      await this.db.delete('Billing', id);
      logger.info(`✅ Deleted billing record ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting billing record ${id}:`, error);
      throw error;
    }
  }

  async markAsPaid(id, paymentMethod = null) {
    try {
      logger.debug(`Marking billing record ${id} as paid`);
      const result = await this.updateBilling(id, {
        status: 'paid',
        paid_at: new Date().toISOString(),
        payment_method: paymentMethod
      });
      logger.info(`✅ Marked billing record ${id} as paid`);
      return result;
    } catch (error) {
      logger.error(`Error marking billing record ${id} as paid:`, error);
      throw error;
    }
  }

  async getAllBilling(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      let query = this.db.supabase
        .from('Billing')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.user_id) query = query.eq('user_id', filters.user_id);
      if (filters.search) {
        query = query.or(`invoice_number.ilike.%${filters.search}%,plan_name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, count, page, limit };
    } catch (error) {
      logger.error('Error fetching billing records:', error);
      throw error;
    }
  }

  async getBillingStats(userId = null) {
    try {
      let query = this.db.supabase
        .from('Billing')
        .select('amount, status, type');

      if (userId) query = query.eq('user_id', userId);

      const { data, error } = await query;
      if (error) throw error;

      const stats = {
        total: data.length,
        paid: data.filter(b => b.status === 'paid').length,
        pending: data.filter(b => b.status === 'pending').length,
        totalAmount: data.reduce((sum, b) => sum + (b.amount || 0), 0),
        paidAmount: data.filter(b => b.status === 'paid').reduce((sum, b) => sum + (b.amount || 0), 0)
      };

      return stats;
    } catch (error) {
      logger.error('Error fetching billing stats:', error);
      throw error;
    }
  }
}

class PackageService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  async createPackage(packageData) {
    try {
      logger.debug('Creating package:', packageData.name);
      const result = await this.db.create('packages', {
        ...packageData,
        status: packageData.status || 'active',
        created_at: new Date().toISOString()
      });
      logger.info(`✅ Created package with ID: ${result.id}`);
      return result;
    } catch (error) {
      logger.error('Error creating package:', error);
      throw error;
    }
  }

  async getPackageById(id) {
    try {
      const packages = await this.db.read('packages', id);
      return packages[0] || null;
    } catch (error) {
      logger.error(`Error fetching package ${id}:`, error);
      throw error;
    }
  }

  async getAllPackages(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      let query = this.db.supabase
        .from('packages')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.package_type) query = query.eq('package_type', filters.package_type);
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, count, page, limit };
    } catch (error) {
      logger.error('Error fetching packages:', error);
      throw error;
    }
  }

  async updatePackage(id, updates) {
    try {
      logger.debug(`Updating package ${id}:`, updates);
      const result = await this.db.update('packages', id, updates);
      logger.info(`✅ Updated package ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error updating package ${id}:`, error);
      throw error;
    }
  }

  async deletePackage(id) {
    try {
      logger.debug(`Deleting package ${id}`);
      await this.db.delete('packages', id);
      logger.info(`✅ Deleted package ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting package ${id}:`, error);
      throw error;
    }
  }

  async activatePackage(id) {
    try {
      logger.debug(`Activating package ${id}`);
      const result = await this.updatePackage(id, {
        status: 'active',
        activated_at: new Date().toISOString()
      });
      logger.info(`✅ Activated package ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error activating package ${id}:`, error);
      throw error;
    }
  }

  async deactivatePackage(id) {
    try {
      logger.debug(`Deactivating package ${id}`);
      const result = await this.updatePackage(id, {
        status: 'inactive',
        deactivated_at: new Date().toISOString()
      });
      logger.info(`✅ Deactivated package ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error deactivating package ${id}:`, error);
      throw error;
    }
  }

  async getActivePackages() {
    try {
      return await this.getAllPackages({ status: 'active' });
    } catch (error) {
      logger.error('Error fetching active packages:', error);
      throw error;
    }
  }
}

class RewardService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  async createReward(rewardData) {
    try {
      logger.debug('Creating reward:', rewardData.title);
      const result = await this.db.create('rewards', {
        ...rewardData,
        status: rewardData.status || 'active',
        created_at: new Date().toISOString()
      });
      logger.info(`✅ Created reward with ID: ${result.id}`);
      return result;
    } catch (error) {
      logger.error('Error creating reward:', error);
      throw error;
    }
  }

  async getRewardById(id) {
    try {
      const rewards = await this.db.read('rewards', id);
      return rewards[0] || null;
    } catch (error) {
      logger.error(`Error fetching reward ${id}:`, error);
      throw error;
    }
  }

  async getAllRewards(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      let query = this.db.supabase
        .from('rewards')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.type) query = query.eq('type', filters.type);
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,type.ilike.%${filters.search}%`);
      }

      const { data, error, count } = await query
        .order('points_required', { ascending: true })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, count, page, limit };
    } catch (error) {
      logger.error('Error fetching rewards:', error);
      throw error;
    }
  }

  async updateReward(id, updates) {
    try {
      logger.debug(`Updating reward ${id}:`, updates);
      const result = await this.db.update('rewards', id, updates);
      logger.info(`✅ Updated reward ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error updating reward ${id}:`, error);
      throw error;
    }
  }

  async deleteReward(id) {
    try {
      logger.debug(`Deleting reward ${id}`);
      await this.db.delete('rewards', id);
      logger.info(`✅ Deleted reward ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting reward ${id}:`, error);
      throw error;
    }
  }

  async getAvailableRewards(userPoints) {
    try {
      const rewards = await this.getAllRewards({ status: 'active' });
      return rewards.filter(reward => reward.points_required <= userPoints);
    } catch (error) {
      logger.error('Error fetching available rewards:', error);
      throw error;
    }
  }

  async redeemReward(userId, rewardId) {
    try {
      // Get reward details
      const reward = await this.getRewardById(rewardId);
      if (!reward) {
        throw new Error('Reward not found');
      }

      if (reward.status !== 'active') {
        throw new Error('Reward is not active');
      }

      // Here you would typically check user's points and deduct them
      // For now, we'll just log the redemption
      logger.info(`User ${userId} redeemed reward ${rewardId}: ${reward.title}`);

      // In a real implementation, you'd create a redemption record
      // and update user's points

      return {
        success: true,
        reward,
        redeemed_at: new Date().toISOString()
      };
    } catch (error) {
      logger.error(`Error redeeming reward ${rewardId} for user ${userId}:`, error);
      throw error;
    }
  }

  async getRewardStats() {
    try {
      const rewards = await this.getAllRewards();

      const stats = {
        total: rewards.length,
        active: rewards.filter(r => r.status === 'active').length,
        inactive: rewards.filter(r => r.status !== 'active').length,
        byType: {}
      };

      // Count by type
      rewards.forEach(reward => {
        stats.byType[reward.type] = (stats.byType[reward.type] || 0) + 1;
      });

      return stats;
    } catch (error) {
      logger.error('Error fetching reward stats:', error);
      throw error;
    }
  }
}

class FinancialService {
  constructor(databaseService) {
    this.db = databaseService;
    this.billing = new BillingService(databaseService);
    this.package = new PackageService(databaseService);
    this.reward = new RewardService(databaseService);
  }

  // Financial dashboard stats
  async getFinancialStats(userId = null) {
    try {
      const [billingStats, packageStats, rewardStats] = await Promise.all([
        this.billing.getBillingStats(userId),
        this.package.getAllPackages(),
        this.reward.getRewardStats()
      ]);

      return {
        billing: billingStats,
        packages: {
          total: packageStats.length,
          active: packageStats.filter(p => p.status === 'active').length
        },
        rewards: rewardStats
      };
    } catch (error) {
      logger.error('Error fetching financial stats:', error);
      throw error;
    }
  }

  // Revenue calculations
  async getRevenueStats(period = 'month') {
    try {
      // Calculate date range
      const now = new Date();
      let startDate;

      switch (period) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      const { data, error } = await this.db.supabase
        .from('billing')
        .select('amount, paid_at')
        .eq('status', 'paid')
        .gte('paid_at', startDate.toISOString());

      if (error) throw error;

      const stats = {
        period,
        totalRevenue: data.reduce((sum, b) => sum + (b.amount || 0), 0),
        transactionCount: data.length,
        averageTransaction: data.length > 0 ? data.reduce((sum, b) => sum + (b.amount || 0), 0) / data.length : 0
      };

      return stats;
    } catch (error) {
      logger.error(`Error fetching revenue stats for period ${period}:`, error);
      throw error;
    }
  }
}

export { FinancialService, BillingService, PackageService, RewardService };
export default FinancialService;