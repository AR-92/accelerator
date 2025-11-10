/**
 * User management service handling user CRUD operations and admin functions
 */
class UserManagementService {
  constructor(userRepository, adminActivityRepository) {
    this.userRepository = userRepository;
    this.adminActivityRepository = adminActivityRepository;
  }

  /**
   * Log admin action for audit purposes
   * @param {Object} action - Action details
   */
  async logAdminAction(action) {
    try {
      await this.adminActivityRepository.create(action);
    } catch (error) {
      console.error('Error logging admin action:', error);
      // Don't throw - logging failure shouldn't break the main operation
    }
  }

  /**
   * Get users with pagination and filtering for admin
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Users data with pagination
   */
  async getUsers(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = (page - 1) * limit;

      const [users, totalCount] = await Promise.all([
        this.userRepository.findAll({
          limit,
          offset,
          role: options.role,
          search: options.search,
          sortBy: options.sortBy,
          sortOrder: options.sortOrder,
        }),
        this.userRepository.countFiltered({
          role: options.role,
          search: options.search,
        }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        users: users.map((user) => ({
          id: user.id,
          rowid: user.rowid,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: `${user.firstName} ${user.lastName}`,
          role: user.role,
          credits: user.credits,
          status: user.status,
          banned: user.banned,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })),
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: totalPages,
        },
      };
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<Object>} Created user data
   */
  async createUser(userData, adminInfo) {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(
        userData.email
      );
      if (existingUser) {
        const ValidationError = require('../../utils/errors/ValidationError');
        throw new ValidationError('User creation failed', [
          'Email already registered',
        ]);
      }

      const user = new (require('../../models/User'))(userData);
      await user.setPassword(userData.password);
      user.validate();

      const userId = await this.userRepository.create(user);

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo.id,
        adminEmail: adminInfo.email,
        action: 'CREATE_USER',
        targetType: 'user',
        targetId: userId,
        details: { email: user.email, role: user.role },
        ip: adminInfo.ip,
      });

      // Fetch the created user
      const createdUser = await this.userRepository.findById(userId);

      return {
        id: createdUser.id,
        email: createdUser.email,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        role: createdUser.role,
        credits: createdUser.credits,
        status: createdUser.status,
        banned: createdUser.banned,
        createdAt: createdUser.createdAt,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Get user by ID for admin
   * @param {number} userId - User ID
   * @returns {Promise<Object>} User data
   */
  async getUserById(userId) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        const NotFoundError = require('../../utils/errors/NotFoundError');
        throw new NotFoundError('User not found');
      }

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        credits: user.credits,
        status: user.status,
        banned: user.banned,
        bannedReason: user.bannedReason,
        bannedAt: user.bannedAt,
        theme: user.theme,
        bio: user.bio,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  async getUserByRowid(rowid) {
    try {
      const user = await this.userRepository.findByRowid(rowid);
      if (!user) {
        const NotFoundError = require('../../utils/errors/NotFoundError');
        throw new NotFoundError('User not found');
      }

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        credits: user.credits,
        status: user.status,
        banned: user.banned,
        bannedReason: user.bannedReason,
        bannedAt: user.bannedAt,
        theme: user.theme,
        bio: user.bio,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('Error getting user by rowid:', error);
      throw error;
    }
  }

  /**
   * Update user credits
   * @param {number} userId - User ID
   * @param {number} credits - New credits amount
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<Object>} Updated user data
   */
  async updateUserCredits(userId, credits, adminInfo) {
    try {
      const user = await this.userRepository.updateCredits(userId, credits);
      if (!user) {
        const NotFoundError = require('../../utils/errors/NotFoundError');
        throw new NotFoundError('User not found');
      }

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo.id,
        adminEmail: adminInfo.email,
        action: 'UPDATE_USER_CREDITS',
        targetType: 'user',
        targetId: userId,
        details: { newCredits: credits },
        ip: adminInfo.ip,
      });

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        credits: user.credits,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('Error updating user credits:', error);
      throw error;
    }
  }

  /**
   * Update user role
   * @param {number} userId - User ID
   * @param {string} role - New role
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<Object>} Updated user data
   */
  async updateUserRole(userId, role, adminInfo) {
    try {
      const user = await this.userRepository.updateRole(userId, role);
      if (!user) {
        const NotFoundError = require('../../utils/errors/NotFoundError');
        throw new NotFoundError('User not found');
      }

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo.id,
        adminEmail: adminInfo.email,
        action: 'UPDATE_USER_ROLE',
        targetType: 'user',
        targetId: userId,
        details: { newRole: role },
        ip: adminInfo.ip,
      });

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        credits: user.credits,
        status: user.status,
        banned: user.banned,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  /**
   * Update user status
   * @param {number} userId - User ID
   * @param {string} status - New status
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<Object>} Updated user data
   */
  async updateUserStatus(userId, status, adminInfo) {
    try {
      const user = await this.userRepository.updateStatus(userId, status);
      if (!user) {
        const NotFoundError = require('../../utils/errors/NotFoundError');
        throw new NotFoundError('User not found');
      }

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo.id,
        adminEmail: adminInfo.email,
        action: 'UPDATE_USER_STATUS',
        targetType: 'user',
        targetId: userId,
        details: { newStatus: status },
        ip: adminInfo.ip,
      });

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        credits: user.credits,
        status: user.status,
        banned: user.banned,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  /**
   * Ban or unban user
   * @param {number} userId - User ID
   * @param {boolean} banned - Ban status
   * @param {string} reason - Ban reason
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<Object>} Updated user data
   */
  async updateUserBanned(userId, banned, reason, adminInfo) {
    try {
      const user = await this.userRepository.updateBanned(
        userId,
        banned,
        reason
      );
      if (!user) {
        const NotFoundError = require('../../utils/errors/NotFoundError');
        throw new NotFoundError('User not found');
      }

      // Prevent banning admin users
      if (banned && user.role === 'admin') {
        const ValidationError = require('../../utils/errors/ValidationError');
        throw new ValidationError('Cannot ban admin users');
      }

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo.id,
        adminEmail: adminInfo.email,
        action: banned ? 'BAN_USER' : 'UNBAN_USER',
        targetType: 'user',
        targetId: userId,
        details: { banned, reason },
        ip: adminInfo.ip,
      });

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        credits: user.credits,
        status: user.status,
        banned: user.banned,
        bannedReason: user.bannedReason,
        bannedAt: user.bannedAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('Error updating user banned status:', error);
      throw error;
    }
  }

  /**
   * Delete user
   * @param {number} userId - User ID
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<boolean>} Success status
   */
  async deleteUser(userId, adminInfo) {
    try {
      // Check if user exists first
      const user = await this.userRepository.findById(userId);
      if (!user) {
        const NotFoundError = require('../../utils/errors/NotFoundError');
        throw new NotFoundError('User not found');
      }

      // Prevent deleting admin users
      if (user.role === 'admin') {
        const ValidationError = require('../../utils/errors/ValidationError');
        throw new ValidationError('Cannot delete admin users');
      }

      const success = await this.userRepository.delete(userId);

      if (success) {
        // Log admin action
        this.logAdminAction({
          adminId: adminInfo.id,
          adminEmail: adminInfo.email,
          action: 'DELETE_USER',
          targetType: 'user',
          targetId: userId,
          details: { deletedUserEmail: user.email, deletedUserRole: user.role },
          ip: adminInfo.ip,
        });
      }

      return success;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  /**
   * Bulk update user credits
   * @param {Array} updates - Array of update objects {userId, credits}
   * @returns {Promise<Array>} Array of update results
   */
  async bulkUpdateCredits(updates) {
    try {
      const results = [];

      for (const update of updates) {
        try {
          const user = await this.userRepository.updateCredits(
            update.userId,
            update.credits
          );
          if (user) {
            results.push({
              userId: update.userId,
              success: true,
              credits: user.credits,
            });
          } else {
            results.push({
              userId: update.userId,
              success: false,
              error: 'User not found',
            });
          }
        } catch (error) {
          results.push({
            userId: update.userId,
            success: false,
            error: error.message,
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Error bulk updating credits:', error);
      throw error;
    }
  }

  /**
   * Bulk update user roles
   * @param {Array} userIds - Array of user IDs
   * @param {string} role - New role for all users
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<Array>} Array of update results
   */
  async bulkUpdateRoles(userIds, role, adminInfo) {
    try {
      const results = [];

      for (const userId of userIds) {
        try {
          const user = await this.userRepository.updateRole(userId, role);
          if (user) {
            // Log admin action
            this.logAdminAction({
              adminId: adminInfo.id,
              adminEmail: adminInfo.email,
              action: 'BULK_UPDATE_USER_ROLE',
              targetType: 'user',
              targetId: userId,
              details: { newRole: role },
              ip: adminInfo.ip,
            });

            results.push({
              userId,
              success: true,
              role: user.role,
            });
          } else {
            results.push({
              userId,
              success: false,
              error: 'User not found',
            });
          }
        } catch (error) {
          results.push({
            userId,
            success: false,
            error: error.message,
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Error bulk updating roles:', error);
      throw error;
    }
  }

  /**
   * Reset user password (admin function)
   * @param {number} userId - User ID
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<Object>} Reset result with new password
   */
  async resetUserPassword(userId, adminInfo) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        const NotFoundError = require('../../utils/errors/NotFoundError');
        throw new NotFoundError('User not found');
      }

      // Generate a temporary password using crypto for better randomness
      const crypto = require('crypto');
      const tempPassword = crypto.randomBytes(16).toString('hex');
      await user.setPassword(tempPassword);
      const updated = await this.userRepository.updatePassword(
        userId,
        user.passwordHash
      );
      if (!updated) {
        throw new Error('Failed to update user password');
      }

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo.id,
        adminEmail: adminInfo.email,
        action: 'RESET_USER_PASSWORD',
        targetType: 'user',
        targetId: userId,
        details: { resetByAdmin: true },
        ip: adminInfo.ip,
      });

      return {
        userId,
        email: user.email,
        tempPassword,
        message:
          'Password has been reset. The new temporary password is shown below.',
      };
    } catch (error) {
      console.error('Error resetting user password:', error);
      throw error;
    }
  }
}

module.exports = UserManagementService;
