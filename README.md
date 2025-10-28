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

### Development Scripts

- `npm run dev` - Start the development server with hot reloading
- `npm start` - Start the production server
- `npm run build:css` - Build the CSS files

## Project Structure

```
accelerator/
├── config/           # Configuration files
├── data/             # Data files (e.g., portfolio.json)
├── middleware/       # Express middleware
├── public/           # Static assets (CSS, JS, images)
├── routes/           # Express routes
├── src/              # Source files (SCSS, JS)
├── views/            # Handlebars templates
├── server.js         # Main server file
└── package.json      # Project dependencies and scripts
```

## Technologies Used

- Node.js
- Express.js
- Handlebars templating engine
- Tailwind CSS
- HTML5 & CSS3
- JavaScript (ES6+)

## License

MIT License