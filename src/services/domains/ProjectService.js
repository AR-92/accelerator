import logger from '../../utils/logger.js';

class ProjectService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  async createProject(projectData) {
    try {
      logger.debug('Creating project:', projectData.title);
      const result = await this.db.create('projects', {
        ...projectData,
        visibility: projectData.visibility || 'private',
        created_at: new Date().toISOString()
      });
      logger.info(`✅ Created project with ID: ${result.id}`);
      return result;
    } catch (error) {
      logger.error('Error creating project:', error);
      throw error;
    }
  }

  async getProjectById(id) {
    try {
      const projects = await this.db.read('projects', id);
      return projects[0] || null;
    } catch (error) {
      logger.error(`Error fetching project ${id}:`, error);
      throw error;
    }
  }

  async getAllProjects(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      let query = this.db.supabase
        .from('projects')
        .select('*', { count: 'exact' });

      if (filters.visibility) query = query.eq('visibility', filters.visibility);
      if (filters.owner_user_id) query = query.eq('owner_user_id', filters.owner_user_id);
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, count, page, limit };
    } catch (error) {
      logger.error('Error fetching projects:', error);
      throw error;
    }
  }

  async updateProject(id, updates) {
    try {
      logger.debug(`Updating project ${id}:`, updates);
      const result = await this.db.update('projects', id, updates);
      logger.info(`✅ Updated project ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error updating project ${id}:`, error);
      throw error;
    }
  }

  async deleteProject(id) {
    try {
      logger.debug(`Deleting project ${id}`);
      await this.db.delete('projects', id);
      logger.info(`✅ Deleted project ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting project ${id}:`, error);
      throw error;
    }
  }

  async getProjectWithCollaborators(id) {
    try {
      const project = await this.getProjectById(id);
      if (!project) return null;

      // Get collaborators
      const collaborators = await this.db.read('project_collaborators', null, { project_id: id });

      return {
        ...project,
        collaborators
      };
    } catch (error) {
      logger.error(`Error fetching project with collaborators ${id}:`, error);
      throw error;
    }
  }
}

class TaskService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  async createTask(taskData) {
    try {
      logger.debug('Creating task:', taskData.title);
      const result = await this.db.create('tasks', {
        ...taskData,
        status: taskData.status || 'todo',
        created_at: new Date().toISOString()
      });
      logger.info(`✅ Created task with ID: ${result.id}`);
      return result;
    } catch (error) {
      logger.error('Error creating task:', error);
      throw error;
    }
  }

  async getTaskById(id) {
    try {
      const tasks = await this.db.read('tasks', id);
      return tasks[0] || null;
    } catch (error) {
      logger.error(`Error fetching task ${id}:`, error);
      throw error;
    }
  }

  async getTasksByProject(projectId, filters = {}) {
    try {
      const taskFilters = { project_id: projectId };
      if (filters.status) taskFilters.status = filters.status;
      if (filters.assignee_user_id) taskFilters.assignee_user_id = filters.assignee_user_id;

      const tasks = await this.db.read('tasks', null, taskFilters);
      return tasks.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } catch (error) {
      logger.error(`Error fetching tasks for project ${projectId}:`, error);
      throw error;
    }
  }

  async getTasksByAssignee(userId, filters = {}) {
    try {
      const taskFilters = { assignee_user_id: userId };
      if (filters.status) taskFilters.status = filters.status;
      if (filters.project_id) taskFilters.project_id = filters.project_id;

      const tasks = await this.db.read('tasks', null, taskFilters);
      return tasks.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } catch (error) {
      logger.error(`Error fetching tasks for user ${userId}:`, error);
      throw error;
    }
  }

  async updateTask(id, updates) {
    try {
      logger.debug(`Updating task ${id}:`, updates);
      const result = await this.db.update('tasks', id, updates);
      logger.info(`✅ Updated task ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error updating task ${id}:`, error);
      throw error;
    }
  }

  async deleteTask(id) {
    try {
      logger.debug(`Deleting task ${id}`);
      await this.db.delete('tasks', id);
      logger.info(`✅ Deleted task ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting task ${id}:`, error);
      throw error;
    }
  }

  async updateTaskStatus(id, status) {
    try {
      logger.debug(`Updating task ${id} status to ${status}`);
      const result = await this.updateTask(id, {
        status,
        updated_at: new Date().toISOString()
      });
      logger.info(`✅ Updated task ${id} status to ${status}`);
      return result;
    } catch (error) {
      logger.error(`Error updating task ${id} status:`, error);
      throw error;
    }
  }

  async assignTask(id, userId) {
    try {
      logger.debug(`Assigning task ${id} to user ${userId}`);
      const result = await this.updateTask(id, {
        assignee_user_id: userId,
        updated_at: new Date().toISOString()
      });
      logger.info(`✅ Assigned task ${id} to user ${userId}`);
      return result;
    } catch (error) {
      logger.error(`Error assigning task ${id}:`, error);
      throw error;
    }
  }
}

class CollaborationService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  async createCollaboration(collaborationData) {
    try {
      logger.debug('Creating collaboration:', collaborationData.role);
      const result = await this.db.create('collaborations', {
        ...collaborationData,
        status: collaborationData.status || 'pending',
        created_at: new Date().toISOString()
      });
      logger.info(`✅ Created collaboration with ID: ${result.id}`);
      return result;
    } catch (error) {
      logger.error('Error creating collaboration:', error);
      throw error;
    }
  }

  async getCollaborationById(id) {
    try {
      const collaborations = await this.db.read('collaborations', id);
      return collaborations[0] || null;
    } catch (error) {
      logger.error(`Error fetching collaboration ${id}:`, error);
      throw error;
    }
  }

  async getCollaborationsByUser(userId) {
    try {
      const collaborations = await this.db.read('collaborations', null, { user_id: userId });
      return collaborations.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } catch (error) {
      logger.error(`Error fetching collaborations for user ${userId}:`, error);
      throw error;
    }
  }

  async getCollaborationsByProject(projectId) {
    try {
      const collaborations = await this.db.read('collaborations', null, { project_id: projectId });
      return collaborations.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } catch (error) {
      logger.error(`Error fetching collaborations for project ${projectId}:`, error);
      throw error;
    }
  }

  async updateCollaboration(id, updates) {
    try {
      logger.debug(`Updating collaboration ${id}:`, updates);
      const result = await this.db.update('collaborations', id, updates);
      logger.info(`✅ Updated collaboration ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error updating collaboration ${id}:`, error);
      throw error;
    }
  }

  async deleteCollaboration(id) {
    try {
      logger.debug(`Deleting collaboration ${id}`);
      await this.db.delete('collaborations', id);
      logger.info(`✅ Deleted collaboration ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting collaboration ${id}:`, error);
      throw error;
    }
  }

  async acceptCollaboration(id) {
    try {
      logger.debug(`Accepting collaboration ${id}`);
      const result = await this.updateCollaboration(id, {
        status: 'active',
        accepted_at: new Date().toISOString()
      });
      logger.info(`✅ Accepted collaboration ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error accepting collaboration ${id}:`, error);
      throw error;
    }
  }

  async rejectCollaboration(id) {
    try {
      logger.debug(`Rejecting collaboration ${id}`);
      const result = await this.updateCollaboration(id, {
        status: 'rejected',
        rejected_at: new Date().toISOString()
      });
      logger.info(`✅ Rejected collaboration ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error rejecting collaboration ${id}:`, error);
      throw error;
    }
  }

  async getAllCollaborations(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      let query = this.db.supabase
        .from('collaborations')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.user_id) query = query.eq('user_id', filters.user_id);
      if (filters.project_id) query = query.eq('project_id', filters.project_id);
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.search) {
        query = query.or(`role.ilike.%${filters.search}%,permissions.ilike.%${filters.search}%`);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, count, page, limit };
    } catch (error) {
      logger.error('Error fetching collaborations:', error);
      throw error;
    }
  }
}

class ProjectCollaboratorService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  async addCollaborator(collaboratorData) {
    try {
      logger.debug('Adding project collaborator:', collaboratorData.role);
      const result = await this.db.create('project_collaborators', {
        ...collaboratorData,
        status: collaboratorData.status || 'active',
        created_at: new Date().toISOString()
      });
      logger.info(`✅ Added project collaborator with ID: ${result.id}`);
      return result;
    } catch (error) {
      logger.error('Error adding project collaborator:', error);
      throw error;
    }
  }

  async getCollaboratorById(id) {
    try {
      const collaborators = await this.db.read('project_collaborators', id);
      return collaborators[0] || null;
    } catch (error) {
      logger.error(`Error fetching project collaborator ${id}:`, error);
      throw error;
    }
  }

  async getProjectCollaborators(projectId) {
    try {
      const collaborators = await this.db.read('project_collaborators', null, { project_id: projectId });
      return collaborators.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } catch (error) {
      logger.error(`Error fetching collaborators for project ${projectId}:`, error);
      throw error;
    }
  }

  async getUserCollaborations(userId) {
    try {
      const collaborations = await this.db.read('project_collaborators', null, { user_id: userId });
      return collaborations.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } catch (error) {
      logger.error(`Error fetching collaborations for user ${userId}:`, error);
      throw error;
    }
  }

  async updateCollaborator(id, updates) {
    try {
      logger.debug(`Updating project collaborator ${id}:`, updates);
      const result = await this.db.update('project_collaborators', id, updates);
      logger.info(`✅ Updated project collaborator ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error updating project collaborator ${id}:`, error);
      throw error;
    }
  }

  async removeCollaborator(id) {
    try {
      logger.debug(`Removing project collaborator ${id}`);
      await this.db.delete('project_collaborators', id);
      logger.info(`✅ Removed project collaborator ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error removing project collaborator ${id}:`, error);
      throw error;
    }
  }

  async updateCollaboratorRole(id, role, permissions = null) {
    try {
      logger.debug(`Updating collaborator ${id} role to ${role}`);
      const updates = { role };
      if (permissions) updates.permissions = permissions;

      const result = await this.updateCollaborator(id, updates);
      logger.info(`✅ Updated collaborator ${id} role to ${role}`);
      return result;
    } catch (error) {
      logger.error(`Error updating collaborator ${id} role:`, error);
      throw error;
    }
  }

  async getAllProjectCollaborators(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      let query = this.db.supabase
        .from('project_collaborators')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.project_id) query = query.eq('project_id', filters.project_id);
      if (filters.user_id) query = query.eq('user_id', filters.user_id);
      if (filters.role) query = query.eq('role', filters.role);
      if (filters.status) query = query.eq('status', filters.status);

      const { data, error, count } = await query
        .order('joined_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, count, page, limit };
    } catch (error) {
      logger.error('Error fetching project collaborators:', error);
      throw error;
    }
  }
}

// Alias for backward compatibility
const ProjectCoreService = ProjectService;

class ProjectManagementService {
  constructor(databaseService) {
    this.db = databaseService;
    this.project = new ProjectService(databaseService);
    this.task = new TaskService(databaseService);
    this.collaboration = new CollaborationService(databaseService);
    this.collaborator = new ProjectCollaboratorService(databaseService);
  }

  // Unified project search
  async searchProjects(searchTerm, filters = {}) {
    try {
      return await this.project.getAllProjects({
        ...filters,
        search: searchTerm
      });
    } catch (error) {
      logger.error('Error searching projects:', error);
      throw error;
    }
  }

  // Project dashboard stats
  async getProjectStats(userId = null) {
    try {
      let projectFilters = {};
      if (userId) projectFilters.owner_user_id = userId;

      const projects = await this.project.getAllProjects(projectFilters);

      const stats = {
        totalProjects: projects.count || 0,
        activeProjects: projects.data?.filter(p => p.status !== 'archived').length || 0,
        completedTasks: 0,
        pendingTasks: 0,
        totalCollaborators: 0
      };

      // Get task and collaborator stats for user's projects
      if (projects.data && projects.data.length > 0) {
        const projectIds = projects.data.map(p => p.id);

        for (const projectId of projectIds) {
          const tasks = await this.task.getTasksByProject(projectId);
          const collaborators = await this.collaborator.getProjectCollaborators(projectId);

          stats.completedTasks += tasks.filter(t => t.status === 'completed').length;
          stats.pendingTasks += tasks.filter(t => t.status !== 'completed').length;
          stats.totalCollaborators += collaborators.length;
        }
      }

      return stats;
    } catch (error) {
      logger.error('Error fetching project stats:', error);
      throw error;
    }
  }

  // Get user's projects with full details
  async getUserProjectsWithDetails(userId) {
    try {
      const projects = await this.project.getAllProjects({ owner_user_id: userId });

      const projectsWithDetails = await Promise.all(
        projects.data.map(async (project) => {
          const tasks = await this.task.getTasksByProject(project.id);
          const collaborators = await this.collaborator.getProjectCollaborators(project.id);

          return {
            ...project,
            taskCount: tasks.length,
            completedTasks: tasks.filter(t => t.status === 'completed').length,
            collaboratorCount: collaborators.length
          };
        })
      );

      return {
        ...projects,
        data: projectsWithDetails
      };
    } catch (error) {
      logger.error(`Error fetching projects with details for user ${userId}:`, error);
      throw error;
    }
  }
}

export {
  ProjectManagementService,
  ProjectCoreService,
  TaskService,
  CollaborationService,
  ProjectCollaboratorService
};
export default ProjectManagementService;