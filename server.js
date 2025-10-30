require('dotenv').config();
const express = require('express');
const path = require('path');
const { handlebarsConfig } = require('./config/handlebars');
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler');

// Import routes
const authRoutes = require('./src/routes/pages/auth');
const pageRoutes = require('./src/routes/pages/main');
const apiRoutes = require('./src/routes/api/v1/api');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up Handlebars as the templating engine
app.engine('hbs', handlebarsConfig);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/auth', authRoutes);
app.use('/pages', pageRoutes);
app.use('/api', apiRoutes);

// Home route (redirect to login)
app.get('/', (req, res) => {
  res.redirect('/auth/login');
});

// 404 handler
app.use('*', notFoundHandler);

// Error handler
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});