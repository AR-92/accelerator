/**
 * System monitoring service handling dashboard stats and system health
 */
class SystemMonitoringService {
  constructor(
    userRepository,
    helpService,
    learningService,
    adminActivityRepository,
    startupService,
    enterpriseService,
    corporateService,
    packageRepository,
    billingRepository,
    rewardRepository
  ) {
    this.userRepository = userRepository;
    this.helpService = helpService;
    this.learningService = learningService;
    this.adminActivityRepository = adminActivityRepository;
    this.startupService = startupService;
    this.enterpriseService = enterpriseService;
    this.corporateService = corporateService;
    this.packageRepository = packageRepository;
    this.billingRepository = billingRepository;
    this.rewardRepository = rewardRepository;
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
   * Get admin dashboard statistics
   * @returns {Promise<Object>} Dashboard stats
   */
  async getDashboardStats() {
    try {
      // Get user statistics
      const totalUsers = await this.userRepository.count();
      const usersByRoleRaw = await this.userRepository.countByRole();
      const recentUsers = await this.userRepository.findRecent(7); // Last 7 days

      // Define all possible roles and ensure they all appear in the data
      const allRoles = ['admin', 'corporate', 'enterprise', 'startup'];

      // Convert usersByRole object to array format for template, including roles with 0 users
      const usersByRole = allRoles.map((role) => ({
        role,
        count: parseInt(usersByRoleRaw[role] || 0),
      }));

      // Get content statistics
      const helpStats = await this.helpService.getHelpStats();
      const learningStats = await this.learningService.getLearningStats();

      // Get startup statistics
      const startupStats = await this.startupService.getStartupsFiltered({});
      const startupCountByStatus = await this.startupService.countByStatus();

      // Get enterprise statistics
      const enterpriseStats =
        await this.enterpriseService.getEnterprisesFiltered({});
      const enterpriseCountByStatus =
        await this.enterpriseService.countByStatus();

      // Get corporate statistics
      const corporateStats = await this.corporateService.getCorporatesFiltered(
        {}
      );
      const corporateCountByStatus =
        await this.corporateService.countByStatus();

      // Get collaboration statistics
      const collaborationStats = await this.getCollaborationStats();

      // Calculate credit statistics
      const totalCredits = await this.userRepository.getTotalCredits();

      // Get package statistics
      const packageStats = await this.packageRepository.getStats();

      // Get billing statistics
      const billingStats = await this.billingRepository.getStats();

      // Get reward statistics
      const rewardStats = await this.rewardRepository.getStats();

      // Get recent activity (last 10 actions)
      const recentActivity = await this.getRecentActivity(10);

      // Get system health metrics
      const systemStats = await this.getSystemStats();

      return {
        users: {
          total: totalUsers,
          byRole: usersByRole,
          recent: recentUsers.length,
          recentUsers: recentUsers.slice(0, 5), // Last 5 new users
        },
        content: {
          help: {
            total: helpStats.totalArticles || 0,
            published: helpStats.totalArticles || 0, // All returned stats are for published articles
            draft: 0, // We'll need to modify the query to get draft count
          },
          learning: {
            total: learningStats.totalArticles || 0,
            published: learningStats.totalArticles || 0,
            draft: 0,
          },
        },
        startups: {
          total: startupStats.total || 0,
          byStatus: Object.entries(startupCountByStatus).map(
            ([status, count]) => ({
              status,
              count: parseInt(count),
            })
          ),
        },
        enterprises: {
          total: enterpriseStats.total || 0,
          byStatus: Object.entries(enterpriseCountByStatus).map(
            ([status, count]) => ({
              status,
              count: parseInt(count),
            })
          ),
        },
        corporates: {
          total: corporateStats.total || 0,
          byStatus: Object.entries(corporateCountByStatus).map(
            ([status, count]) => ({
              status,
              count: parseInt(count),
            })
          ),
        },
        credits: {
          total: totalCredits,
        },
        packages: {
          total: packageStats.total || 0,
          active: packageStats.active || 0,
          avgPrice: packageStats.avg_price || 0,
          avgCredits: packageStats.avg_credits || 0,
        },
        billing: {
          totalTransactions: billingStats.total_transactions || 0,
          totalRevenue: billingStats.total_revenue || 0,
          totalRefunds: billingStats.total_refunds || 0,
          avgTransaction: billingStats.avg_transaction || 0,
          uniqueCustomers: billingStats.unique_customers || 0,
          pendingTransactions: billingStats.pending_transactions || 0,
        },
        rewards: {
          totalRewards: rewardStats.total_rewards || 0,
          activeRewards: rewardStats.active_rewards || 0,
          totalCreditsGranted: rewardStats.total_credits_granted || 0,
          uniqueUsersRewarded: rewardStats.unique_users_rewarded || 0,
        },
        collaborations: collaborationStats,
        activity: recentActivity,
        system: systemStats,
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      // Return default stats on error for better error handling
      return {
        users: {
          total: 0,
          byRole: [
            { role: 'admin', count: 0 },
            { role: 'corporate', count: 0 },
            { role: 'enterprise', count: 0 },
            { role: 'startup', count: 0 },
          ],
          recent: 0,
          recentUsers: [],
        },
        content: {
          help: { total: 0, published: 0, draft: 0 },
          learning: { total: 0, published: 0, draft: 0 },
        },
        startups: {
          total: 0,
          byStatus: [
            { status: 'active', count: 0 },
            { status: 'inactive', count: 0 },
            { status: 'acquired', count: 0 },
            { status: 'failed', count: 0 },
          ],
        },
        credits: { total: 0 },
        activity: [],
        system: { uptime: 0, memory: { used: 0, total: 0 } },
      };
    }
  }

  /**
   * Get comprehensive system health statistics (Bashtop-style)
   * @returns {Promise<Object>} System stats
   */
  async getSystemStats() {
    try {
      const si = require('systeminformation');
      const os = require('os');

      // Get all data in parallel for better performance
      const [
        systemInfo,
        osInfo,
        cpuData,
        memoryData,
        diskData,
        networkData,
        processesData,
        loadData,
        tempData,
        batteryData,
        networkStats,
        diskIO,
      ] = await Promise.all([
        si.system(),
        si.osInfo(),
        si.cpu(),
        si.mem(),
        si.fsSize(),
        si.networkInterfaces(),
        si.processes(),
        si.currentLoad(),
        si.cpuTemperature(),
        si.battery(),
        si.networkStats(),
        si.disksIO(),
      ]);

      const uptime = os.uptime();
      const processMemory = process.memoryUsage();

      // CPU Information
      const cpu = {
        usage: Math.round(loadData.currentLoad || 0),
        cores: cpuData.cores || 1,
        model: cpuData.brand || 'Unknown',
        speed: Math.round(cpuData.speed || 0),
        frequency: Math.round(cpuData.speed || 0),
        temperature: Math.round(tempData.main || 0),
        cores: Array.from({ length: cpuData.cores || 1 }, (_, i) => ({
          id: i,
          usage: Math.round(loadData.cpus[i]?.load || 0),
        })),
      };

      // Memory Information
      const memory = {
        used: Math.round(processMemory.heapUsed / 1024 / 1024), // MB
        total: Math.round(processMemory.heapTotal / 1024 / 1024), // MB
        systemUsed: Math.round(memoryData.used / 1024 / 1024), // MB
        systemTotal: Math.round(memoryData.total / 1024 / 1024), // MB
        systemFree: Math.round(memoryData.free / 1024 / 1024), // MB
        swapUsed: Math.round(memoryData.swapused / 1024 / 1024), // MB
        swapTotal: Math.round(memoryData.swaptotal / 1024 / 1024), // MB
        swapFree: Math.round(memoryData.swapfree / 1024 / 1024), // MB
        shared: Math.round(
          (memoryData.buffers + memoryData.cached) / 1024 / 1024
        ), // MB
        buffers: Math.round(memoryData.buffers / 1024 / 1024), // MB
        cached: Math.round(memoryData.cached / 1024 / 1024), // MB
      };

      // Disk Information
      const disk = {
        total: Math.round(
          diskData.reduce((acc, d) => acc + d.size, 0) / 1024 / 1024 / 1024
        ), // GB
        used: Math.round(
          diskData.reduce((acc, d) => acc + d.used, 0) / 1024 / 1024 / 1024
        ), // GB
        free: Math.round(
          diskData.reduce((acc, d) => acc + d.available, 0) / 1024 / 1024 / 1024
        ), // GB
        devices: diskData.map((d) => ({
          name: d.fs,
          mount: d.mount,
          total: Math.round(d.size / 1024 / 1024 / 1024),
          used: Math.round(d.used / 1024 / 1024 / 1024),
          free: Math.round(d.available / 1024 / 1024 / 1024),
          usage: Math.round(d.use),
        })),
        io: Array.isArray(diskIO)
          ? diskIO.map((d) => ({
              name: d.device || 'unknown',
              read: this.formatBytes(d.read || 0) + '/s',
              write: this.formatBytes(d.write || 0) + '/s',
              io: d.tIO || 0,
              utilization: Math.round(d.tIO_ms || 0),
            }))
          : [
              {
                name: 'system',
                read: this.formatBytes(diskIO.rIO_sec || 0) + '/s',
                write: this.formatBytes(diskIO.wIO_sec || 0) + '/s',
                io: diskIO.tIO || 0,
                utilization: Math.round(diskIO.tIO_ms || 0),
              },
            ],
      };

      // Network Information
      const network = {
        interfaces: networkData
          .filter((iface) => !iface.internal)
          .map((iface) => ({
            name: iface.iface,
            addresses: [`${iface.ip4 || 'N/A'}`, iface.ip6 || ''].filter(
              Boolean
            ),
            mac: iface.mac,
            type: iface.type,
          })),
        stats: networkStats.map((stat) => ({
          iface: stat.iface,
          download: {
            speed: this.formatBytes(stat.rx_sec || 0) + '/s',
            total: this.formatBytes(stat.rx_bytes || 0),
          },
          upload: {
            speed: this.formatBytes(stat.tx_sec || 0) + '/s',
            total: this.formatBytes(stat.tx_bytes || 0),
          },
        })),
      };

      // Process Information (Top 20 by CPU usage)
      const processes = processesData.list
        .sort((a, b) => (b.cpu || 0) - (a.cpu || 0))
        .slice(0, 20)
        .map((proc) => ({
          pid: proc.pid,
          name: proc.name || 'unknown',
          command: (proc.command || '').substring(0, 50),
          cpu: Math.round(proc.cpu || 0),
          memory: Math.round(proc.pmem || 0),
          memoryMB: Math.round((proc.memRss || 0) / 1024 / 1024),
          user: proc.user || 'unknown',
          state: proc.state || 'unknown',
        }));

      // Temperature Information
      const temperatures = [];
      if (tempData.main !== null)
        temperatures.push({ name: 'CPU', value: Math.round(tempData.main) });
      if (tempData.cores && tempData.cores.length > 0) {
        tempData.cores.forEach((core, i) => {
          if (core !== null)
            temperatures.push({ name: `Core ${i}`, value: Math.round(core) });
        });
      }

      // Battery Information
      const battery = batteryData.hasBattery
        ? {
            level: Math.min(
              100,
              Math.max(0, Math.round(batteryData.percent || 0))
            ),
            status: batteryData.isCharging ? 'Charging' : 'Discharging',
            timeRemaining: batteryData.timeRemaining
              ? this.formatTime(Math.floor(batteryData.timeRemaining / 60))
              : null,
            voltage: Math.round(batteryData.voltage || 0),
            temperature: Math.round(batteryData.temperature || 0),
          }
        : null;

      // Generate ASCII graphs
      const cpuGraph = this.generateAsciiGraph([cpu.usage], 20, 1);

      const memoryGraph = this.generateAsciiGraph(
        [(memory.systemUsed / memory.systemTotal) * 100],
        20,
        1
      );

      const networkGraph = this.generateAsciiGraph(
        [
          networkStats.reduce((acc, stat) => acc + (stat.rx_sec || 0), 0) /
            1024 /
            1024, // MB/s
          networkStats.reduce((acc, stat) => acc + (stat.tx_sec || 0), 0) /
            1024 /
            1024, // MB/s
        ],
        20,
        2
      );

      return {
        timestamp: new Date().toISOString(),
        uptime: Math.floor(uptime),
        uptimeFormatted: this.formatUptime(uptime),
        cpu,
        memory,
        disk,
        network,
        processes,
        temperatures,
        battery,
        loadAverage: loadData.loadavg
          ? loadData.loadavg.map(Math.round)
          : [0, 0, 0],
        system: {
          platform: systemInfo.platform || os.platform(),
          arch: systemInfo.arch || os.arch(),
          hostname: os.hostname(),
          kernel: osInfo.kernel || 'unknown',
          distro: osInfo.distro || 'unknown',
          nodeVersion: process.version,
          pid: process.pid,
          model: systemInfo.model || 'unknown',
          manufacturer: systemInfo.manufacturer || 'unknown',
        },
        graphs: {
          cpu: cpuGraph,
          memory: memoryGraph,
          network: networkGraph,
        },
      };
    } catch (error) {
      console.error('Error getting comprehensive system stats:', error);
      return this.getFallbackStats();
    }
  }

  /**
   * Generate ASCII-style graph for visualization
   * @param {Array<number>} data - Data points
   * @param {number} width - Graph width
   * @param {number} height - Graph height
   * @returns {string} ASCII graph
   */
  generateAsciiGraph(data, width = 20, height = 3) {
    if (!data || data.length === 0) return 'No data';

    if (height === 1) {
      // Horizontal bar for single value
      const value = data[0] || 0;
      const filled = Math.round((value / 100) * width);
      return '█'.repeat(filled) + '░'.repeat(width - filled);
    }

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    let graph = '';
    for (let y = height - 1; y >= 0; y--) {
      for (let x = 0; x < width; x++) {
        const dataIndex = Math.floor((x / width) * data.length);
        const value = data[dataIndex] || 0;
        const normalized = (value - min) / range;
        const threshold = (height - 1 - y) / height;

        graph += normalized >= threshold ? '█' : '░';
      }
      graph += '\n';
    }
    return graph.trim();
  }

  /**
   * Format bytes to human readable format
   * @param {number} bytes - Bytes to format
   * @returns {string} Formatted string
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  /**
   * Format time in minutes to human readable format
   * @param {number} minutes - Minutes to format
   * @returns {string} Formatted time
   */
  formatTime(minutes) {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  /**
   * Get fallback stats when system monitoring fails
   * @returns {Object} Basic fallback stats
   */
  getFallbackStats() {
    const os = require('os');
    const uptime = os.uptime();

    return {
      timestamp: new Date().toISOString(),
      uptime: Math.floor(uptime),
      uptimeFormatted: this.formatUptime(uptime),
      cpu: {
        usage: 0,
        cores: os.cpus().length,
        model: 'Unknown',
        speed: 0,
        frequency: 0,
        temperature: 0,
        cores: [],
      },
      memory: {
        used: 0,
        total: 0,
        systemUsed: 0,
        systemTotal: Math.round(os.totalmem() / 1024 / 1024),
        systemFree: Math.round(os.freemem() / 1024 / 1024),
        swapUsed: 0,
        swapTotal: 0,
        swapFree: 0,
        shared: 0,
        buffers: 0,
        cached: 0,
      },
      disk: {
        total: 0,
        used: 0,
        free: 0,
        devices: [],
        io: [],
      },
      network: {
        interfaces: [],
        stats: [],
      },
      processes: [],
      temperatures: [],
      battery: null,
      loadAverage: [0, 0, 0],
      system: {
        platform: os.platform(),
        arch: os.arch(),
        hostname: os.hostname(),
        kernel: 'unknown',
        distro: 'unknown',
        nodeVersion: process.version,
        pid: process.pid,
        model: 'unknown',
        manufacturer: 'unknown',
      },
      graphs: {
        cpu: 'No data',
        memory: 'No data',
        network: 'No data',
      },
    };
  }

  /**
   * Format uptime seconds into human readable string
   * @param {number} seconds - Uptime in seconds
   * @returns {string} Formatted uptime
   */
  formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

    return parts.join(' ');
  }

  /**
   * Get recent admin activity
   * @param {number} limit - Number of activities to return
   * @returns {Promise<Array>} Recent activities
   */
  async getRecentActivity(limit = 10) {
    try {
      return await this.adminActivityRepository.getRecent(limit);
    } catch (error) {
      console.error('Error getting recent activity:', error);
      return [];
    }
  }

  /**
   * Get collaboration statistics
   * @returns {Promise<Object>} Collaboration stats
   */
  async getCollaborationStats() {
    try {
      // This would typically aggregate data from projects, teams, etc.
      // For now, return basic stats
      return {
        totalProjects: 0,
        activeProjects: 0,
        totalTeams: 0,
        totalTeamMembers: 0,
      };
    } catch (error) {
      console.error('Error getting collaboration stats:', error);
      return {
        totalProjects: 0,
        activeProjects: 0,
        totalTeams: 0,
        totalTeamMembers: 0,
      };
    }
  }
}

module.exports = SystemMonitoringService;
