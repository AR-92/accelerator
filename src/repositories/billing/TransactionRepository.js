const BaseRepository = require('../common/BaseRepository');

/**
 * Transaction Repository
 * Handles database operations for credit transactions and payments
 */

class TransactionRepository extends BaseRepository {
  constructor(db) {
    super(db, 'transactions');
  }

  /**
   * Find all transactions with filtering and pagination
   * @param {Object} options - Query options
   * @returns {Promise<Array>}
   */
  async findAll(options = {}) {
    let sql = `
      SELECT t.*, u.name as user_name, u.email as user_email
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (options.search) {
      sql += ` AND (u.email ILIKE ? OR u.name ILIKE ? OR t.provider_tx_id ILIKE ?)`;
      const searchTerm = `%${options.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (options.type) {
      sql += ` AND t.tx_type = ?`;
      params.push(options.type);
    }

    if (options.status) {
      // For transactions, status might not be directly applicable, but keeping for consistency
      sql += ` AND t.tx_type = ?`;
      params.push(options.status);
    }

    if (options.userId) {
      sql += ` AND t.user_id = ?`;
      params.push(options.userId);
    }

    if (options.orderBy) {
      sql += ` ORDER BY ${options.orderBy}`;
    } else {
      sql += ` ORDER BY t.created_at DESC`;
    }

    if (options.limit) {
      sql += ` LIMIT ?`;
      params.push(options.limit);
    }

    if (options.offset) {
      sql += ` OFFSET ?`;
      params.push(options.offset);
    }

    return this.query(sql, params);
  }

  /**
   * Count transactions with filtering
   * @param {Object} options - Query options
   * @returns {Promise<number>}
   */
  async count(options = {}) {
    let sql = `
      SELECT COUNT(*) as count
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (options.search) {
      sql += ` AND (u.email ILIKE ? OR u.name ILIKE ? OR t.provider_tx_id ILIKE ?)`;
      const searchTerm = `%${options.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (options.type) {
      sql += ` AND t.tx_type = ?`;
      params.push(options.type);
    }

    if (options.status) {
      sql += ` AND t.tx_type = ?`;
      params.push(options.status);
    }

    if (options.userId) {
      sql += ` AND t.user_id = ?`;
      params.push(options.userId);
    }

    const result = await this.queryOne(sql, params);
    return result ? result.count : 0;
  }

  /**
   * Get all transactions with user information
   */
  async getAll() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT t.*, u.name as user_name, u.email as user_email
        FROM transactions t
        JOIN users u ON t.user_id = u.id
        ORDER BY t.created_at DESC
      `;
      this.db.all(sql, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  /**
   * Get transactions by user ID
   */
  async getByUserId(userId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM transactions
        WHERE user_id = ?
        ORDER BY created_at DESC
      `;
      this.db.all(sql, [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  /**
   * Get transactions by type
   */
  async getByType(txType) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT t.*, u.name as user_name, u.email as user_email
        FROM transactions t
        JOIN users u ON t.user_id = u.id
        WHERE t.tx_type = ?
        ORDER BY t.created_at DESC
      `;
      this.db.all(sql, [txType], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  /**
   * Get transaction by ID
   */
  async getById(id) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT t.*, u.name as user_name, u.email as user_email
        FROM transactions t
        JOIN users u ON t.user_id = u.id
        WHERE t.id = ?
      `;
      this.db.get(sql, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  /**
   * Create new transaction
   */
  async create(transactionData) {
    return new Promise((resolve, reject) => {
      const {
        user_id,
        tx_type,
        amount_cents,
        credits,
        currency,
        provider,
        provider_tx_id,
      } = transactionData;

      const sql = `
        INSERT INTO transactions (user_id, tx_type, amount_cents, credits, currency, provider, provider_tx_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      this.db.run(
        sql,
        [
          user_id,
          tx_type,
          amount_cents || 0,
          credits || 0,
          currency || 'USD',
          provider,
          provider_tx_id,
        ],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  /**
   * Get user credit balance from transactions
   */
  async getUserCreditBalance(userId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT COALESCE(SUM(credits), 0) as balance
        FROM transactions
        WHERE user_id = ?
      `;
      this.db.get(sql, [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row.balance);
      });
    });
  }

  /**
   * Get transaction statistics
   */
  async getStats() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT
          COUNT(*) as total_transactions,
          SUM(CASE WHEN tx_type = 'purchase_credits' THEN amount_cents ELSE 0 END) / 100.0 as total_revenue,
          SUM(CASE WHEN tx_type = 'reward_spend' THEN credits ELSE 0 END) as total_credits_spent,
          SUM(CASE WHEN credits > 0 THEN credits ELSE 0 END) as total_credits_issued,
          COUNT(DISTINCT user_id) as active_users
        FROM transactions
      `;
      this.db.get(sql, [], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  /**
   * Get transactions by date range
   */
  async getByDateRange(startDate, endDate) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT t.*, u.name as user_name, u.email as user_email
        FROM transactions t
        JOIN users u ON t.user_id = u.id
        WHERE t.created_at BETWEEN ? AND ?
        ORDER BY t.created_at DESC
      `;
      this.db.all(sql, [startDate, endDate], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  /**
   * Get credit transaction summary for user
   */
  async getUserCreditSummary(userId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT
          COUNT(*) as total_transactions,
          SUM(CASE WHEN credits > 0 THEN credits ELSE 0 END) as credits_received,
          SUM(CASE WHEN credits < 0 THEN ABS(credits) ELSE 0 END) as credits_spent,
          MAX(created_at) as last_transaction
        FROM transactions
        WHERE user_id = ?
      `;
      this.db.get(sql, [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
}

module.exports = TransactionRepository;
