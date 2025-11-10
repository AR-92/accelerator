const bcrypt = require('bcrypt');

/**
 * Authentication service handling user authentication logic
 */
class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Created user data (without password)
   */
  async register(userData) {
    const { email, password, firstName, lastName, role = 'startup' } = userData;

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      const ValidationError = require('../utils/errors/ValidationError');
      throw new ValidationError('Registration failed', [
        'Email already registered',
      ]);
    }

    // Validate password strength
    if (!password || password.length < 6) {
      const ValidationError = require('../utils/errors/ValidationError');
      throw new ValidationError('Registration failed', [
        'Password must be at least 6 characters long',
      ]);
    }

    // Create user
    const newUser = new (require('../models/user/User'))({
      email,
      firstName,
      lastName,
      role,
    });
    await newUser.setPassword(password);

    const userId = await this.userRepository.create({
      email: newUser.email,
      password_hash: newUser.passwordHash,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
    });

    // Return user data without password
    const user = await this.userRepository.findById(userId);
    return user.toPublicJSON();
  }

  /**
   * Authenticate a user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data if authentication successful
   */
  async login(email, password) {
    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      const ValidationError = require('../utils/errors/ValidationError');
      throw new ValidationError('Authentication failed', [
        'Invalid email or password',
      ]);
    }

    // Verify password
    const isValidPassword = await user.verifyPassword(password);
    if (!isValidPassword) {
      const ValidationError = require('../utils/errors/ValidationError');
      throw new ValidationError('Authentication failed', [
        'Invalid email or password',
      ]);
    }

    return user.toPublicJSON();
  }

  /**
   * Get user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object>} User data
   */
  async getUserById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      const NotFoundError = require('../utils/errors/NotFoundError');
      throw new NotFoundError('User not found');
    }
    return user.toPublicJSON();
  }

  /**
   * Update user profile
   * @param {number} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Updated user data
   */
  async updateProfile(id, userData) {
    const updated = await this.userRepository.update(id, userData);
    if (!updated) {
      const NotFoundError = require('../utils/errors/NotFoundError');
      throw new NotFoundError('User not found');
    }

    return await this.getUserById(id);
  }

  /**
   * Change user password
   * @param {number} id - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} Success status
   */
  async changePassword(id, currentPassword, newPassword) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      const NotFoundError = require('../utils/errors/NotFoundError');
      throw new NotFoundError('User not found');
    }

    // Verify current password
    const isValidPassword = await user.verifyPassword(currentPassword);
    if (!isValidPassword) {
      const ValidationError = require('../utils/errors/ValidationError');
      throw new ValidationError('Password change failed', [
        'Current password is incorrect',
      ]);
    }

    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      const ValidationError = require('../utils/errors/ValidationError');
      throw new ValidationError('Password change failed', [
        'New password must be at least 6 characters long',
      ]);
    }

    // Hash new password and update
    await user.setPassword(newPassword);
    return await this.userRepository.updatePassword(id, user.passwordHash);
  }

  /**
   * Get users by role
   * @param {string} role - User role
   * @returns {Promise<Object[]>} Array of user data
   */
  async getUsersByRole(role) {
    const users = await this.userRepository.findByRole(role);
    return users.map((user) => user.toPublicJSON());
  }

  /**
   * Search users
   * @param {string} query - Search query
   * @returns {Promise<Object[]>} Array of user data
   */
  async searchUsers(query) {
    const users = await this.userRepository.search(query);
    return users.map((user) => user.toPublicJSON());
  }
}

module.exports = AuthService;
