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

    res.render('admin/other-pages/system-logs', {
      title: 'System Logs',
      currentPage: 'system-logs',
      currentSection: 'system',
      logs: paginatedLogs,
      totalLogs,
      currentPage: parseInt(page),
      totalPages: Math.ceil(logs.length / limit),
      filters: { level, date, search },
      availableDates,
      hasLogs: logs.length > 0,
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
