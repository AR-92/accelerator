# Auth Module

The Authentication module handles all user authentication and authorization features for the Accelerator platform.

## Purpose

This module provides:

- User registration and login
- Password management
- Profile management
- Session management
- Role-based access control

## Structure

```
auth/
├── controllers/
│   └── AuthController.js      # Main auth controller
├── services/
│   └── AuthService.js         # Auth business logic
├── repositories/
│   └── UserRepository.js      # User data access
├── models/
│   └── User.js                # User model
├── routes/
│   ├── api/
│   │   └── index.js           # Auth API endpoints
│   └── pages/
│       └── index.js           # Auth page routes
├── validators/
│   └── authValidators.js      # Input validation
└── index.js                   # Module registration
```

## API Endpoints

### Authentication

- `POST /auth/login` - User login
- `POST /auth/signup` - User registration
- `POST /auth/logout` - User logout

### Profile Management

- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password

### Admin Functions

- `GET /api/auth/users/role/:role` - Get users by role
- `GET /api/auth/users/search` - Search users

## Dependencies

- `shared/middleware/auth/auth` - Authentication middleware
- `shared/utils/logger` - Logging utility
- `shared/utils/errors/` - Error classes
- Database connection (`db`)

## Usage

The module is registered with the dependency injection container and provides:

```javascript
const authModule = require('./modules/auth')(container);
```

This registers:

- `authController` - AuthController instance
- `authService` - AuthService instance
- `userRepository` - UserRepository instance
