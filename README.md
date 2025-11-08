# Accelerator

A web application for managing ideas, portfolios, and business development processes.

## Features

- Dashboard with idea management
- Portfolio tracking
- Chat functionality
- Report generation
- Settings management
- Idea creation and voting system

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd accelerator
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file based on `.env.example`:

   ```bash
   cp .env.example .env
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. The application will be available at `http://localhost:3000` (or the port specified in your .env file)

### Running in Production

To run the application in production mode:

```bash
npm start
```

## Deployment

### PM2 Process Management

For production deployments, use PM2 for process management:

1. Install PM2 globally:

   ```bash
   npm install -g pm2
   ```

2. Start the application with PM2:

   ```bash
   pm2 start ecosystem.config.js
   ```

3. Other useful PM2 commands:
   ```bash
   pm2 stop ecosystem.config.js      # Stop the application
   pm2 restart ecosystem.config.js   # Restart the application
   pm2 reload ecosystem.config.js    # Reload the application
   pm2 logs accelerator             # View logs
   pm2 monit                        # Monitor resources
   ```

### Build Process

Before deploying, build the application assets:

```bash
npm run build
```

This creates a production-ready build in the `dist` directory.

### Environment Configurations

The application supports different environments:

- `.env` - Development environment
- `.env.staging` - Staging environment
- `.env.production` - Production environment

## Development Scripts

- `npm run dev` - Start the development server with hot reloading
- `npm start` - Start the production server
- `npm run build:css` - Build the CSS files
- `npm run build` - Build the entire application for production
- `npm run pm2:start` - Start the application with PM2
- `npm run pm2:stop` - Stop the application with PM2
- `npm run pm2:restart` - Restart the application with PM2

## Project Structure

```
accelerator/
├── config/                   # Configuration files
├── data/                     # Data files (e.g., portfolio.json)
├── docs/                     # Project documentation
├── logs/                     # Application logs (created automatically)
├── public/                   # Static assets (CSS, JS, images, icons)
│   ├── css/                  # Compiled CSS files
│   ├── js/                   # Client-side JavaScript
│   ├── images/               # Image assets
│   ├── icons/                # Icon files
│   └── uploads/              # User uploaded files
├── src/                      # Source files
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Express middleware
│   ├── models/               # Data models
│   ├── routes/               # Express routes
│   │   ├── pages/            # Page routes (HTML)
│   │   └── api/              # API routes (JSON)
│   │       └── v1/           # API version 1
│   ├── services/             # Business logic services
│   ├── utils/                # Utility functions
│   ├── views/                # Handlebars templates
│   │   ├── layouts/          # Template layouts
│   │   ├── partials/         # Reusable template components
│   │   ├── pages/            # Page-specific templates
│   │   └── components/       # UI components
│   └── styles/               # Source CSS/SCSS files
├── tests/                    # Test files
│   ├── unit/                 # Unit tests
│   ├── integration/          # Integration tests
│   └── fixtures/             # Test fixtures
├── ecosystem.config.js       # PM2 configuration
├── server.js                 # Main server file
└── package.json              # Project dependencies and scripts
```

## Technologies Used

- Node.js
- Express.js
- Handlebars templating engine
- Tailwind CSS
- Winston logging
- PM2 process manager
- Docker containerization
- HTML5 & CSS3
- JavaScript (ES6+)

## Health Check

The application provides a health check endpoint:

- `GET /health` - Returns application status and database connectivity

## License

MIT License
