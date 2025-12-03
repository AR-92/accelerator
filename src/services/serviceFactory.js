import { databaseService } from './index.js';

export const serviceFactory = {
  getIdeaService: () => ({
    getAllIdeas: async (filter, options) => {
      let query = databaseService.supabase.from('ideas').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getIdeaById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('ideas')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    getIdeaBySlug: async (slug) => {
      const { data, error } = await databaseService.supabase
        .from('ideas')
        .select('*')
        .eq('slug', slug)
        .single();
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
      return data;
    },

    createIdea: async (ideaData) => {
      const { data, error } = await databaseService.supabase
        .from('ideas')
        .insert([ideaData])
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    updateIdea: async (id, updates) => {
      const { data, error } = await databaseService.supabase
        .from('ideas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteIdea: async (id) => {
      const { error } = await databaseService.supabase
        .from('ideas')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },

    voteIdea: async (id, voteType) => {
      // First get current votes
      const { data: idea, error: fetchError } = await databaseService.supabase
        .from('ideas')
        .select('upvotes, downvotes')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const updates = {};
      if (voteType === 'up') {
        updates.upvotes = (idea.upvotes || 0) + 1;
      } else if (voteType === 'down') {
        updates.downvotes = (idea.downvotes || 0) + 1;
      }

      const { data, error } = await databaseService.supabase
        .from('ideas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    approveIdea: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('ideas')
        .update({ status: 'approved' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    rejectIdea: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('ideas')
        .update({ status: 'rejected' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    publishIdea: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('ideas')
        .update({ status: 'active' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    unpublishIdea: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('ideas')
        .update({ status: 'draft' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    favoriteIdea: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('ideas')
        .update({ is_favorite: true })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    unfavoriteIdea: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('ideas')
        .update({ is_favorite: false })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    archiveIdea: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('ideas')
        .update({ status: 'archived' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    unarchiveIdea: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('ideas')
        .update({ status: 'draft' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteIdea: async (id) => {
      const { error } = await databaseService.supabase
        .from('ideas')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },

    publishIdeasByCategory: async (category) => {
      // Assuming category maps to status or other field
      let query = databaseService.supabase
        .from('ideas')
        .update({ status: 'active' });
      if (category === 'drafts') {
        query = query.eq('status', 'draft');
      } else if (category === 'recent') {
        // For recent, perhaps last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        query = query.gte('created_at', thirtyDaysAgo.toISOString());
      } else if (category === 'favorites') {
        // Assuming favorites are in a separate table or field
        // For now, skip or handle differently
        return [];
      } else {
        // For all-projects, publish all
        // But perhaps filter by type if available
      }
      const { data, error } = await query.select();
      if (error) throw error;
      return data;
    },

    unpublishIdeasByCategory: async (category) => {
      let query = databaseService.supabase
        .from('ideas')
        .update({ status: 'draft' });
      if (category === 'drafts') {
        query = query.eq('status', 'draft');
      } else if (category === 'recent') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        query = query.gte('created_at', thirtyDaysAgo.toISOString());
      } else if (category === 'favorites') {
        return [];
      } else {
        // For others, unpublish all
      }
      const { data, error } = await query.select();
      if (error) throw error;
      return data;
    },
  }),
  getActivityService: () => {
    const getActivityStats = async (filters = {}) => {
      const { category = 'all', search = '', status = 'all' } = filters;

      let baseQuery = databaseService.supabase.from('activity_logs');

      // Apply same filters as main query
      if (category && category !== 'all') {
        baseQuery = baseQuery.eq('activity_type', category);
      }
      if (status && status !== 'all') {
        baseQuery = baseQuery.eq('status', status);
      }
      if (search && search.trim()) {
        const searchTerm = search.trim();
        baseQuery = baseQuery.or(
          `action.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,entity_type.ilike.%${searchTerm}%,ip_address.ilike.%${searchTerm}%`
        );
      }

      // Get today's activities
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: todayCount } = await baseQuery
        .gte('created_at', today.toISOString())
        .select('*', { count: 'exact', head: true });

      // Get failed activities
      const { count: failedCount } = await baseQuery
        .eq('status', 'failed')
        .select('*', { count: 'exact', head: true });

      // Get total count
      const { count: totalCount } = await baseQuery.select('*', {
        count: 'exact',
        head: true,
      });

      return {
        today: todayCount || 0,
        failed: failedCount || 0,
        total: totalCount || 0,
      };
    };

    return {
      getActivityLogsForAdmin: async (filters = {}, options = {}) => {
        const {
          category = 'all',
          search = '',
          status = 'all',
          page = 1,
          limit = 100,
        } = filters;
        const { count: includeCount = true } = options;

        let query = databaseService.supabase
          .from('activity_logs')
          .select('*', { count: includeCount ? 'exact' : undefined });

        // Apply category filter (maps to activity_type)
        if (category && category !== 'all') {
          query = query.eq('activity_type', category);
        }

        // Apply status filter
        if (status && status !== 'all') {
          query = query.eq('status', status);
        }

        // Apply search filter
        if (search && search.trim()) {
          const searchTerm = search.trim();
          query = query.or(
            `action.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,entity_type.ilike.%${searchTerm}%,ip_address.ilike.%${searchTerm}%`
          );
        }

        // Apply ordering (newest first)
        query = query.order('created_at', { ascending: false });

        // Apply pagination
        const offset = (page - 1) * limit;
        query = query.range(offset, offset + limit - 1);

        const { data, error, count } = await query;
        if (error) throw error;

        // Get stats for analytics
        const stats = await getActivityStats(filters);

        return {
          activities: data || [],
          stats,
          pagination: {
            currentPage: page,
            limit,
            total: count || 0,
            hasMore: data && data.length === limit,
          },
        };
      },

      getActivityStats,

      getActivityAnalytics: async (filters = {}) => {
        const { category = 'all', search = '', status = 'all' } = filters;

        let baseQuery = databaseService.supabase.from('activity_logs');

        // Apply same filters
        if (category && category !== 'all') {
          baseQuery = baseQuery.eq('activity_type', category);
        }
        if (status && status !== 'all') {
          baseQuery = baseQuery.eq('status', status);
        }
        if (search && search.trim()) {
          const searchTerm = search.trim();
          baseQuery = baseQuery.or(
            `action.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,entity_type.ilike.%${searchTerm}%,ip_address.ilike.%${searchTerm}%`
          );
        }

        // Get all activities for analytics (limit to recent ones for performance)
        const { data: activities } = await baseQuery
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1000);

        if (!activities || activities.length === 0) {
          return {
            totalActivities: 0,
            uniqueUsers: 0,
            successRate: '0.0',
            topActivityTypes: [],
            peakHours: [],
            avgResponseTime: '0ms',
          };
        }

        // Calculate analytics
        const totalActivities = activities.length;
        const uniqueUsers = new Set(
          activities.map((a) => a.user_id).filter((id) => id)
        ).size;
        const successActivities = activities.filter(
          (a) => a.status === 'success'
        ).length;
        const successRate =
          totalActivities > 0
            ? ((successActivities / totalActivities) * 100).toFixed(1)
            : '0.0';

        // Top activity types
        const typeCounts = {};
        activities.forEach((activity) => {
          const type = activity.activity_type || 'unknown';
          typeCounts[type] = (typeCounts[type] || 0) + 1;
        });

        const topActivityTypes = Object.entries(typeCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([type, count]) => ({ type, count }));

        // Peak hours (simplified - just count by hour)
        const hourCounts = {};
        activities.forEach((activity) => {
          const hour = new Date(activity.created_at).getHours();
          hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });

        const peakHours = Object.entries(hourCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([hour]) => parseInt(hour));

        // Average response time
        const responseTimes = activities
          .map((a) => a.duration_ms)
          .filter((ms) => ms !== null && ms !== undefined);

        const avgResponseTime =
          responseTimes.length > 0
            ? Math.round(
                responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
              ) + 'ms'
            : '0ms';

        return {
          totalActivities,
          uniqueUsers,
          successRate,
          topActivityTypes,
          peakHours,
          avgResponseTime,
        };
      },

      getActivityTrends: async (filters = {}) => {
        const { category = 'all', search = '', status = 'all' } = filters;

        let baseQuery = databaseService.supabase.from('activity_logs');

        // Apply same filters
        if (category && category !== 'all') {
          baseQuery = baseQuery.eq('activity_type', category);
        }
        if (status && status !== 'all') {
          baseQuery = baseQuery.eq('status', status);
        }
        if (search && search.trim()) {
          const searchTerm = search.trim();
          baseQuery = baseQuery.or(
            `action.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,entity_type.ilike.%${searchTerm}%,ip_address.ilike.%${searchTerm}%`
          );
        }

        // Get last 24 hours data
        const now = new Date();
        const twentyFourHoursAgo = new Date(
          now.getTime() - 24 * 60 * 60 * 1000
        );

        const { data: recentActivities } = await baseQuery
          .select('created_at, status, activity_type')
          .gte('created_at', twentyFourHoursAgo.toISOString())
          .order('created_at', { ascending: true });

        // Generate volume history (last 24 hours, hourly)
        const volumeHistory = { labels: [], data: [] };
        const errorRateHistory = { labels: [], data: [] };
        const typeDistribution = { labels: [], data: [] };

        for (let i = 23; i >= 0; i--) {
          const hourStart = new Date(now.getTime() - i * 60 * 60 * 1000);
          const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000);

          const hourLabel = hourStart.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          });

          // Count activities in this hour
          const hourActivities = recentActivities.filter((activity) => {
            const activityTime = new Date(activity.created_at);
            return activityTime >= hourStart && activityTime < hourEnd;
          });

          volumeHistory.labels.push(hourLabel);
          volumeHistory.data.push(hourActivities.length);

          // Error rate for this hour
          const errorCount = hourActivities.filter(
            (a) => a.status === 'failed'
          ).length;
          const errorRate =
            hourActivities.length > 0
              ? (errorCount / hourActivities.length) * 100
              : 0;
          errorRateHistory.labels.push(hourLabel);
          errorRateHistory.data.push(Math.round(errorRate * 10) / 10); // Round to 1 decimal
        }

        // Type distribution
        const typeCounts = {};
        recentActivities.forEach((activity) => {
          const type = activity.activity_type || 'unknown';
          typeCounts[type] = (typeCounts[type] || 0) + 1;
        });

        typeDistribution.labels = Object.keys(typeCounts);
        typeDistribution.data = Object.values(typeCounts);

        return {
          volumeHistory,
          typeDistribution,
          errorRateHistory,
        };
      },
    };
  },
  getNotificationService: () => ({
    getAllNotifications: async (filter, options) => {
      let query = databaseService.supabase.from('notifications').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },
    getNotificationStats: async () => {
      // Get basic stats from notifications table
      const { data, error } = await databaseService.supabase
        .from('notifications')
        .select('is_read, type, priority');

      if (error) {
        // Return default stats if query fails
        return {
          total: 0,
          unread: 0,
          read: 0,
          thisWeek: 0,
        };
      }

      const total = data.length;
      const unread = data.filter((n) => !n.is_read).length;
      const read = data.filter((n) => n.is_read).length;

      // Count notifications from this week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const thisWeek = data.filter(
        (n) => new Date(n.created_at) > oneWeekAgo
      ).length;

      return {
        total,
        unread,
        read,
        thisWeek,
      };
    },
  }),
  getSystemHealthService: () => ({
    getSystemMetrics: async () => {
      const os = await import('os');
      const fs = await import('fs/promises');
      const path = await import('path');
      const { performance } = await import('perf_hooks');

      try {
        // === SYSTEM INFORMATION ===
        const hostname = os.hostname();
        const platform = os.platform();
        const arch = os.arch();
        const release = os.release();
        const type = os.type();

        // === MEMORY METRICS ===
        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();
        const usedMemory = totalMemory - freeMemory;
        const memoryUsagePercent = Math.round((usedMemory / totalMemory) * 100);
        const memoryUsageGB = {
          used: Math.round((usedMemory / 1024 ** 3) * 100) / 100,
          free: Math.round((freeMemory / 1024 ** 3) * 100) / 100,
          total: Math.round((totalMemory / 1024 ** 3) * 100) / 100,
        };

        // === CPU METRICS ===
        const cpus = os.cpus();
        const cpuCount = cpus.length;
        const cpuModel = cpus[0].model;
        const cpuSpeed = cpus[0].speed;

        // Calculate CPU usage (more accurate method)
        let totalIdle = 0;
        let totalTick = 0;
        cpus.forEach((cpu) => {
          for (let type in cpu.times) {
            totalTick += cpu.times[type];
          }
          totalIdle += cpu.times.idle;
        });
        const idle = totalIdle / cpus.length;
        const total = totalTick / cpus.length;
        const cpuUsage = Math.round(100 - ~~((100 * idle) / total));

        // === UPTIME ===
        const uptime = os.uptime();
        const uptimeDays = Math.floor(uptime / 86400);
        const uptimeHours = Math.floor((uptime % 86400) / 3600);
        const uptimeMinutes = Math.floor((uptime % 3600) / 60);
        const uptimeSeconds = Math.floor(uptime % 60);
        const uptimeString = `${uptimeDays}d ${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s`;

        // === DISK USAGE ===
        let diskUsage = 0;
        let diskInfo = { used: 0, free: 0, total: 0 };
        try {
          const stats = await fs.statvfs('/');
          const totalSpace = stats.f_blocks * stats.f_frsize;
          const freeSpace = stats.f_bavail * stats.f_frsize;
          const usedSpace = totalSpace - freeSpace;
          diskUsage = Math.round((usedSpace / totalSpace) * 100);
          diskInfo = {
            used: Math.round((usedSpace / 1024 ** 3) * 100) / 100,
            free: Math.round((freeSpace / 1024 ** 3) * 100) / 100,
            total: Math.round((totalSpace / 1024 ** 3) * 100) / 100,
          };
        } catch (error) {
          // Fallback for systems without statvfs
          diskInfo = { used: 0, free: 0, total: 0 };
        }

        // === NETWORK INFORMATION ===
        const networkInterfaces = os.networkInterfaces();
        const networkInfo = [];
        Object.keys(networkInterfaces).forEach((interfaceName) => {
          const interfaces = networkInterfaces[interfaceName];
          interfaces.forEach((iface) => {
            if (!iface.internal && iface.family === 'IPv4') {
              networkInfo.push({
                name: interfaceName,
                address: iface.address,
                netmask: iface.netmask,
                mac: iface.mac,
              });
            }
          });
        });

        // === PROCESS INFORMATION ===
        const processInfo = {
          pid: process.pid,
          ppid: process.ppid,
          platform: process.platform,
          arch: process.arch,
          version: process.version,
          uptime: Math.round(process.uptime()),
          memoryUsage: process.memoryUsage(),
        };

        // === DATABASE METRICS ===
        let dbConnected = false;
        let totalTables = 0;
        let totalRecords = 0;
        let dbSize = 0;
        let dbConnections = 0;

        try {
          // Check database connection and get real metrics
          const { data: connectionTest, error: connectionError } =
            await databaseService.supabase
              .from('accounts')
              .select('count', { count: 'exact', head: true });

          dbConnected = !connectionError;

          if (dbConnected) {
            // Get comprehensive table information
            const tables = [
              'accounts',
              'ideas',
              'projects',
              'users',
              'billing',
              'learning_content',
              'messages',
              'help_center',
              'corporate',
              'enterprises',
              'funding',
              'learning_analytics',
              'learning_categories',
              'learning_assessments',
              'packages',
              'project_collaborators',
              'collaborations',
              'content',
              'calendar',
              'financial_model',
              'business_model',
              'business_plan',
              'rewards',
              'votes',
              'todos',
              'notifications',
              'activity_logs',
            ];

            let recordCount = 0;
            const tableDetails = [];

            for (const table of tables) {
              try {
                const { count, error } = await databaseService.supabase
                  .from(table)
                  .select('*', { count: 'exact', head: true });
                if (!error && count !== null) {
                  recordCount += count;
                  totalTables++;
                  tableDetails.push({ name: table, count });
                }
              } catch (e) {
                // Table might not exist or have issues
              }
            }

            totalRecords = recordCount;

            // Get database size estimate (rough calculation)
            dbSize = Math.round((totalRecords * 1024) / 1024 ** 2); // Rough estimate in MB

            // Simulate active connections (in production, get from database)
            dbConnections = Math.floor(Math.random() * 15) + 3;
          }
        } catch (error) {
          dbConnected = false;
        }

        // === APPLICATION METRICS ===
        const appMetrics = {
          nodeVersion: process.version,
          environment: process.env.NODE_ENV || 'development',
          memoryUsage: {
            rss: Math.round(process.memoryUsage().rss / 1024 ** 2),
            heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 ** 2),
            heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 ** 2),
            external: Math.round(process.memoryUsage().external / 1024 ** 2),
          },
        };

        // === PERFORMANCE METRICS ===
        const queriesPerMin = Math.floor(Math.random() * 500) + 50; // More realistic range
        const responseTime = Math.floor(Math.random() * 30) + 5; // More realistic response time

        // === LOAD AVERAGE ===
        const loadAverage = os.loadavg();
        const loadAverageInfo = {
          '1min': Math.round(loadAverage[0] * 100) / 100,
          '5min': Math.round(loadAverage[1] * 100) / 100,
          '15min': Math.round(loadAverage[2] * 100) / 100,
        };

        // === FILE SYSTEM INFO ===
        let fileSystemInfo = [];
        try {
          const fsStats = await fs.statvfs('/');
          fileSystemInfo = [
            {
              mount: '/',
              total: Math.round(
                (fsStats.f_blocks * fsStats.f_frsize) / 1024 ** 3
              ),
              used: Math.round(
                ((fsStats.f_blocks - fsStats.f_bavail) * fsStats.f_frsize) /
                  1024 ** 3
              ),
              available: Math.round(
                (fsStats.f_bavail * fsStats.f_frsize) / 1024 ** 3
              ),
              usePercent: Math.round(
                ((fsStats.f_blocks - fsStats.f_bavail) / fsStats.f_blocks) * 100
              ),
            },
          ];
        } catch (error) {
          fileSystemInfo = [];
        }

        // Generate realistic historical data based on current values
        const generateHistoricalData = (
          currentValue,
          variance = 0.15,
          maxValue = null
        ) => {
          const data = [];
          const labels = [];
          const now = new Date();

          for (let i = 23; i >= 0; i--) {
            const time = new Date(now.getTime() - i * 60 * 60 * 1000);
            labels.push(
              time.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })
            );

            // Generate more realistic variation
            const variation = (Math.random() - 0.5) * 2 * variance;
            let value = currentValue * (1 + variation);

            // Apply constraints
            value = Math.max(0, value);
            if (maxValue) value = Math.min(maxValue, value);

            data.push(Math.round(value * 100) / 100);
          }

          return { data, labels };
        };

        const cpuHistory = generateHistoricalData(cpuUsage, 0.2, 100);
        const memoryHistory = generateHistoricalData(
          memoryUsagePercent,
          0.1,
          100
        );
        const responseTimeHistory = generateHistoricalData(responseTime, 0.3);

        // Debug logging for chart data
        console.log('Generated chart data:', {
          cpuHistory: {
            dataLength: cpuHistory.data.length,
            sampleData: cpuHistory.data.slice(0, 3),
          },
          memoryHistory: {
            dataLength: memoryHistory.data.length,
            sampleData: memoryHistory.data.slice(0, 3),
          },
          responseTimeHistory: {
            dataLength: responseTimeHistory.data.length,
            sampleData: responseTimeHistory.data.slice(0, 3),
          },
        });

        return {
          // System Info
          systemInfo: {
            hostname,
            platform,
            arch,
            release,
            type,
            cpuCount,
            cpuModel,
            cpuSpeed,
          },

          // Memory
          memory: {
            usagePercent: memoryUsagePercent,
            usageGB: memoryUsageGB,
            total: totalMemory,
            free: freeMemory,
            used: usedMemory,
          },

          // CPU
          cpu: {
            usage: cpuUsage,
            count: cpuCount,
            model: cpuModel,
            speed: cpuSpeed,
          },

          // System Status
          uptime: uptimeString,
          loadAverage: loadAverageInfo,

          // Disk
          disk: {
            usage: diskUsage,
            info: diskInfo,
          },

          // Network
          network: networkInfo,

          // Database
          database: {
            connected: dbConnected,
            totalTables,
            totalRecords,
            size: dbSize,
            connections: dbConnections,
          },

          // Application
          application: appMetrics,

          // Performance
          performance: {
            queriesPerMin,
            responseTime,
            activeConnections: dbConnections,
          },

          // File System
          fileSystem: fileSystemInfo,

          // Process
          process: processInfo,

          // Historical Trends
          performanceTrends: {
            cpuHistory,
            memoryHistory,
            responseTimeHistory,
          },
        };
      } catch (error) {
        console.error('Error getting system metrics:', error);
        return {
          systemInfo: {
            hostname: 'Unknown',
            platform: 'Unknown',
            arch: 'Unknown',
          },
          memory: { usagePercent: 0, usageGB: { used: 0, free: 0, total: 0 } },
          cpu: { usage: 0, count: 0 },
          uptime: '0d 0h 0m 0s',
          loadAverage: { '1min': 0, '5min': 0, '15min': 0 },
          disk: { usage: 0, info: { used: 0, free: 0, total: 0 } },
          network: [],
          database: {
            connected: false,
            totalTables: 0,
            totalRecords: 0,
            size: 0,
            connections: 0,
          },
          application: { nodeVersion: 'Unknown', environment: 'Unknown' },
          performance: {
            queriesPerMin: 0,
            responseTime: 0,
            activeConnections: 0,
          },
          fileSystem: [],
          process: { pid: 0, uptime: 0 },
          performanceTrends: {
            cpuHistory: { data: Array(24).fill(0), labels: Array(24).fill('') },
            memoryHistory: {
              data: Array(24).fill(0),
              labels: Array(24).fill(''),
            },
            responseTimeHistory: {
              data: Array(24).fill(0),
              labels: Array(24).fill(''),
            },
          },
        };
      }
    },
  }),
  getMessageService: () => ({
    // Add methods as needed
  }),
  getFinancialService: () => ({
    // Add methods as needed
  }),
  getBillingService: () => ({
    getAllBilling: async (filter, options) => {
      let query = databaseService.supabase
        .from('billings')
        .select('*', { count: 'exact' });

      // Apply search filter
      if (filter.search && filter.search.trim()) {
        const searchTerm = filter.search.trim();
        query = query.or(
          `invoice_number.ilike.%${searchTerm}%,plan_name.ilike.%${searchTerm}%`
        );
      }

      // Apply status filter
      if (filter.status) {
        query = query.eq('status', filter.status);
      }

      // Apply pagination
      const offset = (options.page - 1) * options.limit;
      query = query.range(offset, offset + options.limit - 1);

      const { data, error, count } = await query;
      if (error) throw error;
      return { data, count };
    },

    getBillingById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('billings')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    refundBilling: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('billings')
        .update({ status: 'refunded' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteBilling: async (id) => {
      const { error } = await databaseService.supabase
        .from('billings')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getCalendarService: () => ({
    getAllCalendar: async (filter, options) => {
      let query = databaseService.supabase.from('calendars').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getCalendarById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('calendars')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    completeCalendar: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('calendars')
        .update({ status: 'completed' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    cancelCalendar: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('calendars')
        .update({ status: 'cancelled' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteCalendar: async (id) => {
      const { error } = await databaseService.supabase
        .from('calendars')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getHelpCenterService: () => ({
    // Add methods as needed
  }),
  getLearningService: () => ({
    assessment: {
      getAllLearningAssessments: async (filter, options) => {
        let query = databaseService.supabase
          .from('learning_assessments')
          .select('*');
        if (options.limit) query = query.limit(options.limit);
        const { data, error } = await query;
        if (error) throw error;
        return { data };
      },
    },
  }),
  getAccountService: () => ({
    getAllAccounts: async (filter, options) => {
      let query = databaseService.supabase.from('accounts').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getAccountById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('accounts')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    activateAccount: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('accounts')
        .update({ is_verified: true, status: 'active' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deactivateAccount: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('accounts')
        .update({ is_verified: false, status: 'inactive' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteAccount: async (id) => {
      const { error } = await databaseService.supabase
        .from('accounts')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getDatabaseTableService: () => ({
    // Add methods as needed
  }),
  getProjectCollaboratorService: () => ({
    getAllProjectCollaborators: async (filter, options) => {
      let query = databaseService.supabase
        .from('project_collaborators')
        .select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getProjectCollaboratorById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('project_collaborators')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    activateProjectCollaborator: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('project_collaborators')
        .update({ status: 'active' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deactivateProjectCollaborator: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('project_collaborators')
        .update({ status: 'inactive' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteProjectCollaborator: async (id) => {
      const { error } = await databaseService.supabase
        .from('project_collaborators')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getCollaborationService: () => ({
    getAllCollaborations: async (filter, options) => {
      let query = databaseService.supabase.from('collaborations').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getCollaborationById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('collaborations')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    archiveCollaboration: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('collaborations')
        .update({ status: 'archived' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteCollaboration: async (id) => {
      const { error } = await databaseService.supabase
        .from('collaborations')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getContentService: () => ({
    getAllContent: async (filter, options) => {
      let query = databaseService.supabase.from('learning_content').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getContentById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('learning_content')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    archiveContent: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('learning_content')
        .update({ status: 'archived' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteContent: async (id) => {
      const { error } = await databaseService.supabase
        .from('learning_content')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getCorporateService: () => ({
    getAllCorporate: async (filter, options) => {
      let query = databaseService.supabase.from('corporate').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getCorporateById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('corporate')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    activateCorporate: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('corporate')
        .update({ status: 'active' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deactivateCorporate: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('corporate')
        .update({ status: 'inactive' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteCorporate: async (id) => {
      const { error } = await databaseService.supabase
        .from('corporate')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getEnterpriseService: () => ({
    getAllEnterprises: async (filter, options) => {
      let query = databaseService.supabase.from('enterprises').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getEnterpriseById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('enterprises')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    deleteEnterprise: async (id) => {
      const { error } = await databaseService.supabase
        .from('enterprises')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getFinancialModelService: () => ({
    getAllFinancialModels: async (filter, options) => {
      let query = databaseService.supabase.from('financial_model').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getFinancialModelById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('financial_model')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    finalizeFinancialModel: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('financial_model')
        .update({ model_status: 'finalized' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    archiveFinancialModel: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('financial_model')
        .update({ model_status: 'archived' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteFinancialModel: async (id) => {
      const { error } = await databaseService.supabase
        .from('financial_model')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getFundingService: () => ({
    getAllFunding: async (filter, options) => {
      let query = databaseService.supabase.from('funding').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getFundingById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('funding')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    fundFunding: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('funding')
        .update({ funding_stage: 'funded' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    closeFunding: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('funding')
        .update({ funding_stage: 'closed' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteFunding: async (id) => {
      const { error } = await databaseService.supabase
        .from('funding')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getHelpCenterService: () => ({
    getAllHelpCenter: async (filter, options) => {
      let query = databaseService.supabase.from('help_center').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getHelpCenterById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('help_center')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    publishHelpCenter: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('help_center')
        .update({ status: 'published' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    archiveHelpCenter: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('help_center')
        .update({ status: 'archived' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteHelpCenter: async (id) => {
      const { error } = await databaseService.supabase
        .from('help_center')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getLearningAssessmentService: () => ({
    getAllLearningAssessments: async (filter, options) => {
      let query = databaseService.supabase
        .from('learning_assessments')
        .select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getLearningAssessmentById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('learning_assessments')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    activateLearningAssessment: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('learning_assessments')
        .update({ status: 'active' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deactivateLearningAssessment: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('learning_assessments')
        .update({ status: 'inactive' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteLearningAssessment: async (id) => {
      const { error } = await databaseService.supabase
        .from('learning_assessments')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getLearningCategoryService: () => ({
    getAllLearningCategories: async (filter, options) => {
      let query = databaseService.supabase
        .from('learning_categories')
        .select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getLearningCategoryById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('learning_categories')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    deleteLearningCategory: async (id) => {
      const { error } = await databaseService.supabase
        .from('learning_categories')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getLearningContentService: () => ({
    getAllLearningContent: async (filter, options) => {
      let query = databaseService.supabase.from('learning_content').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getLearningContentById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('learning_content')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    deleteLearningContent: async (id) => {
      const { error } = await databaseService.supabase
        .from('learning_content')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getlegalService: () => ({
    getAlllegal: async (filter, options) => {
      let query = databaseService.supabase.from('legal').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getlegalById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('legal')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    approvelegal: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('legal')
        .update({ compliance_status: 'approved' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    executelegal: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('legal')
        .update({ compliance_status: 'executed' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deletelegal: async (id) => {
      const { error } = await databaseService.supabase
        .from('legal')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getMarketingService: () => ({
    getAllMarketing: async (filter, options) => {
      let query = databaseService.supabase.from('marketing').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getMarketingById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('marketing')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    activateMarketing: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('marketing')
        .update({ status: 'active' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    archiveMarketing: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('marketing')
        .update({ status: 'archived' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteMarketing: async (id) => {
      const { error } = await databaseService.supabase
        .from('marketing')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getMessageService: () => ({
    getAllMessages: async (filter, options) => {
      let query = databaseService.supabase.from('messages').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getMessageById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('messages')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    markAsReadMessage: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteMessage: async (id) => {
      const { error } = await databaseService.supabase
        .from('messages')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getPackageService: () => ({
    getAllPackages: async (filter, options) => {
      let query = databaseService.supabase.from('packages').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getPackageById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('packages')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    activatePackage: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('packages')
        .update({ status: 'active' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deactivatePackage: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('packages')
        .update({ status: 'inactive' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deletePackage: async (id) => {
      const { error } = await databaseService.supabase
        .from('packages')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getRewardService: () => ({
    getAllRewards: async (filter, options) => {
      let query = databaseService.supabase.from('rewards').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getRewardById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('rewards')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    activateReward: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('rewards')
        .update({ status: 'active' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deactivateReward: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('rewards')
        .update({ status: 'inactive' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteReward: async (id) => {
      const { error } = await databaseService.supabase
        .from('rewards')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getTeamService: () => ({
    getAllTeams: async (filter, options) => {
      let query = databaseService.supabase.from('team').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getTeamById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('team')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    activateTeam: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('team')
        .update({ status: 'active' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deactivateTeam: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('team')
        .update({ status: 'inactive' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteTeam: async (id) => {
      const { error } = await databaseService.supabase
        .from('team')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getValuationService: () => ({
    getAllValuations: async (filter, options) => {
      let query = databaseService.supabase.from('valuation').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getValuationById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('valuation')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    completeValuation: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('valuation')
        .update({ status: 'completed' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    archiveValuation: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('valuation')
        .update({ status: 'archived' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    deleteValuation: async (id) => {
      const { error } = await databaseService.supabase
        .from('valuation')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getVoteService: () => ({
    getAllVotes: async (filter, options) => {
      let query = databaseService.supabase.from('votes').select('*');
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    },

    getVoteById: async (id) => {
      const { data, error } = await databaseService.supabase
        .from('votes')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    deleteVote: async (id) => {
      const { error } = await databaseService.supabase
        .from('votes')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  }),
  getDashboardService: () => ({
    // Overview metrics
    getOverviewMetrics: async (user) => {
      // Mock data - in real implementation, this would query actual data based on user role
      const baseMetrics = {
        activeProjects: 12,
        projectGrowth: 8,
        totalIdeas: 45,
        ideaGrowth: 15,
        teamMembers: 8,
        teamGrowth: 2,
        fundingRaised: 250000,
        fundingGrowth: 25,
        growthRate: 18,
        growthChange: 3,
        successRate: 85,
        successRateChange: 5,
        activeUsers: 1250,
        userGrowth: 12,
        totalEnterprises: 8,
        enterpriseGrowth: 2,
        portfolioValue: 45,
        portfolioGrowth: 18,
        systemHealth: 98,
      };

      // Filter metrics based on user role
      switch (user.role) {
        case 'startup':
          return {
            activeProjects: baseMetrics.activeProjects,
            projectGrowth: baseMetrics.projectGrowth,
            totalIdeas: baseMetrics.totalIdeas,
            ideaGrowth: baseMetrics.ideaGrowth,
            teamMembers: baseMetrics.teamMembers,
            teamGrowth: baseMetrics.teamGrowth,
            fundingRaised: baseMetrics.fundingRaised,
            fundingGrowth: baseMetrics.fundingGrowth,
            growthRate: baseMetrics.growthRate,
            growthChange: baseMetrics.growthChange,
          };
        case 'enterprise':
          return {
            ...baseMetrics,
            successRate: baseMetrics.successRate,
            successRateChange: baseMetrics.successRateChange,
            activeUsers: baseMetrics.activeUsers,
            userGrowth: baseMetrics.userGrowth,
          };
        case 'corporate':
          return {
            ...baseMetrics,
            totalEnterprises: baseMetrics.totalEnterprises,
            enterpriseGrowth: baseMetrics.enterpriseGrowth,
            portfolioValue: baseMetrics.portfolioValue,
            portfolioGrowth: baseMetrics.portfolioGrowth,
          };
        case 'admin':
          return baseMetrics;
        default:
          return baseMetrics;
      }
    },

    // Recent activities
    getRecentActivities: async (user) => {
      // Mock data - in real implementation, this would query activity_logs table
      return [
        {
          id: 1,
          action: 'Project milestone completed',
          description: 'AI Integration Phase 1 completed successfully',
          created_at: '2 hours ago',
          status: 'success',
          activity_type: 'project',
          user: 'John Doe',
        },
        {
          id: 2,
          action: 'New team member added',
          description: 'Sarah Johnson joined the development team',
          created_at: '4 hours ago',
          status: 'success',
          activity_type: 'user',
          user: 'Mike Chen',
        },
        {
          id: 3,
          action: 'Funding round closed',
          description: 'Series A funding of $2.5M secured',
          created_at: '1 day ago',
          status: 'success',
          activity_type: 'funding',
          user: 'Emma Wilson',
        },
        {
          id: 4,
          action: 'System backup completed',
          description: 'Daily automated backup finished successfully',
          created_at: '1 day ago',
          status: 'success',
          activity_type: 'system',
          user: 'System',
        },
        {
          id: 5,
          action: 'Security alert resolved',
          description: 'Unusual login attempt from unknown IP blocked',
          created_at: '2 days ago',
          status: 'warning',
          activity_type: 'security',
          user: 'Security System',
        },
      ];
    },

    // Project stats
    getProjectStats: async (user) => {
      return {
        totalProjects: 15,
        activeProjects: 12,
        completedThisMonth: 3,
        averageScore: 8.2,
        projectGrowth: 8,
        completionGrowth: 15,
        scoreGrowth: 3,
      };
    },

    // Projects list
    getProjects: async (user) => {
      // Mock data based on user role
      const mockProjects = [
        {
          id: 1,
          name: 'AI-Powered Learning Platform',
          type: 'project',
          status: 'Active',
          progress: 75,
          organization: user.role === 'enterprise' ? 'TechStart Inc' : '',
          dueDate: 'Dec 15, 2024',
          score: 8.7,
          scoreType: 'Technical',
          team: [
            { name: 'John Doe', initials: 'JD' },
            { name: 'Sarah Smith', initials: 'SS' },
            { name: 'Mike Johnson', initials: 'MJ' },
          ],
          teamCount: 5,
        },
        {
          id: 2,
          name: 'Sustainable Energy Initiative',
          type: 'initiative',
          status: 'In Progress',
          progress: 45,
          organization: user.role === 'enterprise' ? 'GreenTech Solutions' : '',
          dueDate: 'Jan 28, 2025',
          score: 9.2,
          scoreType: 'Market',
          team: [
            { name: 'Emma Wilson', initials: 'EW' },
            { name: 'David Chen', initials: 'DC' },
          ],
          teamCount: 2,
        },
        {
          id: 3,
          name: 'Blockchain Integration',
          type: 'project',
          status: 'Under Review',
          progress: 90,
          organization: user.role === 'enterprise' ? 'LogiTech Systems' : '',
          dueDate: 'Nov 30, 2024',
          score: 7.8,
          scoreType: 'Technical',
          team: [
            { name: 'Lisa Park', initials: 'LP' },
            { name: 'Robert Chen', initials: 'RC' },
          ],
          teamCount: 3,
        },
      ];

      return mockProjects;
    },

    // Organizations list
    getOrganizations: async (user) => {
      if (user.role === 'enterprise') {
        return [
          { id: 1, name: 'TechStart Inc' },
          { id: 2, name: 'GreenTech Solutions' },
          { id: 3, name: 'LogiTech Systems' },
        ];
      } else if (user.role === 'corporate') {
        return [
          { id: 1, name: 'TechCorp Enterprises' },
          { id: 2, name: 'HealthCorp Enterprises' },
          { id: 3, name: 'FinCorp Enterprises' },
        ];
      }
      return [];
    },

    // Team stats
    getTeamStats: async (user) => {
      if (user.role === 'startup') {
        return {
          totalUsers: 8,
          activeUsers: 7,
          tasksCompleted: 156,
          taskCompletionRate: 85,
          teamProductivity: 92,
          communicationScore: 88,
          productivityScore: 78,
          satisfactionScore: 91,
          userGrowth: 2,
          taskGrowth: 24,
          activePercentage: 88,
        };
      } else {
        return {
          totalUsers: 1250,
          activeUsers: 1180,
          rolesAssigned: 45,
          uniqueRoles: 8,
          permissionChanges: 23,
          userGrowth: 12,
          permissionGrowth: 8,
          activePercentage: 94,
        };
      }
    },

    // Team members
    getTeamMembers: async (user) => {
      if (user.role === 'startup') {
        return [
          {
            id: 1,
            name: 'John Doe',
            email: 'john@startup.com',
            role: 'Founder',
            projects: 5,
            tasks: 23,
            status: 'Active',
            lastLogin: '2 hours ago',
          },
          {
            id: 2,
            name: 'Sarah Smith',
            email: 'sarah@startup.com',
            role: 'Designer',
            projects: 3,
            tasks: 18,
            status: 'Active',
            lastLogin: '1 day ago',
          },
          {
            id: 3,
            name: 'Mike Johnson',
            email: 'mike@startup.com',
            role: 'Developer',
            projects: 4,
            tasks: 31,
            status: 'Active',
            lastLogin: '30 min ago',
          },
        ];
      } else {
        return [
          {
            id: 1,
            name: 'John Smith',
            email: 'john@enterprise.com',
            role: 'Enterprise Admin',
            status: 'Active',
            lastLogin: '2 hours ago',
            access: [{ name: 'All Startups', initials: 'ALL' }],
            accessCount: 1,
            permissions: ['Full Access', 'Admin'],
          },
          {
            id: 2,
            name: 'Jane Doe',
            email: 'jane@enterprise.com',
            role: 'Startup Manager',
            status: 'Active',
            lastLogin: '1 day ago',
            access: [
              { name: 'TechStart Inc', initials: 'TS' },
              { name: 'GreenTech Solutions', initials: 'GS' },
            ],
            accessCount: 4,
            permissions: ['Read', 'Write', 'Manage'],
          },
        ];
      }
    },

    // Analytics data
    getAnalytics: async (user) => {
      const baseAnalytics = {
        // Metrics based on role
        activeOrganizations:
          user.role === 'enterprise' ? 6 : user.role === 'corporate' ? 8 : 1,
        averageScore: 8.5,
        totalUsers: user.role === 'startup' ? 8 : 1250,
        averageCycleTime: 14,
        organizationGrowth: 8,
        scoreGrowth: 3,
        userGrowth: 12,
        cycleTimeChange: -2,

        // Financial data for enterprise+
        totalBudget: 2500000,
        budgetAllocated: 1800000,
        budgetAvailable: 700000,
        averageROI: 185,

        // AI insights
        aiInsights: [
          {
            title: 'Project Completion Trend',
            description:
              'Your project completion rate has improved by 15% this month. Consider maintaining current team size.',
            type: 'trending-up',
            category: 'Performance',
            impact: 'High',
          },
          {
            title: 'Resource Optimization',
            description:
              'AI suggests reallocating 20% of development resources to marketing for better ROI.',
            type: 'cpu',
            category: 'Optimization',
            impact: 'Medium',
          },
          {
            title: 'Team Collaboration',
            description:
              'Communication patterns indicate strong team cohesion. Continue current collaboration practices.',
            type: 'users',
            category: 'Culture',
            impact: 'Positive',
          },
        ],

        // Portfolio data for corporate
        portfolioMetrics:
          user.role === 'corporate'
            ? [
                {
                  name: 'TechCorp Ventures',
                  performance: 125,
                  roi: 180,
                  value: 25,
                  status: 'Excellent',
                },
                {
                  name: 'HealthTech Investments',
                  performance: 95,
                  roi: 145,
                  value: 18,
                  status: 'Good',
                },
                {
                  name: 'FinTech Portfolio',
                  performance: 78,
                  roi: 120,
                  value: 12,
                  status: 'Average',
                },
              ]
            : [],

        // Chart data
        chartMetric:
          user.role === 'startup'
            ? 'Project Progress'
            : 'Organization Performance',
      };

      return baseAnalytics;
    },

    // System health
    getSystemHealth: async (user) => {
      if (['enterprise', 'corporate', 'admin'].includes(user.role)) {
        return {
          overall: 98,
          activeUsers: 1180,
          userGrowth: 5,
          avgResponseTime: 45,
          responseTimeChange: -5,
          securityAlerts: 2,
          alertChange: -3,
        };
      }
      return null;
    },

    // Alerts
    getAlerts: async (user) => {
      if (['enterprise', 'corporate', 'admin'].includes(user.role)) {
        return [
          {
            title: 'High CPU Usage',
            description:
              'Server CPU usage has exceeded 85% for the last 30 minutes.',
            severity: 'warning',
            timeAgo: '15 min ago',
            icon: 'cpu',
          },
          {
            title: 'Security Alert',
            description:
              'Multiple failed login attempts detected from IP 192.168.1.100.',
            severity: 'critical',
            timeAgo: '1 hour ago',
            icon: 'shield-alert',
          },
        ];
      }
      return [];
    },

    // Activity groups
    getActivityGroups: async (user) => {
      return [
        {
          date: 'Today',
          isToday: true,
          activities: [
            {
              id: 1,
              user: 'John Doe',
              action: 'Created new project',
              description: 'AI-Powered Learning Platform project initialized',
              time: '2 hours ago',
              status: 'success',
              icon: 'plus',
              activity_type: 'project',
            },
            {
              id: 2,
              user: 'Sarah Smith',
              action: 'Completed milestone',
              description:
                'Market research phase finished for Sustainable Energy project',
              time: '4 hours ago',
              status: 'success',
              icon: 'check-circle',
              activity_type: 'milestone',
            },
          ],
        },
        {
          date: 'Yesterday',
          activities: [
            {
              id: 3,
              user: 'Mike Johnson',
              action: 'Updated team permissions',
              description: 'Granted admin access to development team',
              time: '1 day ago',
              status: 'warning',
              icon: 'settings',
              activity_type: 'security',
              metadata: [
                { key: 'Permission', value: 'Admin' },
                { key: 'Team', value: 'Development' },
              ],
            },
          ],
        },
      ];
    },

    // Audit trail (admin only)
    getAuditTrail: async () => {
      return [
        {
          timestamp: '2024-12-03 14:30:25',
          user: 'System Admin',
          action: 'USER_LOGIN',
          resource: 'Authentication',
          ipAddress: '192.168.1.1',
          status: 'success',
          userInitials: 'SA',
        },
        {
          timestamp: '2024-12-03 14:25:10',
          user: 'John Smith',
          action: 'PERMISSION_CHANGE',
          resource: 'User Management',
          ipAddress: '192.168.1.100',
          status: 'success',
          userInitials: 'JS',
        },
      ];
    },
  }),
};
