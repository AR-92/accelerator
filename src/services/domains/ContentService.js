import logger from '../../utils/logger.js';

class ContentService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  // Content CRUD operations
  async createContent(contentData) {
    try {
      logger.debug('Creating content:', contentData.title);
      const result = await this.db.create('content', {
        ...contentData,
        status: contentData.status || 'draft',
        created_at: new Date().toISOString()
      });
      logger.info(`✅ Created content with ID: ${result.id}`);
      return result;
    } catch (error) {
      logger.error('Error creating content:', error);
      throw error;
    }
  }

  async getContentById(id) {
    try {
      const content = await this.db.read('content', id);
      return content[0] || null;
    } catch (error) {
      logger.error(`Error fetching content ${id}:`, error);
      throw error;
    }
  }

  async getAllContent(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      let query = this.db.supabase
        .from('content')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.content_type) query = query.eq('content_type', filters.content_type);
      if (filters.author_id) query = query.eq('author_id', filters.author_id);
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, count, page, limit };
    } catch (error) {
      logger.error('Error fetching content:', error);
      throw error;
    }
  }

  async updateContent(id, updates) {
    try {
      logger.debug(`Updating content ${id}:`, updates);
      const result = await this.db.update('content', id, updates);
      logger.info(`✅ Updated content ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error updating content ${id}:`, error);
      throw error;
    }
  }

  async deleteContent(id) {
    try {
      logger.debug(`Deleting content ${id}`);
      await this.db.delete('content', id);
      logger.info(`✅ Deleted content ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting content ${id}:`, error);
      throw error;
    }
  }

  // Content publishing workflow
  async publishContent(id) {
    try {
      logger.debug(`Publishing content ${id}`);
      const result = await this.updateContent(id, {
        status: 'published',
        published_at: new Date().toISOString()
      });
      logger.info(`✅ Published content ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error publishing content ${id}:`, error);
      throw error;
    }
  }

  async archiveContent(id) {
    try {
      logger.debug(`Archiving content ${id}`);
      const result = await this.updateContent(id, {
        status: 'archived',
        archived_at: new Date().toISOString()
      });
      logger.info(`✅ Archived content ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error archiving content ${id}:`, error);
      throw error;
    }
  }

  // Content search and filtering
  async searchContent(searchTerm, filters = {}) {
    try {
      let query = this.db.supabase
        .from('content')
        .select('*')
        .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);

      // Apply additional filters
      if (filters.content_type) query = query.eq('content_type', filters.content_type);
      if (filters.status) query = query.eq('status', filters.status);

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error searching content:', error);
      throw error;
    }
  }

  async getContentByCategory(category, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      const { data, error, count } = await this.db.supabase
        .from('content')
        .select('*', { count: 'exact' })
        .eq('content_type', category)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, count, page, limit };
    } catch (error) {
      logger.error(`Error fetching content by category ${category}:`, error);
      throw error;
    }
  }

  async getContentByAuthor(authorId, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      const { data, error, count } = await this.db.supabase
        .from('content')
        .select('*', { count: 'exact' })
        .eq('author_id', authorId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, count, page, limit };
    } catch (error) {
      logger.error(`Error fetching content by author ${authorId}:`, error);
      throw error;
    }
  }

  // Content statistics
  async getContentStats() {
    try {
      const { data, error } = await this.db.supabase
        .from('content')
        .select('status, content_type');

      if (error) throw error;

      const stats = {
        total: data.length,
        published: data.filter(item => item.status === 'published').length,
        draft: data.filter(item => item.status === 'draft').length,
        archived: data.filter(item => item.status === 'archived').length,
        byType: {}
      };

      // Count by content type
      data.forEach(item => {
        stats.byType[item.content_type] = (stats.byType[item.content_type] || 0) + 1;
      });

      return stats;
    } catch (error) {
      logger.error('Error fetching content stats:', error);
      throw error;
    }
  }
}

export { ContentService };
export default ContentService;