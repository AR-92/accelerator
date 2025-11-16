/**
 * Project service handling project business logic
 */
class ProjectService {
  constructor(
    projectRepository,
    teamRepository,
    projectCollaboratorRepository
  ) {
    this.projectRepository = projectRepository;
    this.teamRepository = teamRepository;
    this.projectCollaboratorRepository = projectCollaboratorRepository;
  }

  /**
   * Get projects for a user
   * @param {number} userId - User ID
   * @returns {Promise<Array>} Projects
   */
  async getUserProjects(userId) {
    return await this.projectRepository.findByUserId(userId);
  }

  /**
   * Get project by ID
   * @param {number} projectId - Project ID
   * @returns {Promise<Object|null>} Project
   */
  async getProjectById(projectId) {
    return await this.projectRepository.findById(projectId);
  }

  /**
   * Create a new project
   * @param {Object} projectData - Project data
   * @returns {Promise<Object>} Created project
   */
  async createProject(projectData) {
    const project = await this.projectRepository.create(projectData);

    // Add creator as owner in team
    await this.teamRepository.create({
      projectId: project.id,
      userId: projectData.userId,
      role: 'owner',
    });

    return project;
  }

  /**
   * Update a project
   * @param {number} projectId - Project ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated project
   */
  async updateProject(projectId, updateData) {
    return await this.projectRepository.update(projectId, updateData);
  }

  /**
   * Delete a project
   * @param {number} projectId - Project ID
   * @returns {Promise<boolean>} Success
   */
  async deleteProject(projectId) {
    // Delete associated teams and collaborators first
    await this.teamRepository.deleteByProject(projectId);
    await this.projectCollaboratorRepository.deleteByProject(projectId);

    return await this.projectRepository.delete(projectId);
  }

  /**
   * Add user to project
   * @param {number} projectId - Project ID
   * @param {number} userId - User ID
   * @param {string} role - User role
   * @returns {Promise<Object>} Team member
   */
  async addUserToProject(projectId, userId, role = 'member') {
    return await this.teamRepository.create({
      projectId,
      userId,
      role,
    });
  }

  /**
   * Remove user from project
   * @param {number} projectId - Project ID
   * @param {number} userId - User ID
   * @returns {Promise<boolean>} Success
   */
  async removeUserFromProject(projectId, userId) {
    return await this.teamRepository.deleteByProjectAndUser(projectId, userId);
  }

  /**
   * Get project team members
   * @param {number} projectId - Project ID
   * @returns {Promise<Array>} Team members
   */
  async getProjectTeam(projectId) {
    return await this.teamRepository.findByProject(projectId);
  }
}

module.exports = ProjectService;
