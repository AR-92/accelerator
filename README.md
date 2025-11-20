# Scalable Boilerplate: Node.js + Express + Handlebars + PostgreSQL

A production-ready, scalable boilerplate for building modern web applications with Node.js, Express, Handlebars templating, PostgreSQL database, and comprehensive middleware stack.

## Features

- **Scalable Architecture**: Modular structure with controllers, models, middleware, and services
- **Security First**: Helmet, CORS, rate limiting, input validation, and sanitization
- **Database Abstraction**: Repository pattern with PostgreSQL support
- **Comprehensive Logging**: Winston-based logging with multiple transports
- **Testing Ready**: Jest setup with unit and integration tests
- **Container Ready**: Docker and docker-compose configuration
- **Environment Management**: Centralized configuration with environment variables
- **Error Handling**: Global error handling with proper HTTP status codes
- **Input Validation**: Express-validator for robust API validation
- **HTMX Integration**: Seamless AJAX interactions without JavaScript complexity
- **Modern UI**: Tailwind CSS v4 with shadcn/ui components

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (Supabase, AWS RDS, or local PostgreSQL)
- Docker (optional, for containerized deployment)

## Quick Start

1. **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd accelerator
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up environment variables:**
    ```bash
    cp .env.example .env
    # Edit .env with your database credentials
    ```

4. **Set up the database:**
    - Create a PostgreSQL database
    - Run the SQL schema from `db/init.sql`

5. **Start development:**
    ```bash
    npm run dev
    ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## Project Structure

```
accelerator/
├── src/
│   ├── config/           # Environment configuration
│   ├── controllers/      # Route handlers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Data models
│   ├── services/        # External services (database, etc.)
│   ├── utils/           # Utility functions
│   ├── helpers/         # Handlebars helpers
│   ├── styles/          # CSS files
│   └── app.js           # Express app setup
├── tests/               # Test files
│   ├── unit/           # Unit tests
│   └── integration/    # Integration tests
├── views/              # Handlebars templates
├── public/             # Static assets
├── db/                 # Database files
├── logs/               # Application logs
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Docker compose setup
├── jest.config.js      # Jest testing configuration
└── index.js            # Application entry point
```

## Available Scripts

### Development
- `npm run dev` - Start development mode (CSS watching + server)
- `npm run build-css` - Build Tailwind CSS with file watching
- `npm start` - Start the production server

### Testing
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

### Building
- `npm run build` - Build CSS for production

### Code Quality
- `npm run lint` - Run ESLint (when configured)
- `npm run format` - Run Prettier (when configured)

## API Documentation

### Todos API

All endpoints support both JSON responses and HTMX HTML fragments based on the request type.

#### GET /api/todos
Fetch all todos.

**Response (JSON):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Sample Todo",
      "description": "Description",
      "completed": false,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /api/todos
Create a new todo.

**Request Body:**
```json
{
  "title": "New Todo",
  "description": "Optional description"
}
```

#### PUT /api/todos/:id
Update a todo.

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated Description",
  "completed": true
}
```

#### DELETE /api/todos/:id
Delete a todo.

### Health Check

#### GET /health
Application health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development",
  "version": "1.0.0"
}
```

## Database Setup

### Using Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Settings > Database to find your connection details
3. Update your `.env` file with the credentials

### Using Docker

```bash
docker-compose up -d
```

This will start PostgreSQL and the application in containers.

### Manual PostgreSQL Setup

1. Create a PostgreSQL database
2. Run the schema from `db/init.sql`
3. Update your `.env` file with database credentials

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=accelerator
DB_USER=postgres
DB_PASSWORD=password

# Supabase (alternative to direct DB)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Security
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=http://localhost:3000
```

## Deployment

### Docker Deployment

```bash
# Build and run
docker-compose -f docker-compose.yml up -d

# Or for production
docker build -t accelerator .
docker run -p 3000:3000 accelerator
```

### Traditional Deployment

1. Build assets: `npm run build`
2. Set environment variables
3. Start with: `npm start`
4. Use a process manager like PM2 in production

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## Architecture Overview

### Controllers
Route handlers that process requests and return responses. Located in `src/controllers/`.

### Models
Data models that represent database entities and handle business logic. Located in `src/models/`.

### Services
External service integrations (database, APIs, etc.). Located in `src/services/`.

### Middleware
Custom middleware for authentication, validation, security, etc. Located in `src/middleware/`.

### Configuration
Centralized configuration management. Located in `src/config/`.

### Utils
Utility functions and helpers. Located in `src/utils/`.

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing control
- **Rate Limiting**: API rate limiting
- **Input Validation**: Request validation and sanitization
- **Error Handling**: Secure error responses

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass: `npm test`
6. Submit a pull request

## License

This project is licensed under the ISC License.