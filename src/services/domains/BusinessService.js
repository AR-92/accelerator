import logger from '../../utils/logger.js';

class CorporateService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  async createCorporate(corporateData) {
    try {
      logger.debug('Creating corporate:', corporateData.name);
      const result = await this.db.create('corporates', {
        ...corporateData,
        status: corporateData.status || 'active',
        created_at: new Date().toISOString()
      });
      logger.info(`✅ Created corporate with ID: ${result.id}`);
      return result;
    } catch (error) {
      logger.error('Error creating corporate:', error);
      throw error;
    }
  }

  async getCorporateById(id) {
    try {
      const corporates = await this.db.read('corporates', id);
      return corporates[0] || null;
    } catch (error) {
      logger.error(`Error fetching corporate ${id}:`, error);
      throw error;
    }
  }

  async getAllCorporates(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      let query = this.db.supabase
        .from('corporates')
        .select('*', { count: 'exact' });

      if (filters.industry) query = query.eq('industry', filters.industry);
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,industry.ilike.%${filters.search}%`);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, count, page, limit };
    } catch (error) {
      logger.error('Error fetching corporates:', error);
      throw error;
    }
  }

  async updateCorporate(id, updates) {
    try {
      logger.debug(`Updating corporate ${id}:`, updates);
      const result = await this.db.update('corporates', id, updates);
      logger.info(`✅ Updated corporate ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error updating corporate ${id}:`, error);
      throw error;
    }
  }

  async deleteCorporate(id) {
    try {
      logger.debug(`Deleting corporate ${id}`);
      await this.db.delete('corporates', id);
      logger.info(`✅ Deleted corporate ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting corporate ${id}:`, error);
      throw error;
    }
  }
}

class EnterpriseService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  async createEnterprise(enterpriseData) {
    try {
      logger.debug('Creating enterprise:', enterpriseData.name);
      const result = await this.db.create('enterprises', {
        ...enterpriseData,
        status: enterpriseData.status || 'active',
        created_at: new Date().toISOString()
      });
      logger.info(`✅ Created enterprise with ID: ${result.id}`);
      return result;
    } catch (error) {
      logger.error('Error creating enterprise:', error);
      throw error;
    }
  }

  async getEnterpriseById(id) {
    try {
      const enterprises = await this.db.read('enterprises', id);
      return enterprises[0] || null;
    } catch (error) {
      logger.error(`Error fetching enterprise ${id}:`, error);
      throw error;
    }
  }

  async getAllEnterprises(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      let query = this.db.supabase
        .from('enterprises')
        .select('*', { count: 'exact' });

      if (filters.industry) query = query.eq('industry', filters.industry);
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,industry.ilike.%${filters.search}%`);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, count, page, limit };
    } catch (error) {
      logger.error('Error fetching enterprises:', error);
      throw error;
    }
  }

  async updateEnterprise(id, updates) {
    try {
      logger.debug(`Updating enterprise ${id}:`, updates);
      const result = await this.db.update('enterprises', id, updates);
      logger.info(`✅ Updated enterprise ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error updating enterprise ${id}:`, error);
      throw error;
    }
  }

  async deleteEnterprise(id) {
    try {
      logger.debug(`Deleting enterprise ${id}`);
      await this.db.delete('enterprises', id);
      logger.info(`✅ Deleted enterprise ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting enterprise ${id}:`, error);
      throw error;
    }
  }
}

class StartupService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  async createStartup(startupData) {
    try {
      logger.debug('Creating startup:', startupData.name);
      const result = await this.db.create('startups', {
        ...startupData,
        status: startupData.status || 'active',
        created_at: new Date().toISOString()
      });
      logger.info(`✅ Created startup with ID: ${result.id}`);
      return result;
    } catch (error) {
      logger.error('Error creating startup:', error);
      throw error;
    }
  }

  async getStartupById(id) {
    try {
      const startups = await this.db.read('startups', id);
      return startups[0] || null;
    } catch (error) {
      logger.error(`Error fetching startup ${id}:`, error);
      throw error;
    }
  }

  async getAllStartups(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      let query = this.db.supabase
        .from('startups')
        .select('*', { count: 'exact' });

      if (filters.industry) query = query.eq('industry', filters.industry);
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,industry.ilike.%${filters.search}%`);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, count, page, limit };
    } catch (error) {
      logger.error('Error fetching startups:', error);
      throw error;
    }
  }

  async updateStartup(id, updates) {
    try {
      logger.debug(`Updating startup ${id}:`, updates);
      const result = await this.db.update('startups', id, updates);
      logger.info(`✅ Updated startup ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error updating startup ${id}:`, error);
      throw error;
    }
  }

  async deleteStartup(id) {
    try {
      logger.debug(`Deleting startup ${id}`);
      await this.db.delete('startups', id);
      logger.info(`✅ Deleted startup ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting startup ${id}:`, error);
      throw error;
    }
  }
}

class BusinessService {
  constructor(databaseService) {
    this.db = databaseService;
    this.corporate = new CorporateService(databaseService);
    this.enterprise = new EnterpriseService(databaseService);
    this.startup = new StartupService(databaseService);
  }

  // Unified business search across all types
  async searchBusinesses(searchTerm, type = null) {
    try {
      const results = { corporates: [], enterprises: [], startups: [] };

      if (!type || type === 'corporate') {
        results.corporates = await this.corporate.getAllCorporates({ search: searchTerm }, { limit: 20 });
      }
      if (!type || type === 'enterprise') {
        results.enterprises = await this.enterprise.getAllEnterprises({ search: searchTerm }, { limit: 20 });
      }
      if (!type || type === 'startup') {
        results.startups = await this.startup.getAllStartups({ search: searchTerm }, { limit: 20 });
      }

      return results;
    } catch (error) {
      logger.error('Error searching businesses:', error);
      throw error;
    }
  }

  // Business statistics
  async getBusinessStats() {
    try {
      const [corporateStats, enterpriseStats, startupStats] = await Promise.all([
        this.corporate.getAllCorporates(),
        this.enterprise.getAllEnterprises(),
        this.startup.getAllStartups()
      ]);

      return {
        corporates: {
          total: corporateStats.count || 0,
          active: corporateStats.data?.filter(c => c.status === 'active').length || 0
        },
        enterprises: {
          total: enterpriseStats.count || 0,
          active: enterpriseStats.data?.filter(e => e.status === 'active').length || 0
        },
        startups: {
          total: startupStats.count || 0,
          active: startupStats.data?.filter(s => s.status === 'active').length || 0
        },
        total: (corporateStats.count || 0) + (enterpriseStats.count || 0) + (startupStats.count || 0)
      };
    } catch (error) {
      logger.error('Error fetching business stats:', error);
      throw error;
    }
  }
}

export { BusinessService, CorporateService, EnterpriseService, StartupService };
export default BusinessService;