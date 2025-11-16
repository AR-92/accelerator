# Learning Module

The Learning module handles learning content management including articles, categories, search, and user progress tracking for the Accelerator platform.

## Purpose

This module provides:

- Learning content management (articles, categories)
- Search and filtering capabilities
- User progress tracking
- Like/unlike functionality
- Learning statistics

## Structure

```
learning/
├── controllers/
│   └── LearningController.js         # Main learning controller
├── services/
│   └── LearningService.js            # Learning business logic
├── repositories/
│   ├── LearningContentRepository.js  # Article data access
│   └── LearningCategoryRepository.js # Category data access
├── models/
│   ├── LearningContent.js            # Article model
│   └── LearningCategory.js           # Category model
├── routes/
│   ├── api/
│   │   └── index.js                  # Learning API endpoints
│   └── pages/
│       └── index.js                  # Learning page routes
└── index.js                          # Module registration
```

## API Endpoints

### Content Management

- `GET /api/learning/categories` - Get all categories
- `GET /api/learning/categories/:categorySlug/articles` - Get articles by category
- `GET /api/learning/articles/:articleSlug` - Get article by slug
- `GET /api/learning/search` - Search articles
- `GET /api/learning/stats` - Get learning statistics

### User Progress (Authenticated)

- `GET /api/learning/progress/:articleId` - Get user progress for article
- `PUT /api/learning/progress/:articleId` - Update user progress
- `POST /api/learning/progress/:articleId/complete` - Mark article as completed
- `GET /api/learning/progress` - Get all user progress

### Social Features (Authenticated)

- `POST /api/learning/articles/:articleId/like` - Like an article
- `DELETE /api/learning/articles/:articleId/like` - Unlike an article

## Page Routes

- `GET /learn` - Learning center overview
- `GET /learn/search` - Search results page
- `GET /learn/category/:categorySlug` - Category articles page
- `GET /learn/article/:articleSlug` - Individual article page

## Dependencies

- `shared/middleware/auth/auth` - Authentication middleware
- `shared/models/BaseModel` - Base model class
- `shared/repositories/BaseRepository` - Base repository class
- `shared/utils/errors/` - Error classes
- Database connection (`db`)

## Usage

The module is registered with the dependency injection container and provides:

```javascript
const learningModule = require('./modules/learning')(container);
```

This registers:

- `learningController` - LearningController instance
- `learningService` - LearningService instance
- `learningContentRepository` - LearningContentRepository instance
- `learningCategoryRepository` - LearningCategoryRepository instance
