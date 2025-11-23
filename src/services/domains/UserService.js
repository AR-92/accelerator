import logger from '../../utils/logger.js';

class UserService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  // User CRUD operations
  async createUser(userData) {
    try {
      logger.debug('Creating user:', userData.email);
      const result = await this.db.create('users', {
        ...userData,
        status: userData.status || 'active',
        role: userData.role || 'user',
        created_at: new Date().toISOString()
      });
      logger.info(`✅ Created user with ID: ${result.id}`);
      return result;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const users = await this.db.read('users', id);
      return users[0] || null;
    } catch (error) {
      logger.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      const users = await this.db.read('users', null, { email });
      return users[0] || null;
    } catch (error) {
      logger.error(`Error fetching user by email ${email}:`, error);
      throw error;
    }
  }

  async getAllUsers(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      let query = this.db.supabase
        .from('users')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.role) query = query.eq('role', filters.role);
      if (filters.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, count, page, limit };
    } catch (error) {
      logger.error('Error fetching users:', error);
      throw error;
    }
  }

  async updateUser(id, updates) {
    try {
      logger.debug(`Updating user ${id}:`, updates);
      const result = await this.db.update('users', id, updates);
      logger.info(`✅ Updated user ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      logger.debug(`Deleting user ${id}`);
      await this.db.delete('users', id);
      logger.info(`✅ Deleted user ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }

  // Authentication methods
  async authenticateUser(email, password) {
    try {
      // Note: In production, use proper password hashing/verification
      // This is a simplified example
      const user = await this.getUserByEmail(email);
      if (!user || user.password !== password) {
        return null;
      }
      return user;
    } catch (error) {
      logger.error('Error authenticating user:', error);
      throw error;
    }
  }

  async changePassword(id, newPassword) {
    try {
      logger.debug(`Changing password for user ${id}`);
      const result = await this.db.update('users', id, {
        password: newPassword,
        password_changed_at: new Date().toISOString()
      });
      logger.info(`✅ Changed password for user ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error changing password for user ${id}:`, error);
      throw error;
    }
  }

  // Profile management
  async getUserProfile(id) {
    try {
      const user = await this.getUserById(id);
      if (!user) return null;

      // Get associated accounts
      const accounts = await this.db.read('accounts', null, { user_id: id });

      return {
        ...user,
        accounts
      };
    } catch (error) {
      logger.error(`Error fetching profile for user ${id}:`, error);
      throw error;
    }
  }

  async updateUserProfile(id, profileData) {
    try {
      logger.debug(`Updating profile for user ${id}:`, profileData);
      const result = await this.updateUser(id, profileData);
      logger.info(`✅ Updated profile for user ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error updating profile for user ${id}:`, error);
      throw error;
    }
  }

  // Account management
  async createUserAccount(userId, accountData) {
    try {
      logger.debug(`Creating account for user ${userId}:`, accountData);
      const result = await this.db.create('accounts', {
        ...accountData,
        user_id: userId,
        created_at: new Date().toISOString()
      });
      logger.info(`✅ Created account for user ${userId}`);
      return result;
    } catch (error) {
      logger.error(`Error creating account for user ${userId}:`, error);
      throw error;
    }
  }

  async getUserAccounts(userId) {
    try {
      return await this.db.read('accounts', null, { user_id: userId });
    } catch (error) {
      logger.error(`Error fetching accounts for user ${userId}:`, error);
      throw error;
    }
  }
}

class AccountService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  async createAccount(accountData) {
    try {
      logger.debug('Creating account:', accountData.username);
      const result = await this.db.create('Accounts', {
        ...accountData,
        is_verified: accountData.is_verified || false,
        created_at: new Date().toISOString()
      });
      logger.info(`✅ Created account with ID: ${result.id}`);
      return result;
    } catch (error) {
      logger.error('Error creating account:', error);
      throw error;
    }
  }

  async getAccountById(id) {
    try {
      const accounts = await this.db.read('Accounts', id);
      return accounts[0] || null;
    } catch (error) {
      logger.error(`Error fetching account ${id}:`, error);
      throw error;
    }
  }

  async getAllAccounts(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      let query = this.db.supabase
        .from('Accounts')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.account_type) query = query.eq('account_type', filters.account_type);
      if (filters.is_verified !== undefined) query = query.eq('is_verified', filters.is_verified);
      if (filters.search) {
        query = query.or(`display_name.ilike.%${filters.search}%,username.ilike.%${filters.search}%,bio.ilike.%${filters.search}%`);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, count, page, limit };
    } catch (error) {
      logger.error('Error fetching accounts:', error);
      throw error;
    }
  }

  async updateAccount(id, updates) {
    try {
      logger.debug(`Updating account ${id}:`, updates);
      const result = await this.db.update('Accounts', id, updates);
      logger.info(`✅ Updated account ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error updating account ${id}:`, error);
      throw error;
    }
  }

  async deleteAccount(id) {
    try {
      logger.debug(`Deleting account ${id}`);
      await this.db.delete('Accounts', id);
      logger.info(`✅ Deleted account ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting account ${id}:`, error);
      throw error;
    }
  }

  async toggleVerification(id, verified) {
    try {
      logger.debug(`Toggling verification for account ${id} to ${verified}`);
      const result = await this.updateAccount(id, { is_verified: verified });
      logger.info(`✅ Toggled verification for account ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error toggling verification for account ${id}:`, error);
      throw error;
    }
  }
}

class IdeaService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  async createIdea(ideaData) {
    try {
      logger.debug('Creating idea:', ideaData.title);
      const result = await this.db.create('ideas', {
        ...ideaData,
        upvotes: ideaData.upvotes || 0,
        downvotes: ideaData.downvotes || 0,
        status: ideaData.status || 'pending',
        created_at: new Date().toISOString()
      });
      logger.info(`✅ Created idea with ID: ${result.id}`);
      return result;
    } catch (error) {
      logger.error('Error creating idea:', error);
      throw error;
    }
  }

  async getIdeaById(id) {
    try {
      const ideas = await this.db.read('ideas', id);
      return ideas[0] || null;
    } catch (error) {
      logger.error(`Error fetching idea ${id}:`, error);
      throw error;
    }
  }

  async getAllIdeas(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      let query = this.db.supabase
        .from('ideas')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.type) query = query.eq('type', filters.type);
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,author.ilike.%${filters.search}%`);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, count, page, limit };
    } catch (error) {
      logger.error('Error fetching ideas:', error);
      throw error;
    }
  }

  async updateIdea(id, updates) {
    try {
      logger.debug(`Updating idea ${id}:`, updates);
      const result = await this.db.update('ideas', id, updates);
      logger.info(`✅ Updated idea ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error updating idea ${id}:`, error);
      throw error;
    }
  }

  async deleteIdea(id) {
    try {
      logger.debug(`Deleting idea ${id}`);
      await this.db.delete('ideas', id);
      logger.info(`✅ Deleted idea ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting idea ${id}:`, error);
      throw error;
    }
  }

  async voteIdea(id, voteType) {
    try {
      logger.debug(`Voting on idea ${id} with type: ${voteType}`);

      // Get current idea
      const idea = await this.getIdeaById(id);
      if (!idea) {
        throw new Error('Idea not found');
      }

      // Update vote count
      const updates = {};
      if (voteType === 'up') {
        updates.upvotes = (idea.upvotes || 0) + 1;
      } else if (voteType === 'down') {
        updates.downvotes = (idea.downvotes || 0) + 1;
      } else {
        throw new Error('Invalid vote type. Must be "up" or "down"');
      }

      const result = await this.updateIdea(id, updates);
      logger.info(`✅ Recorded ${voteType}vote for idea ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error voting on idea ${id}:`, error);
      throw error;
    }
  }

  async approveIdea(id) {
    try {
      logger.debug(`Approving idea ${id}`);
      const result = await this.updateIdea(id, { status: 'active' });
      logger.info(`✅ Approved idea ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error approving idea ${id}:`, error);
      throw error;
    }
  }

  async rejectIdea(id) {
    try {
      logger.debug(`Rejecting idea ${id}`);
      const result = await this.updateIdea(id, { status: 'rejected' });
      logger.info(`✅ Rejected idea ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error rejecting idea ${id}:`, error);
      throw error;
    }
  }
}

class MessageService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  async createMessage(messageData) {
    try {
      logger.debug('Creating message:', messageData.body?.substring(0, 50));
      const result = await this.db.create('messages', {
        ...messageData,
        created_at: new Date().toISOString()
      });
      logger.info(`✅ Created message with ID: ${result.id}`);
      return result;
    } catch (error) {
      logger.error('Error creating message:', error);
      throw error;
    }
  }

  async getMessageById(id) {
    try {
      const messages = await this.db.read('messages', id);
      return messages[0] || null;
    } catch (error) {
      logger.error(`Error fetching message ${id}:`, error);
      throw error;
    }
  }

  async getAllMessages(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      let query = this.db.supabase
        .from('messages')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.search) query = query.ilike('body', `%${filters.search}%`);
      if (filters.project_id) query = query.eq('project_id', filters.project_id);
      if (filters.user_id) query = query.eq('user_id', filters.user_id);

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, count, page, limit };
    } catch (error) {
      logger.error('Error fetching messages:', error);
      throw error;
    }
  }

  async updateMessage(id, updates) {
    try {
      logger.debug(`Updating message ${id}:`, updates);
      const result = await this.db.update('messages', id, updates);
      logger.info(`✅ Updated message ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error updating message ${id}:`, error);
      throw error;
    }
  }

  async deleteMessage(id) {
    try {
      logger.debug(`Deleting message ${id}`);
      await this.db.delete('messages', id);
      logger.info(`✅ Deleted message ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting message ${id}:`, error);
      throw error;
    }
  }
}

class HelpCenterService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  async createHelpCenterArticle(articleData) {
    try {
      logger.debug('Creating help center article:', articleData.title);
      const result = await this.db.create('Help Center', {
        ...articleData,
        view_count: articleData.view_count || 0,
        is_published: articleData.is_published || false,
        created_at: new Date().toISOString()
      });
      logger.info(`✅ Created help center article with ID: ${result.id}`);
      return result;
    } catch (error) {
      logger.error('Error creating help center article:', error);
      throw error;
    }
  }

  async getHelpCenterArticleById(id) {
    try {
      const articles = await this.db.read('Help Center', id);
      return articles[0] || null;
    } catch (error) {
      logger.error(`Error fetching help center article ${id}:`, error);
      throw error;
    }
  }

  async getAllHelpCenterArticles(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      let query = this.db.supabase
        .from('Help Center')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
      }
      if (filters.content_type) query = query.eq('content_type', filters.content_type);
      if (filters.category_name) query = query.eq('category_name', filters.category_name);
      if (filters.is_published !== undefined) query = query.eq('is_published', filters.is_published);

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, count, page, limit };
    } catch (error) {
      logger.error('Error fetching help center articles:', error);
      throw error;
    }
  }

  async updateHelpCenterArticle(id, updates) {
    try {
      logger.debug(`Updating help center article ${id}:`, updates);
      const result = await this.db.update('Help Center', id, updates);
      logger.info(`✅ Updated help center article ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error updating help center article ${id}:`, error);
      throw error;
    }
  }

  async deleteHelpCenterArticle(id) {
    try {
      logger.debug(`Deleting help center article ${id}`);
      await this.db.delete('Help Center', id);
      logger.info(`✅ Deleted help center article ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting help center article ${id}:`, error);
      throw error;
    }
  }
}

export { UserService, AccountService, IdeaService, MessageService, HelpCenterService };
export default UserService;