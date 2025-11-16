/**
 * Team service handling team business logic
 */
class TeamService {
  constructor(teamRepository, userRepository) {
    this.teamRepository = teamRepository;
    this.userRepository = userRepository;
  }

  /**
   * Get teams for a user
   * @param {number} userId - User ID
   * @returns {Promise<Array>} Teams with project info
   */
  async getUserTeams(userId) {
    const teams = await this.teamRepository.findByUser(userId);

    // Enrich with project information
    const enrichedTeams = await Promise.all(
      teams.map(async (team) => {
        const project = await this.teamRepository.getProjectById(
          team.projectId
        );
        return {
          ...team,
          project: project
            ? {
                id: project.id,
                title: project.title,
                description: project.description,
                status: project.status,
              }
            : null,
        };
      })
    );

    return enrichedTeams;
  }

  /**
   * Get team members for a project
   * @param {number} projectId - Project ID
   * @returns {Promise<Array>} Team members with user info
   */
  async getProjectTeamMembers(projectId) {
    const teamMembers = await this.teamRepository.findByProject(projectId);

    // Enrich with user information
    const enrichedMembers = await Promise.all(
      teamMembers.map(async (member) => {
        const user = await this.userRepository.findById(member.userId);
        return {
          ...member,
          user: user
            ? {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
              }
            : null,
        };
      })
    );

    return enrichedMembers;
  }

  /**
   * Add user to team
   * @param {number} projectId - Project ID
   * @param {number} userId - User ID
   * @param {string} role - User role
   * @returns {Promise<Object>} Team member
   */
  async addTeamMember(projectId, userId, role = 'member') {
    return await this.teamRepository.create({
      projectId,
      userId,
      role,
    });
  }

  /**
   * Update team member role
   * @param {number} teamId - Team member ID
   * @param {string} role - New role
   * @returns {Promise<Object>} Updated team member
   */
  async updateTeamMemberRole(teamId, role) {
    return await this.teamRepository.update(teamId, { role });
  }

  /**
   * Remove user from team
   * @param {number} projectId - Project ID
   * @param {number} userId - User ID
   * @returns {Promise<boolean>} Success
   */
  async removeTeamMember(projectId, userId) {
    return await this.teamRepository.deleteByProjectAndUser(projectId, userId);
  }

  /**
   * Check if user is team member
   * @param {number} projectId - Project ID
   * @param {number} userId - User ID
   * @returns {Promise<boolean>} Is member
   */
  async isTeamMember(projectId, userId) {
    const member = await this.teamRepository.findByProjectAndUser(
      projectId,
      userId
    );
    return !!member;
  }

  /**
   * Check if user is team admin/owner
   * @param {number} projectId - Project ID
   * @param {number} userId - User ID
   * @returns {Promise<boolean>} Is admin/owner
   */
  async isTeamAdmin(projectId, userId) {
    const member = await this.teamRepository.findByProjectAndUser(
      projectId,
      userId
    );
    return member && (member.role === 'admin' || member.role === 'owner');
  }

  /**
   * Get team member role
   * @param {number} projectId - Project ID
   * @param {number} userId - User ID
   * @returns {Promise<string|null>} Role or null if not member
   */
  async getTeamMemberRole(projectId, userId) {
    const member = await this.teamRepository.findByProjectAndUser(
      projectId,
      userId
    );
    return member ? member.role : null;
  }
}

module.exports = TeamService;
