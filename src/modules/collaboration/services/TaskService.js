/**
 * Task service handling task business logic
 */
class TaskService {
  constructor(taskRepository, projectRepository, teamRepository) {
    this.taskRepository = taskRepository;
    this.projectRepository = projectRepository;
    this.teamRepository = teamRepository;
  }

  /**
   * Get tasks for a user (across all their projects)
   * @param {number} userId - User ID
   * @returns {Promise<Array>} Tasks
   */
  async getUserTasks(userId) {
    // First get user's projects
    const projects = await this.projectRepository.findByUserId(userId);
    const projectIds = projects.map((p) => p.id);

    if (projectIds.length === 0) {
      return [];
    }

    // Get tasks for these projects
    const tasks = [];
    for (const projectId of projectIds) {
      const projectTasks = await this.taskRepository.findByProjectId(projectId);
      tasks.push(...projectTasks);
    }

    return tasks;
  }

  /**
   * Get tasks for a specific project
   * @param {number} projectId - Project ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Tasks
   */
  async getProjectTasks(projectId, options = {}) {
    return await this.taskRepository.findByProjectId(projectId, options);
  }

  /**
   * Get task by ID
   * @param {number} taskId - Task ID
   * @returns {Promise<Object|null>} Task
   */
  async getTaskById(taskId) {
    return await this.taskRepository.findById(taskId);
  }

  /**
   * Create a new task
   * @param {Object} taskData - Task data
   * @returns {Promise<Object>} Created task
   */
  async createTask(taskData) {
    // Verify user has access to the project
    const project = await this.projectRepository.findById(taskData.projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    // Check if user is a team member
    const isMember = await this.teamRepository.findByProjectAndUser(
      taskData.projectId,
      taskData.createdBy || taskData.userId
    );
    if (!isMember) {
      throw new Error('User is not a member of this project');
    }

    return await this.taskRepository.create(taskData);
  }

  /**
   * Update a task
   * @param {number} taskId - Task ID
   * @param {Object} updateData - Update data
   * @param {number} userId - User ID making the update
   * @returns {Promise<Object>} Updated task
   */
  async updateTask(taskId, updateData, userId) {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    // Check if user has access to the project
    const isMember = await this.teamRepository.findByProjectAndUser(
      task.project_id,
      userId
    );
    if (!isMember) {
      throw new Error('User does not have access to this task');
    }

    const success = await this.taskRepository.update(taskId, updateData);
    if (success) {
      return await this.taskRepository.findById(taskId);
    }
    return null;
  }

  /**
   * Delete a task
   * @param {number} taskId - Task ID
   * @param {number} userId - User ID making the delete
   * @returns {Promise<boolean>} Success
   */
  async deleteTask(taskId, userId) {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    // Check if user has admin access to the project
    const member = await this.teamRepository.findByProjectAndUser(
      task.project_id,
      userId
    );
    if (!member || (member.role !== 'admin' && member.role !== 'owner')) {
      throw new Error('User does not have permission to delete this task');
    }

    return await this.taskRepository.delete(taskId);
  }

  /**
   * Assign task to user
   * @param {number} taskId - Task ID
   * @param {number} assigneeUserId - User ID to assign to
   * @param {number} userId - User ID making the assignment
   * @returns {Promise<Object>} Updated task
   */
  async assignTask(taskId, assigneeUserId, userId) {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    // Check if assignee is a team member
    const isAssigneeMember = await this.teamRepository.findByProjectAndUser(
      task.project_id,
      assigneeUserId
    );
    if (!isAssigneeMember) {
      throw new Error('Assignee is not a member of this project');
    }

    // Check if user has permission to assign
    const member = await this.teamRepository.findByProjectAndUser(
      task.project_id,
      userId
    );
    if (!member || (member.role !== 'admin' && member.role !== 'owner')) {
      throw new Error('User does not have permission to assign tasks');
    }

    const success = await this.taskRepository.update(taskId, {
      assignee_user_id: assigneeUserId,
    });

    if (success) {
      return await this.taskRepository.findById(taskId);
    }
    return null;
  }

  /**
   * Update task status
   * @param {number} taskId - Task ID
   * @param {string} status - New status
   * @param {number} userId - User ID making the update
   * @returns {Promise<Object>} Updated task
   */
  async updateTaskStatus(taskId, status, userId) {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    // Check if user has access to the project
    const isMember = await this.teamRepository.findByProjectAndUser(
      task.project_id,
      userId
    );
    if (!isMember) {
      throw new Error('User does not have access to this task');
    }

    // Allow status updates by assignee or admins
    const canUpdate =
      task.assignee_user_id === userId ||
      isMember.role === 'admin' ||
      isMember.role === 'owner';

    if (!canUpdate) {
      throw new Error(
        'User does not have permission to update this task status'
      );
    }

    const success = await this.taskRepository.update(taskId, { status });
    if (success) {
      return await this.taskRepository.findById(taskId);
    }
    return null;
  }

  /**
   * Get task statistics
   * @returns {Promise<Object>} Statistics
   */
  async getTaskStats() {
    return await this.taskRepository.getStats();
  }
}

module.exports = TaskService;
