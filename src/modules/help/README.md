# Help Module

The Help module manages the help center functionality, including articles, categories, search, and user support features for the Accelerator platform.

## Purpose

This module provides:

- Help center overview and navigation
- Article management and display
- Category organization
- Search functionality
- User feedback (helpful ratings)
- Help statistics and analytics

## Structure

```
help/
├── controllers/
│   └── HelpController.js          # Main help controller
├── services/
│   └── HelpService.js             # Help business logic
├── repositories/
│   ├── HelpContentRepository.js   # Article data access
│   └── HelpCategoryRepository.js  # Category data access
├── models/
│   ├── HelpContent.js             # Article model
│   └── HelpCategory.js            # Category model
├── routes/
│   ├── api/
│   │   └── index.js               # Help API endpoints
│   └── pages/
│       └── index.js               # Help page routes
└── index.js                       # Module registration
```

## Page Routes

### Help Center

- `GET /help` - Help center overview
- `GET /help/:categorySlug` - Articles by category
- `GET /help/article/:articleSlug` - Individual article
- `GET /help/search` - Search results

## API Endpoints

### Categories

- `GET /api/help/categories` - Get all categories

### Articles

- `GET /api/help/categories/:categorySlug/articles` - Get articles by category
- `GET /api/help/articles/:articleSlug` - Get article by slug
- `POST /api/help/articles/:articleId/helpful` - Mark article as helpful

### Search

- `GET /api/help/search?q=query` - Search articles

### Statistics

- `GET /api/help/stats` - Get help statistics

## Dependencies

- `shared/middleware/auth/auth` - Authentication middleware
- `shared/utils/logger` - Logging utility
- `shared/utils/errors/` - Error classes
- Database connection (`db`)

## Usage

The module is registered with the dependency injection container and provides:

```javascript
const helpModule = require('./modules/help')(container);
```

This registers:

- `helpController` - HelpController instance
- `helpService` - HelpService instance
- `helpContentRepository` - HelpContentRepository instance
- `helpCategoryRepository` - HelpCategoryRepository instance
