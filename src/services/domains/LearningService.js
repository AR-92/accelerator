import logger from '../../utils/logger.js';

class LearningContentService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  async createLearningContent(contentData) {
    try {
      logger.debug('Creating learning content:', contentData.title);
      const result = await this.db.create('learning_content', {
        ...contentData,
        status: contentData.status || 'draft',
        created_at: new Date().toISOString()
      });
      logger.info(`✅ Created learning content with ID: ${result.id}`);
      return result;
    } catch (error) {
      logger.error('Error creating learning content:', error);
      throw error;
    }
  }

  async getLearningContentById(id) {
    try {
      const content = await this.db.read('learning_content', id);
      return content[0] || null;
    } catch (error) {
      logger.error(`Error fetching learning content ${id}:`, error);
      throw error;
    }
  }

  async getAllLearningContent(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      let query = this.db.supabase
        .from('learning_content')
        .select('*', { count: 'exact' });

      if (filters.content_type) query = query.eq('content_type', filters.content_type);
      if (filters.difficulty_level) query = query.eq('difficulty_level', filters.difficulty_level);
      if (filters.category_id) query = query.eq('category_id', filters.category_id);
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, count, page, limit };
    } catch (error) {
      logger.error('Error fetching learning content:', error);
      throw error;
    }
  }

  async updateLearningContent(id, updates) {
    try {
      logger.debug(`Updating learning content ${id}:`, updates);
      const result = await this.db.update('learning_content', id, updates);
      logger.info(`✅ Updated learning content ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error updating learning content ${id}:`, error);
      throw error;
    }
  }

  async deleteLearningContent(id) {
    try {
      logger.debug(`Deleting learning content ${id}`);
      await this.db.delete('learning_content', id);
      logger.info(`✅ Deleted learning content ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting learning content ${id}:`, error);
      throw error;
    }
  }

  async publishLearningContent(id) {
    try {
      logger.debug(`Publishing learning content ${id}`);
      const result = await this.updateLearningContent(id, {
        status: 'published',
        published_at: new Date().toISOString()
      });
      logger.info(`✅ Published learning content ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error publishing learning content ${id}:`, error);
      throw error;
    }
  }
}

class LearningCategoryService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  async createLearningCategory(categoryData) {
    try {
      logger.debug('Creating learning category:', categoryData.name);
      const result = await this.db.create('learning_categories', {
        ...categoryData,
        is_active: categoryData.is_active !== undefined ? categoryData.is_active : true,
        created_at: new Date().toISOString()
      });
      logger.info(`✅ Created learning category with ID: ${result.id}`);
      return result;
    } catch (error) {
      logger.error('Error creating learning category:', error);
      throw error;
    }
  }

  async getLearningCategoryById(id) {
    try {
      const categories = await this.db.read('learning_categories', id);
      return categories[0] || null;
    } catch (error) {
      logger.error(`Error fetching learning category ${id}:`, error);
      throw error;
    }
  }

  async getAllLearningCategories(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      let query = this.db.supabase
        .from('learning_categories')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.is_active !== undefined) query = query.eq('is_active', filters.is_active);
      if (filters.is_featured !== undefined) query = query.eq('is_featured', filters.is_featured);
      if (filters.category_type) query = query.eq('category_type', filters.category_type);
      if (filters.parent_id !== undefined) {
        if (filters.parent_id === null) {
          query = query.is('parent_id', null);
        } else {
          query = query.eq('parent_id', filters.parent_id);
        }
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error, count } = await query
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, count, page, limit };
    } catch (error) {
      logger.error('Error fetching learning categories:', error);
      throw error;
    }
  }

  async updateLearningCategory(id, updates) {
    try {
      logger.debug(`Updating learning category ${id}:`, updates);
      const result = await this.db.update('learning_categories', id, updates);
      logger.info(`✅ Updated learning category ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error updating learning category ${id}:`, error);
      throw error;
    }
  }

  async deleteLearningCategory(id) {
    try {
      logger.debug(`Deleting learning category ${id}`);
      await this.db.delete('learning_categories', id);
      logger.info(`✅ Deleted learning category ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting learning category ${id}:`, error);
      throw error;
    }
  }

  async getCategoryHierarchy() {
    try {
      const categories = await this.getAllLearningCategories();

      // Build hierarchy
      const hierarchy = [];
      const categoryMap = new Map();

      // First pass: create category objects
      categories.forEach(cat => {
        categoryMap.set(cat.id, { ...cat, children: [] });
      });

      // Second pass: build hierarchy
      categories.forEach(cat => {
        if (cat.parent_id) {
          const parent = categoryMap.get(cat.parent_id);
          if (parent) {
            parent.children.push(categoryMap.get(cat.id));
          }
        } else {
          hierarchy.push(categoryMap.get(cat.id));
        }
      });

      return hierarchy;
    } catch (error) {
      logger.error('Error building category hierarchy:', error);
      throw error;
    }
  }
}

class LearningAssessmentService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  async createLearningAssessment(assessmentData) {
    try {
      logger.debug('Creating learning assessment for content:', assessmentData.content_id);
      const result = await this.db.create('learning_assessments', {
        ...assessmentData,
        passed: assessmentData.passed || false,
        created_at: new Date().toISOString()
      });
      logger.info(`✅ Created learning assessment with ID: ${result.id}`);
      return result;
    } catch (error) {
      logger.error('Error creating learning assessment:', error);
      throw error;
    }
  }

  async getLearningAssessmentById(id) {
    try {
      const assessments = await this.db.read('learning_assessments', id);
      return assessments[0] || null;
    } catch (error) {
      logger.error(`Error fetching learning assessment ${id}:`, error);
      throw error;
    }
  }

  async getAssessmentsByUser(userId, contentId = null) {
    try {
      const filters = { user_id: userId };
      if (contentId) filters.content_id = contentId;

      const assessments = await this.db.read('learning_assessments', null, filters);
      return assessments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } catch (error) {
      logger.error(`Error fetching assessments for user ${userId}:`, error);
      throw error;
    }
  }

  async getAllLearningAssessments(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      let query = this.db.supabase
        .from('learning_assessments')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.is_active !== undefined) query = query.eq('is_active', filters.is_active);
      if (filters.assessment_type) query = query.eq('assessment_type', filters.assessment_type);
      if (filters.difficulty_level) query = query.eq('difficulty_level', filters.difficulty_level);
      if (filters.content_id) query = query.eq('content_id', filters.content_id);
      if (filters.user_id) query = query.eq('user_id', filters.user_id);
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, count, page, limit };
    } catch (error) {
      logger.error('Error fetching learning assessments:', error);
      throw error;
    }
  }

  async getAssessmentsByContent(contentId) {
    try {
      const assessments = await this.db.read('learning_assessments', null, { content_id: contentId });
      return assessments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } catch (error) {
      logger.error(`Error fetching assessments for content ${contentId}:`, error);
      throw error;
    }
  }

  async updateLearningAssessment(id, updates) {
    try {
      logger.debug(`Updating learning assessment ${id}:`, updates);
      const result = await this.db.update('learning_assessments', id, updates);
      logger.info(`✅ Updated learning assessment ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error updating learning assessment ${id}:`, error);
      throw error;
    }
  }

  async deleteLearningAssessment(id) {
    try {
      logger.debug(`Deleting learning assessment ${id}`);
      await this.db.delete('learning_assessments', id);
      logger.info(`✅ Deleted learning assessment ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting learning assessment ${id}:`, error);
      throw error;
    }
  }

  async getAssessmentStats(contentId = null) {
    try {
      let query = this.db.supabase
        .from('learning_assessments')
        .select('score, max_score, passed');

      if (contentId) query = query.eq('content_id', contentId);

      const { data, error } = await query;
      if (error) throw error;

      const stats = {
        total: data.length,
        passed: data.filter(a => a.passed).length,
        failed: data.filter(a => !a.passed).length,
        averageScore: data.length > 0 ? data.reduce((sum, a) => sum + a.score, 0) / data.length : 0,
        averageMaxScore: data.length > 0 ? data.reduce((sum, a) => sum + a.max_score, 0) / data.length : 0
      };

      return stats;
    } catch (error) {
      logger.error('Error fetching assessment stats:', error);
      throw error;
    }
  }
}

class LearningAnalyticsService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  async createLearningAnalytics(analyticsData) {
    try {
      logger.debug('Creating learning analytics event:', analyticsData.event_type);
      const result = await this.db.create('learning_analytics', {
        ...analyticsData,
        created_at: new Date().toISOString()
      });
      logger.info(`✅ Created learning analytics event with ID: ${result.id}`);
      return result;
    } catch (error) {
      logger.error('Error creating learning analytics:', error);
      throw error;
    }
  }

  async getAnalyticsByUser(userId, contentId = null) {
    try {
      const filters = { user_id: userId };
      if (contentId) filters.content_id = contentId;

      const analytics = await this.db.read('learning_analytics', null, filters);
      return analytics.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } catch (error) {
      logger.error(`Error fetching analytics for user ${userId}:`, error);
      throw error;
    }
  }

  async getAnalyticsByContent(contentId) {
    try {
      const analytics = await this.db.read('learning_analytics', null, { content_id: contentId });
      return analytics.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } catch (error) {
      logger.error(`Error fetching analytics for content ${contentId}:`, error);
      throw error;
    }
  }

  async getUserProgress(userId) {
    try {
      // Get all analytics for user
      const analytics = await this.getAnalyticsByUser(userId);

      // Calculate progress metrics
      const progress = {
        totalViews: analytics.filter(a => a.event_type === 'view').length,
        totalStarts: analytics.filter(a => a.event_type === 'start').length,
        totalCompletes: analytics.filter(a => a.event_type === 'complete').length,
        totalTimeSpent: analytics.reduce((sum, a) => sum + (a.duration_seconds || 0), 0),
        contentEngaged: new Set(analytics.map(a => a.content_id)).size,
        recentActivity: analytics.slice(0, 10) // Last 10 events
      };

      return progress;
    } catch (error) {
      logger.error(`Error fetching progress for user ${userId}:`, error);
      throw error;
    }
  }

  async getContentAnalytics(contentId) {
    try {
      const analytics = await this.getAnalyticsByContent(contentId);

      const stats = {
        totalViews: analytics.filter(a => a.event_type === 'view').length,
        totalStarts: analytics.filter(a => a.event_type === 'start').length,
        totalCompletes: analytics.filter(a => a.event_type === 'complete').length,
        totalBookmarks: analytics.filter(a => a.event_type === 'bookmark').length,
        averageProgress: analytics.length > 0 ?
          analytics.reduce((sum, a) => sum + (a.progress_percentage || 0), 0) / analytics.length : 0,
        uniqueUsers: new Set(analytics.map(a => a.user_id)).size,
        totalTimeSpent: analytics.reduce((sum, a) => sum + (a.duration_seconds || 0), 0)
      };

      return stats;
    } catch (error) {
      logger.error(`Error fetching analytics for content ${contentId}:`, error);
      throw error;
    }
  }

  async getAllLearningAnalytics(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      let query = this.db.supabase
        .from('learning_analytics')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.event_type) query = query.eq('event_type', filters.event_type);
      if (filters.country) query = query.eq('country', filters.country);
      if (filters.is_processed !== undefined) query = query.eq('is_processed', filters.is_processed);
      if (filters.user_id) query = query.eq('user_id', filters.user_id);
      if (filters.content_id) query = query.eq('content_id', filters.content_id);
      if (filters.search) {
        // Note: This would require joining with users/content tables for name search
        // For now, we'll skip search or implement it differently
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, count, page, limit };
    } catch (error) {
      logger.error('Error fetching learning analytics:', error);
      throw error;
    }
  }

  async getLearningAnalyticsById(id) {
    try {
      const analytics = await this.db.read('learning_analytics', id);
      return analytics[0] || null;
    } catch (error) {
      logger.error(`Error fetching learning analytics ${id}:`, error);
      throw error;
    }
  }

  async updateLearningAnalytics(id, updates) {
    try {
      logger.debug(`Updating learning analytics ${id}:`, updates);
      const result = await this.db.update('learning_analytics', id, updates);
      logger.info(`✅ Updated learning analytics ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error updating learning analytics ${id}:`, error);
      throw error;
    }
  }

  async deleteLearningAnalytics(id) {
    try {
      logger.debug(`Deleting learning analytics ${id}`);
      await this.db.delete('learning_analytics', id);
      logger.info(`✅ Deleted learning analytics ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting learning analytics ${id}:`, error);
      throw error;
    }
  }
}

class LearningService {
  constructor(databaseService) {
    this.db = databaseService;
    this.content = new LearningContentService(databaseService);
    this.category = new LearningCategoryService(databaseService);
    this.assessment = new LearningAssessmentService(databaseService);
    this.analytics = new LearningAnalyticsService(databaseService);
  }

  // Unified learning search
  async searchLearningContent(searchTerm, filters = {}) {
    try {
      return await this.content.getAllLearningContent({
        ...filters,
        search: searchTerm
      });
    } catch (error) {
      logger.error('Error searching learning content:', error);
      throw error;
    }
  }

  // Learning dashboard stats
  async getLearningStats() {
    try {
      const [contentStats, categoryStats, assessmentStats] = await Promise.all([
        this.content.getAllLearningContent(),
        this.category.getAllLearningCategories(),
        this.assessment.getAssessmentStats()
      ]);

      return {
        content: {
          total: contentStats.count || 0,
          published: contentStats.data?.filter(c => c.is_published).length || 0
        },
        categories: {
          total: categoryStats.length,
          active: categoryStats.filter(c => c.is_active).length
        },
        assessments: assessmentStats
      };
    } catch (error) {
      logger.error('Error fetching learning stats:', error);
      throw error;
    }
  }
}

export {
  LearningService,
  LearningContentService,
  LearningCategoryService,
  LearningAssessmentService,
  LearningAnalyticsService
};
export default LearningService;