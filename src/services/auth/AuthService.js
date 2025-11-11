const bcrypt = require('bcrypt');
const { Logger } = require('../../utils/logger');

/**
 * Authentication service handling user authentication logic
 */
class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
    this.logger = new Logger('AuthService');
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Created user data (without password)
   */
  async register(userData) {
    const { email, firstName, lastName, role = 'startup' } = userData;
    this.logger.info('User registration attempt', { email, firstName, lastName, role });

    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        this.logger.warn('Registration failed - email already exists', { email });
        const ValidationError = require('../../utils/errors/ValidationError');
        throw new ValidationError('Registration failed', [
          'Email already registered',
        ]);
      }

      // Validate password strength
      if (!userData.password || userData.password.length < 6) {
        this.logger.warn('Registration failed - weak password', { email });
        const ValidationError = require('../../utils/errors/ValidationError');
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
      await newUser.setPassword(userData.password);

      const userId = await this.userRepository.create({
        email: newUser.email,
        password_hash: newUser.passwordHash,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
      });

      this.logger.info('User registered successfully', { userId, email });

      // Return user data without password
      const user = await this.userRepository.findById(userId);
      return user.toPublicJSON();
    } catch (error) {
      this.logger.error(error, { email, firstName, lastName, role });
      throw error;
    }
  }

  /**
   * Authenticate a user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data if authentication successful
   */
  async login(email, password) {
    this.logger.info('Login attempt', { email });

    try {
      // Find user by email
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        this.logger.warn('Login failed - user not found', { email });
        const ValidationError = require('../../utils/errors/ValidationError');
        throw new ValidationError('Authentication failed', [
          'Invalid email or password',
        ]);
      }

      // Verify password
      const isValidPassword = await user.verifyPassword(password);
      if (!isValidPassword) {
        this.logger.warn('Login failed - invalid password', { email, userId: user.id });
        const ValidationError = require('../../utils/errors/ValidationError');
        throw new ValidationError('Authentication failed', [
          'Invalid email or password',
        ]);
      }

      this.logger.info('Login successful', { email, userId: user.id });
      return user.toPublicJSON();
    } catch (error) {
      this.logger.error(error, { email });
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object>} User data
   */
  async getUserById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      const NotFoundError = require('../../utils/errors/NotFoundError');
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
      const NotFoundError = require('../../utils/errors/NotFoundError');
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
    this.logger.info('Password change attempt', { userId: id });

    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        this.logger.warn('Password change failed - user not found', { userId: id });
        const NotFoundError = require('../../utils/errors/NotFoundError');
        throw new NotFoundError('User not found');
      }

      // Verify current password
      const isValidPassword = await user.verifyPassword(currentPassword);
      if (!isValidPassword) {
        this.logger.warn('Password change failed - current password invalid', { userId: id });
        const ValidationError = require('../../utils/errors/ValidationError');
        throw new ValidationError('Password change failed', [
          'Current password is incorrect',
        ]);
      }

      // Validate new password
      if (!newPassword || newPassword.length < 6) {
        this.logger.warn('Password change failed - new password too short', { userId: id });
        const ValidationError = require('../../utils/errors/ValidationError');
        throw new ValidationError('Password change failed', [
          'New password must be at least 6 characters long',
        ]);
      }

      // Hash new password and update
      await user.setPassword(newPassword);
      const updated = await this.userRepository.updatePassword(id, user.passwordHash);
      
      if (updated) {
        this.logger.info('Password changed successfully', { userId: id });
      }

      return updated;
    } catch (error) {
      this.logger.error(error, { userId: id });
      throw error;
    }
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
