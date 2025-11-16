# Startup Module

The Startup module handles all startup management features for the Accelerator platform.

## Purpose

This module provides:

- Startup CRUD operations (Create, Read, Update, Delete)
- Startup search and filtering
- User-specific startup management
- Industry and status-based categorization

## Structure

```
startup/
├── controllers/
│   └── StartupController.js      # Main startup controller
├── services/
│   └── StartupService.js         # Startup business logic
├── repositories/
│   └── StartupRepository.js      # Startup data access
├── models/
│   └── Startup.js                # Startup model
├── routes/
│   ├── api/
│   │   └── index.js              # Startup API endpoints
│   └── pages/
│       └── index.js              # Startup page routes
└── index.js                      # Module registration
```

## API Endpoints

### Startup Management

- `GET /api/startups` - Get all startups (with optional filtering)
- `GET /api/startups/search` - Search startups by name/description
- `GET /api/startups/filtered` - Get startups with advanced filtering
- `GET /api/startups/:id` - Get startup by ID
- `POST /api/startups` - Create a new startup (requires auth)
- `PUT /api/startups/:id` - Update a startup (requires auth)
- `DELETE /api/startups/:id` - Delete a startup (requires auth)

## Dependencies

- `shared/middleware/auth/auth` - Authentication middleware
- `shared/models/BaseModel` - Base model class
- `shared/repositories/BaseRepository` - Base repository class
- `shared/utils/errors/` - Error classes
- Database connection (`db`)

## Usage

The module is registered with the dependency injection container and provides:

```javascript
const startupModule = require('./modules/startup')(container);
```

This registers:

- `startupController` - StartupController instance
- `startupService` - StartupService instance
- `startupRepository` - StartupRepository instance
