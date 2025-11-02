// Error handling middleware

const { logger } = require('../../config/logger');

const errorHandler = (err, req, res) => {
  logger.error(err.stack);

  // In development, send full error details
  if (process.env.NODE_ENV === 'development') {
    res.status(500).send(`
      <div class="text-red-500 p-4">
        <h2>Something went wrong!</h2>
        <pre>${err.message}</pre>
      </div>
    `);
  } else {
    // In production, send generic error message
    res.status(500).send(`
      <div class="text-red-500 p-4">
        <h2>Something went wrong!</h2>
        <p>Please try again later.</p>
      </div>
    `);
  }
};

const notFoundHandler = (req, res) => {
  res.status(404).render('pages/404', {
    title: 'Page Not Found - Minimal Dark UI',
    mainPadding: 'py-16',
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
