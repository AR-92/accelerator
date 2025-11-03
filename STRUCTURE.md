# Project Structure

This document describes the organized structure of the Accelerator project.

## Directory Structure

```
accelerator/
├── config/                 # Configuration files
│   ├── database.js         # Database configuration
│   └── handlebars.js       # Handlebars configuration
├── data/                   # Data files (JSON, etc.)
│   └── portfolio.json      # Portfolio data
├── middleware/             # Express middleware
│   ├── auth.js             # Authentication middleware
│   ├── errorHandler.js     # Error handling middleware
│   └── validation.js       # Validation middleware
├── public/                 # Publicly accessible assets
│   ├── css/                # Stylesheets
│   │   ├── charts.css      # Chart styling
│   │   ├── scroll.css      # Scroll styling
│   │   └── animate.min.css # Animation library
│   ├── js/                 # JavaScript files
│   │   ├── htmx.min.js     # HTMX library
│   │   └── main.js         # Main JavaScript
│   ├── images/             # Image assets
│   └── favicons/           # Favicon files
├── routes/                 # Express route handlers
│   ├── api/                # API routes
│   │   └── api.js          # Main API routes
│   └── pages/              # Page routes
│       ├── auth.js         # Authentication routes
│       └── main.js         # Main page routes
├── src/                    # Source files
│   ├── controllers/        # Controller logic (empty - for future use)
│   ├── models/             # Data models (empty - for future use)
│   ├── services/           # Business logic services
│   │   └── llmService.js   # LLM service
│   ├── styles/             # Additional styles (empty - for future use)
│   ├── utils/              # Utility functions (empty - for future use)
│   ├── input.css           # Main Tailwind input file
│   ├── safelist.css        # Tailwind safelist
│   └── tokens.css          # Design tokens
├── views/                  # Handlebars templates
│   ├── layouts/            # Layout templates
│   ├── partials/           # Reusable components
│   ├── components/         # View components (empty - for future use)
│   └── [feature dirs]      # Feature-specific templates
├── tests/                  # Test files (empty - for future use)
├── docs/                   # Documentation (empty - for future use)
├── scripts/                # Build/deployment scripts (empty - for future use)
├── server.js               # Main server file
├── package.json            # Project dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── .env.example            # Environment variables example
└── README.md               # Project README
```

## Key Changes

- **Separation of Concerns**: Files are now organized by their function/purpose
- **Better Maintainability**: Logical grouping makes it easier to find and modify code
- **Scalability**: New features can be added in appropriate directories
- **Public Assets**: Static assets are properly served from the public directory
- **Route Organization**: API and page routes are separated for clarity

## Migration Notes

When adding new features:
- Place API routes in `routes/api/`
- Place page routes in `routes/pages/`
- Place service logic in `src/services/`
- Place controller logic in `src/controllers/`
- Place data models in `src/models/`
- Place reusable view components in `views/components/`
- Place utility functions in `src/utils/`