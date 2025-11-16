/**
 * Collaboration controller handling all collaboration-related operations
 */
class CollaborationController {
  constructor(
    collaborationService,
    projectService,
    teamService,
    taskService,
    messageService
  ) {
    this.collaborationService = collaborationService;
    this.projectService = projectService;
    this.teamService = teamService;
    this.taskService = taskService;
    this.messageService = messageService;
  }

  /**
   * Get collaboration hub overview
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getCollaborationHub(req, res) {
    try {
      const userId = req.session.userId;

      // If no user is logged in, show empty collaboration hub
      if (!userId) {
        return res.render('pages/collaborate/collaborate', {
          title: 'Collaboration Hub - Accelerator Platform',
          layout: 'collaborate',
          activeDashboard: true,
          isActiveCollaborate: true,
          projects: [],
          recentMessages: [],
          tasks: [],
          user: res.locals.user,
        });
      }

      const [projects, recentMessages, tasks] = await Promise.all([
        this.projectService.getUserProjects(userId),
        this.messageService.getRecentMessages(userId, 5),
        this.taskService.getUserTasks(userId),
      ]);

      res.render('pages/collaborate/collaborate', {
        title: 'Collaboration Hub - Accelerator Platform',
        layout: 'collaborate',
        activeDashboard: true,
        isActiveCollaborate: true,
        projects,
        recentMessages,
        tasks,
        user: res.locals.user,
      });
    } catch (error) {
      console.error('Get collaboration hub error:', error);
      res.status(500).render('pages/collaborate/collaborate', {
        title: 'Collaboration Hub - Accelerator Platform',
        layout: 'collaborate',
        activeDashboard: true,
        isActiveCollaborate: true,
        projects: [],
        recentMessages: [],
        tasks: [],
        error: 'Failed to load collaboration hub',
        user: res.locals.user,
      });
    }
  }

  /**
   * Get team chat page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getTeamChat(req, res) {
    try {
      const userId = req.session.userId;
      const messages = await this.messageService.getMessages(userId);

      res.render('pages/collaborate/chat', {
        title: 'Team Chat - Accelerator Platform',
        layout: 'collaborate',
        activeChat: true,
        messages,
        user: res.locals.user,
      });
    } catch (error) {
      console.error('Get team chat error:', error);
      res.status(500).render('pages/collaborate/chat', {
        title: 'Team Chat - Accelerator Platform',
        layout: 'collaborate',
        activeChat: true,
        messages: [],
        error: 'Failed to load chat',
      });
    }
  }

  /**
   * Get task board
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getTaskBoard(req, res) {
    try {
      const userId = req.session.userId;
      const tasks = await this.taskService.getUserTasks(userId);

      res.render('pages/collaborate/tasks', {
        title: 'Task Board - Accelerator Platform',
        layout: 'collaborate',
        activeTasks: true,
        tasks,
        user: res.locals.user,
      });
    } catch (error) {
      console.error('Get task board error:', error);
      res.status(500).render('pages/collaborate/tasks', {
        title: 'Task Board - Accelerator Platform',
        layout: 'collaborate',
        activeTasks: true,
        tasks: [],
        error: 'Failed to load tasks',
      });
    }
  }

  /**
   * Get team directory
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getTeamDirectory(req, res) {
    try {
      const userId = req.session.userId;
      const teams = await this.teamService.getUserTeams(userId);

      res.render('pages/collaborate/team', {
        title: 'Team Directory - Accelerator Platform',
        layout: 'collaborate',
        activeTeam: true,
        teams,
        user: res.locals.user,
      });
    } catch (error) {
      console.error('Get team directory error:', error);
      res.status(500).render('pages/collaborate/team', {
        title: 'Team Directory - Accelerator Platform',
        layout: 'collaborate',
        activeTeam: true,
        teams: [],
        error: 'Failed to load team directory',
      });
    }
  }

  /**
   * Get file repository
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getFileRepository(req, res) {
    try {
      const userId = req.session.userId;
      const files = await this.collaborationService.getUserFiles(userId);

      res.render('pages/collaborate/files', {
        title: 'File Repository - Accelerator Platform',
        layout: 'collaborate',
        activeFiles: true,
        files,
        user: res.locals.user,
      });
    } catch (error) {
      console.error('Get file repository error:', error);
      res.status(500).render('pages/collaborate/files', {
        title: 'File Repository - Accelerator Platform',
        layout: 'collaborate',
        activeFiles: true,
        files: [],
        error: 'Failed to load files',
      });
    }
  }

  /**
   * Get team calendar
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getTeamCalendar(req, res) {
    try {
      const userId = req.session.userId;
      const events = await this.collaborationService.getTeamEvents(userId);

      res.render('pages/collaborate/calendar', {
        title: 'Team Calendar - Accelerator Platform',
        layout: 'collaborate',
        activeCalendar: true,
        events,
        user: res.locals.user,
      });
    } catch (error) {
      console.error('Get team calendar error:', error);
      res.status(500).render('pages/collaborate/calendar', {
        title: 'Team Calendar - Accelerator Platform',
        layout: 'collaborate',
        activeCalendar: true,
        events: [],
        error: 'Failed to load calendar',
      });
    }
  }

  /**
   * Get activity timeline
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getActivityTimeline(req, res) {
    try {
      const userId = req.session.userId;
      const activities =
        await this.collaborationService.getUserActivities(userId);

      res.render('pages/collaborate/activity', {
        title: 'Activity Timeline - Accelerator Platform',
        layout: 'collaborate',
        activeActivity: true,
        activities,
        user: res.locals.user,
      });
    } catch (error) {
      console.error('Get activity timeline error:', error);
      res.status(500).render('pages/collaborate/activity', {
        title: 'Activity Timeline - Accelerator Platform',
        layout: 'collaborate',
        activeActivity: true,
        activities: [],
        error: 'Failed to load activities',
      });
    }
  }

  /**
   * Get collaboration settings
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getCollaborationSettings(req, res) {
    try {
      const userId = req.session.userId;
      const settings = await this.collaborationService.getUserSettings(userId);

      res.render('pages/collaborate/settings', {
        title: 'Collaboration Settings - Accelerator Platform',
        layout: 'collaborate',
        activeSettings: true,
        settings,
        user: res.locals.user,
      });
    } catch (error) {
      console.error('Get collaboration settings error:', error);
      res.status(500).render('pages/collaborate/settings', {
        title: 'Collaboration Settings - Accelerator Platform',
        layout: 'collaborate',
        activeSettings: true,
        settings: {},
        error: 'Failed to load settings',
      });
    }
  }

  /**
   * Post a message to team chat
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async postMessage(req, res) {
    try {
      const { message } = req.body;
      const userId = req.session.userId;

      if (!message || message.trim().length === 0) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const newMessage = await this.messageService.createMessage({
        userId,
        content: message.trim(),
        type: 'chat',
      });

      res.json({
        success: true,
        message: newMessage,
      });
    } catch (error) {
      console.error('Post message error:', error);
      res.status(500).json({
        error: 'Failed to send message',
      });
    }
  }

  // API Methods

  /**
   * Get projects (API)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getProjectsAPI(req, res) {
    try {
      const userId = req.session.userId;
      const projects = await this.projectService.getUserProjects(userId);

      res.json({
        success: true,
        projects,
      });
    } catch (error) {
      console.error('Get projects API error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch projects',
      });
    }
  }

  /**
   * Get tasks (API)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getTasksAPI(req, res) {
    try {
      const userId = req.session.userId;
      const tasks = await this.taskService.getUserTasks(userId);

      res.json({
        success: true,
        tasks,
      });
    } catch (error) {
      console.error('Get tasks API error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch tasks',
      });
    }
  }

  /**
   * Get messages (API)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getMessagesAPI(req, res) {
    try {
      const userId = req.session.userId;
      const messages = await this.messageService.getMessages(userId);

      res.json({
        success: true,
        messages,
      });
    } catch (error) {
      console.error('Get messages API error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch messages',
      });
    }
  }
}

module.exports = CollaborationController;
