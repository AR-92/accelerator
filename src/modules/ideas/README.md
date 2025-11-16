# Ideas Module

The Ideas module handles business idea generation, management, voting, and exploration features for the Accelerator platform.

## Purpose

This module provides:

- Idea creation, editing, and deletion
- Idea search and filtering
- Favorite ideas functionality
- Voting system for idea evaluation
- Public idea browsing

## Structure

```
ideas/
├── controllers/
│   ├── IdeaController.js     # Main idea CRUD operations
│   └── VoteController.js     # Voting system operations
├── services/
│   ├── IdeaService.js        # Idea business logic
│   └── VoteService.js        # Vote business logic
├── repositories/
│   ├── IdeaRepository.js     # Idea data access
│   └── VoteRepository.js     # Vote data access
├── models/
│   ├── Idea.js               # Idea data model
│   └── Vote.js               # Vote data model
├── routes/
│   ├── api/
│   │   └── index.js          # Idea API endpoints
│   └── pages/
│       └── index.js          # Idea page routes
├── validators/
│   ├── ideaValidators.js     # Idea input validation
│   └── voteValidators.js     # Vote input validation
└── index.js                  # Module registration
```

## API Endpoints

### Ideas

- `GET /api/ideas` - Get all ideas (with filtering)
- `GET /api/ideas/search` - Search ideas
- `GET /api/ideas/:href` - Get idea by href
- `POST /api/ideas` - Create new idea (auth required)
- `PUT /api/ideas/:id` - Update idea (auth required)
- `DELETE /api/ideas/:id` - Delete idea (auth required)
- `POST /api/ideas/:id/favorite` - Toggle favorite (auth required)

### Votes

- `GET /api/ideas/:ideaSlug/votes` - Get votes for idea
- `POST /api/ideas/:ideaSlug/votes` - Add vote (auth required)
- `PUT /api/ideas/votes/:voteId` - Update vote (auth required)
- `DELETE /api/ideas/votes/:voteId` - Delete vote (auth required)
- `GET /api/ideas/:ideaSlug/votes/stats` - Get vote statistics
- `GET /api/ideas/user/votes` - Get user's votes (auth required)

## Page Routes

- `GET /ideas` - Browse ideas page
- `GET /ideas/:href` - Individual idea detail page

## Dependencies

- `shared/middleware/auth/` - Authentication middleware
- Database connection (`db`)
- User context for ownership validation

## Usage

The module is registered with the dependency injection container and provides:

```javascript
const ideasModule = require('./modules/ideas')(container);
```

This registers:

- `ideaController` - IdeaController instance
- `voteController` - VoteController instance
- `ideaService` - IdeaService instance
- `voteService` - VoteService instance
- `ideaRepository` - IdeaRepository instance
- `voteRepository` - VoteRepository instance

## Business Logic

### Ideas

- Users can create, edit, and delete their own ideas
- Ideas can be marked as favorites by users
- Public browsing of all ideas with optional authentication
- Search functionality across idea titles and descriptions

### Voting

- Users can vote on ideas with multiple criteria:
  - Market viability
  - Real-world problem solving
  - Innovation level
  - Technical feasibility
  - Scalability
  - Market survival potential
- Vote statistics are calculated and displayed
- Users can update or delete their own votes
