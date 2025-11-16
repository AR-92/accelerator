# Corporate Module

The Corporate module handles corporate business management for the Accelerator platform, including corporate profiles, search, filtering, statistics, and bulk operations.

## Purpose

This module provides:

- Corporate profile management (create, read, update, delete)
- Advanced search and filtering capabilities
- Corporate statistics and analytics
- Bulk operations for multiple corporates
- CSV export functionality

## Structure

```
corporate/
├── controllers/
│   └── CorporateController.js    # All corporate operations
├── services/
│   └── CorporateService.js       # Corporate business logic
├── repositories/
│   └── CorporateRepository.js    # Corporate data access
├── models/
│   └── Corporate.js              # Corporate data model
├── routes/
│   ├── api/
│   │   └── index.js              # Corporate API endpoints
│   └── pages/
│       └── index.js              # Corporate page routes
└── index.js                      # Module registration
```

## API Endpoints

### Corporate Management

- `GET /api/corporates` - Get all corporates (with pagination)
- `GET /api/corporates/search` - Search corporates by query
- `GET /api/corporates/filtered` - Get corporates with advanced filtering
- `GET /api/corporates/:id` - Get corporate by ID
- `POST /api/corporates` - Create new corporate (auth required)
- `PUT /api/corporates/:id` - Update corporate (auth required)
- `DELETE /api/corporates/:id` - Delete corporate (auth required)

### Analytics & Operations

- `GET /api/corporates/stats/statistics` - Get corporate statistics
- `PUT /api/corporates/bulk/status` - Bulk update corporate status (auth required)
- `DELETE /api/corporates/bulk/delete` - Bulk delete corporates (auth required)
- `GET /api/corporates/export/csv` - Export corporates to CSV (auth required)

## Page Routes

- `GET /corporates` - Corporate listing page
- `GET /corporates/:id` - Individual corporate detail page

## Business Logic

### Corporate Profiles

- **Industry Classification**: Technology, Finance, Healthcare, etc.
- **Company Size**: Startup, Small, Medium, Large, Enterprise
- **Status Tracking**: Active, Inactive, Acquired, Failed
- **Sector Analysis**: B2B, B2C, B2G, etc.

### Search & Filtering

- **Text Search**: Company name, description, industry
- **Advanced Filters**: Industry, sector, company size, status
- **Pagination**: Efficient handling of large datasets

### Statistics & Analytics

- **Industry Distribution**: Breakdown by industry sectors
- **Growth Metrics**: New corporates, status changes
- **Geographic Analysis**: Regional distribution
- **Performance Tracking**: Success rates, acquisition trends

### Bulk Operations

- **Status Updates**: Change multiple corporates' status simultaneously
- **Bulk Deletion**: Remove multiple corporates with confirmation
- **Data Export**: CSV export with customizable filters

## Dependencies

- `shared/middleware/auth/auth` - Authentication middleware
- Database connection (`db`)
- User context for ownership validation

## Usage

The module is registered with the dependency injection container and provides:

```javascript
const corporateModule = require('./modules/corporate')(container);
```

This registers:

- `corporateController` - CorporateController instance
- `corporateService` - CorporateService instance
- `corporateRepository` - CorporateRepository instance

## Data Model

Corporate entities include:

- **Basic Info**: Name, description, website, location
- **Classification**: Industry, sector, company size
- **Status**: Current operational status
- **Financials**: Revenue, funding, valuation
- **Team**: Executive team, board members
- **Metrics**: Employee count, growth rate, market share
