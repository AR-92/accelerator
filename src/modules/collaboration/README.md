# Collaboration Module

The Collaboration module manages team collaboration features including projects, tasks, messages, team management, and file sharing for the Accelerator platform.

## Purpose

This module provides:

- Project management and collaboration
- Task board and task management
- Team directory and member management
- Real-time messaging and chat
- File repository and sharing
- Team calendar and scheduling
- Activity timeline and notifications
- Collaboration settings and preferences

## Structure

```
collaboration/
├── controllers/
│   └── CollaborationController.js     # Main collaboration controller
├── services/
│   ├── CollaborationService.js        # General collaboration logic
│   ├── ProjectService.js              # Project management logic
│   ├── TeamService.js                 # Team management logic
│   ├── TaskService.js                 # Task management logic
│   └── MessageService.js              # Message/chat logic
├── repositories/
│   ├── CollaborationRepository.js     # Collaboration data access
│   ├── ProjectRepository.js           # Project data access
│   ├── TeamRepository.js              # Team data access
│   ├── TaskRepository.js              # Task data access
│   ├── MessageRepository.js           # Message data access
│   └── ProjectCollaboratorRepository.js # Project collaborator data access
├── models/
│   ├── Project.js                     # Project model
│   ├── Team.js                        # Team member model
│   ├── Task.js                        # Task model
│   ├── Message.js                     # Message model
│   └── Collaboration.js               # Collaboration model
├── routes/
│   ├── api/
│   │   └── index.js                   # Collaboration API endpoints
│   └── pages/
│       └── index.js                   # Collaboration page routes
└── index.js                           # Module registration
```

## Page Routes

### Main Collaboration Hub

- `GET /collaborate` - Collaboration hub overview
- `GET /collaborate/chat` - Team chat interface
- `GET /collaborate/tasks` - Task board
- `GET /collaborate/files` - File repository
- `GET /collaborate/team` - Team directory
- `GET /collaborate/calendar` - Team calendar
- `GET /collaborate/activity` - Activity timeline
- `GET /collaborate/settings` - Collaboration settings
- `GET /collaborate/ai` - AI assistant chat
- `GET /collaborate/ai-new` - Detailed AI chat
- `GET /collaborate/manus-static` - Static chat interface

## API Endpoints

### Projects

- `GET /api/collaborate/projects` - Get user's projects

### Tasks

- `GET /api/collaborate/tasks` - Get user's tasks

### Messages

- `GET /api/collaborate/messages` - Get user's messages
- `POST /api/collaborate/messages` - Send a message

## Dependencies

- `shared/middleware/auth/auth` - Authentication middleware
- `shared/utils/logger` - Logging utility
- `shared/utils/errors/` - Error classes
- `userRepository` - User data access
- Database connection (`db`)

## Usage

The module is registered with the dependency injection container and provides:

```javascript
const collaborationModule = require('./modules/collaboration')(container);
```

This registers:

- `collaborationController` - CollaborationController instance
- `collaborationService` - CollaborationService instance
- `projectService` - ProjectService instance
- `teamService` - TeamService instance
- `taskService` - TaskService instance
- `messageService` - MessageService instance
- `collaborationRepository` - CollaborationRepository instance
- `projectRepository` - ProjectRepository instance
- `teamRepository` - TeamRepository instance
- `taskRepository` - TaskRepository instance
- `messageRepository` - MessageRepository instance
- `projectCollaboratorRepository` - ProjectCollaboratorRepository instance

## Features

### Project Management

- Create and manage collaborative projects
- Add/remove team members with different roles (owner, admin, member)
- Project status tracking (active, inactive, completed, archived)

### Task Management

- Create tasks within projects
- Assign tasks to team members
- Track task status (todo, in_progress, done, cancelled)
- Task board interface

### Team Management

- Team directory with member information
- Role-based permissions
- Team member management

### Messaging

- Real-time messaging within projects
- Message history and threading
- User permissions for messaging

### File Sharing

- File repository for project assets
- File sharing and collaboration
- Access control based on team membership

### Calendar & Activity

- Team calendar for scheduling
- Activity timeline for project updates
- Notification system for team activities
