/**
 * Message service handling message business logic
 */
class MessageService {
  constructor(messageRepository, projectRepository, teamRepository) {
    this.messageRepository = messageRepository;
    this.projectRepository = projectRepository;
    this.teamRepository = teamRepository;
  }

  /**
   * Get messages for a user (across all their projects)
   * @param {number} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Messages
   */
  async getMessages(userId, options = {}) {
    // First get user's projects
    const projects = await this.projectRepository.findByUserId(userId);
    const projectIds = projects.map((p) => p.id);

    if (projectIds.length === 0) {
      return [];
    }

    // Get messages for these projects
    const messages = [];
    for (const projectId of projectIds) {
      const projectMessages = await this.messageRepository.findByProjectId(
        projectId,
        options
      );
      messages.push(...projectMessages);
    }

    // Sort by created_at descending
    messages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return messages;
  }

  /**
   * Get messages for a specific project
   * @param {number} projectId - Project ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Messages
   */
  async getProjectMessages(projectId, options = {}) {
    return await this.messageRepository.findByProjectId(projectId, options);
  }

  /**
   * Get recent messages for a user
   * @param {number} userId - User ID
   * @param {number} limit - Number of messages to return
   * @returns {Promise<Array>} Recent messages
   */
  async getRecentMessages(userId, limit = 10) {
    return await this.getMessages(userId, { limit });
  }

  /**
   * Create a new message
   * @param {Object} messageData - Message data
   * @returns {Promise<Object>} Created message
   */
  async createMessage(messageData) {
    // Verify user has access to the project
    const project = await this.projectRepository.findById(
      messageData.projectId
    );
    if (!project) {
      throw new Error('Project not found');
    }

    // Check if user is a team member
    const isMember = await this.teamRepository.findByProjectAndUser(
      messageData.projectId,
      messageData.userId
    );
    if (!isMember) {
      throw new Error('User is not a member of this project');
    }

    const messageId = await this.messageRepository.create(messageData);
    return await this.messageRepository.findById(messageId);
  }

  /**
   * Delete a message
   * @param {number} messageId - Message ID
   * @param {number} userId - User ID making the delete
   * @returns {Promise<boolean>} Success
   */
  async deleteMessage(messageId, userId) {
    const message = await this.messageRepository.findById(messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    // Check if user is the author or has admin access to the project
    const member = await this.teamRepository.findByProjectAndUser(
      message.project_id,
      userId
    );
    const canDelete =
      message.user_id === userId ||
      (member && (member.role === 'admin' || member.role === 'owner'));

    if (!canDelete) {
      throw new Error('User does not have permission to delete this message');
    }

    return await this.messageRepository.delete(messageId);
  }

  /**
   * Get message statistics
   * @returns {Promise<Object>} Statistics
   */
  async getMessageStats() {
    return await this.messageRepository.getStats();
  }

  /**
   * Count messages by user
   * @param {number} userId - User ID
   * @returns {Promise<number>} Message count
   */
  async countByUser(userId) {
    const messages = await this.messageRepository.findByUserId(userId);
    return messages.length;
  }
}

module.exports = MessageService;
