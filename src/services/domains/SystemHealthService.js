import logger from '../../utils/logger.js';

class SystemHealthService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  async getSystemMetrics() {
    try {
      logger.debug('Fetching system health metrics');

      // Get system metrics
      const os = await import('os');

      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const usedMemory = totalMemory - freeMemory;
      const memoryUsagePercent = Math.round((usedMemory / totalMemory) * 100);

      const uptime = os.uptime();
      const uptimeDays = Math.floor(uptime / 86400);
      const uptimeHours = Math.floor((uptime % 86400) / 3600);
      const uptimeString = `${uptimeDays}d ${uptimeHours}h`;

      // Database connection test
      const dbConnected = await this.db.testConnection();

      let dbMetrics = {
        totalTables: 0,
        totalRecords: 0,
        activeConnections: 0
      };

      if (dbConnected) {
        try {
          const tables = await this.db.getAllTables();
          dbMetrics.totalTables = tables.length;

          // Get record counts for major tables
          const tableCounts = await Promise.all(tables.slice(0, 10).map(async (tableName) => {
            try {
              const { count } = await this.db.supabase
                .from(tableName)
                .select('*', { count: 'exact', head: true });
              return count || 0;
            } catch (error) {
              return 0;
            }
          }));

          dbMetrics.totalRecords = tableCounts.reduce((sum, count) => sum + count, 0);
        } catch (error) {
          logger.warn('Error getting database metrics:', error.message);
        }
      }

      // Mock additional metrics (in a real app, you'd collect these from monitoring tools)
      const systemMetrics = {
        dbConnected,
        memoryUsagePercent,
        uptimeString,
        cpuUsage: Math.floor(Math.random() * 30) + 40, // Mock CPU usage
        diskUsage: Math.floor(Math.random() * 20) + 25, // Mock disk usage
        ...dbMetrics,
        queriesPerMin: Math.floor(Math.random() * 50) + 10,
        responseTime: Math.floor(Math.random() * 50) + 20,
        activeConnections: Math.floor(Math.random() * 10) + 1
      };

      logger.info('✅ Fetched system health metrics');
      return systemMetrics;
    } catch (error) {
      logger.error('Error fetching system health metrics:', error);
      throw error;
    }
  }

  async getDatabaseHealth() {
    try {
      logger.debug('Checking database health');

      const dbConnected = await this.db.testConnection();

      if (!dbConnected) {
        return {
          status: 'disconnected',
          message: 'Database connection failed'
        };
      }

      // Get basic database stats
      const tables = await this.db.getAllTables();
      const totalRecords = await this.getTotalRecordCount(tables);

      return {
        status: 'healthy',
        totalTables: tables.length,
        totalRecords,
        lastChecked: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Error checking database health:', error);
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  async getTotalRecordCount(tables) {
    try {
      const tableCounts = await Promise.all(tables.slice(0, 20).map(async (tableName) => {
        try {
          const { count } = await this.db.supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });
          return count || 0;
        } catch (error) {
          return 0;
        }
      }));

      return tableCounts.reduce((sum, count) => sum + count, 0);
    } catch (error) {
      logger.error('Error getting total record count:', error);
      return 0;
    }
  }

  async getPerformanceMetrics() {
    try {
      logger.debug('Fetching performance metrics');

      // Mock performance metrics (in a real app, you'd collect these from monitoring tools)
      return {
        responseTime: Math.floor(Math.random() * 50) + 20,
        throughput: Math.floor(Math.random() * 100) + 50,
        errorRate: Math.floor(Math.random() * 5),
        cpuUsage: Math.floor(Math.random() * 30) + 40,
        memoryUsage: Math.floor(Math.random() * 30) + 40
      };
    } catch (error) {
      logger.error('Error fetching performance metrics:', error);
      throw error;
    }
  }
}

export { SystemHealthService };
export default SystemHealthService;