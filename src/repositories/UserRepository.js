const BaseRepository = require('./BaseRepository');
const User = require('../models/User');

/**
 * User repository for data access operations
 */
class UserRepository extends BaseRepository {
  constructor(db) {
    super(db, 'users');
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<User|null>}
   */
  async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const row = await this.queryOne(sql, [email]);
    return row ? new User(row) : null;
  }

  /**
   * Find user by ID with public fields only
   * @param {number} id - User ID
   * @returns {Promise<User|null>}
   */
  async findById(id) {
    const row = await super.findById(id);
    return row ? new User(row) : null;
  }

  /**
   * Create a new user
   * @param {Object|User} userData - User data or User instance
   * @returns {Promise<number>} Created user ID
   */
  async create(userData) {
    let user;
    if (userData instanceof User) {
      user = userData;
    } else {
      user = new User(userData);
      // If password is provided, hash it
      if (userData.password) {
        await user.setPassword(userData.password);
      }
    }
    user.validate();

    const data = {
      email: user.email,
      password_hash: user.passwordHash,
      first_name: user.firstName,
      last_name: user.lastName,
      role: user.role,
      theme: user.theme,
      bio: user.bio,
      credits: user.credits,
    };

    return await super.create(data);
  }

  /**
   * Update user information
   * @param {number} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<boolean>}
   */
  async update(id, userData) {
    const user = new User(userData);
    user.validate();

    const data = {};
    if (user.firstName !== undefined) data.first_name = user.firstName;
    if (user.lastName !== undefined) data.last_name = user.lastName;
    if (user.role !== undefined) data.role = user.role;
    if (user.theme !== undefined) data.theme = user.theme;
    if (user.bio !== undefined) data.bio = user.bio;
    data.updated_at = new Date().toISOString();

    return await super.update(id, data);
  }

  /**
   * Update user password
   * @param {number} id - User ID
   * @param {string} passwordHash - New password hash
   * @returns {Promise<boolean>}
   */
  async updatePassword(id, passwordHash) {
    const data = {
      password_hash: passwordHash,
      updated_at: new Date().toISOString(),
    };

    return await super.update(id, data);
  }

  /**
   * Find users by role
   * @param {string} role - User role
   * @returns {Promise<User[]>}
   */
  async findByRole(role) {
    const sql = 'SELECT * FROM users WHERE role = ? ORDER BY created_at DESC';
    const rows = await this.query(sql, [role]);
    return rows.map((row) => new User(row));
  }

  /**
   * Search users by name or email
   * @param {string} query - Search query
   * @returns {Promise<User[]>}
   */
  async search(query) {
    const searchTerm = `%${query}%`;
    const sql = `
      SELECT * FROM users
      WHERE email LIKE ? OR first_name LIKE ? OR last_name LIKE ?
      ORDER BY first_name, last_name
    `;
    const rows = await this.query(sql, [searchTerm, searchTerm, searchTerm]);
    return rows.map((row) => new User(row));
  }

  /**
   * Count users by role
   * @returns {Promise<Object>} Role counts
   */
  async countByRole() {
    const sql = 'SELECT role, COUNT(*) as count FROM users GROUP BY role';
    const rows = await this.query(sql);
    const result = {};
    rows.forEach((row) => {
      result[row.role] = row.count;
    });
    return result;
  }

  /**
   * Find recent users (last N days)
   * @param {number} days - Number of days
   * @returns {Promise<User[]>}
   */
  async findRecent(days = 7) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    const sql =
      'SELECT * FROM users WHERE created_at >= ? ORDER BY created_at DESC';
    const rows = await this.query(sql, [date.toISOString()]);
    return rows.map((row) => new User(row));
  }

  /**
   * Update user credits
   * @param {number} id - User ID
   * @param {number} credits - New credits amount
   * @returns {Promise<User>}
   */
  async updateCredits(id, credits) {
    const data = {
      credits: credits,
      updated_at: new Date().toISOString(),
    };
    const success = await super.update(id, data);
    if (success) {
      return await this.findById(id);
    }
    return null;
  }

  /**
   * Update user role
   * @param {number} id - User ID
   * @param {string} role - New role
   * @returns {Promise<User>}
   */
  async updateRole(id, role) {
    const data = {
      role: role,
      updated_at: new Date().toISOString(),
    };
    const success = await super.update(id, data);
    if (success) {
      return await this.findById(id);
    }
    return null;
  }

  /**
   * Update user status
   * @param {number} id - User ID
   * @param {string} status - New status
   * @returns {Promise<User>}
   */
  async updateStatus(id, status) {
    const data = {
      status: status,
      updated_at: new Date().toISOString(),
    };
    const success = await super.update(id, data);
    if (success) {
      return await this.findById(id);
    }
    return null;
  }

  /**
   * Ban or unban user
   * @param {number} id - User ID
   * @param {boolean} banned - Ban status
   * @param {string} reason - Ban reason (optional)
   * @returns {Promise<User>}
   */
  async updateBanned(id, banned, reason = '') {
    const data = {
      banned: banned,
      banned_reason: reason,
      banned_at: banned ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };
    const success = await super.update(id, data);
    if (success) {
      return await this.findById(id);
    }
    return null;
  }

  /**
   * Get total credits across all users
   * @returns {Promise<number>}
   */
  async getTotalCredits() {
    const sql = 'SELECT SUM(credits) as total FROM users';
    const row = await this.queryOne(sql);
    return row.total || 0;
  }

  /**
   * Get users with pagination and filtering
   * @param {Object} options - Query options
   * @returns {Promise<User[]>}
   */
  async findAll(options = {}) {
    const {
      limit = 20,
      offset = 0,
      role,
      search,
      sortBy = 'created_at',
      sortOrder = 'desc',
    } = options;

    // Validate sortBy to prevent SQL injection
    const allowedSortFields = [
      'id',
      'email',
      'first_name',
      'last_name',
      'role',
      'credits',
      'created_at',
      'updated_at',
    ];
    const validSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'created_at';
    const validSortOrder = ['asc', 'desc'].includes(sortOrder.toLowerCase())
      ? sortOrder.toUpperCase()
      : 'DESC';

    let sql = 'SELECT * FROM users WHERE 1=1';
    const params = [];

    if (role) {
      sql += ' AND role = ?';
      params.push(role);
    }

    if (search && search.trim()) {
      sql += ' AND (email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)';
      const searchTerm = `%${search.trim()}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ` ORDER BY ${validSortBy} ${validSortOrder} LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const rows = await this.query(sql, params);
    return rows.map((row) => new User(row));
  }

  /**
   * Count users with filtering
   * @param {Object} options - Filter options
   * @returns {Promise<number>}
   */
  async countFiltered(options = {}) {
    const { role, search } = options;

    let sql = 'SELECT COUNT(*) as count FROM users WHERE 1=1';
    const params = [];

    if (role) {
      sql += ' AND role = ?';
      params.push(role);
    }

    if (search && search.trim()) {
      sql += ' AND (email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)';
      const searchTerm = `%${search.trim()}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const result = await this.queryOne(sql, params);
    return result.count;
  }
}

module.exports = UserRepository;
