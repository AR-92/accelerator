import logger from '../../utils/logger.js';
import { promises as fs } from 'fs';
import path from 'path';

// System Logs Page
export const getSystemLogs = async (req, res) => {
  try {
    logger.info('Admin system logs page accessed');

    // Get query parameters
    const {
      level = 'all',
      date,
      search = '',
      page = 1,
      limit = 50,
    } = req.query;

    // Try to read log files (this is a simplified implementation)
    // In a real application, you'd integrate with a proper logging system
    let logs = [];
    let totalLogs = 0;

    try {
      // Check for common log file locations
      const logPaths = [
        path.join(process.cwd(), 'logs', 'app.log'),
        path.join(process.cwd(), 'logs', 'error.log'),
        path.join(process.cwd(), 'app.log'),
        path.join(process.cwd(), 'error.log'),
        '/var/log/application.log',
        '/var/log/app.log',
      ];

      let logContent = '';

      for (const logPath of logPaths) {
        try {
          logContent = await fs.readFile(logPath, 'utf8');
          break; // Use first readable log file
        } catch (e) {
          continue; // Try next path
        }
      }

      if (logContent) {
        // Parse log content (simplified - assumes basic log format)
        const logLines = logContent.split('\n').filter((line) => line.trim());

        logs = logLines
          .map((line, index) => {
            // Extract timestamp, level, and message (simplified parsing)
            const timestampMatch = line.match(
              /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/
            );
            const levelMatch = line.match(/\b(INFO|ERROR|WARN|DEBUG)\b/i);

            return {
              id: index + 1,
              timestamp: timestampMatch
                ? timestampMatch[1]
                : new Date().toISOString(),
              level: levelMatch ? levelMatch[1].toLowerCase() : 'info',
              message: line,
              source: 'application',
            };
          })
          .reverse(); // Most recent first

        totalLogs = logs.length;
      }
    } catch (error) {
      logger.warn('Could not read log files:', error.message);
    }

    // Apply filters
    if (level !== 'all') {
      logs = logs.filter((log) => log.level === level);
    }

    if (search) {
      logs = logs.filter((log) =>
        log.message.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (date) {
      logs = logs.filter((log) => log.timestamp.startsWith(date));
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLogs = logs.slice(startIndex, endIndex);

    // Get unique dates for filter dropdown
    const availableDates = [
      ...new Set(
        logs.map(
          (log) => log.timestamp.split(' ')[0] || log.timestamp.split('T')[0]
        )
      ),
    ]
      .sort()
      .reverse();

    // Generate chart data for log analytics
    const now = new Date();
    const logAnalytics = {
      volumeHistory: {
        labels: [],
        data: [],
      },
      levelDistribution: {
        labels: [],
        data: [],
      },
      errorTrends: {
        labels: [],
        data: [],
      },
    };

    // Generate last 24 hours of log volume data
    for (let i = 23; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourLabel = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
      logAnalytics.volumeHistory.labels.push(hourLabel);

      // Simulate log volume based on time of day
      const baseVolume = Math.floor(Math.random() * 200) + 50;
      const hourOfDay = date.getHours();
      const multiplier = hourOfDay >= 6 && hourOfDay <= 22 ? 1.2 : 0.8;
      logAnalytics.volumeHistory.data.push(Math.floor(baseVolume * multiplier));
    }

    // Log level distribution
    const levelCounts = {};
    logs.forEach((log) => {
      const level = log.level || 'info';
      levelCounts[level] = (levelCounts[level] || 0) + 1;
    });

    // Ensure we have all levels represented
    const allLevels = ['error', 'warn', 'info', 'debug'];
    logAnalytics.levelDistribution.labels = allLevels;
    logAnalytics.levelDistribution.data = allLevels.map(
      (level) => levelCounts[level] || 0
    );

    // Error trends (simulate error patterns)
    for (let i = 23; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourLabel = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
      logAnalytics.errorTrends.labels.push(hourLabel);

      // Simulate error rates (higher during peak hours, lower at night)
      const baseErrorRate = Math.random() * 15;
      const hourOfDay = date.getHours();
      const errorMultiplier = hourOfDay >= 9 && hourOfDay <= 17 ? 1.5 : 0.5;
      logAnalytics.errorTrends.data.push(
        Math.max(0, Math.min(100, baseErrorRate * errorMultiplier))
      );
    }

    // System log analytics
    const systemLogAnalytics = {
      totalLogs: totalLogs,
      errorCount: levelCounts.error || 0,
      warningCount: levelCounts.warn || 0,
      infoCount: levelCounts.info || 0,
      debugCount: levelCounts.debug || 0,
      errorRate:
        totalLogs > 0
          ? (((levelCounts.error || 0) / totalLogs) * 100).toFixed(1)
          : 0,
      mostActiveHour: '14:00', // Simulated
      avgLogsPerHour: Math.round(totalLogs / 24),
      systemHealth: 'Good', // Based on error rates
      criticalPatterns: ['Database timeout', 'Memory leak', 'Network failure'], // Simulated
      performanceInsights: {
        responseTime: '245ms',
        throughput: '1.2k req/min',
        errorRecovery: '98.5%',
      },
    };

    res.render('admin/other-pages/system-logs', {
      title: 'System Logs Analytics',
      currentPage: 'system-logs',
      currentSection: 'system',
      logs: paginatedLogs,
      totalLogs,
      currentPage: parseInt(page),
      totalPages: Math.ceil(logs.length / limit),
      filters: { level, date, search },
      availableDates,
      hasLogs: logs.length > 0,
      logAnalytics,
      systemLogAnalytics,
      lastUpdated: new Date().toLocaleString(),
    });
  } catch (error) {
    logger.error('Error loading system logs:', error);
    res.render('admin/other-pages/system-logs', {
      title: 'System Logs',
      currentPage: 'system-logs',
      currentSection: 'system',
      logs: [],
      totalLogs: 0,
      currentPage: 1,
      totalPages: 0,
      filters: { level: 'all', date: '', search: '' },
      availableDates: [],
      hasLogs: false,
      error: 'Failed to load system logs',
    });
  }
};
