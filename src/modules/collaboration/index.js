/**
 * Collaboration Module
 *
 * Handles team collaboration features including projects, tasks, messages, and team management.
 * This module provides both API endpoints and page routes for collaboration features.
 */

const CollaborationController = require('./controllers/CollaborationController');
const CollaborationService = require('./services/CollaborationService');
const ProjectService = require('./services/ProjectService');
const TeamService = require('./services/TeamService');
const TaskService = require('./services/TaskService');
const MessageService = require('./services/MessageService');

const CollaborationRepository = require('./repositories/CollaborationRepository');
const ProjectRepository = require('./repositories/ProjectRepository');
const TeamRepository = require('./repositories/TeamRepository');
const TaskRepository = require('./repositories/TaskRepository');
const MessageRepository = require('./repositories/MessageRepository');
const ProjectCollaboratorRepository = require('./repositories/ProjectCollaboratorRepository');

const Project = require('./models/Project');
const Team = require('./models/Team');
const Task = require('./models/Task');
const Message = require('./models/Message');
const Collaboration = require('./models/Collaboration');

module.exports = (container) => {
  // Register repositories
  container.register(
    'collaborationRepository',
    () => new CollaborationRepository(container.get('db'))
  );
  container.register(
    'projectRepository',
    () => new ProjectRepository(container.get('db'))
  );
  container.register(
    'teamRepository',
    () => new TeamRepository(container.get('db'))
  );
  container.register(
    'taskRepository',
    () => new TaskRepository(container.get('db'))
  );
  container.register(
    'messageRepository',
    () => new MessageRepository(container.get('db'))
  );
  container.register(
    'projectCollaboratorRepository',
    () => new ProjectCollaboratorRepository(container.get('db'))
  );

  // Register services
  container.register(
    'collaborationService',
    () =>
      new CollaborationService(
        container.get('collaborationRepository'),
        container.get('projectRepository'),
        container.get('teamRepository'),
        container.get('taskRepository'),
        container.get('messageRepository'),
        container.get('projectCollaboratorRepository')
      )
  );
  container.register(
    'projectService',
    () =>
      new ProjectService(
        container.get('projectRepository'),
        container.get('teamRepository'),
        container.get('projectCollaboratorRepository')
      )
  );
  container.register(
    'teamService',
    () =>
      new TeamService(
        container.get('teamRepository'),
        container.get('userRepository')
      )
  );
  container.register(
    'taskService',
    () =>
      new TaskService(
        container.get('taskRepository'),
        container.get('projectRepository'),
        container.get('teamRepository')
      )
  );
  container.register(
    'messageService',
    () =>
      new MessageService(
        container.get('messageRepository'),
        container.get('projectRepository'),
        container.get('teamRepository')
      )
  );

  // Register controllers
  container.register(
    'collaborationController',
    () =>
      new CollaborationController(
        container.get('collaborationService'),
        container.get('projectService'),
        container.get('teamService'),
        container.get('taskService'),
        container.get('messageService')
      )
  );

  return {
    CollaborationController: container.get('collaborationController'),
    CollaborationService: container.get('collaborationService'),
    ProjectService: container.get('projectService'),
    TeamService: container.get('teamService'),
    TaskService: container.get('taskService'),
    MessageService: container.get('messageService'),
    CollaborationRepository: container.get('collaborationRepository'),
    ProjectRepository: container.get('projectRepository'),
    TeamRepository: container.get('teamRepository'),
    TaskRepository: container.get('taskRepository'),
    MessageRepository: container.get('messageRepository'),
    ProjectCollaboratorRepository: container.get(
      'projectCollaboratorRepository'
    ),
    Project,
    Team,
    Task,
    Message,
    Collaboration,
  };
};
