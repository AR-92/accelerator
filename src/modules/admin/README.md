# Admin Module

The Admin module handles all administrative functions for the Accelerator platform, including user management, system monitoring, content management, business operations, and AI model management.

## Purpose

This module provides:

- Administrative dashboard and system monitoring
- User management (view, edit, ban, credits, roles)
- Content management (learning, help articles)
- Business operations (corporates, enterprises, startups, ideas)
- Organization and package management
- Billing and transaction management
- AI model and workflow administration
- System health and statistics

## Structure

```
admin/
├── controllers/
│   ├── AdminDashboardController.js     # Dashboard and settings
│   ├── AdminSystemStatsController.js   # System monitoring
│   ├── AdminUserViewController.js      # User viewing operations
│   ├── AdminUserActionController.js    # User modification operations
│   ├── AdminBusinessController.js      # Business entity management
│   ├── AdminOrganizationController.js  # Organization and packages
│   ├── AdminAIController.js            # AI models and workflows
│   ├── AdminCreditController.js        # Billing and credits
│   └── AdminAuthController.js          # Admin authentication
├── services/
│   ├── AdminService.js                 # Core admin service
│   ├── SystemMonitoringService.js      # System health monitoring
│   ├── UserManagementService.js        # User management operations
│   ├── ContentManagementService.js     # Content management
│   ├── ProjectManagementService.js     # Project administration
│   └── BusinessManagementService.js    # Business operations
├── repositories/
│   └── AdminActivityRepository.js      # Admin activity logging
├── routes/
│   ├── api/
│   │   └── v1/admin/
│   │       └── index.js                # Admin API endpoints
│   └── pages/
│       └── admin.js                    # Admin page routes
└── index.js                            # Module registration
```

## API Endpoints

### Dashboard & System

- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/system-stats` - System statistics
- `GET /api/admin/system-health` - System health status

### User Management

- `GET /api/admin/users` - List users with filtering
- `GET /api/admin/users/:id` - Get user details
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id/credits` - Update user credits
- `PUT /api/admin/users/:id/role` - Update user role
- `PUT /api/admin/users/:id/status` - Update user status
- `PUT /api/admin/users/:id/banned` - Ban/unban user
- `PUT /api/admin/users/:id/password` - Reset user password
- `DELETE /api/admin/users/:id` - Delete user

### Business Management

- `GET /api/admin/collaborations` - List collaborations
- `GET /api/admin/projects` - List projects
- `GET /api/admin/ideas` - List ideas
- `GET /api/admin/startups` - List startups
- `GET /api/admin/enterprises` - List enterprises
- `GET /api/admin/corporates` - List corporates

### Content Management

- `GET /api/admin/content` - Content overview
- `GET /api/admin/learning-content` - Learning content
- `GET /api/admin/help-content` - Help content

### Organization & Billing

- `GET /api/admin/packages` - List packages
- `GET /api/admin/billing` - Billing overview
- `GET /api/admin/transactions` - Transaction history
- `GET /api/admin/credits` - Credits overview

### AI Management

- `GET /api/admin/ai-models` - AI models list
- `GET /api/admin/ai-workflows` - AI workflows list

## Page Routes

- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/users` - User management
- `GET /admin/content` - Content management
- `GET /admin/organizations` - Organization management
- `GET /admin/billing` - Billing management
- `GET /admin/credits` - Credits management
- `GET /admin/system-health` - System health
- And many more admin pages...

## Dependencies

- `shared/middleware/auth/adminAuth` - Admin authentication middleware
- Database connection (`db`)
- All other module services and repositories
- Various repositories for data access

## Usage

The module is registered with the dependency injection container and provides:

```javascript
const adminModule = require('./modules/admin')(container);
```

This registers:

- `adminDashboardController` - AdminDashboardController instance
- `adminSystemStatsController` - AdminSystemStatsController instance
- `adminUserViewController` - AdminUserViewController instance
- `adminUserActionController` - AdminUserActionController instance
- `adminBusinessController` - AdminBusinessController instance
- `adminOrganizationController` - AdminOrganizationController instance
- `adminAIController` - AdminAIController instance
- `adminCreditController` - AdminCreditController instance
- `adminAuthController` - AdminAuthController instance
- All admin services and repositories

## Security

All admin routes require admin authentication and authorization. The module includes rate limiting for sensitive operations and comprehensive logging of admin activities.
