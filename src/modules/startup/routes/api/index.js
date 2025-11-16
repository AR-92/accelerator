const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../../../shared/middleware/auth/auth');

// Import startup controller from container
// This will be registered by the startup module
let startupController;

router.use((req, res, next) => {
  if (!startupController) {
    const container = require('../../../../container');
    startupController = container.get('startupController');
  }
  next();
});

// GET /api/startups - Get all startups
router.get('/', (req, res) => startupController.getAllStartups(req, res));

// GET /api/startups/search - Search startups
router.get('/search', (req, res) => startupController.searchStartups(req, res));

// GET /api/startups/filtered - Get startups with advanced filtering
router.get('/filtered', (req, res) =>
  startupController.getStartupsFiltered(req, res)
);

// GET /api/startups/:id - Get startup by ID
router.get('/:id', (req, res) => startupController.getStartupById(req, res));

// POST /api/startups - Create a new startup (requires auth)
router.post('/', requireAuth, (req, res) =>
  startupController.createStartup(req, res)
);

// PUT /api/startups/:id - Update a startup (requires auth)
router.put('/:id', requireAuth, (req, res) =>
  startupController.updateStartup(req, res)
);

// DELETE /api/startups/:id - Delete a startup (requires auth)
router.delete('/:id', requireAuth, (req, res) =>
  startupController.deleteStartup(req, res)
);

module.exports = router;
