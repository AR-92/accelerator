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
   * @param {Object} userData - User data
   * @returns {Promise<number>} Created user ID
   */
  async create(userData) {
    const user = new User(userData);
    user.validate();

    const data = {
      email: user.email,
      password_hash: user.passwordHash,
      first_name: user.firstName,
      last_name: user.lastName,
      role: user.role,
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
    if (user.firstName) data.first_name = user.firstName;
    if (user.lastName) data.last_name = user.lastName;
    if (user.role) data.role = user.role;
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
}

module.exports = UserRepository;
