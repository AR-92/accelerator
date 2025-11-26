# Accelerator

A comprehensive business accelerator platform built with Node.js, designed to streamline business development, project management, and growth tracking for startups and enterprises.

## Features

### 🏢 Business Management

- **Business Models**: Create and manage different business model templates (startup, enterprise, nonprofit)
- **Business Plans**: Develop detailed business plans with financial projections
- **Enterprises**: Track and manage enterprise-level ventures
- **Financial Modeling**: Comprehensive financial planning and analysis tools

### 📊 Dashboard & Analytics

- **Admin Dashboard**: System health monitoring, performance metrics, and activity tracking
- **Business Analytics**: Growth metrics, success rates, funding progress, and team expansion
- **System Health**: Real-time monitoring of database connections, memory usage, and performance
- **Interactive Charts**: Visual representation of trends and data using Chart.js

### 🎯 Project Management

- **Project Tracking**: Monitor project status from draft to completion
- **Collaboration Tools**: Team collaboration features and project milestones
- **Task Management**: Organize and track project tasks and deliverables

### 📚 Learning Platform

- **Learning Modules**: Structured learning paths (basics, intermediate, advanced)
- **Content Management**: Create and manage educational content
- **Assessments**: Learning progress tracking and evaluations

### 👥 User Management

- **Authentication**: Secure login/signup system
- **Role-based Access**: Admin, user, and moderator roles
- **Profile Management**: User profiles with customizable settings

### 🔧 System Administration

- **System Configuration**: Comprehensive settings management
- **API Management**: RESTful API endpoints for integrations
- **Security Features**: Rate limiting, CORS, CSRF protection, input sanitization
- **Logging & Monitoring**: Winston-based logging with multiple transports

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **Frontend**: Handlebars templating, TailwindCSS
- **Charts**: Chart.js
- **Authentication**: JWT, session management
- **Security**: Helmet, rate limiting, input validation
- **Deployment**: Docker support

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account (for database)

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/AR-92/accelerator.git
   cd accelerator
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file with the required environment variables:
   - Database connection (Supabase URL and keys)
   - JWT secret
   - Email configuration (optional)
   - Other settings as needed

4. **Build CSS**
   ```bash
   npm run build-css
   ```

## Usage

### Development

```bash
npm run dev
```

This starts the development server with hot reloading for both the Node.js server and CSS compilation.

### Production

```bash
npm run build
npm start
```

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with auto-reload
- `npm run build-css` - Build CSS from Tailwind sources
- `npm run build` - Build CSS for production
- `npm run lint` - Run linting (currently configured to skip)
- `npm run format` - Format code with Prettier
- `npm run fetch-openapi` - Fetch OpenAPI specifications

## API Documentation

The application provides RESTful API endpoints for:

- Business data management
- User authentication
- System health monitoring
- Content management
- Learning module interactions

API endpoints are available under `/api/` routes with proper authentication and validation.

## Database Schema

The application uses Supabase with tables for:

- Users and authentication
- Business models and plans
- Projects and tasks
- Financial data
- Learning content
- System logs and settings

## Docker Support

A `docker-compose.yml` file is provided for containerized deployment. Use:

```bash
docker-compose up -d
```

## Configuration

The application supports extensive configuration through environment variables. Key configuration areas include:

- **Server Settings**: Port, environment, clustering
- **Database**: Connection pooling, SSL, migrations
- **Security**: Rate limiting, CORS, authentication
- **UI/UX**: Theming, localization, performance
- **AI Integration**: OpenAI API configuration for content generation
- **Email & Notifications**: SMTP settings, webhooks
- **Compliance**: GDPR, audit trails, data retention

See `.env.example` for all available configuration options.

## Security Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Input Validation**: Comprehensive validation using express-validator
- **Security Headers**: Helmet.js for secure HTTP headers
- **Rate Limiting**: Protection against abuse with configurable limits
- **Data Sanitization**: Input cleaning and XSS prevention
- **CSRF Protection**: Cross-site request forgery prevention
- **Audit Logging**: Comprehensive logging for security events

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Code Quality

- **Linting**: ESLint configuration (currently disabled)
- **Formatting**: Prettier for consistent code style
- **Testing**: Framework setup ready (tests to be implemented)

## License

ISC License - see the package.json for details.

## Support

For support and questions:

- Create an issue on [GitHub](https://github.com/AR-92/accelerator/issues)
- Check the documentation in the `/docs` folder (if available)

## Roadmap

Future enhancements may include:

- Advanced AI-powered business insights
- Mobile application
- Multi-tenant architecture
- Advanced reporting and analytics
- Integration with third-party business tools
