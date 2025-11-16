/**
 * Payment Method Repository
 * Handles database operations for user payment methods
 */

class PaymentMethodRepository {
  constructor(db) {
    this.db = db;
  }

  /**
   * Get all payment methods with user information
   */
  async getAll() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT pm.*, u.name as user_name, u.email as user_email
        FROM payment_methods pm
        JOIN users u ON pm.user_id = u.id
        ORDER BY pm.is_default DESC, pm.created_at DESC
      `;
      this.db.all(sql, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  /**
   * Get payment methods by user ID
   */
  async getByUserId(userId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM payment_methods
        WHERE user_id = ?
        ORDER BY is_default DESC, created_at DESC
      `;
      this.db.all(sql, [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  /**
   * Get default payment method for user
   */
  async getDefaultByUserId(userId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM payment_methods
        WHERE user_id = ? AND is_default = 1
        LIMIT 1
      `;
      this.db.get(sql, [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  /**
   * Get payment method by ID
   */
  async getById(id) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT pm.*, u.name as user_name, u.email as user_email
        FROM payment_methods pm
        JOIN users u ON pm.user_id = u.id
        WHERE pm.id = ?
      `;
      this.db.get(sql, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  /**
   * Create new payment method
   */
  async create(paymentMethodData) {
    return new Promise((resolve, reject) => {
      const {
        user_id,
        provider,
        provider_method_id,
        last4,
        brand,
        exp_month,
        exp_year,
        is_default,
      } = paymentMethodData;

      const sql = `
        INSERT INTO payment_methods (user_id, provider, provider_method_id, last4, brand, exp_month, exp_year, is_default)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      this.db.run(
        sql,
        [
          user_id,
          provider,
          provider_method_id,
          last4,
          brand,
          exp_month,
          exp_year,
          is_default || 0,
        ],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  /**
   * Update payment method
   */
  async update(id, paymentMethodData) {
    return new Promise((resolve, reject) => {
      const { last4, brand, exp_month, exp_year, is_default } =
        paymentMethodData;
      const sql = `
        UPDATE payment_methods
        SET last4 = ?, brand = ?, exp_month = ?, exp_year = ?, is_default = ?
        WHERE id = ?
      `;
      this.db.run(
        sql,
        [last4, brand, exp_month, exp_year, is_default, id],
        function (err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  }

  /**
   * Set default payment method for user
   */
  async setDefault(userId, paymentMethodId) {
    return new Promise((resolve, reject) => {
      // First, unset all default flags for this user
      const unsetSql =
        'UPDATE payment_methods SET is_default = 0 WHERE user_id = ?';
      // Then set the new default
      const setSql =
        'UPDATE payment_methods SET is_default = 1 WHERE id = ? AND user_id = ?';

      this.db.serialize(() => {
        this.db.run(unsetSql, [userId], (err) => {
          if (err) {
            reject(err);
            return;
          }

          this.db.run(setSql, [paymentMethodId, userId], function (err) {
            if (err) reject(err);
            else resolve(this.changes);
          });
        });
      });
    });
  }

  /**
   * Delete payment method
   */
  async delete(id) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM payment_methods WHERE id = ?';
      this.db.run(sql, [id], function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }

  /**
   * Get payment method statistics
   */
  async getStats() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT
          COUNT(*) as total_payment_methods,
          COUNT(DISTINCT user_id) as users_with_payment_methods,
          SUM(CASE WHEN provider = 'stripe' THEN 1 ELSE 0 END) as stripe_methods,
          SUM(CASE WHEN provider = 'paypal' THEN 1 ELSE 0 END) as paypal_methods,
          SUM(CASE WHEN is_default = 1 THEN 1 ELSE 0 END) as default_methods
        FROM payment_methods
      `;
      this.db.get(sql, [], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
}

module.exports = PaymentMethodRepository;
