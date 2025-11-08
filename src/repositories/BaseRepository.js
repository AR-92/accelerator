/**
 * Base repository class with common database operations
 */
class BaseRepository {
  constructor(db, tableName) {
    this.db = db;
    this.tableName = tableName;
  }

  /**
   * Execute a query and return a promise
   * @param {string} sql - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise}
   */
  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  /**
   * Execute a query and return the first row
   * @param {string} sql - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise}
   */
  queryOne(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  /**
   * Execute a run command (INSERT, UPDATE, DELETE)
   * @param {string} sql - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise}
   */
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
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

    if (options.where) {
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
    const columns = Object.keys(data);
    const placeholders = columns.map(() => '?').join(', ');
    const values = Object.values(data);

    const sql = `INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
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
    const columns = Object.keys(data);
    const setClause = columns.map((col) => `${col} = ?`).join(', ');
    const values = [...Object.values(data), id];

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
