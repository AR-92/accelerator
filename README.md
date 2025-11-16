# Accelerator

A comprehensive web application accelerator built with Node.js, Express, Handlebars, and Tailwind CSS. This platform helps entrepreneurs and teams accelerate their idea development through AI-powered tools, business modeling, marketing strategies, financial projections, and collaboration features.

## Features

- **AI-Powered Idea Generation**: Generate and refine business ideas using integrated AI models
- **Business Model Templates**: Pre-built templates for various business models
- **Marketing Strategies**: AI-assisted marketing plan creation
- **Financial Projections**: Built-in financial modeling tools
- **Team Building**: Collaboration and team management features
- **Admin Dashboard**: Comprehensive admin interface for system management
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/accelerator.git
   cd accelerator
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Configure your database connection and other settings

4. Set up the database:

   ```bash
   npm run db:setup
   ```

5. Run database migrations:
   ```bash
   npm run db:migrate
   ```

## Usage

### Development

```bash
npm run dev
```

This starts the development server with hot reloading, Tailwind CSS watching, and browser sync.

### Production

```bash
npm run build
npm start
```

### Testing

```bash
npm test
```

## Project Structure

- `src/` - Main application source code
  - `admin/` - Admin-specific controllers, services, and routes
  - `main/` - Main application features
  - `common/` - Shared utilities and authentication
  - `components/` - Handlebars components
  - `middleware/` - Express middleware
  - `utils/` - Utility functions
  - `validators/` - Input validation
- `views/` - Handlebars templates
- `public/` - Static assets (CSS, JS, images)
- `sql/` - Database schemas and setup scripts
- `config/` - Configuration files
- `tests/` - Unit and integration tests

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development environment
- `npm run build` - Build CSS for production
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run db:setup` - Set up database
- `npm run db:migrate` - Run database migrations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run `npm run format` and `npm test`
6. Submit a pull request

## License

This project is licensed under the ISC License.
