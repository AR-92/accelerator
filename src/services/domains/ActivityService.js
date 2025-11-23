import logger from '../../utils/logger.js';

class ActivityService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  async logActivity(activityData) {
    try {
      logger.debug('Logging activity:', activityData.action);
      const result = await this.db.create('activity_logs', {
        ...activityData,
        created_at: new Date().toISOString()
      });
      logger.info(`✅ Logged activity: ${activityData.action} by user ${activityData.user_id}`);
      return result;
    } catch (error) {
      logger.error('Error logging activity:', error);
      throw error;
    }
  }

  async getActivityById(id) {
    try {
      const activities = await this.db.read('activity_logs', id);
      return activities[0] || null;
    } catch (error) {
      logger.error(`Error fetching activity ${id}:`, error);
      throw error;
    }
  }

  async getActivitiesByUser(userId, filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 20 } = pagination;
      const offset = (page - 1) * limit;

      let query = this.db.supabase
        .from('activity_logs')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      // Apply filters
      if (filters.action) query = query.eq('action', filters.action);
      if (filters.activity_type) query = query.eq('activity_type', filters.activity_type);
      if (filters.start_date) query = query.gte('created_at', filters.start_date);
      if (filters.end_date) query = query.lte('created_at', filters.end_date);

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, count, page, limit };
    } catch (error) {
      logger.error(`Error fetching activities for user ${userId}:`, error);
      throw error;
    }
  }

  async getAllActivities(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 50 } = pagination;
      const offset = (page - 1) * limit;

      let query = this.db.supabase
        .from('activity_logs')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.action) query = query.eq('action', filters.action);
      if (filters.activity_type) query = query.eq('activity_type', filters.activity_type);
      if (filters.user_id) query = query.eq('user_id', filters.user_id);
      if (filters.start_date) query = query.gte('created_at', filters.start_date);
      if (filters.end_date) query = query.lte('created_at', filters.end_date);

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, count, page, limit };
    } catch (error) {
      logger.error('Error fetching all activities:', error);
      throw error;
    }
  }

  // Predefined activity logging methods
  async logUserLogin(userId, ipAddress = null, userAgent = null) {
    try {
      return await this.logActivity({
        user_id: userId,
        action: 'login',
        resource_type: 'user',
        resource_id: userId,
        description: 'User logged in',
        metadata: { ip_address: ipAddress, user_agent: userAgent }
      });
    } catch (error) {
      logger.error(`Error logging login for user ${userId}:`, error);
      throw error;
    }
  }

  async logUserLogout(userId) {
    try {
      return await this.logActivity({
        user_id: userId,
        action: 'logout',
        resource_type: 'user',
        resource_id: userId,
        description: 'User logged out'
      });
    } catch (error) {
      logger.error(`Error logging logout for user ${userId}:`, error);
      throw error;
    }
  }

  async logProjectCreated(userId, projectId, projectName) {
    try {
      return await this.logActivity({
        user_id: userId,
        action: 'create',
        resource_type: 'project',
        resource_id: projectId,
        description: `Created project "${projectName}"`,
        metadata: { project_name: projectName }
      });
    } catch (error) {
      logger.error(`Error logging project creation for user ${userId}:`, error);
      throw error;
    }
  }

  async logTaskCompleted(userId, taskId, taskTitle, projectName) {
    try {
      return await this.logActivity({
        user_id: userId,
        action: 'complete',
        resource_type: 'task',
        resource_id: taskId,
        description: `Completed task "${taskTitle}" in project "${projectName}"`,
        metadata: { task_title: taskTitle, project_name: projectName }
      });
    } catch (error) {
      logger.error(`Error logging task completion for user ${userId}:`, error);
      throw error;
    }
  }

  async logContentPublished(userId, contentId, contentTitle) {
    try {
      return await this.logActivity({
        user_id: userId,
        action: 'publish',
        resource_type: 'content',
        resource_id: contentId,
        description: `Published content "${contentTitle}"`,
        metadata: { content_title: contentTitle }
      });
    } catch (error) {
      logger.error(`Error logging content publication for user ${userId}:`, error);
      throw error;
    }
  }

  async logUserRegistered(userId, email) {
    try {
      return await this.logActivity({
        user_id: userId,
        action: 'register',
        resource_type: 'user',
        resource_id: userId,
        description: `User registered with email ${email}`,
        metadata: { email }
      });
    } catch (error) {
      logger.error(`Error logging user registration for ${email}:`, error);
      throw error;
    }
  }

  // Activity analytics
  async getActivityStats(filters = {}) {
    try {
      let query = this.db.supabase
        .from('activity_logs')
        .select('action, activity_type, created_at');

      // Apply date filters
      if (filters.start_date) query = query.gte('created_at', filters.start_date);
      if (filters.end_date) query = query.lte('created_at', filters.end_date);

      const { data, error } = await query;
      if (error) throw error;

      const stats = {
        total: data.length,
        byAction: {},
        byActivityType: {},
        recentActivity: data.slice(0, 10) // Last 10 activities
      };

      // Count by action and activity_type
      data.forEach(activity => {
        stats.byAction[activity.action] = (stats.byAction[activity.action] || 0) + 1;
        stats.byActivityType[activity.activity_type] = (stats.byActivityType[activity.activity_type] || 0) + 1;
      });

      return stats;
    } catch (error) {
      logger.error('Error fetching activity stats:', error);
      throw error;
    }
  }

  async getUserActivitySummary(userId, days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const activities = await this.getActivitiesByUser(userId, {
        start_date: startDate.toISOString()
      });

      const summary = {
        totalActivities: activities.count || 0,
        byAction: {},
        byActivityType: {},
        mostActiveDay: null,
        activityStreak: 0
      };

      if (activities.data) {
        // Count by action and activity_type
        activities.data.forEach(activity => {
          summary.byAction[activity.action] = (summary.byAction[activity.action] || 0) + 1;
          summary.byActivityType[activity.activity_type] = (summary.byActivityType[activity.activity_type] || 0) + 1;
        });

        // Find most active day
        const dayCounts = {};
        activities.data.forEach(activity => {
          const day = new Date(activity.created_at).toDateString();
          dayCounts[day] = (dayCounts[day] || 0) + 1;
        });

        if (Object.keys(dayCounts).length > 0) {
          const mostActiveDay = Object.entries(dayCounts).reduce((a, b) =>
            dayCounts[a[0]] > dayCounts[b[0]] ? a : b
          );
          summary.mostActiveDay = mostActiveDay[0];
        }
      }

      return summary;
    } catch (error) {
      logger.error(`Error fetching activity summary for user ${userId}:`, error);
      throw error;
    }
  }

  // Get activity logs for admin page
  async getActivityLogsForAdmin(limit = 100) {
    try {
      const { data: activities, error } = await this.db.supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Map to expected format
      const mappedActivities = activities.map(activity => ({
        id: activity.id,
        user_id: activity.user_id,
        activity_type: activity.activity_type,
        action: activity.action,
        entity_type: activity.entity_type,
        description: activity.description,
        ip_address: activity.ip_address,
        browser: activity.browser,
        os: activity.os,
        status: activity.status,
        created_at: activity.created_at
      }));

      // Calculate activity stats
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);

      const activityStats = {
        total: mappedActivities.length,
        today: mappedActivities.filter(a => new Date(a.created_at) >= today).length,
        thisWeek: mappedActivities.filter(a => new Date(a.created_at) >= weekAgo).length,
        failed: mappedActivities.filter(a => a.status === 'failed').length
      };

      return {
        activities: mappedActivities,
        stats: activityStats
      };
    } catch (error) {
      logger.error('Error fetching activity logs for admin:', error);
      throw error;
    }
  }

  // Cleanup old activities
  async cleanupOldActivities(daysOld = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      logger.debug(`Cleaning up activities older than ${daysOld} days`);

      // In a real implementation, you'd archive or delete old activities
      // For now, we'll just count what would be cleaned up
      const { data, error } = await this.db.supabase
        .from('activity_logs')
        .select('id')
        .lt('created_at', cutoffDate.toISOString());

      if (error) throw error;

      logger.info(`Found ${data.length} old activities that could be cleaned up`);
      return { wouldArchive: data.length };
    } catch (error) {
      logger.error('Error during activity cleanup:', error);
      throw error;
    }
  }
}

export { ActivityService };
export default ActivityService;