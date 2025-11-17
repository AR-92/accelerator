/**
 * Base repository class with common database operations
 */
class BaseRepository {
  constructor(db, tableName, logger) {
    this.db = db;
    this.tableName = tableName;
    this.logger = logger;
  }

  /**
   * Execute a query and return a promise
   * @param {string} sql - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise}
   */
  async query(sql, params = []) {
    const start = Date.now();
    try {
      const rows = await this.db.all(sql, params);
      const duration = Date.now() - start;
      this.logger.logDatabaseQuery('query', sql, params, duration);
      return rows;
    } catch (error) {
      const duration = Date.now() - start;
      this.logger.logDatabaseError('query', sql, params, error, { duration });
      throw error;
    }
  }

  /**
   * Execute a query and return the first row
   * @param {string} sql - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise}
   */
  async queryOne(sql, params = []) {
    const start = Date.now();
    try {
      const row = await this.db.get(sql, params);
      const duration = Date.now() - start;
      this.logger.logDatabaseQuery('queryOne', sql, params, duration);
      return row;
    } catch (error) {
      const duration = Date.now() - start;
      this.logger.logDatabaseError('queryOne', sql, params, error, {
        duration,
      });
      throw error;
    }
  }

  /**
   * Execute a run command (INSERT, UPDATE, DELETE)
   * @param {string} sql - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise}
   */
  async run(sql, params = []) {
    const start = Date.now();
    try {
      const resultData = await this.db.run(sql, params);
      const duration = Date.now() - start;
      this.logger.logDatabaseQuery('run', sql, params, duration);
      return { id: resultData.lastID, changes: resultData.changes };
    } catch (error) {
      const duration = Date.now() - start;
      this.logger.logDatabaseError('run', sql, params, error, { duration });
      throw error;
    }
  }

  /**
   * Find a record by ID
   * @param {number} id - Record ID
   * @returns {Promise}
   */
  async findById(id) {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    return await this.queryOne(sql, [id]);
  }

  /**
   * Find all records
   * @param {Object} options - Query options
   * @returns {Promise}
   */
  async findAll(options = {}) {
    let sql = `SELECT * FROM ${this.tableName}`;
    const params = [];

    if (options.where && Object.keys(options.where).length > 0) {
      const whereClause = Object.keys(options.where)
        .map((key) => `${key} = ?`)
        .join(' AND ');
      sql += ` WHERE ${whereClause}`;
      params.push(...Object.values(options.where));
    }

    if (options.orderBy) {
      sql += ` ORDER BY ${options.orderBy}`;
    }

    if (options.limit) {
      sql += ` LIMIT ?`;
      params.push(options.limit);
    }

    if (options.offset) {
      sql += ` OFFSET ?`;
      params.push(options.offset);
    }

    return await this.query(sql, params);
  }

  /**
   * Create a new record
   * @param {Object} data - Record data
   * @returns {Promise}
   */
  async create(data) {
    // If data has a toDatabaseJSON method, use it for database serialization
    const dbData = data.toDatabaseJSON ? data.toDatabaseJSON() : data;

    const columns = Object.keys(dbData);
    const placeholders = columns.map(() => '?').join(', ');
    const values = Object.values(dbData);

    const sql = `INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES (${placeholders}) RETURNING id`;
    const result = await this.run(sql, values);

    return result.id;
  }

  /**
   * Update a record
   * @param {number} id - Record ID
   * @param {Object} data - Updated data
   * @returns {Promise}
   */
  async update(id, data) {
    // If data has a toDatabaseJSON method, use it for database serialization
    const dbData = data.toDatabaseJSON ? data.toDatabaseJSON() : data;

    const columns = Object.keys(dbData);
    const setClause = columns.map((col) => `${col} = ?`).join(', ');
    const values = [...Object.values(dbData), id];

    const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;
    const result = await this.run(sql, values);

    return result.changes > 0;
  }

  /**
   * Delete a record
   * @param {number} id - Record ID
   * @returns {Promise}
   */
  async delete(id) {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const result = await this.run(sql, [id]);

    return result.changes > 0;
  }

  /**
   * Count records
   * @param {Object} where - Where conditions
   * @returns {Promise}
   */
  async count(where = {}) {
    let sql = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    const params = [];

    if (Object.keys(where).length > 0) {
      const whereClause = Object.keys(where)
        .map((key) => `${key} = ?`)
        .join(' AND ');
      sql += ` WHERE ${whereClause}`;
      params.push(...Object.values(where));
    }

    const result = await this.queryOne(sql, params);
    return result.count;
  }
}

module.exports = BaseRepository;
