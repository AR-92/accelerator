/**
 * Project management service handling projects and teams for admin
 */
class ProjectManagementService {
  constructor(projectRepository, teamRepository, adminActivityRepository) {
    this.projectRepository = projectRepository;
    this.teamRepository = teamRepository;
    this.adminActivityRepository = adminActivityRepository;
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
        const NotFoundError = require('../../utils/errors/NotFoundError');
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
        const NotFoundError = require('../../utils/errors/NotFoundError');
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
        const NotFoundError = require('../../utils/errors/NotFoundError');
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
          targetType: 'project',
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
}

module.exports = ProjectManagementService;
