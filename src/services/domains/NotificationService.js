import logger from '../../utils/logger.js';

class NotificationService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  async createNotification(notificationData) {
    try {
      logger.debug('Creating notification:', notificationData.title);
      const result = await this.db.create('notifications', {
        ...notificationData,
        is_read: notificationData.is_read || false,
        created_at: new Date().toISOString()
      });
      logger.info(`✅ Created notification with ID: ${result.id}`);
      return result;
    } catch (error) {
      logger.error('Error creating notification:', error);
      throw error;
    }
  }

  async getNotificationById(id) {
    try {
      const notifications = await this.db.read('notifications', id);
      return notifications[0] || null;
    } catch (error) {
      logger.error(`Error fetching notification ${id}:`, error);
      throw error;
    }
  }

  async getNotificationsByUser(userId, filters = {}) {
    try {
      const notificationFilters = { user_id: userId };
      if (filters.is_read !== undefined) notificationFilters.is_read = filters.is_read;
      if (filters.type) notificationFilters.type = filters.type;

      const notifications = await this.db.read('notifications', null, notificationFilters);
      return notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } catch (error) {
      logger.error(`Error fetching notifications for user ${userId}:`, error);
      throw error;
    }
  }

  async getAllNotifications(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      let query = this.db.supabase
        .from('notifications')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.is_read !== undefined) query = query.eq('is_read', filters.is_read);
      if (filters.type) query = query.eq('type', filters.type);
      if (filters.priority) query = query.eq('priority', filters.priority);
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,message.ilike.%${filters.search}%`);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, count, page, limit };
    } catch (error) {
      logger.error('Error fetching all notifications:', error);
      throw error;
    }
  }

  async updateNotification(id, updates) {
    try {
      logger.debug(`Updating notification ${id}:`, updates);
      const result = await this.db.update('notifications', id, updates);
      logger.info(`✅ Updated notification ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error updating notification ${id}:`, error);
      throw error;
    }
  }

  async deleteNotification(id) {
    try {
      logger.debug(`Deleting notification ${id}`);
      await this.db.delete('notifications', id);
      logger.info(`✅ Deleted notification ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting notification ${id}:`, error);
      throw error;
    }
  }

  async markAsRead(id) {
    try {
      logger.debug(`Marking notification ${id} as read`);
      const result = await this.updateNotification(id, {
        is_read: true,
        read_at: new Date().toISOString()
      });
      logger.info(`✅ Marked notification ${id} as read`);
      return result;
    } catch (error) {
      logger.error(`Error marking notification ${id} as read:`, error);
      throw error;
    }
  }

  async markAllAsRead(userId) {
    try {
      logger.debug(`Marking all notifications as read for user ${userId}`);

      // Get all unread notifications for the user
      const unreadNotifications = await this.getNotificationsByUser(userId, { is_read: false });

      // Update each notification
      const updatePromises = unreadNotifications.map(notification =>
        this.updateNotification(notification.id, {
          is_read: true,
          read_at: new Date().toISOString()
        })
      );

      await Promise.all(updatePromises);
      logger.info(`✅ Marked ${unreadNotifications.length} notifications as read for user ${userId}`);

      return { updated: unreadNotifications.length };
    } catch (error) {
      logger.error(`Error marking all notifications as read for user ${userId}:`, error);
      throw error;
    }
  }

  // Bulk notification creation
  async createBulkNotifications(notifications) {
    try {
      logger.debug(`Creating ${notifications.length} bulk notifications`);

      const notificationsWithTimestamps = notifications.map(notification => ({
        ...notification,
        is_read: notification.is_read || false,
        created_at: new Date().toISOString()
      }));

      const results = [];
      for (const notification of notificationsWithTimestamps) {
        const result = await this.createNotification(notification);
        results.push(result);
      }

      logger.info(`✅ Created ${results.length} bulk notifications`);
      return results;
    } catch (error) {
      logger.error('Error creating bulk notifications:', error);
      throw error;
    }
  }

  // Notification templates
  async createWelcomeNotification(userId, userName) {
    try {
      return await this.createNotification({
        user_id: userId,
        title: 'Welcome to Accelerator!',
        message: `Hi ${userName}, welcome to your new workspace. Explore the features and start building!`,
        type: 'info'
      });
    } catch (error) {
      logger.error(`Error creating welcome notification for user ${userId}:`, error);
      throw error;
    }
  }

  async createProjectInvitationNotification(userId, projectName, inviterName) {
    try {
      return await this.createNotification({
        user_id: userId,
        title: 'Project Invitation',
        message: `${inviterName} invited you to collaborate on "${projectName}"`,
        type: 'info'
      });
    } catch (error) {
      logger.error(`Error creating project invitation notification for user ${userId}:`, error);
      throw error;
    }
  }

  async createTaskAssignedNotification(userId, taskTitle, projectName) {
    try {
      return await this.createNotification({
        user_id: userId,
        title: 'Task Assigned',
        message: `You have been assigned to "${taskTitle}" in project "${projectName}"`,
        type: 'info'
      });
    } catch (error) {
      logger.error(`Error creating task assigned notification for user ${userId}:`, error);
      throw error;
    }
  }

  // Notification statistics
  async getNotificationStats(userId = null) {
    try {
      let query = this.db.supabase
        .from('notifications')
        .select('is_read, type, created_at, priority');

      if (userId) query = query.eq('user_id', userId);

      const { data, error } = await query;
      if (error) throw error;

      const stats = {
        total: data.length,
        read: data.filter(n => n.is_read).length,
        unread: data.filter(n => !n.is_read).length,
        thisWeek: 0,
        systemAlerts: 0,
        byType: {}
      };

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      // Count by type and calculate additional stats
      data.forEach(notification => {
        stats.byType[notification.type] = (stats.byType[notification.type] || 0) + 1;

        // Count this week's notifications
        if (new Date(notification.created_at) >= weekAgo) {
          stats.thisWeek++;
        }

        // Count system alerts (high priority system notifications)
        if (notification.type === 'system' && notification.priority === 'high') {
          stats.systemAlerts++;
        }
      });

      return stats;
    } catch (error) {
      logger.error('Error fetching notification stats:', error);
      throw error;
    }
  }

  // Clean up old notifications
  async cleanupOldNotifications(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      logger.debug(`Cleaning up notifications older than ${daysOld} days`);

      // In a real implementation, you'd delete old read notifications
      // For now, we'll just log what would be cleaned up
      const { data, error } = await this.db.supabase
        .from('notifications')
        .select('id')
        .eq('is_read', true)
        .lt('created_at', cutoffDate.toISOString());

      if (error) throw error;

      logger.info(`Found ${data.length} old notifications that could be cleaned up`);
      return { wouldDelete: data.length };
    } catch (error) {
      logger.error('Error during notification cleanup:', error);
      throw error;
    }
  }
}

export { NotificationService };
export default NotificationService;