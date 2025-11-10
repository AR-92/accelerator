/**
 * Admin service handling admin-specific business logic
 */
class AdminService {
  constructor(
    userRepository,
    helpService,
    learningService,
    adminActivityRepository,
    startupService,
    enterpriseService,
    corporateService,
    projectRepository,
    teamRepository,
    ideaService,
    ideaRepository,
    landingPageService,
    packageRepository,
    billingRepository,
    rewardRepository,
    voteRepository
  ) {
    this.userRepository = userRepository;
    this.helpService = helpService;
    this.learningService = learningService;
    this.adminActivityRepository = adminActivityRepository;
    this.startupService = startupService;
    this.enterpriseService = enterpriseService;
    this.corporateService = corporateService;
    this.projectRepository = projectRepository;
    this.teamRepository = teamRepository;
    this.ideaService = ideaService;
    this.ideaRepository = ideaRepository;
    this.landingPageService = landingPageService;
    this.packageRepository = packageRepository;
    this.billingRepository = billingRepository;
    this.rewardRepository = rewardRepository;
    this.voteRepository = voteRepository;
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
        const ValidationError = require('../utils/errors/ValidationError');
        throw new ValidationError('User creation failed', [
          'Email already registered',
        ]);
      }

      const user = new (require('../models/User'))(userData);
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
        const NotFoundError = require('../utils/errors/NotFoundError');
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
        const NotFoundError = require('../utils/errors/NotFoundError');
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
        const NotFoundError = require('../utils/errors/NotFoundError');
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
        const NotFoundError = require('../utils/errors/NotFoundError');
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
        const NotFoundError = require('../utils/errors/NotFoundError');
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
        const NotFoundError = require('../utils/errors/NotFoundError');
        throw new NotFoundError('User not found');
      }

      // Prevent banning admin users
      if (banned && user.role === 'admin') {
        const ValidationError = require('../utils/errors/ValidationError');
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
        const NotFoundError = require('../utils/errors/NotFoundError');
        throw new NotFoundError('User not found');
      }

      // Prevent deleting admin users
      if (user.role === 'admin') {
        const ValidationError = require('../utils/errors/ValidationError');
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
   * Get help content for admin management
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Help content data with pagination
   */
  async getHelpContent(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = (page - 1) * limit;

      const [articles, totalCount, categories] = await Promise.all([
        this.helpService.getArticles({
          limit,
          offset,
          category: options.category,
          search: options.search,
        }),
        this.helpService.countArticles({
          category: options.category,
          search: options.search,
        }),
        this.helpService.getCategories(),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        articles,
        categories,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: totalPages,
        },
      };
    } catch (error) {
      console.error('Error getting help content:', error);
      throw error;
    }
  }

  /**
   * Get learning content for admin management
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Learning content data with pagination
   */
  async getLearningContent(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = (page - 1) * limit;

      const [articles, totalCount, categories] = await Promise.all([
        this.learningService.getArticles({
          limit,
          offset,
          category: options.category,
          search: options.search,
        }),
        this.learningService.countArticles({
          category: options.category,
          search: options.search,
        }),
        this.learningService.getCategories(),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        articles,
        categories,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: totalPages,
        },
      };
    } catch (error) {
      console.error('Error getting learning content:', error);
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
        const NotFoundError = require('../utils/errors/NotFoundError');
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
   * Get startups with pagination and filtering for admin
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Startups data with pagination
   */
  async getStartups(options = {}) {
    try {
      const result = await this.startupService.getStartupsFiltered(options);

      return {
        startups: result.startups.map((startup) => ({
          id: startup.id,
          name: startup.name,
          industry: startup.industry,
          status: startup.status,
          website: startup.website,
          foundedDate: startup.foundedDate,
          description: startup.description,
          userId: startup.userId,
          createdAt: startup.createdAt,
          updatedAt: startup.updatedAt,
        })),
        pagination: {
          page: Math.floor(options.offset / options.limit) + 1 || 1,
          limit: options.limit || 20,
          total: result.total,
          pages: Math.ceil(result.total / (options.limit || 20)),
        },
      };
    } catch (error) {
      console.error('Error getting startups:', error);
      throw error;
    }
  }

  /**
   * Get startup by ID for admin
   * @param {number} startupId - Startup ID
   * @returns {Promise<Object>} Startup data
   */
  async getStartupById(startupId) {
    try {
      const startup = await this.startupService.getStartupById(startupId);
      return startup;
    } catch (error) {
      console.error('Error getting startup by ID:', error);
      throw error;
    }
  }

  /**
   * Create a new startup
   * @param {Object} startupData - Startup data
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<Object>} Created startup data
   */
  async createStartup(startupData, adminInfo) {
    try {
      const startup = await this.startupService.createStartup(
        startupData.userId,
        startupData
      );

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo.id,
        adminEmail: adminInfo.email,
        action: 'CREATE_STARTUP',
        targetType: 'startup',
        targetId: startup.id,
        details: { name: startup.name, industry: startup.industry },
        ip: adminInfo.ip,
      });

      return startup;
    } catch (error) {
      console.error('Error creating startup:', error);
      throw error;
    }
  }

  /**
   * Update a startup
   * @param {number} startupId - Startup ID
   * @param {Object} startupData - Updated startup data
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<Object>} Updated startup data
   */
  async updateStartup(startupId, startupData, adminInfo) {
    try {
      const startup = await this.startupService.updateStartup(
        startupId,
        startupData.userId || 0, // Admin can update any startup
        startupData
      );

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo.id,
        adminEmail: adminInfo.email,
        action: 'UPDATE_STARTUP',
        targetType: 'startup',
        targetId: startupId,
        details: { name: startup.name, industry: startup.industry },
        ip: adminInfo.ip,
      });

      return startup;
    } catch (error) {
      console.error('Error updating startup:', error);
      throw error;
    }
  }

  /**
   * Delete a startup
   * @param {number} startupId - Startup ID
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<boolean>} Success status
   */
  async deleteStartup(startupId, adminInfo) {
    try {
      // Check if startup exists first
      const startup = await this.startupService.getStartupById(startupId);

      const success = await this.startupService.deleteStartup(
        startupId,
        startup.userId // Use the actual owner ID
      );

      if (success) {
        // Log admin action
        this.logAdminAction({
          adminId: adminInfo.id,
          adminEmail: adminInfo.email,
          action: 'DELETE_STARTUP',
          targetType: 'startup',
          targetId: startupId,
          details: {
            deletedStartupName: startup.name,
            deletedStartupIndustry: startup.industry,
          },
          ip: adminInfo.ip,
        });
      }

      return success;
    } catch (error) {
      console.error('Error deleting startup:', error);
      throw error;
    }
  }

  /**
   * Get enterprises for admin with filtering and pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Enterprises with pagination info
   */
  async getEnterprises(options = {}) {
    try {
      const result =
        await this.enterpriseService.getEnterprisesFiltered(options);

      return {
        enterprises: result.enterprises,
        pagination: {
          page: Math.floor(options.offset / options.limit) + 1 || 1,
          limit: options.limit || 20,
          total: result.total,
          pages: Math.ceil(result.total / (options.limit || 20)),
        },
      };
    } catch (error) {
      console.error('Error getting enterprises:', error);
      throw error;
    }
  }

  /**
   * Get enterprise by ID for admin
   * @param {number} enterpriseId - Enterprise ID
   * @returns {Promise<Object>} Enterprise data
   */
  async getEnterpriseById(enterpriseId) {
    try {
      const enterprise =
        await this.enterpriseService.getEnterpriseById(enterpriseId);
      return enterprise;
    } catch (error) {
      console.error('Error getting enterprise by ID:', error);
      throw error;
    }
  }

  /**
   * Create a new enterprise
   * @param {number} userId - User ID
   * @param {Object} enterpriseData - Enterprise data
   * @returns {Promise<Object>} Created enterprise data
   */
  async createEnterprise(userId, enterpriseData) {
    try {
      const enterprise = await this.enterpriseService.createEnterprise(
        userId,
        enterpriseData
      );

      // Log admin action
      this.logAdminAction({
        adminId: this.currentAdmin?.id,
        adminEmail: this.currentAdmin?.email,
        action: 'CREATE_ENTERPRISE',
        targetType: 'enterprise',
        targetId: enterprise.id,
        details: { name: enterprise.name, industry: enterprise.industry },
      });

      return enterprise;
    } catch (error) {
      console.error('Error creating enterprise:', error);
      throw error;
    }
  }

  /**
   * Update an enterprise
   * @param {number} enterpriseId - Enterprise ID
   * @param {Object} enterpriseData - Updated enterprise data
   * @returns {Promise<Object>} Updated enterprise data
   */
  async updateEnterprise(enterpriseId, enterpriseData) {
    try {
      const enterprise = await this.enterpriseService.updateEnterprise(
        enterpriseId,
        enterpriseData
      );

      // Log admin action
      this.logAdminAction({
        adminId: this.currentAdmin?.id,
        adminEmail: this.currentAdmin?.email,
        action: 'UPDATE_ENTERPRISE',
        targetType: 'enterprise',
        targetId: enterprise.id,
        details: {
          name: enterprise.name,
          changes: Object.keys(enterpriseData),
        },
      });

      return enterprise;
    } catch (error) {
      console.error('Error updating enterprise:', error);
      throw error;
    }
  }

  /**
   * Delete an enterprise
   * @param {number} enterpriseId - Enterprise ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteEnterprise(enterpriseId) {
    try {
      const success =
        await this.enterpriseService.deleteEnterprise(enterpriseId);

      if (success) {
        // Log admin action
        this.logAdminAction({
          adminId: this.currentAdmin?.id,
          adminEmail: this.currentAdmin?.email,
          action: 'DELETE_ENTERPRISE',
          targetType: 'enterprise',
          targetId: enterpriseId,
        });
      }

      return success;
    } catch (error) {
      console.error('Error deleting enterprise:', error);
      throw error;
    }
  }

  /**
   * Bulk update enterprise status
   * @param {Array<number>} enterpriseIds - Enterprise IDs
   * @param {string} status - New status
   * @returns {Promise<number>} Number of updated enterprises
   */
  async bulkUpdateEnterpriseStatus(enterpriseIds, status) {
    try {
      const updatedCount = await this.enterpriseService.bulkUpdateStatus(
        enterpriseIds,
        status
      );

      // Log admin action
      this.logAdminAction({
        adminId: this.currentAdmin?.id,
        adminEmail: this.currentAdmin?.email,
        action: 'BULK_UPDATE_ENTERPRISE_STATUS',
        targetType: 'enterprise',
        details: { enterpriseIds, status, updatedCount },
      });

      return updatedCount;
    } catch (error) {
      console.error('Error bulk updating enterprise status:', error);
      throw error;
    }
  }

  /**
   * Bulk delete enterprises
   * @param {Array<number>} enterpriseIds - Enterprise IDs
   * @returns {Promise<number>} Number of deleted enterprises
   */
  async bulkDeleteEnterprises(enterpriseIds) {
    try {
      const deletedCount =
        await this.enterpriseService.bulkDelete(enterpriseIds);

      // Log admin action
      this.logAdminAction({
        adminId: this.currentAdmin?.id,
        adminEmail: this.currentAdmin?.email,
        action: 'BULK_DELETE_ENTERPRISES',
        targetType: 'enterprise',
        details: { enterpriseIds, deletedCount },
      });

      return deletedCount;
    } catch (error) {
      console.error('Error bulk deleting enterprises:', error);
      throw error;
    }
  }

  /**
   * Export enterprises to CSV
   * @param {Object} filters - Filter options
   * @returns {Promise<string>} CSV content
   */
  async exportEnterprisesToCSV(filters = {}) {
    try {
      const csvContent = await this.enterpriseService.exportToCSV(filters);

      // Log admin action
      this.logAdminAction({
        adminId: this.currentAdmin?.id,
        adminEmail: this.currentAdmin?.email,
        action: 'EXPORT_ENTERPRISES_CSV',
        targetType: 'enterprise',
        details: { filters },
      });

      return csvContent;
    } catch (error) {
      console.error('Error exporting enterprises to CSV:', error);
      throw error;
    }
  }

  /**
   * Get corporates for admin with filtering and pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Corporates with pagination info
   */
  async getCorporates(options = {}) {
    try {
      const result = await this.corporateService.getCorporatesFiltered(options);

      return {
        corporates: result.corporates,
        pagination: {
          page: Math.floor(options.offset / options.limit) + 1 || 1,
          limit: options.limit || 20,
          total: result.total,
          pages: Math.ceil(result.total / (options.limit || 20)),
        },
      };
    } catch (error) {
      console.error('Error getting corporates:', error);
      throw error;
    }
  }

  /**
   * Get corporate by ID for admin
   * @param {number} corporateId - Corporate ID
   * @returns {Promise<Object>} Corporate data
   */
  async getCorporateById(corporateId) {
    try {
      const corporate =
        await this.corporateService.getCorporateById(corporateId);
      return corporate;
    } catch (error) {
      console.error('Error getting corporate by ID:', error);
      throw error;
    }
  }

  /**
   * Create a new corporate
   * @param {number} userId - User ID creating the corporate
   * @param {Object} corporateData - Corporate data
   * @returns {Promise<Object>} Created corporate data
   */
  async createCorporate(userId, corporateData) {
    try {
      const corporate = await this.corporateService.createCorporate(
        userId,
        corporateData
      );

      // Log admin action
      this.logAdminAction({
        adminId: this.currentAdmin?.id,
        adminEmail: this.currentAdmin?.email,
        action: 'CREATE_CORPORATE',
        targetType: 'corporate',
        targetId: corporate.id,
        details: { name: corporate.name, industry: corporate.industry },
      });

      return corporate;
    } catch (error) {
      console.error('Error creating corporate:', error);
      throw error;
    }
  }

  /**
   * Update a corporate
   * @param {number} corporateId - Corporate ID
   * @param {Object} corporateData - Updated corporate data
   * @returns {Promise<Object>} Updated corporate data
   */
  async updateCorporate(corporateId, corporateData) {
    try {
      const corporate = await this.corporateService.updateCorporate(
        corporateId,
        corporateData
      );

      // Log admin action
      this.logAdminAction({
        adminId: this.currentAdmin?.id,
        adminEmail: this.currentAdmin?.email,
        action: 'UPDATE_CORPORATE',
        targetType: 'corporate',
        targetId: corporate.id,
        details: {
          name: corporate.name,
          changes: Object.keys(corporateData),
        },
      });

      return corporate;
    } catch (error) {
      console.error('Error updating corporate:', error);
      throw error;
    }
  }

  /**
   * Delete a corporate
   * @param {number} corporateId - Corporate ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteCorporate(corporateId) {
    try {
      const success = await this.corporateService.deleteCorporate(corporateId);

      if (success) {
        // Log admin action
        this.logAdminAction({
          adminId: this.currentAdmin?.id,
          adminEmail: this.currentAdmin?.email,
          action: 'DELETE_CORPORATE',
          targetType: 'corporate',
          targetId: corporateId,
        });
      }

      return success;
    } catch (error) {
      console.error('Error deleting corporate:', error);
      throw error;
    }
  }

  /**
   * Bulk update corporate status
   * @param {Array<number>} corporateIds - Corporate IDs
   * @param {string} status - New status
   * @returns {Promise<number>} Number of updated corporates
   */
  async bulkUpdateCorporateStatus(corporateIds, status) {
    try {
      const updatedCount = await this.corporateService.bulkUpdateStatus(
        corporateIds,
        status
      );

      // Log admin action
      this.logAdminAction({
        adminId: this.currentAdmin?.id,
        adminEmail: this.currentAdmin?.email,
        action: 'BULK_UPDATE_CORPORATE_STATUS',
        targetType: 'corporate',
        details: { corporateIds, status, updatedCount },
      });

      return updatedCount;
    } catch (error) {
      console.error('Error bulk updating corporate status:', error);
      throw error;
    }
  }

  /**
   * Bulk delete corporates
   * @param {Array<number>} corporateIds - Corporate IDs
   * @returns {Promise<number>} Number of deleted corporates
   */
  async bulkDeleteCorporates(corporateIds) {
    try {
      const deletedCount = await this.corporateService.bulkDelete(corporateIds);

      // Log admin action
      this.logAdminAction({
        adminId: this.currentAdmin?.id,
        adminEmail: this.currentAdmin?.email,
        action: 'BULK_DELETE_CORPORATES',
        targetType: 'corporate',
        details: { corporateIds, deletedCount },
      });

      return deletedCount;
    } catch (error) {
      console.error('Error bulk deleting corporates:', error);
      throw error;
    }
  }

  /**
   * Export corporates to CSV
   * @param {Object} filters - Filter options
   * @returns {Promise<string>} CSV content
   */
  async exportCorporatesToCSV(filters = {}) {
    try {
      const csvContent = await this.corporateService.exportToCSV(filters);

      // Log admin action
      this.logAdminAction({
        adminId: this.currentAdmin?.id,
        adminEmail: this.currentAdmin?.email,
        action: 'EXPORT_CORPORATES_CSV',
        targetType: 'corporate',
        details: { filters },
      });

      return csvContent;
    } catch (error) {
      console.error('Error exporting corporates to CSV:', error);
      throw error;
    }
  }

  /**
   * Get projects with pagination and filtering
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Projects data with pagination
   */
  async getProjects(options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        userId,
        status,
        search,
        sortBy = 'created_at',
        sortOrder = 'desc',
      } = options;

      const offset = (page - 1) * limit;

      const projects = await this.projectRepository.findAll({
        limit,
        offset,
        userId,
        status,
        search,
        sortBy,
        sortOrder,
      });

      const total = await this.projectRepository.countFiltered({
        userId,
        status,
        search,
      });

      const totalPages = Math.ceil(total / limit);

      return {
        projects,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error('Error getting projects:', error);
      throw error;
    }
  }

  /**
   * Get project by ID with team information
   * @param {number} projectId - Project ID
   * @returns {Promise<Object>} Project data with team
   */
  async getProjectById(projectId) {
    try {
      const project = await this.projectRepository.findById(projectId);
      if (!project) {
        const NotFoundError = require('../utils/errors/NotFoundError');
        throw new NotFoundError('Project not found');
      }

      const team = await this.teamRepository.getTeamWithUsers(projectId);

      return {
        ...project.toPublicJSON(),
        team,
        teamCount: team.length,
      };
    } catch (error) {
      console.error('Error getting project by ID:', error);
      throw error;
    }
  }

  /**
   * Update project status
   * @param {number} projectId - Project ID
   * @param {string} status - New status
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<Object>} Updated project data
   */
  async updateProjectStatus(projectId, status, adminInfo) {
    try {
      const project = await this.projectRepository.update(projectId, {
        status,
      });
      if (!project) {
        const NotFoundError = require('../utils/errors/NotFoundError');
        throw new NotFoundError('Project not found');
      }

      // Log admin action
      await this.logAdminAction({
        adminId: adminInfo.id,
        action: 'update_project_status',
        targetType: 'project',
        targetId: projectId,
        details: { newStatus: status },
        ip: adminInfo.ip,
      });

      return await this.getProjectById(projectId);
    } catch (error) {
      console.error('Error updating project status:', error);
      throw error;
    }
  }

  /**
   * Delete project
   * @param {number} projectId - Project ID
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<boolean>} Success status
   */
  async deleteProject(projectId, adminInfo) {
    try {
      const project = await this.projectRepository.findById(projectId);
      if (!project) {
        const NotFoundError = require('../utils/errors/NotFoundError');
        throw new NotFoundError('Project not found');
      }

      // Delete team members first
      await this.teamRepository.query(
        'DELETE FROM teams WHERE project_id = ?',
        [projectId]
      );

      // Delete project
      const success = await this.projectRepository.delete(projectId);

      if (success) {
        // Log admin action
        await this.logAdminAction({
          adminId: adminInfo.id,
          action: 'delete_project',
          targetType: 'project',
          targetId: projectId,
          details: { projectTitle: project.title },
          ip: adminInfo.ip,
        });
      }

      return success;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  /**
   * Remove user from project team
   * @param {number} projectId - Project ID
   * @param {number} userId - User ID
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<boolean>} Success status
   */
  async removeUserFromProject(projectId, userId, adminInfo) {
    try {
      const success = await this.teamRepository.removeUserFromProject(
        projectId,
        userId
      );

      if (success) {
        // Log admin action
        await this.logAdminAction({
          adminId: adminInfo.id,
          action: 'remove_user_from_project',
          targetType: 'project_team',
          targetId: projectId,
          details: { removedUserId: userId },
          ip: adminInfo.ip,
        });
      }

      return success;
    } catch (error) {
      console.error('Error removing user from project:', error);
      throw error;
    }
  }

  /**
   * Get collaboration statistics for dashboard
   * @returns {Promise<Object>} Collaboration stats
   */
  async getCollaborationStats() {
    try {
      const totalProjects = await this.projectRepository.count();
      const projectsByStatus = await this.projectRepository.countByStatus();

      // Get total team members
      const teamCountResult = await this.teamRepository.queryOne(
        'SELECT COUNT(*) as count FROM teams'
      );
      const totalTeamMembers = teamCountResult.count;

      // Get average team size
      const avgTeamSizeResult = await this.teamRepository.queryOne(`
        SELECT AVG(team_count) as avg_size
        FROM (
          SELECT project_id, COUNT(*) as team_count
          FROM teams
          GROUP BY project_id
        ) t
      `);
      const avgTeamSize = avgTeamSizeResult.avg_size || 0;

      return {
        totalProjects,
        projectsByStatus: Object.entries(projectsByStatus).map(
          ([status, count]) => ({
            status,
            count: parseInt(count),
          })
        ),
        totalTeamMembers,
        avgTeamSize: Math.round(avgTeamSize * 100) / 100,
      };
    } catch (error) {
      console.error('Error getting collaboration stats:', error);
      return {
        totalProjects: 0,
        projectsByStatus: [],
        totalTeamMembers: 0,
        avgTeamSize: 0,
      };
    }
  }

  // ===== PACKAGE MANAGEMENT METHODS =====

  /**
   * Get packages with pagination and filtering
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Packages data with pagination
   */
  async getPackages(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = (page - 1) * limit;

      let where = {};
      if (options.status) where.status = options.status;
      if (options.search) {
        // Handle search separately since it requires LIKE queries
        const packages = await this.packageRepository.search(options.search);
        const totalCount = packages.length;
        const paginatedPackages = packages.slice(offset, offset + limit);

        return {
          packages: paginatedPackages,
          pagination: {
            page,
            limit,
            total: totalCount,
            pages: Math.ceil(totalCount / limit),
          },
        };
      }

      const [packages, totalCount] = await Promise.all([
        this.packageRepository.findAll({
          where,
          limit,
          offset,
          orderBy: 'sort_order ASC, created_at DESC',
        }),
        this.packageRepository.count(where),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        packages,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: totalPages,
        },
      };
    } catch (error) {
      console.error('Error getting packages:', error);
      throw error;
    }
  }

  /**
   * Get package by ID
   * @param {number} packageId - Package ID
   * @returns {Promise<Object>} Package data
   */
  async getPackageById(packageId) {
    try {
      const pkg = await this.packageRepository.findById(packageId);
      if (!pkg) {
        const NotFoundError = require('../utils/errors/NotFoundError');
        throw new NotFoundError('Package not found');
      }
      return pkg;
    } catch (error) {
      console.error('Error getting package by ID:', error);
      throw error;
    }
  }

  /**
   * Create a new package
   * @param {Object} packageData - Package data
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<Object>} Created package data
   */
  async createPackage(packageData, adminInfo) {
    try {
      const Package = require('../models/Package');
      const pkg = new Package(packageData);
      pkg.validate();

      const packageId = await this.packageRepository.create(pkg);

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo.id,
        adminEmail: adminInfo.email,
        action: 'CREATE_PACKAGE',
        targetType: 'package',
        targetId: packageId,
        details: {
          name: pkg.name,
          price: pkg.price,
          credits: pkg.credits,
        },
        ip: adminInfo.ip,
      });

      const createdPackage = await this.packageRepository.findById(packageId);
      return createdPackage;
    } catch (error) {
      console.error('Error creating package:', error);
      throw error;
    }
  }

  /**
   * Update a package
   * @param {number} packageId - Package ID
   * @param {Object} packageData - Updated package data
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<Object>} Updated package data
   */
  async updatePackage(packageId, packageData, adminInfo) {
    try {
      const Package = require('../models/Package');
      const existingPackage = await this.packageRepository.findById(packageId);
      if (!existingPackage) {
        const NotFoundError = require('../utils/errors/NotFoundError');
        throw new NotFoundError('Package not found');
      }

      const updatedPackage = new Package({
        ...existingPackage,
        ...packageData,
      });
      updatedPackage.validate();

      const success = await this.packageRepository.update(
        packageId,
        packageData
      );
      if (!success) {
        throw new Error('Failed to update package');
      }

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo.id,
        adminEmail: adminInfo.email,
        action: 'UPDATE_PACKAGE',
        targetType: 'package',
        targetId: packageId,
        details: {
          name: updatedPackage.name,
          changes: Object.keys(packageData),
        },
        ip: adminInfo.ip,
      });

      return await this.packageRepository.findById(packageId);
    } catch (error) {
      console.error('Error updating package:', error);
      throw error;
    }
  }

  /**
   * Delete a package
   * @param {number} packageId - Package ID
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<boolean>} Success status
   */
  async deletePackage(packageId, adminInfo) {
    try {
      const pkg = await this.packageRepository.findById(packageId);
      if (!pkg) {
        const NotFoundError = require('../utils/errors/NotFoundError');
        throw new NotFoundError('Package not found');
      }

      const success = await this.packageRepository.delete(packageId);

      if (success) {
        // Log admin action
        this.logAdminAction({
          adminId: adminInfo.id,
          adminEmail: adminInfo.email,
          action: 'DELETE_PACKAGE',
          targetType: 'package',
          targetId: packageId,
          details: { deletedPackageName: pkg.name },
          ip: adminInfo.ip,
        });
      }

      return success;
    } catch (error) {
      console.error('Error deleting package:', error);
      throw error;
    }
  }

  // ===== BILLING MANAGEMENT METHODS =====

  /**
   * Get billing transactions with pagination and filtering
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Billing data with pagination
   */
  async getBillingTransactions(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = (page - 1) * limit;

      let where = {};
      if (options.status) where.status = options.status;
      if (options.userId) where.user_id = options.userId;

      const [transactions, totalCount] = await Promise.all([
        this.billingRepository.findAll({
          where,
          limit,
          offset,
          orderBy: 'created_at DESC',
        }),
        this.billingRepository.count(where),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        transactions,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: totalPages,
        },
      };
    } catch (error) {
      console.error('Error getting billing transactions:', error);
      throw error;
    }
  }

  /**
   * Get billing transaction by ID
   * @param {number} billingId - Billing transaction ID
   * @returns {Promise<Object>} Billing transaction data
   */
  async getBillingTransactionById(billingId) {
    try {
      const transaction = await this.billingRepository.findById(billingId);
      if (!transaction) {
        const NotFoundError = require('../utils/errors/NotFoundError');
        throw new NotFoundError('Billing transaction not found');
      }
      return transaction;
    } catch (error) {
      console.error('Error getting billing transaction by ID:', error);
      throw error;
    }
  }

  /**
   * Create a billing transaction
   * @param {Object} billingData - Billing data
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<Object>} Created billing transaction
   */
  async createBillingTransaction(billingData, adminInfo) {
    try {
      const Billing = require('../models/Billing');
      const billing = new Billing(billingData);
      billing.validate();

      const billingId = await this.billingRepository.create(billing);

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo.id,
        adminEmail: adminInfo.email,
        action: 'CREATE_BILLING_TRANSACTION',
        targetType: 'billing',
        targetId: billingId,
        details: { amount: billing.amount, status: billing.status },
        ip: adminInfo.ip,
      });

      const createdTransaction =
        await this.billingRepository.findById(billingId);
      return createdTransaction;
    } catch (error) {
      console.error('Error creating billing transaction:', error);
      throw error;
    }
  }

  /**
   * Update billing transaction status
   * @param {number} billingId - Billing transaction ID
   * @param {string} status - New status
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<Object>} Updated billing transaction
   */
  async updateBillingTransactionStatus(billingId, status, adminInfo) {
    try {
      const transaction = await this.billingRepository.findById(billingId);
      if (!transaction) {
        const NotFoundError = require('../utils/errors/NotFoundError');
        throw new NotFoundError('Billing transaction not found');
      }

      const success = await this.billingRepository.updateStatus(
        billingId,
        status
      );
      if (!success) {
        throw new Error('Failed to update billing transaction status');
      }

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo.id,
        adminEmail: adminInfo.email,
        action: 'UPDATE_BILLING_STATUS',
        targetType: 'billing',
        targetId: billingId,
        details: { oldStatus: transaction.status, newStatus: status },
        ip: adminInfo.ip,
      });

      return await this.billingRepository.findById(billingId);
    } catch (error) {
      console.error('Error updating billing transaction status:', error);
      throw error;
    }
  }

  /**
   * Process refund for billing transaction
   * @param {number} billingId - Billing transaction ID
   * @param {number} refundAmount - Refund amount
   * @param {string} refundReason - Refund reason
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<Object>} Updated billing transaction
   */
  async processRefund(billingId, refundAmount, refundReason, adminInfo) {
    try {
      const transaction = await this.billingRepository.findById(billingId);
      if (!transaction) {
        const NotFoundError = require('../utils/errors/NotFoundError');
        throw new NotFoundError('Billing transaction not found');
      }

      if (transaction.status !== 'completed') {
        throw new Error('Can only refund completed transactions');
      }

      const success = await this.billingRepository.processRefund(
        billingId,
        refundAmount,
        refundReason
      );
      if (!success) {
        throw new Error('Failed to process refund');
      }

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo.id,
        adminEmail: adminInfo.email,
        action: 'PROCESS_REFUND',
        targetType: 'billing',
        targetId: billingId,
        details: { refundAmount, refundReason },
        ip: adminInfo.ip,
      });

      return await this.billingRepository.findById(billingId);
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  // ===== REWARD MANAGEMENT METHODS =====

  /**
   * Get rewards with pagination and filtering
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Rewards data with pagination
   */
  async getRewards(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = (page - 1) * limit;

      let where = {};
      if (options.status) where.status = options.status;
      if (options.type) where.type = options.type;
      if (options.userId) where.user_id = options.userId;

      const [rewards, totalCount] = await Promise.all([
        this.rewardRepository.findAll({
          where,
          limit,
          offset,
          orderBy: 'created_at DESC',
        }),
        this.rewardRepository.count(where),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        rewards,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: totalPages,
        },
      };
    } catch (error) {
      console.error('Error getting rewards:', error);
      throw error;
    }
  }

  /**
   * Get reward by ID
   * @param {number} rewardId - Reward ID
   * @returns {Promise<Object>} Reward data
   */
  async getRewardById(rewardId) {
    try {
      const reward = await this.rewardRepository.findById(rewardId);
      if (!reward) {
        const NotFoundError = require('../utils/errors/NotFoundError');
        throw new NotFoundError('Reward not found');
      }
      return reward;
    } catch (error) {
      console.error('Error getting reward by ID:', error);
      throw error;
    }
  }

  /**
   * Create a reward
   * @param {Object} rewardData - Reward data
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<Object>} Created reward data
   */
  async createReward(rewardData, adminInfo) {
    try {
      const Reward = require('../models/Reward');
      const reward = new Reward({ ...rewardData, adminId: adminInfo.id });
      reward.validate();

      const rewardId = await this.rewardRepository.create(reward);

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo.id,
        adminEmail: adminInfo.email,
        action: 'CREATE_REWARD',
        targetType: 'reward',
        targetId: rewardId,
        details: {
          type: reward.type,
          credits: reward.credits,
          userId: reward.userId,
        },
        ip: adminInfo.ip,
      });

      const createdReward = await this.rewardRepository.findById(rewardId);
      return createdReward;
    } catch (error) {
      console.error('Error creating reward:', error);
      throw error;
    }
  }

  /**
   * Update a reward
   * @param {number} rewardId - Reward ID
   * @param {Object} rewardData - Updated reward data
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<Object>} Updated reward data
   */
  async updateReward(rewardId, rewardData, adminInfo) {
    try {
      const Reward = require('../models/Reward');
      const existingReward = await this.rewardRepository.findById(rewardId);
      if (!existingReward) {
        const NotFoundError = require('../utils/errors/NotFoundError');
        throw new NotFoundError('Reward not found');
      }

      const updatedReward = new Reward({ ...existingReward, ...rewardData });
      updatedReward.validate();

      const success = await this.rewardRepository.update(rewardId, rewardData);
      if (!success) {
        throw new Error('Failed to update reward');
      }

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo.id,
        adminEmail: adminInfo.email,
        action: 'UPDATE_REWARD',
        targetType: 'reward',
        targetId: rewardId,
        details: { changes: Object.keys(rewardData) },
        ip: adminInfo.ip,
      });

      return await this.rewardRepository.findById(rewardId);
    } catch (error) {
      console.error('Error updating reward:', error);
      throw error;
    }
  }

  /**
   * Delete a reward
   * @param {number} rewardId - Reward ID
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<boolean>} Success status
   */
  async deleteReward(rewardId, adminInfo) {
    try {
      const reward = await this.rewardRepository.findById(rewardId);
      if (!reward) {
        const NotFoundError = require('../utils/errors/NotFoundError');
        throw new NotFoundError('Reward not found');
      }

      const success = await this.rewardRepository.delete(rewardId);

      if (success) {
        // Log admin action
        this.logAdminAction({
          adminId: adminInfo.id,
          adminEmail: adminInfo.email,
          action: 'DELETE_REWARD',
          targetType: 'reward',
          targetId: rewardId,
          details: {
            deletedRewardType: reward.type,
            deletedRewardCredits: reward.credits,
          },
          ip: adminInfo.ip,
        });
      }

      return success;
    } catch (error) {
      console.error('Error deleting reward:', error);
      throw error;
    }
  }

  /**
   * Grant reward to user (convenience method)
   * @param {number} userId - User ID
   * @param {string} type - Reward type
   * @param {string} title - Reward title
   * @param {number} credits - Credits to grant
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<Object>} Created reward
   */
  async grantRewardToUser(userId, type, title, credits, adminInfo) {
    return await this.createReward(
      {
        userId,
        type,
        title,
        credits,
        status: 'active',
      },
      adminInfo
    );
  }

  /**
   * Get ideas with pagination and filtering for admin
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Ideas data with pagination
   */
  async getIdeas(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = (page - 1) * limit;

      const ideas = await this.ideaService.getAllIdeas(null, {
        limit,
        offset,
        orderBy: options.sortBy
          ? `${options.sortBy} ${options.sortOrder || 'desc'}`
          : 'created_at DESC',
      });

      // Get total count
      const totalCount = await this.ideaRepository.count();

      const totalPages = Math.ceil(totalCount / limit);

      return {
        ideas: ideas.map((idea) => ({
          id: idea.id,
          href: idea.href,
          title: idea.title,
          type: idea.type,
          typeIcon: idea.typeIcon,
          rating: idea.rating,
          description: idea.description,
          tags: idea.tags,
          isFavorite: idea.isFavorite,
          userId: idea.userId,
          createdAt: idea.createdAt,
          updatedAt: idea.updatedAt,
        })),
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: totalPages,
        },
      };
    } catch (error) {
      console.error('Error getting ideas:', error);
      throw error;
    }
  }

  /**
   * Get votes for admin management
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Votes data with pagination
   */
  async getVotes(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = (page - 1) * limit;

      const votes = await this.voteRepository.findAll({
        limit,
        offset,
        orderBy: 'timestamp DESC',
      });

      // Get total count
      const totalCount = await this.voteRepository.count();

      const totalPages = Math.ceil(totalCount / limit);

      return {
        votes: votes.map((vote) => ({
          id: vote.id,
          ideaSlug: vote.idea_slug,
          userId: vote.user_id,
          marketViability: vote.market_viability,
          realWorldProblem: vote.real_world_problem,
          innovation: vote.innovation,
          technicalFeasibility: vote.technical_feasibility,
          scalability: vote.scalability,
          marketSurvival: vote.market_survival,
          createdAt: vote.timestamp,
        })),
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: totalPages,
        },
      };
    } catch (error) {
      console.error('Error getting votes:', error);
      throw error;
    }
  }

  /**
   * Get idea by ID for admin
   * @param {number} ideaId - Idea ID
   * @returns {Promise<Object>} Idea data
   */
  async getIdeaById(ideaId) {
    try {
      const idea = await this.ideaService.getIdeaById(ideaId);
      return idea;
    } catch (error) {
      console.error('Error getting idea by ID:', error);
      throw error;
    }
  }

  /**
   * Update an idea (admin override)
   * @param {number} ideaId - Idea ID
   * @param {Object} ideaData - Updated idea data
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<Object>} Updated idea data
   */
  async updateIdea(ideaId, ideaData, adminInfo) {
    try {
      // Get the original idea to check ownership
      const originalIdea = await this.ideaService.getIdeaById(ideaId);

      // For admin updates, we bypass ownership check by using the original userId
      const updatedIdea = await this.ideaService.updateIdea(
        ideaId,
        originalIdea.userId,
        ideaData
      );

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo.id,
        adminEmail: adminInfo.email,
        action: 'UPDATE_IDEA',
        targetType: 'idea',
        targetId: ideaId,
        details: { title: updatedIdea.title },
        ip: adminInfo.ip,
      });

      return updatedIdea;
    } catch (error) {
      console.error('Error updating idea:', error);
      throw error;
    }
  }

  /**
   * Delete an idea (admin override)
   * @param {number} ideaId - Idea ID
   * @param {Object} adminInfo - Admin performing the action
   * @returns {Promise<boolean>} Success status
   */
  async deleteIdea(ideaId, adminInfo) {
    try {
      // Get the original idea to check ownership
      const originalIdea = await this.ideaService.getIdeaById(ideaId);

      // For admin deletion, we bypass ownership check by using the original userId
      const success = await this.ideaService.deleteIdea(
        ideaId,
        originalIdea.userId
      );

      if (success) {
        // Log admin action
        this.logAdminAction({
          adminId: adminInfo.id,
          adminEmail: adminInfo.email,
          action: 'DELETE_IDEA',
          targetType: 'idea',
          targetId: ideaId,
          details: { deletedIdeaTitle: originalIdea.title },
          ip: adminInfo.ip,
        });
      }

      return success;
    } catch (error) {
      console.error('Error deleting idea:', error);
      throw error;
    }
  }

  /**
   * Get all landing page sections for admin management
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Sections with pagination
   */
  async getLandingPageSections(options = {}) {
    try {
      return await this.landingPageService.getAllSections(options);
    } catch (error) {
      console.error('Error fetching landing page sections:', error);
      throw error;
    }
  }

  /**
   * Get landing page section by ID
   * @param {number} id - Section ID
   * @returns {Promise<Object|null>} Section data
   */
  async getLandingPageSectionById(id) {
    try {
      return await this.landingPageService.getSectionById(id);
    } catch (error) {
      console.error('Error fetching landing page section:', error);
      throw error;
    }
  }

  /**
   * Create a new landing page section
   * @param {Object} sectionData - Section data
   * @param {Object} adminInfo - Admin user info
   * @returns {Promise<number>} Created section ID
   */
  async createLandingPageSection(sectionData, adminInfo) {
    try {
      const sectionId =
        await this.landingPageService.createSection(sectionData);

      // Log admin action
      this.logAdminAction({
        adminId: adminInfo.id,
        adminEmail: adminInfo.email,
        action: 'CREATE_LANDING_PAGE_SECTION',
        targetType: 'landing_page_section',
        targetId: sectionId,
        details: {
          sectionType: sectionData.sectionType,
          title: sectionData.title,
        },
        ip: adminInfo.ip,
      });

      return sectionId;
    } catch (error) {
      console.error('Error creating landing page section:', error);
      throw error;
    }
  }

  /**
   * Update a landing page section
   * @param {number} id - Section ID
   * @param {Object} sectionData - Updated section data
   * @param {Object} adminInfo - Admin user info
   * @returns {Promise<boolean>} Success status
   */
  async updateLandingPageSection(id, sectionData, adminInfo) {
    try {
      const success = await this.landingPageService.updateSection(
        id,
        sectionData
      );

      if (success) {
        // Log admin action
        this.logAdminAction({
          adminId: adminInfo.id,
          adminEmail: adminInfo.email,
          action: 'UPDATE_LANDING_PAGE_SECTION',
          targetType: 'landing_page_section',
          targetId: id,
          details: {
            sectionType: sectionData.sectionType,
            title: sectionData.title,
          },
          ip: adminInfo.ip,
        });
      }

      return success;
    } catch (error) {
      console.error('Error updating landing page section:', error);
      throw error;
    }
  }

  /**
   * Delete a landing page section
   * @param {number} id - Section ID
   * @param {Object} adminInfo - Admin user info
   * @returns {Promise<boolean>} Success status
   */
  async deleteLandingPageSection(id, adminInfo) {
    try {
      // Get section info before deletion for logging
      const section = await this.landingPageService.getSectionById(id);

      const success = await this.landingPageService.deleteSection(id);

      if (success && section) {
        // Log admin action
        this.logAdminAction({
          adminId: adminInfo.id,
          adminEmail: adminInfo.email,
          action: 'DELETE_LANDING_PAGE_SECTION',
          targetType: 'landing_page_section',
          targetId: id,
          details: { sectionType: section.sectionType, title: section.title },
          ip: adminInfo.ip,
        });
      }

      return success;
    } catch (error) {
      console.error('Error deleting landing page section:', error);
      throw error;
    }
  }

  /**
   * Toggle landing page section active status
   * @param {number} id - Section ID
   * @param {Object} adminInfo - Admin user info
   * @returns {Promise<boolean>} Success status
   */
  async toggleLandingPageSectionStatus(id, adminInfo) {
    try {
      const success = await this.landingPageService.toggleSectionStatus(id);

      if (success) {
        // Log admin action
        this.logAdminAction({
          adminId: adminInfo.id,
          adminEmail: adminInfo.email,
          action: 'TOGGLE_LANDING_PAGE_SECTION',
          targetType: 'landing_page_section',
          targetId: id,
          details: { toggled: true },
          ip: adminInfo.ip,
        });
      }

      return success;
    } catch (error) {
      console.error('Error toggling landing page section status:', error);
      throw error;
    }
  }

  /**
   * Update landing page section order
   * @param {number} id - Section ID
   * @param {number} order - New order
   * @param {Object} adminInfo - Admin user info
   * @returns {Promise<boolean>} Success status
   */
  async updateLandingPageSectionOrder(id, order, adminInfo) {
    try {
      const success = await this.landingPageService.updateSectionOrder(
        id,
        order
      );

      if (success) {
        // Log admin action
        this.logAdminAction({
          adminId: adminInfo.id,
          adminEmail: adminInfo.email,
          action: 'UPDATE_LANDING_PAGE_SECTION_ORDER',
          targetType: 'landing_page_section',
          targetId: id,
          details: { newOrder: order },
          ip: adminInfo.ip,
        });
      }

      return success;
    } catch (error) {
      console.error('Error updating landing page section order:', error);
      throw error;
    }
  }

  /**
   * Get landing page section types for dropdowns
   * @returns {Array} Section type options
   */
  getLandingPageSectionTypes() {
    return this.landingPageService.getSectionTypes();
  }
}

module.exports = AdminService;
