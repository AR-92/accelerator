import logger from '../../utils/logger.js';

class DatabaseTableService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  async getAllTables() {
    try {
      logger.debug('Fetching all database tables');
      const tables = await this.db.getAllTables();
      logger.info(`✅ Found ${tables.length} tables`);
      return tables;
    } catch (error) {
      logger.error('Error fetching tables:', error);
      throw error;
    }
  }

  async getTableInfo(tableName) {
    try {
      logger.debug(`Fetching info for table: ${tableName}`);

      const { count, error } = await this.db.supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (error) {
        logger.warn(`Could not get count for table ${tableName}:`, error.message);
        return { name: tableName, records: 'N/A', size: 'N/A', error: error.message };
      }

      return {
        name: tableName,
        records: count || 0,
        size: 'N/A', // Size calculation would need additional query
        lastChecked: new Date().toISOString()
      };
    } catch (error) {
      logger.error(`Error getting info for table ${tableName}:`, error);
      return { name: tableName, records: 'Error', size: 'Error', error: error.message };
    }
  }

  async getAllTablesInfo() {
    try {
      logger.debug('Fetching info for all tables');

      const tables = await this.getAllTables();
      const tableInfos = await Promise.all(tables.map(tableName => this.getTableInfo(tableName)));

      logger.info(`✅ Fetched info for ${tableInfos.length} tables`);
      return tableInfos;
    } catch (error) {
      logger.error('Error fetching all tables info:', error);
      throw error;
    }
  }

  async getDatabaseStats() {
    try {
      logger.debug('Fetching database statistics');

      const tables = await this.getAllTables();
      const tableInfos = await this.getAllTablesInfo();

      const totalRecords = tableInfos
        .filter(info => typeof info.records === 'number')
        .reduce((sum, info) => sum + info.records, 0);

      const stats = {
        totalTables: tables.length,
        totalRecords,
        accessibleTables: tableInfos.filter(info => !info.error).length,
        inaccessibleTables: tableInfos.filter(info => info.error).length,
        lastChecked: new Date().toISOString()
      };

      logger.info(`✅ Database stats: ${stats.totalTables} tables, ${stats.totalRecords} records`);
      return stats;
    } catch (error) {
      logger.error('Error fetching database stats:', error);
      throw error;
    }
  }

  async testTableAccess(tableName) {
    try {
      logger.debug(`Testing access to table: ${tableName}`);

      const { data, error } = await this.db.supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .limit(1);

      if (error) {
        return { accessible: false, error: error.message };
      }

      return { accessible: true, recordCount: data?.length || 0 };
    } catch (error) {
      logger.error(`Error testing access to table ${tableName}:`, error);
      return { accessible: false, error: error.message };
    }
  }
}

export { DatabaseTableService };
export default DatabaseTableService;