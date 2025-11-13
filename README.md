# Accelerator

A comprehensive web application accelerator for startups, enterprises, and businesses. Features AI-powered business modeling, collaboration tools, project management, and comprehensive reporting capabilities.

## Features

### AI-Powered Business Tools

- Business model generation and analysis
- Financial modeling and forecasting
- Funding strategy development
- Legal document assistance
- Marketing strategy planning
- Team building and recruitment tools

### Collaboration & Communication

- Real-time chat and messaging
- Team collaboration spaces
- File sharing and management
- Task and project management
- Calendar and scheduling
- Activity tracking and notifications

### Idea Management

- Idea creation and submission
- Community voting system
- Idea browsing and discovery
- Portfolio management
- Idea-to-business conversion tools

### Enterprise Features

- Multi-tenant dashboards (Corporate, Enterprise, Startup)
- Analytics and reporting
- User management and permissions
- Billing and subscription management
- Account settings and profile management

### Learning & Resources

- Interactive tutorials and courses
- Getting started guides
- Help center and FAQ
- Business plan generation
- Pitch deck creation
- Company valuation tools

### Admin Panel

The application includes a comprehensive admin panel for system administration and content management.

#### Features

- **User Management**: View, edit, and manage user accounts, roles, and credits
- **Content Management**: Manage help articles and learning content
- **Dashboard Analytics**: System statistics, user metrics, and activity monitoring
- **Security Features**: Rate limiting, audit logging, and secure authentication

#### Admin Panel Navigation

The admin panel features a responsive navigation system with:

- **Top Navbar**: Displays current page title, user information, and logout functionality
- **Sidebar Navigation**: Quick access to dashboard, users, content, and settings
- **Back to Site Link**: Easy navigation back to the main application
- **User Profile Display**: Shows admin user name, email, and avatar

#### Admin Access

To access the admin panel:

1. Create an admin user (if not already created):

   ```bash
   node create-admin.js
   ```

2. Login credentials:
   - Email: `admin@accelerator.com`
   - Password: `123456`

3. Navigate to `/admin/login` and sign in

#### Admin Routes

- `/admin/dashboard` - Main dashboard with system statistics
- `/admin/users` - User management interface
- `/admin/content` - Content management (help and learning articles)
- `/admin/settings` - System settings and configuration

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

6. The application will be available at `http://localhost:3002` in development mode (browser-sync proxy), or `http://localhost:3000` for direct server access

### Running in Production

To run the application in production mode:

```bash
npm start
```

### Build Process

Build the application assets for production:

```bash
npm run build
```

This compiles and minifies the CSS for production deployment.

### Environment Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Configure the following environment variables:

- `PORT` - Server port (default: 3000)
- `BASE_URL` - Base URL for CORS
- `ALLOWED_ORIGINS` - Comma-separated list of allowed origins

## Development Scripts

- `npm run dev` - Start development environment with hot reloading, CSS watching, and browser sync
- `npm run dev:server` - Start the development server with nodemon
- `npm run dev:tailwind` - Watch and compile Tailwind CSS
- `npm run dev:browser-sync` - Start browser sync for automatic reloading
- `npm start` - Start the production server
- `npm run build` - Build and minify CSS for production
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Project Structure

```
accelerator/
├── config/                   # Configuration files
│   ├── database.js          # Database configuration
│   ├── handlebars.js        # Handlebars templating config
│   └── security.js          # Security middleware config
├── data/                     # JSON data files
│   ├── ideas.json           # Idea storage
│   ├── portfolio.json       # Portfolio data
│   └── votes.json           # Voting data
├── public/                   # Static assets
│   ├── css/                 # Compiled CSS files
│   ├── js/                  # Client-side JavaScript
│   └── images/              # Image assets
├── src/                     # Source code
│   ├── components/          # Handlebars components
│   ├── controllers/         # Express controllers (organized by domain)
│   │   ├── admin/           # Admin controllers
│   │   ├── auth/            # Authentication controllers
│   │   ├── business/        # Business-related controllers
│   │   ├── content/         # Content management controllers
│   │   ├── idea/            # Idea management controllers
│   │   └── user/            # User management controllers
│   ├── middleware/          # Express middleware
│   │   ├── auth/            # Authentication middleware
│   │   └── error/           # Error handling middleware
│   ├── migrations/          # Database migrations
│   ├── models/              # Data models
│   ├── plugins/             # Tailwind plugins
│   ├── repositories/        # Data access repositories
│   ├── routes/              # Express routes
│   │   ├── api/v1/          # API endpoints
│   │   └── pages/           # Page routes
│   ├── services/            # Business logic services
│   ├── styles/              # CSS source files
│   ├── tests/               # Test files
│   ├── utils/               # Utility functions
│   ├── validators/          # Input validation
│   └── views/               # Handlebars templates
│       ├── layouts/         # Page layouts
│       ├── pages/           # Page templates
│       └── partials/        # Reusable components
├── .env.example             # Environment variables template
├── package.json             # Dependencies and scripts
├── server.js                # Main application server
└── tailwind.config.js       # Tailwind CSS configuration
```

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: Handlebars templating, HTMX, Tailwind CSS
- **Database**: JSON file storage (configurable)
- **AI Integration**: Custom LLM service integration
- **Development**: Nodemon, Browser-sync, Prettier
- **Security**: Helmet, CORS, Rate limiting
- **Build Tools**: Tailwind CSS CLI

## Health Check

The application provides a health check endpoint:

- `GET /health` - Returns application status and database connectivity

## License

MIT License
